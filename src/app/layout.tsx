import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import SecurityProtection from "@/components/SecurityProtection";
import Script from "next/script";

// Flower icon as favicon
const flowerIconUrl = "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/2d798a37-c66d-4915-a56f-7cda10a6f3cd/generated_images/simple-minimalist-flower-icon-with-8-pet-a2755c74-20251202154253.jpg"

export const metadata: Metadata = {
  title: "PetalMind - Advanced AI Chat Interface",
  description: "Experience the next generation of AI with PetalMind. Fast, secure, and intelligent chat with custom AI modes, PWA support, and advanced privacy features.",
  keywords: ["AI", "Chatbot", "Artificial Intelligence", "Next.js", "PWA", "PetalMind", "Secure AI"],
  authors: [{ name: "PetalMind Team" }],
  creator: "PetalMind",
  publisher: "PetalMind",
  applicationName: "PetalMind",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PetalMind",
  },
  formatDetection: {
    telephone: false,
  },
  manifest: "/manifest.json",
  icons: [
    { rel: "icon", url: flowerIconUrl },
    { rel: "icon", type: "image/png", sizes: "32x32", url: flowerIconUrl },
    { rel: "icon", type: "image/png", sizes: "192x192", url: flowerIconUrl },
    { rel: "icon", type: "image/png", sizes: "512x512", url: flowerIconUrl },
    { rel: "apple-touch-icon", sizes: "180x180", url: flowerIconUrl },
    { rel: "shortcut icon", url: flowerIconUrl },
  ],
  openGraph: {
    images: [flowerIconUrl],
  },
  twitter: {
    images: [flowerIconUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href={flowerIconUrl} sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href={flowerIconUrl} />
        <link rel="icon" type="image/png" sizes="192x192" href={flowerIconUrl} />
        <link rel="apple-touch-icon" href={flowerIconUrl} />
        <link rel="shortcut icon" href={flowerIconUrl} />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="antialiased">
        <Script
          id="orchids-browser-logs"
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts/orchids-browser-logs.js"
          strategy="afterInteractive"
          data-orchids-project-id="2d798a37-c66d-4915-a56f-7cda10a6f3cd"
        />
        <SecurityProtection />
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        {children}
        <VisualEditsMessenger />
      </body>
    </html>
  );
}