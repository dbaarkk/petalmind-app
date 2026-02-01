"use client"

import { useState, useEffect, useRef } from "react"
import {
  Sparkles, Send, Menu, Copy, ThumbsUp, ThumbsDown, X, Plus, Paperclip,
  RotateCw, ChevronDown, ArrowUp, User, Mail, Camera, FileImage,
  Lightbulb, BarChart3, Code2, LogOut, Search, Gift, GraduationCap,
  FileText, MoreHorizontal, Check, Zap, Target, Brain, Flame, Gauge,
  Download, Settings, Sliders, Shield, History, Palette
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { authClient, useSession } from "@/lib/auth-client"

/* ---------------- TYPES ---------------- */

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: number
  imageUrl?: string
  liked?: boolean
  disliked?: boolean
}

interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt?: number
  messagesLoaded?: boolean
}

interface AIMode {
  id: string
  name: string
  description: string
  icon: any
}

/* ---------------- CONSTANTS ---------------- */

const AI_MODES: AIMode[] = [
  { id: "logic-breaker", name: "Logic Breaker", description: "Finds flaws and logic gaps.", icon: Target },
  { id: "brutal-honesty", name: "Brutal Honesty", description: "No sugarcoating.", icon: Flame },
  { id: "deep-analyst", name: "Deep Analyst", description: "Structural thinking.", icon: Brain },
  { id: "ego-slayer", name: "Ego Slayer", description: "Destroys excuses.", icon: Zap },
  { id: "rapid-fire", name: "Rapid Fire", description: "Fast, no fluff.", icon: Gauge }
]

/* ---------------- PAGE ---------------- */

export default function Page() {
  const router = useRouter()
  const { data: session, isPending, refetch } = useSession()
  const user = session?.user

  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isStreamingRef = useRef(false)

  /* ---------------- UTILS ---------------- */

  const scrollToBottom = (smooth = true) => {
    if (!messagesContainerRef.current) return
    messagesContainerRef.current.scrollTo({
      top: messagesContainerRef.current.scrollHeight,
      behavior: smooth ? "smooth" : "auto"
    })
  }

  /* ---------------- EFFECTS ---------------- */

  useEffect(() => {
    if (!isPending && user) refetch()
  }, [user, isPending, refetch])

  useEffect(() => {
    scrollToBottom(!isStreamingRef.current)
  }, [chats, currentChatId])

  /* ---------------- AI STREAM ---------------- */

  const getAIResponse = async (chatId: string, messages: Message[]) => {
    setIsSearching(true)
    isStreamingRef.current = true

    const aiId = Date.now().toString()

    setChats(prev =>
      prev.map(chat =>
        chat.id === chatId
          ? { ...chat, messages: [...chat.messages, { id: aiId, role: "assistant", content: "", timestamp: Date.now() }] }
          : chat
      )
    )

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, stream: true })
      })

      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: d } = await reader.read()
        done = d
        if (value) {
          const chunk = decoder.decode(value)
          setChats(prev =>
            prev.map(chat => {
              if (chat.id !== chatId) return chat
              const msgs = [...chat.messages]
              const idx = msgs.findIndex(m => m.id === aiId)
              if (idx !== -1) msgs[idx] = { ...msgs[idx], content: msgs[idx].content + chunk }
              return { ...chat, messages: msgs }
            })
          )
        }
      }
    } catch (err) {
      console.error(err)
      toast.error("AI response failed")
    } finally {
      isStreamingRef.current = false
      setIsSearching(false)
      scrollToBottom()
    }
  }

  /* ---------------- SEND ---------------- */

  const handleSendMessage = async () => {
    if (!input.trim() || isSearching) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: Date.now()
    }

    setInput("")

    if (!currentChatId) {
      const newChatId = Date.now().toString()
      setChats([{ id: newChatId, title: input.slice(0, 40), messages: [userMsg], createdAt: Date.now(), messagesLoaded: true }])
      setCurrentChatId(newChatId)
      await getAIResponse(newChatId, [userMsg])
    } else {
      setChats(prev =>
        prev.map(chat =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, userMsg] }
            : chat
        )
      )
      await getAIResponse(currentChatId, [...(chats.find(c => c.id === currentChatId)?.messages || []), userMsg])
    }
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div className="flex h-screen bg-black text-white">
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4">
        {chats.find(c => c.id === currentChatId)?.messages.map(m => (
          <div key={m.id} className="mb-3 text-xs">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 p-3">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSendMessage()}
          placeholder="Message PetalMind"
          className="w-full bg-[#2a2a2a]"
        />
      </div>
    </div>
  )
    }
