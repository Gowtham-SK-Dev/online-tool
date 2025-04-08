"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import CodeEditor from "@/components/code-editor"
import DragDropZone from "@/components/drag-drop-zone"
import { HashIcon, TypeIcon, AlignJustifyIcon, BookOpenIcon } from "lucide-react"

export default function WordCounterPage() {
  const [text, setText] = useState("")
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
  })

  useEffect(() => {
    const characters = text.length
    const charactersNoSpaces = text.replace(/\s/g, "").length
    const words = text.trim() ? text.trim().split(/\s+/).length : 0

    // Count sentences by looking for periods, exclamation points, or question marks
    // followed by a space or end of string
    const sentences = text.trim() ? (text.match(/[.!?]+[\s$]+/g) || []).length + 1 : 0

    // Count paragraphs by looking for double line breaks
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0

    setStats({
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
    })
  }, [text])

  const handleFileDrop = (content: string) => {
    setText(content)
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Word Counter</h1>
        <p className="mt-2 text-muted-foreground">Count words, characters, sentences, and paragraphs in your text</p>
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full p-3 bg-primary/10 text-primary">
                <HashIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Characters</p>
                <p className="text-2xl font-bold">{stats.characters}</p>
                <p className="text-xs text-muted-foreground">Without spaces: {stats.charactersNoSpaces}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full p-3 bg-primary/10 text-primary">
                <TypeIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Words</p>
                <p className="text-2xl font-bold">{stats.words}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full p-3 bg-primary/10 text-primary">
                <AlignJustifyIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sentences</p>
                <p className="text-2xl font-bold">{stats.sentences}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full p-3 bg-primary/10 text-primary">
                <BookOpenIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Paragraphs</p>
                <p className="text-2xl font-bold">{stats.paragraphs}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
