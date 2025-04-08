"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import CodeEditor from "@/components/code-editor"
import DragDropZone from "@/components/drag-drop-zone"
import KeyboardShortcuts from "@/components/keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"

export default function JsonFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const beautify = () => {
    try {
      if (!input.trim()) {
        setOutput("")
        setError(null)
        return
      }

      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError(null)
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`)
      toast({
        title: "Invalid JSON",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const minify = () => {
    try {
      if (!input.trim()) {
        setOutput("")
        setError(null)
        return
      }

      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError(null)
    } catch (err) {
      setError(`Invalid JSON: ${(err as Error).message}`)
      toast({
        title: "Invalid JSON",
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
      beautify()
    }
  }, [input])

  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">JSON Formatter</h1>
          <p className="mt-2 text-muted-foreground">Beautify and minify JSON data with syntax highlighting</p>
        </div>

        <AdBanner format="horizontal" slot="json-formatter-top" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Input</h2>
            <DragDropZone onFileDrop={handleFileDrop} accept=".json,.txt" />
            <CodeEditor
              value={input}
              onChange={setInput}
              language="json"
              placeholder="Paste your JSON here..."
              minHeight="300px"
              showLineNumbers={true}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Output</h2>
              <div className="flex gap-2">
                <Button onClick={beautify} size="sm">
                  Beautify
                </Button>
                <Button onClick={minify} size="sm" variant="outline">
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
                language="json"
                readOnly
                minHeight="300px"
                showLineNumbers={true}
              />
            )}
          </div>
        </div>

        <AdBanner className="my-8" format="rectangle" slot="json-formatter-middle" />

        <div className="mt-8 border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-3 border rounded-md">
              <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl + B</kbd>
              <span className="ml-2">Beautify JSON</span>
            </div>
            <div className="p-3 border rounded-md">
              <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl + M</kbd>
              <span className="ml-2">Minify JSON</span>
            </div>
          </div>
        </div>

        <section className="my-8 py-6 border-t">
          <h2 className="text-2xl font-semibold mb-4">About JSON Formatter</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Our JSON Formatter tool helps you beautify and minify JSON data with proper syntax highlighting. It's
              perfect for developers who need to work with JSON data regularly.
            </p>
            <p>
              JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read
              and write and easy for machines to parse and generate. It is based on a subset of the JavaScript
              Programming Language.
            </p>
            <p>With our tool, you can:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Beautify JSON to make it more readable with proper indentation</li>
              <li>Minify JSON to reduce file size for production</li>
              <li>Validate JSON to ensure it's correctly formatted</li>
              <li>Highlight syntax with different colors for keys and values</li>
              <li>Copy the formatted JSON to clipboard with one click</li>
              <li>Download the formatted JSON as a file</li>
            </ul>
          </div>
        </section>
      </div>

      <KeyboardShortcuts
        shortcuts={[
          { key: "b", ctrlKey: true, action: beautify },
          { key: "m", ctrlKey: true, action: minify },
        ]}
      />
    </>
  )
}
