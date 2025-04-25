import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  Code,
  Hash,
  Palette,
  Diff,
  FileJson,
  FileSpreadsheet,
  Fingerprint,
  Layers,
  Clock,
  Calculator,
  Paintbrush,
  Box,
  Type,
  FileImage,
  FileCheck,
  Percent,
} from "lucide-react"
import AdBanner from "@/components/ad-banner"
import type { Metadata } from "next"
import FAQSection from "@/components/faq-section"

export const metadata: Metadata = {
  title: "OnlineTools - Free Online Developer Utilities",
  description:
    "Free online developer tools for formatting, beautifying, and validating code. JSON formatter, HTML formatter, text diff checker, base64 encoder/decoder, and more.",
  keywords:
    "developer tools, code formatter, JSON formatter, HTML formatter, text diff, base64 encoder, color converter, uuid generator, online tools",
}
export default function Home() {
  const tools = [
    {
      title: "JSON Formatter",
      description: "Beautify, minify, and validate JSON data with syntax highlighting",
      icon: <FileJson className="h-8 w-8" />,
      href: "/tools/formatters/json",
    },
    {
      title: "HTML Formatter",
      description: "Format and clean up messy HTML code",
      icon: <Code className="h-8 w-8" />,
      href: "/tools/formatters/html",
    },
    {
      title: "Text Diff Checker",
      description: "Compare two texts and highlight the differences",
      icon: <Diff className="h-8 w-8" />,
      href: "/tools/text-diff",
    },
    {
      title: "Base64 Encoder/Decoder",
      description: "Encode text to Base64 or decode Base64 to text",
      icon: <Hash className="h-8 w-8" />,
      href: "/tools/base64",
    },
    {
      title: "CSV to JSON Converter",
      description: "Convert between CSV and JSON formats",
      icon: <FileSpreadsheet className="h-8 w-8" />,
      href: "/tools/converters/csv-to-json",
    },
    {
      title: "Color Converter",
      description: "Convert between HEX, RGB, and HSL color formats",
      icon: <Palette className="h-8 w-8" />,
      href: "/tools/design/color-converter",
    },
    {
      title: "UUID Generator",
      description: "Generate random UUIDs for your applications",
      icon: <Fingerprint className="h-8 w-8" />,
      href: "/tools/generators/uuid",
    },
    {
      title: "YAML to JSON",
      description: "Convert YAML to JSON and vice versa",
      icon: <Layers className="h-8 w-8" />,
      href: "/tools/converters/yaml-to-json",
    },
    {
      title: "Unix Timestamp Converter",
      description: "Convert between Unix timestamps and human-readable dates",
      icon: <Clock className="h-8 w-8" />,
      href: "/tools/converters/timestamp",
    },
    {
      title: "Number to Words",
      description: "Convert numbers to words and Roman numerals",
      icon: <Calculator className="h-8 w-8" />,
      href: "/tools/converters/number-to-words",
    },
    {
      title: "Color Palette Generator",
      description: "Generate color palettes from a base color",
      icon: <Paintbrush className="h-8 w-8" />,
      href: "/tools/design/color-palette",
    },
    {
      title: "Box Shadow Generator",
      description: "Create CSS box shadows with a visual editor",
      icon: <Box className="h-8 w-8" />,
      href: "/tools/design/box-shadow",
    },
    {
      title: "Typography Scale",
      description: "Generate a typography scale for your designs",
      icon: <Type className="h-8 w-8" />,
      href: "/tools/design/typography",
    },
    {
      title: "Favicon Generator",
      description: "Create favicons for your website",
      icon: <FileImage className="h-8 w-8" />,
      href: "/tools/design/favicon",
    },
    {
      title: "Invoice Generator",
      description: "Create professional invoices and download as PDF",
      icon: <FileCheck className="h-8 w-8" />,
      href: "/tools/business/invoice",
    },
    {
      title: "GST Calculator",
      description: "Calculate GST for your products and services",
      icon: <Percent className="h-8 w-8" />,
      href: "/tools/business/gst",
    },
  ]

  const faqs = [
    {
      question: "Are these tools free to use?",
      answer: "Yes, all tools on DevTools are completely free to use. No registration or payment is required.",
    },
    {
      question: "Is my data secure when using these tools?",
      answer:
        "Yes, all processing happens in your browser. Your code and data never leave your device, ensuring complete privacy and security.",
    },
    {
      question: "Can I use these tools offline?",
      answer:
        "Yes, DevTools is a Progressive Web App (PWA). You can install it on your device and use it even when you're offline.",
    },
    {
      question: "How often are new tools added?",
      answer:
        "We regularly add new tools based on user feedback and developer needs. Check back often to see what's new!",
    },
    {
      question: "Can I suggest a new tool?",
      answer: "We welcome suggestions for new tools. Please use our contact form to send your ideas.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Developer Tools</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          A collection of free online tools for developers. Format code, execute scripts, manipulate text, and more.
        </p>
        <div className="mt-8">
          <Link href="/tools/formatters/json">
            <Button size="lg">Try JSON Formatter</Button>
          </Link>
        </div>
      </div>

      <AdBanner className="my-8" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {tools.map((tool) => (
          <Link href={tool.href} key={tool.title} className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-center mb-2 text-primary">{tool.icon}</div>
                <CardTitle className="text-center">{tool.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">{tool.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <AdBanner className="my-8" />

      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold">Features</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-medium">Syntax Highlighting</h3>
            <p className="text-sm text-muted-foreground mt-2">Color-coded code for better readability</p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-medium">Dark/Light Mode</h3>
            <p className="text-sm text-muted-foreground mt-2">Switch between themes for comfort</p>
          </div>
          <div className="p-4 rounded-lg border bg-card">
            <h3 className="font-medium">PWA Support</h3>
            <p className="text-sm text-muted-foreground mt-2">Install as an app on your device</p>
          </div>
        </div>
      </div>

      <section className="my-12 py-8 border-t border-b">
        <h2 className="text-2xl font-bold text-center mb-6">Why Use Our Developer Tools?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-2">Free and Easy to Use</h3>
            <p>
              All our tools are completely free to use with no registration required. Simply load the page and start
              using the tools immediately.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Privacy Focused</h3>
            <p>
              Your code and data never leave your browser. All processing happens locally, ensuring your sensitive
              information remains private.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Works Offline</h3>
            <p>
              Install our PWA to use all tools even when you're offline. Perfect for developers on the go or with
              unreliable internet.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Regularly Updated</h3>
            <p>
              We continuously improve our tools and add new features based on user feedback and the latest development
              trends.
            </p>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}