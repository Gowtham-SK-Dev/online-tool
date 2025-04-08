"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CodeEditor from "@/components/code-editor"
import DragDropZone from "@/components/drag-drop-zone"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"

export default function Base64ClientPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [activeTab, setActiveTab] = useState("encode")
  const { toast } = useToast()

  const encode = () => {
    try {
      if (!input.trim()) {
        setOutput("")
        return
      }

      const encoded = btoa(input)
      setOutput(encoded)

      toast({
        title: "Encoded successfully",
        description: "Text has been encoded to Base64",
      })
    } catch (err) {
      toast({
        title: "Encoding failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const decode = () => {
    try {
      if (!input.trim()) {
        setOutput("")
        return
      }

      const decoded = atob(input)
      setOutput(decoded)

      toast({
        title: "Decoded successfully",
        description: "Base64 has been decoded to text",
      })
    } catch (err) {
      toast({
        title: "Decoding failed",
        description: "Invalid Base64 string",
        variant: "destructive",
      })
    }
  }

  const handleFileDrop = (content: string) => {
    setInput(content)
  }

  useEffect(() => {
    if (input.trim()) {
      if (activeTab === "encode") {
        encode()
      } else {
        decode()
      }
    }
  }, [input, activeTab])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setInput("")
    setOutput("")
  }

  const faqs = [
    {
      question: "What is Base64 encoding?",
      answer:
        "Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's commonly used when there's a need to encode binary data that needs to be stored and transferred over media that are designed to deal with text.",
    },
    {
      question: "Why would I need to encode something in Base64?",
      answer:
        "Base64 encoding is useful when you need to transmit binary data over systems that only support text, such as email attachments, storing complex data in JSON, or embedding image data directly in HTML or CSS.",
    },
    {
      question: "Is Base64 encoding secure for passwords?",
      answer:
        "No, Base64 is not encryption and provides no security. It's an encoding scheme, not an encryption algorithm. Anyone can decode Base64 data, so it should never be used to secure sensitive information like passwords.",
    },
    {
      question: "Why does Base64 encoded data end with '=' sometimes?",
      answer:
        "The '=' padding at the end of Base64 encoded data is used to indicate that the last block of encoded data doesn't contain a full 24 bits (3 bytes) of input data. This ensures the encoded data length is a multiple of 4 characters.",
    },
    {
      question: "Does Base64 encoding increase file size?",
      answer:
        "Yes, Base64 encoding increases the size of the data by approximately 33% because it represents 3 bytes of binary data with 4 ASCII characters.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Base64 Encoder/Decoder</h1>
        <p className="mt-2 text-muted-foreground">Encode text to Base64 or decode Base64 to text</p>
      </div>

      <AdBanner format="horizontal" slot="base64-top" />

      <Tabs defaultValue="encode" className="mt-6" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>

        <TabsContent value="encode" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Text Input</h2>
              <DragDropZone onFileDrop={handleFileDrop} accept=".txt,.md,.html,.css,.js" />
              <CodeEditor
                value={input}
                onChange={setInput}
                language="plaintext"
                placeholder="Enter text to encode to Base64..."
                minHeight="200px"
              />
              <Button onClick={encode} className="w-full">
                Encode to Base64
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Base64 Output</h2>
              <CodeEditor
                value={output}
                onChange={() => {}}
                language="plaintext"
                readOnly
                minHeight="200px"
                placeholder="Base64 encoded output will appear here..."
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="decode" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Base64 Input</h2>
              <DragDropZone onFileDrop={handleFileDrop} accept=".txt,.md,.html,.css,.js" />
              <CodeEditor
                value={input}
                onChange={setInput}
                language="plaintext"
                placeholder="Enter Base64 to decode to text..."
                minHeight="200px"
              />
              <Button onClick={decode} className="w-full">
                Decode from Base64
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Text Output</h2>
              <CodeEditor
                value={output}
                onChange={() => {}}
                language="plaintext"
                readOnly
                minHeight="200px"
                placeholder="Decoded text output will appear here..."
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AdBanner className="my-8" format="rectangle" slot="base64-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Base64 Encoding</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format by
            translating it into a radix-64 representation. The term Base64 originates from a specific MIME content
            transfer encoding.
          </p>
          <p>
            Base64 encoding schemes are commonly used when there is a need to encode binary data that needs to be stored
            and transferred over media that are designed to deal with textual data. This is to ensure that the data
            remains intact without modification during transport.
          </p>
          <p>Common uses of Base64 encoding include:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Encoding email attachments</li>
            <li>Storing complex data in JSON</li>
            <li>Embedding image data directly in HTML or CSS</li>
            <li>Encoding binary data to be included in a URL</li>
            <li>Storing binary data in XML</li>
          </ul>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
