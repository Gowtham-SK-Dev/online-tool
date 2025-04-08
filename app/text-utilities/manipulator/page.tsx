"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import CodeEditor from "@/components/code-editor"
import DragDropZone from "@/components/drag-drop-zone"
import { useToast } from "@/hooks/use-toast"

export default function TextManipulatorPage() {
  const [text, setText] = useState("")
  const [prefix, setPrefix] = useState("")
  const [suffix, setSuffix] = useState("")
  const [findText, setFindText] = useState("")
  const [replaceText, setReplaceText] = useState("")
  const { toast } = useToast()

  const handleFileDrop = (content: string) => {
    setText(content)
  }

  const addPrefix = () => {
    if (!text.trim() || !prefix.trim()) return

    const words = text.split(/\s+/)
    const result = words.map((word) => `${prefix}${word}`).join(" ")
    setText(result)

    toast({
      title: "Prefix Added",
      description: `Added prefix "${prefix}" to each word.`,
    })
  }

  const addSuffix = () => {
    if (!text.trim() || !suffix.trim()) return

    const words = text.split(/\s+/)
    const result = words.map((word) => `${word}${suffix}`).join(" ")
    setText(result)

    toast({
      title: "Suffix Added",
      description: `Added suffix "${suffix}" to each word.`,
    })
  }

  const findAndReplace = () => {
    if (!text.trim() || !findText.trim()) return

    const regex = new RegExp(findText, "g")
    const result = text.replace(regex, replaceText)
    setText(result)

    toast({
      title: "Find and Replace",
      description: `Replaced "${findText}" with "${replaceText}".`,
    })
  }

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Text Manipulator</h1>
        <p className="mt-2 text-muted-foreground">Add prefix/suffix to words, find and replace text</p>
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

        <Tabs defaultValue="prefix-suffix">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="prefix-suffix">Prefix/Suffix</TabsTrigger>
            <TabsTrigger value="find-replace">Find & Replace</TabsTrigger>
          </TabsList>

          <TabsContent value="prefix-suffix" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="prefix" className="text-sm font-medium">
                  Prefix (add before each word)
                </label>
                <div className="flex gap-2">
                  <Input
                    id="prefix"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="Enter prefix..."
                  />
                  <Button onClick={addPrefix} disabled={!text.trim() || !prefix.trim()}>
                    Add
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="suffix" className="text-sm font-medium">
                  Suffix (add after each word)
                </label>
                <div className="flex gap-2">
                  <Input
                    id="suffix"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="Enter suffix..."
                  />
                  <Button onClick={addSuffix} disabled={!text.trim() || !suffix.trim()}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="find-replace" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="find" className="text-sm font-medium">
                  Find
                </label>
                <Input
                  id="find"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  placeholder="Text to find..."
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="replace" className="text-sm font-medium">
                  Replace
                </label>
                <Input
                  id="replace"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Replace with..."
                />
              </div>
            </div>

            <Button onClick={findAndReplace} disabled={!text.trim() || !findText.trim()} className="w-full">
              Find and Replace
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
