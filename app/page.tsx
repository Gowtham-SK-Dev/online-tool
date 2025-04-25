"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Script from "next/script"
import { Suspense } from "react"
import Loading from "./loading"

const inter = Inter({ subsets: ["latin"] })import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Sidebar from "@/components/sidebar"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Script from "next/script"
import { Suspense } from "react"
import Loading from "./loading"

const inter = Inter({ subsets: ["latin"] })

export default function HomePage() {
  const { pathname } = useRouter();

  export const metadata: Metadata = {
    title: {
      default: "DevTools - Online Developer Utilities",
      template: "%s | DevTools",
    },
    description:
      "Free online developer tools for formatting, beautifying, and validating code. JSON formatter, HTML formatter, text diff checker, base64 encoder/decoder, and more.",
    keywords:
      "developer tools, code formatter, JSON formatter, HTML formatter, text diff, base64 encoder, color converter, uuid generator, online tools, web development tools, programming utilities",
    authors: [{ name: "DevTools Team", url: "https://devtools-online.vercel.app" }],
    creator: "DevTools Team",
    publisher: "DevTools",
    openGraph: {
      title: "DevTools - Online Developer Utilities",
      description: "Free online developer tools for formatting, beautifying, and validating code.",
      url: "https://devtools-online.vercel.app",
      siteName: "DevTools",
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: "DevTools - Online Developer Utilities",
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "DevTools - Online Developer Utilities",
      description: "Free online developer tools for formatting, beautifying, and validating code.",
      images: ["/og-image.png"],
      creator: "@devtools",
    },
    manifest: "/manifest.json",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: "https://devtools-online.vercel.app",
    },
    metadataBase: new URL("https://devtools-online.vercel.app"),
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
      generator: 'v0.dev'
  }
  
  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="en" suppressHydrationWarning>
        <head>
          {/* Google AdSense Script - Replace with your actual AdSense code when approved */}
          <Script
            id="google-adsense"
            async
            strategy="afterInteractive"
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
            crossOrigin="anonymous"
          />
          {/* Google Analytics */}
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          />
          <Script
            id="google-analytics-config"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-XXXXXXXXXX');
              `,
            }}
          />
          <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "DevTools - Online Developer Utilities",
                url: "https://devtools-online.vercel.app",
                description: "Free online developer tools for formatting, beautifying, and validating code.",
                potentialAction: {
                  "@type": "SearchAction",
                  target: "https://devtools-online.vercel.app/search?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              }),
            }}
          />
        </head>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="flex flex-col min-h-screen">
              <Header />
              <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                  <Suspense fallback={<Loading />}>{children}</Suspense>
                </main>
              </div>
              <Footer />
            </div>
          </ThemeProvider>
        </body>
      </html>
    )
  }
}