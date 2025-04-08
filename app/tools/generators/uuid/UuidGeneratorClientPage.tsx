"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, RefreshCw } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export default function UuidGeneratorClientPage() {
  const [uuids, setUuids] = useState<string[]>([])
  const [quantity, setQuantity] = useState(5)
  const [version, setVersion] = useState<"v4" | "v1">("v4")
  const [uppercase, setUppercase] = useState(false)
  const [hyphens, setHyphens] = useState(true)
  const { toast } = useToast()

  // Generate a UUID v4 (random)
  const generateUUIDv4 = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      const v = c === "x" ? r : (r & 0x3) | 0x8
      return v.toString(16)
    })
  }

  // Generate a UUID v1 (time-based)
  // This is a simplified version that mimics v1 format but isn't truly spec-compliant
  const generateUUIDv1 = () => {
    const now = new Date().getTime()
    const uuid = "xxxxxxxx-xxxx-1xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = ((now + Math.random() * 16) % 16) | 0
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
    })
    return uuid
  }

  // Format UUID based on user preferences
  const formatUUID = (uuid: string) => {
    let formatted = uuid
    if (!hyphens) {
      formatted = formatted.replace(/-/g, "")
    }
    if (uppercase) {
      formatted = formatted.toUpperCase()
    }
    return formatted
  }

  // Generate UUIDs
  const generateUUIDs = () => {
    const newUUIDs = []
    for (let i = 0; i < quantity; i++) {
      const uuid = version === "v4" ? generateUUIDv4() : generateUUIDv1()
      newUUIDs.push(formatUUID(uuid))
    }
    setUuids(newUUIDs)
  }

  // Copy UUID to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "UUID has been copied to your clipboard.",
    })
  }

  // Copy all UUIDs to clipboard
  const copyAllToClipboard = () => {
    navigator.clipboard.writeText(uuids.join("\n"))
    toast({
      title: "Copied all to clipboard",
      description: `${uuids.length} UUIDs have been copied to your clipboard.`,
    })
  }

  // Generate UUIDs on initial load and when settings change
  useEffect(() => {
    generateUUIDs()
  }, [version, uppercase, hyphens])

  const faqs = [
    {
      question: "What is a UUID?",
      answer:
        "UUID (Universally Unique Identifier) is a 128-bit label used for information in computer systems. The probability of generating the same UUID twice is practically zero, making them useful for creating unique identifiers without a central coordination mechanism.",
    },
    {
      question: "What's the difference between UUID v1 and v4?",
      answer:
        "UUID v1 is time-based and includes the MAC address of the computer that generated it. UUID v4 is randomly generated. While v1 can be traced back to the generating computer and time, v4 is completely random and offers better privacy.",
    },
    {
      question: "When should I use UUIDs?",
      answer:
        "UUIDs are useful when you need to generate unique identifiers across distributed systems without coordination. They're commonly used for database primary keys, session IDs, transaction IDs, and any scenario where uniqueness is critical.",
    },
    {
      question: "Are UUIDs case-sensitive?",
      answer:
        "UUIDs are typically represented as 32 hexadecimal digits, which are not case-sensitive. However, some systems might treat them as case-sensitive, so it's best to be consistent in your usage.",
    },
    {
      question: "How secure are UUIDs?",
      answer:
        "UUID v4 (random) provides a high level of uniqueness and unpredictability, making them suitable for many security contexts. However, they're not cryptographically secure for all purposes. For high-security applications, consider using a cryptographically secure random number generator.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">UUID Generator</h1>
        <p className="mt-2 text-muted-foreground">Generate random UUIDs for your applications</p>
      </div>

      <AdBanner format="horizontal" slot="uuid-generator-top" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-1">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Settings</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max="100"
                    value={quantity}
                    onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 1)}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>UUID Version</Label>
                  <Tabs defaultValue="v4" className="mt-2" onValueChange={(v) => setVersion(v as "v4" | "v1")}>
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="v4">Version 4 (Random)</TabsTrigger>
                      <TabsTrigger value="v1">Version 1 (Time-based)</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase">Uppercase</Label>
                  <Switch id="uppercase" checked={uppercase} onCheckedChange={setUppercase} />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="hyphens">Include Hyphens</Label>
                  <Switch id="hyphens" checked={hyphens} onCheckedChange={setHyphens} />
                </div>

                <Button onClick={generateUUIDs} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate UUIDs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Generated UUIDs</h2>
                <Button variant="outline" size="sm" onClick={copyAllToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy All
                </Button>
              </div>
              <div className="space-y-2">
                {uuids.map((uuid, index) => (
                  <div key={index} className="flex items-center">
                    <code className="bg-muted p-2 rounded text-sm flex-1 font-mono">{uuid}</code>
                    <Button variant="ghost" size="icon" className="ml-2" onClick={() => copyToClipboard(uuid)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="uuid-generator-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About UUID Generator</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our UUID Generator tool helps you create Universally Unique Identifiers (UUIDs) for your applications. UUIDs
            are 128-bit identifiers that are guaranteed to be unique across space and time, making them perfect for
            distributed systems where uniqueness is critical.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Generate multiple UUIDs at once</li>
            <li>Choose between UUID version 4 (random) and version 1 (time-based)</li>
            <li>Format UUIDs with or without hyphens</li>
            <li>Convert UUIDs to uppercase or lowercase</li>
            <li>Copy individual UUIDs or all generated UUIDs to clipboard</li>
          </ul>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
