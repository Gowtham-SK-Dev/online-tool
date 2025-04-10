"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import CodeEditor from "@/components/code-editor"
import DragDropZone from "@/components/drag-drop-zone"
import KeyboardShortcuts from "@/components/keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function HtmlFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"beautify" | "minify">("beautify")
  const { toast } = useToast()

  const formatHTML = () => {
    try {
      if (!input.trim()) {
        setOutput("")
        setError(null)
        return
      }

      // Simple HTML formatting
      let formatted = ""
      let indent = 0
      let inTag = false
      let inContent = false
      let inComment = false
      let tagContent = ""
      let lastChar = ""

      for (let i = 0; i < input.length; i++) {
        const char = input[i]
        const nextChar = input[i + 1] || ""

        // Handle comments
        if (char === "<" && nextChar === "!" && input.substr(i, 4) === "<!--") {
          inComment = true
          formatted += "\n" + " ".repeat(indent) + "<!--"
          i += 3
          continue
        }

        if (inComment) {
          if (char === "-" && nextChar === "-" && input[i + 2] === ">") {
            formatted += "-->"
            inComment = false
            i += 2
            continue
          }
          formatted += char
          continue
        }

        // Handle tags
        if (char === "<" && !inTag) {
          inTag = true
          inContent = false
          tagContent = "<"
          continue
        }

        if (inTag) {
          tagContent += char

          if (char === ">") {
            inTag = false

            // Check if it's a closing tag or self-closing tag
            if (tagContent.startsWith("</") || tagContent.endsWith("/>")) {
              indent = Math.max(0, indent - 2)
              formatted += "\n" + " ".repeat(indent) + tagContent
            } else {
              formatted += "\n" + " ".repeat(indent) + tagContent
              // Don't increase indent for void elements like <br>, <img>, etc.
              const voidElements = [
                "area",
                "base",
                "br",
                "col",
                "embed",
                "hr",
                "img",
                "input",
                "link",
                "meta",
                "param",
                "source",
                "track",
                "wbr",
              ]
              const tagName = tagContent.match(/<([a-zA-Z0-9]+)/)?.[1]?.toLowerCase()
              if (tagName && !voidElements.includes(tagName) && !tagContent.endsWith("/>")) {
                indent += 2
              }
            }

            inContent = true
            tagContent = ""
          }
          continue
        }

        // Handle content between tags
        if (inContent) {
          if (char === "\n" || char === "\r" || char === "\t" || (char === " " && lastChar === " ")) {
            continue
          }

          if (lastChar === ">" || formatted.endsWith(">")) {
            formatted += "\n" + " ".repeat(indent)
          }

          formatted += char
        }

        lastChar = char
      }

      setOutput(formatted.trim())
      setError(null)

      if (activeTab === "beautify") {
        toast({
          title: "HTML Formatted",
          description: "Your HTML has been beautified successfully.",
        })
      }
    } catch (err) {
      setError(`Error formatting HTML: ${(err as Error).message}`)
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const minifyHTML = () => {
    try {
      if (!input.trim()) {
        setOutput("")
        setError(null)
        return
      }

      // Preserve content in <pre> and <textarea> tags
      const preservedBlocks: string[] = []
      const preservedHtml = input.replace(
        /(<(pre|textarea|script|style)[^>]*>)([\s\S]*?)(<\/\2>)/gi,
        (match, start, tag, content, end) => {
          preservedBlocks.push(content)
          return `${start}__PRESERVED_BLOCK_${preservedBlocks.length - 1}__${end}`
        },
      )

      // Simple HTML minification
      const minified = preservedHtml
        .replace(/<!--[\s\S]*?-->/g, "") // Remove comments
        .replace(/\s+/g, " ") // Replace multiple spaces with a single space
        .replace(/>\s+</g, "><") // Remove spaces between tags
        .replace(/\s+>/g, ">") // Remove spaces before closing brackets
        .replace(/<\s+/g, "<") // Remove spaces after opening brackets
        .replace(/\s+\/>/g, "/>") // Remove spaces before self-closing tags
        .trim()

      // Restore preserved blocks
      let result = minified
      preservedBlocks.forEach((block, i) => {
        result = result.replace(`__PRESERVED_BLOCK_${i}__`, block)
      })

      setOutput(result)
      setError(null)

      toast({
        title: "HTML Minified",
        description: "Your HTML has been minified successfully.",
      })
    } catch (err) {
      setError(`Error minifying HTML: ${(err as Error).message}`)
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const handleFileDrop = (content: string) => {
    setInput(content)
  }

  useEffect(() => {
    if (input.trim()) {
      if (activeTab === "beautify") {
        formatHTML()
      } else {
        minifyHTML()
      }
    }
  }, [input, activeTab])

  const handleTabChange = (value: string) => {
    setActiveTab(value as "beautify" | "minify")
  }

  const faqs = [
    {
      question: "What is HTML formatting?",
      answer:
        "HTML formatting is the process of organizing HTML code with proper indentation and line breaks to make it more readable and maintainable. It helps developers understand the structure of the document more easily.",
    },
    {
      question: "Why would I minify HTML?",
      answer:
        "Minifying HTML removes unnecessary characters like whitespace, comments, and line breaks to reduce file size. This can improve page load times, especially for larger HTML documents, which is beneficial for website performance.",
    },
    {
      question: "Does formatting HTML change how it renders in the browser?",
      answer:
        "No, formatting or minifying HTML doesn't change how the page renders in browsers. It only affects the readability of the code. Browsers ignore most whitespace when rendering HTML.",
    },
    {
      question: "Is my HTML data secure when using this tool?",
      answer:
        "Yes, all processing happens directly in your browser. Your HTML code is never sent to our servers, ensuring complete privacy and security.",
    },
    {
      question: "Can I format HTML with embedded JavaScript or CSS?",
      answer:
        "Yes, our formatter preserves content within <script>, <style>, <pre>, and <textarea> tags to ensure that embedded JavaScript, CSS, and preformatted text maintain their original formatting.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">HTML Formatter</h1>
        <p className="mt-2 text-muted-foreground">Format and clean up messy HTML code with syntax highlighting</p>
      </div>

      <AdBanner format="horizontal" slot="html-formatter-top" />

      <Tabs defaultValue="beautify" className="mt-6" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="beautify">Beautify</TabsTrigger>
          <TabsTrigger value="minify">Minify</TabsTrigger>
        </TabsList>

        <TabsContent value="beautify" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Input</h2>
              <DragDropZone onFileDrop={handleFileDrop} accept=".html,.htm,.xml,.txt" />
              <CodeEditor
                value={input}
                onChange={setInput}
                language="html"
                placeholder="Paste your HTML here..."
                minHeight="300px"
                showLineNumbers={true}
              />
              <Button onClick={formatHTML} className="w-full">
                Format HTML
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Output</h2>
              </div>

              {error ? (
                <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive">
                  {error}
                </div>
              ) : (
                <CodeEditor
                  value={output}
                  onChange={() => {}}
                  language="html"
                  readOnly
                  minHeight="300px"
                  showLineNumbers={true}
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="minify" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Input</h2>
              <DragDropZone onFileDrop={handleFileDrop} accept=".html,.htm,.xml,.txt" />
              <CodeEditor
                value={input}
                onChange={setInput}
                language="html"
                placeholder="Paste your HTML here..."
                minHeight="300px"
                showLineNumbers={true}
              />
              <Button onClick={minifyHTML} className="w-full">
                Minify HTML
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Output</h2>
              </div>

              {error ? (
                <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive">
                  {error}
                </div>
              ) : (
                <CodeEditor
                  value={output}
                  onChange={() => {}}
                  language="html"
                  readOnly
                  minHeight="300px"
                  showLineNumbers={true}
                />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 border rounded-md">
            <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl + F</kbd>
            <span className="ml-2">Format HTML</span>
          </div>
          <div className="p-3 border rounded-md">
            <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl + M</kbd>
            <span className="ml-2">Minify HTML</span>
          </div>
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="html-formatter-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About HTML Formatter</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our HTML Formatter tool helps you beautify and minify HTML code with proper syntax highlighting. It's
            perfect for web developers who need to work with HTML code regularly.
          </p>
          <p>
            HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a
            web browser. It defines the structure and content of web pages.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Beautify HTML to make it more readable with proper indentation</li>
            <li>Minify HTML to reduce file size for production</li>
            <li>Highlight syntax with different colors for tags, attributes, and content</li>
            <li>Copy the formatted HTML to clipboard with one click</li>
            <li>Download the formatted HTML as a file</li>
            <li>Drag and drop HTML files for quick formatting</li>
          </ul>
        </div>
      </section>

      <FAQSection faqs={faqs} />

      <KeyboardShortcuts
        shortcuts={[
          { key: "f", ctrlKey: true, action: formatHTML },
          { key: "m", ctrlKey: true, action: minifyHTML },
        ]}
      />
    </div>
  )
}
