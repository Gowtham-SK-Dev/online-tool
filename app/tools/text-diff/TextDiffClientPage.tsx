"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import CodeEditor from "@/components/code-editor"
import DragDropZone from "@/components/drag-drop-zone"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { diffLines, diffWords } from "diff"

export default function TextDiffClientPage() {
  const [leftText, setLeftText] = useState("")
  const [rightText, setRightText] = useState("")
  const [diffResult, setDiffResult] = useState<any[]>([])
  const [diffMode, setDiffMode] = useState<"line" | "word">("line")

  const handleLeftDrop = (content: string) => {
    setLeftText(content)
  }

  const handleRightDrop = (content: string) => {
    setRightText(content)
  }

  const compareTexts = () => {
    if (diffMode === "line") {
      const diff = diffLines(leftText, rightText)
      setDiffResult(diff)
    } else {
      const diff = diffWords(leftText, rightText)
      setDiffResult(diff)
    }
  }

  useEffect(() => {
    if (leftText && rightText) {
      compareTexts()
    }
  }, [leftText, rightText, diffMode])

  const faqs = [
    {
      question: "What is a text diff checker?",
      answer:
        "A text diff checker is a tool that compares two texts and highlights the differences between them. It's useful for comparing versions of code, documents, or any text-based content.",
    },
    {
      question: "What's the difference between line-by-line and word-by-word comparison?",
      answer:
        "Line-by-line comparison shows differences at the line level, highlighting entire lines that have been added, removed, or changed. Word-by-word comparison is more granular, highlighting specific words or characters that differ within lines.",
    },
    {
      question: "Is my text data secure when using this tool?",
      answer:
        "Yes, all processing happens directly in your browser. Your text data is never sent to our servers, ensuring complete privacy and security.",
    },
    {
      question: "Can I compare code with this tool?",
      answer:
        "Yes, this tool works well for comparing code snippets, configuration files, or any text-based content. The syntax highlighting helps make the differences more visible.",
    },
    {
      question: "What file formats can I compare?",
      answer:
        "You can compare any text-based file formats, including .txt, .md, .html, .css, .js, .json, and more. Simply drag and drop your files or paste the content into the input areas.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Text Diff Checker</h1>
        <p className="mt-2 text-muted-foreground">Compare two texts and highlight the differences</p>
      </div>

      <AdBanner format="horizontal" slot="text-diff-top" />

      <div className="flex flex-col md:flex-row gap-4 mt-6">
        <Button
          variant={diffMode === "line" ? "default" : "outline"}
          onClick={() => setDiffMode("line")}
          className="flex-1"
        >
          Line by Line
        </Button>
        <Button
          variant={diffMode === "word" ? "default" : "outline"}
          onClick={() => setDiffMode("word")}
          className="flex-1"
        >
          Word by Word
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Original Text</h2>
          <DragDropZone onFileDrop={handleLeftDrop} accept=".txt,.md,.html,.css,.js" />
          <CodeEditor
            value={leftText}
            onChange={setLeftText}
            language="plaintext"
            placeholder="Paste your original text here..."
            minHeight="300px"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Modified Text</h2>
          <DragDropZone onFileDrop={handleRightDrop} accept=".txt,.md,.html,.css,.js" />
          <CodeEditor
            value={rightText}
            onChange={setRightText}
            language="plaintext"
            placeholder="Paste your modified text here..."
            minHeight="300px"
          />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Differences</h2>
        <div className="border rounded-md p-4 bg-card overflow-x-auto">
          {diffResult.length > 0 ? (
            <pre className="whitespace-pre-wrap">
              {diffResult.map((part, index) => (
                <span
                  key={index}
                  className={
                    part.added
                      ? "bg-green-500/20 text-green-700 dark:text-green-400"
                      : part.removed
                        ? "bg-red-500/20 text-red-700 dark:text-red-400"
                        : ""
                  }
                >
                  {part.value}
                </span>
              ))}
            </pre>
          ) : (
            <p className="text-muted-foreground">Enter text in both fields to see differences</p>
          )}
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="text-diff-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Text Diff Checker</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our Text Diff Checker tool helps you compare two texts and highlight the differences between them. It's
            perfect for developers, writers, and anyone who needs to compare versions of text-based content.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Compare texts line by line or word by word</li>
            <li>Highlight additions, deletions, and changes</li>
            <li>Drag and drop files for easy comparison</li>
            <li>Compare code, documents, or any text-based content</li>
          </ul>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
