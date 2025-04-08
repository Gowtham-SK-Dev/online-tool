"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CodeEditor from "@/components/code-editor"
import DragDropZone from "@/components/drag-drop-zone"
import { useToast } from "@/hooks/use-toast"

export default function LineToolsPage() {
  const [text, setText] = useState("")
  const { toast } = useToast()

  const handleFileDrop = (content: string) => {
    setText(content)
  }

  const removeDuplicateLines = () => {
    if (!text.trim()) return

    const lines = text.split("\n")
    const uniqueLines = [...new Set(lines)]
    setText(uniqueLines.join("\n"))

    const removed = lines.length - uniqueLines.length
    toast({
      title: "Duplicates Removed",
      description: `Removed ${removed} duplicate line${removed !== 1 ? "s" : ""}.`,
    })
  }

  const sortLinesAscending = () => {
    if (!text.trim()) return

    const lines = text.split("\n")
    const sortedLines = [...lines].sort()
    setText(sortedLines.join("\n"))

    toast({
      title: "Lines Sorted",
      description: "Sorted lines in ascending order (A-Z).",
    })
  }

  const sortLinesDescending = () => {
    if (!text.trim()) return

    const lines = text.split("\n")
    const sortedLines = [...lines].sort().reverse()
    setText(sortedLines.join("\n"))

    toast({
      title: "Lines Sorted",
      description: "Sorted lines in descending order (Z-A).",
    })
  }

  const trimLines = () => {
    if (!text.trim()) return

    const lines = text.split("\n")
    const trimmedLines = lines.map((line) => line.trim())
    setText(trimmedLines.join("\n"))

    toast({
      title: "Lines Trimmed",
      description: "Removed extra spaces from the beginning and end of each line.",
    })
  }

  const removeEmptyLines = () => {
    if (!text.trim()) return

    const lines = text.split("\n")
    const nonEmptyLines = lines.filter((line) => line.trim() !== "")
    setText(nonEmptyLines.join("\n"))

    const removed = lines.length - nonEmptyLines.length
    toast({
      title: "Empty Lines Removed",
      description: `Removed ${removed} empty line${removed !== 1 ? "s" : ""}.`,
    })
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Line Tools</h1>
        <p className="mt-2 text-muted-foreground">Remove duplicates, sort lines, trim spaces, and more</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button onClick={removeDuplicateLines} disabled={!text.trim()}>
            Remove Duplicate Lines
          </Button>
          <Button onClick={sortLinesAscending} disabled={!text.trim()}>
            Sort Lines (A-Z)
          </Button>
          <Button onClick={sortLinesDescending} disabled={!text.trim()}>
            Sort Lines (Z-A)
          </Button>
          <Button onClick={trimLines} disabled={!text.trim()}>
            Trim Extra Spaces
          </Button>
          <Button onClick={removeEmptyLines} disabled={!text.trim()}>
            Remove Empty Lines
          </Button>
        </div>
      </div>
    </div>
  )
}
