"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CodeEditor from "@/components/code-editor"
import DragDropZone from "@/components/drag-drop-zone"
import KeyboardShortcuts from "@/components/keyboard-shortcuts"
import { useToast } from "@/hooks/use-toast"

export default function CaseConverterPage() {
  const [text, setText] = useState("")
  const { toast } = useToast()

  const convertToUppercase = () => {
    if (!text.trim()) return
    setText(text.toUpperCase())
    toast({
      title: "Converted",
      description: "Text converted to uppercase.",
    })
  }

  const convertToLowercase = () => {
    if (!text.trim()) return
    setText(text.toLowerCase())
    toast({
      title: "Converted",
      description: "Text converted to lowercase.",
    })
  }

  const convertToTitleCase = () => {
    if (!text.trim()) return
    setText(
      text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    )
    toast({
      title: "Converted",
      description: "Text converted to title case.",
    })
  }

  const convertToSentenceCase = () => {
    if (!text.trim()) return

    // Split by sentence endings (., !, ?) followed by a space or end of string
    const sentences = text.match(/[^.!?]+[.!?]+[\s$]*/g) || [text]

    const sentenceCaseText = sentences
      .map((sentence) => {
        const trimmed = sentence.trim()
        if (trimmed.length === 0) return sentence
        return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
      })
      .join("")

    setText(sentenceCaseText)
    toast({
      title: "Converted",
      description: "Text converted to sentence case.",
    })
  }

  const handleFileDrop = (content: string) => {
    setText(content)
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Text Case Converter</h1>
        <p className="mt-2 text-muted-foreground">
          Convert text to different cases: UPPERCASE, lowercase, Title Case, Sentence case
        </p>
      </div>

      <div className="space-y-6 mt-6">
        <DragDropZone onFileDrop={handleFileDrop} accept=".txt,.md,.html,.css,.js" />

        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Text</h2>
          <CodeEditor
            value={text}
            onChange={setText}
            language="plaintext"
            placeholder="Enter or paste your text here..."
            minHeight="200px"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={convertToUppercase}>UPPERCASE</Button>
          <Button onClick={convertToLowercase}>lowercase</Button>
          <Button onClick={convertToTitleCase}>Title Case</Button>
          <Button onClick={convertToSentenceCase}>Sentence case</Button>
        </div>
      </div>

      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Keyboard Shortcuts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 border rounded-md">
            <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl + U</kbd>
            <span className="ml-2">UPPERCASE</span>
          </div>
          <div className="p-3 border rounded-md">
            <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl + L</kbd>
            <span className="ml-2">lowercase</span>
          </div>
          <div className="p-3 border rounded-md">
            <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl + T</kbd>
            <span className="ml-2">Title Case</span>
          </div>
          <div className="p-3 border rounded-md">
            <kbd className="px-2 py-1 bg-muted rounded text-sm">Ctrl + S</kbd>
            <span className="ml-2">Sentence case</span>
          </div>
        </div>
      </div>

      <KeyboardShortcuts
        shortcuts={[
          { key: "u", ctrlKey: true, action: convertToUppercase },
          { key: "l", ctrlKey: true, action: convertToLowercase },
          { key: "t", ctrlKey: true, action: convertToTitleCase },
          { key: "s", ctrlKey: true, action: convertToSentenceCase },
        ]}
      />
    </div>
  )
}
