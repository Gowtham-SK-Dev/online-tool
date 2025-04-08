"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import CodeEditor from "@/components/code-editor"
import DragDropZone from "@/components/drag-drop-zone"
import KeyboardShortcuts from "@/components/keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"

export default function JsonFormatterClientPage() {
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

  const faqs = [
    {
      question: "What is JSON?",
      answer:
        "JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate. It is based on a subset of JavaScript language and is commonly used for transmitting data in web applications.",
    },
    {
      question: "Why should I format or beautify JSON?",
      answer:
        "Beautifying JSON makes it more readable by adding proper indentation and line breaks. This is especially helpful when debugging or when you need to understand the structure of complex JSON data.",
    },
    {
      question: "Why would I want to minify JSON?",
      answer:
        "Minifying JSON removes all unnecessary whitespace, making the file size smaller. This is useful for production environments where you want to reduce bandwidth usage and improve loading times.",
    },
    {
      question: "Is my JSON data secure when using this tool?",
      answer:
        "Yes, all processing happens directly in your browser. Your JSON data is never sent to our servers, ensuring complete privacy and security.",
    },
    {
      question: "What are some common JSON errors?",
      answer:
        "Common JSON errors include missing or extra commas, unquoted property names, single quotes instead of double quotes, trailing commas in arrays or objects, and using comments (which are not supported in JSON).",
    },
    {
      question: "Can I use this tool for large JSON files?",
      answer:
        "Yes, our tool is optimized to handle large JSON files efficiently. However, extremely large files (over 10MB) might cause performance issues in some browsers.",
    },
    {
      question: "How do I fix invalid JSON?",
      answer:
        "Our tool highlights JSON syntax errors to help you identify and fix them. Common fixes include adding missing quotes around property names, replacing single quotes with double quotes, removing trailing commas, and ensuring proper nesting of brackets and braces.",
    },
  ]

  return (
    <>
      <div className="container mx-auto">
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight">JSON Formatter & Validator</h1>
          <p className="mt-2 text-muted-foreground">
            Beautify, minify, and validate JSON data with syntax highlighting
          </p>
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
              Our JSON Formatter tool helps you beautify, minify, and validate JSON data with proper syntax
              highlighting. It's perfect for developers who need to work with JSON data regularly.
            </p>

            <h3 className="text-lg font-medium text-foreground mt-6">What is JSON?</h3>
            <p>
              JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read
              and write and easy for machines to parse and generate. It is based on a subset of the JavaScript
              Programming Language and has become the standard format for data exchange in web applications.
            </p>

            <p>JSON is built on two structures:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A collection of name/value pairs (similar to objects in JavaScript)</li>
              <li>An ordered list of values (similar to arrays in JavaScript)</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6">Features of Our JSON Formatter</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Beautify JSON</strong> - Format your JSON with proper indentation and line breaks for better
                readability
              </li>
              <li>
                <strong>Minify JSON</strong> - Remove all unnecessary whitespace to reduce file size for production
              </li>
              <li>
                <strong>Validate JSON</strong> - Check if your JSON is valid and see detailed error messages if it's not
              </li>
              <li>
                <strong>Syntax Highlighting</strong> - Different colors for keys, values, and punctuation make JSON
                easier to read
              </li>
              <li>
                <strong>Copy to Clipboard</strong> - Easily copy the formatted JSON with one click
              </li>
              <li>
                <strong>Download as File</strong> - Save the formatted JSON to your device
              </li>
              <li>
                <strong>Drag and Drop</strong> - Simply drag and drop your JSON files for quick formatting
              </li>
              <li>
                <strong>Keyboard Shortcuts</strong> - Use keyboard shortcuts for faster workflow
              </li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6">Common Use Cases</h3>
            <p>Our JSON Formatter is useful in many scenarios:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>API Development</strong> - Format and validate API responses for debugging
              </li>
              <li>
                <strong>Configuration Files</strong> - Make your JSON configuration files more readable
              </li>
              <li>
                <strong>Data Analysis</strong> - Examine JSON data structures more easily
              </li>
              <li>
                <strong>Web Development</strong> - Validate JSON before using it in your web applications
              </li>
              <li>
                <strong>Database Management</strong> - Format JSON data stored in databases like MongoDB
              </li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-6">How to Use</h3>
            <ol className="list-decimal pl-6 space-y-2">
              <li>Paste your JSON data into the input area or drag and drop a JSON file</li>
              <li>The tool will automatically validate and format your JSON</li>
              <li>Use the "Beautify" button to format with indentation or "Minify" to remove whitespace</li>
              <li>Copy the formatted JSON or download it as a file</li>
              <li>If there are any errors, they will be displayed with helpful messages</li>
            </ol>

            <p className="mt-6">
              Whether you're a developer working with APIs, a data analyst examining JSON structures, or anyone who
              needs to work with JSON data, our JSON Formatter tool makes the process easier and more efficient.
            </p>
          </div>
        </section>

        <FAQSection faqs={faqs} />
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
