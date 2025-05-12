"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import CodeEditor from "@/components/code-editor"
import DragDropZone from "@/components/drag-drop-zone"
import KeyboardShortcuts from "@/components/keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"

export default function HtmlFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
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

            if (tagContent.startsWith("</") || tagContent.endsWith("/>")) {
              indent = Math.max(0, indent - 2)
              formatted += "\n" + " ".repeat(indent) + tagContent
            } else {
              formatted += "\n" + " ".repeat(indent) + tagContent
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

        if (inContent) {
          if (char === "\n" || char === "\r" || char === "\t" || (char === " " && formatted.endsWith(" "))) {
            continue
          }

          if (!formatted.endsWith("\n") && formatted.endsWith(">")) {
            formatted += "\n" + " ".repeat(indent)
          }

          formatted += char
        }
      }

      setOutput(formatted.trim())
      setError(null)
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

      // Simple HTML minification
      const minified = input
        .replace(/\s+/g, " ")
        .replace(/>\s+</g, "><")
        .replace(/\s+>/g, ">")
        .replace(/<\s+/g, "<")
        .trim()

      setOutput(minified)
      setError(null)
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
      formatHTML()
    }
  }, [input])

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">HTML Formatter</h1>
        <p className="mt-2 text-muted-foreground">Format and clean up messy HTML code with syntax highlighting</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Output</h2>
            <div className="flex gap-2">
              <Button onClick={formatHTML} size="sm">
                Format
              </Button>
              <Button onClick={minifyHTML} size="sm" variant="outline">
                Minify
              </Button>
            </div>
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

      <KeyboardShortcuts
        shortcuts={[
          { key: "f", ctrlKey: true, action: formatHTML },
          { key: "m", ctrlKey: true, action: minifyHTML },
        ]}
      />
    </div>
  )
}
