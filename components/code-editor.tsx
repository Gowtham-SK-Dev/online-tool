"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CopyIcon, DownloadIcon, UploadIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import SyntaxHighlighter from "./syntax-highlighter"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  placeholder?: string
  minHeight?: string
  maxHeight?: string
  readOnly?: boolean
  showLineNumbers?: boolean
}

export default function CodeEditor({
  value,
  onChange,
  language = "plaintext",
  placeholder = "Enter or paste your code here...",
  minHeight = "200px",
  maxHeight = "500px",
  readOnly = false,
  showLineNumbers = false,
}: CodeEditorProps) {
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(!readOnly)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "The content has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      })
    }
  }

  const downloadAsFile = () => {
    const blob = new Blob([value], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `code.${language === "plaintext" ? "txt" : language}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      onChange(content)
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  const toggleEditMode = () => {
    if (readOnly) return
    setIsEditing(!isEditing)
    if (!isEditing && textareaRef.current) {
      setTimeout(() => {
        textareaRef.current?.focus()
      }, 0)
    }
  }

  return (
    <div className="relative border rounded-md">
      <div className="flex items-center justify-between p-2 border-b bg-muted/50">
        <div className="text-sm font-medium">{language.toUpperCase()}</div>
        <div className="flex items-center gap-2">
          {!readOnly && (
            <>
              <label htmlFor="file-upload" className="cursor-pointer">
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  accept=".txt,.js,.html,.css,.json,.xml,.md,.py,.java,.php"
                />
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <UploadIcon className="h-4 w-4 mr-1" />
                    Upload
                  </span>
                </Button>
              </label>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={toggleEditMode}>
                  Edit
                </Button>
              )}
            </>
          )}
          <Button variant="outline" size="sm" onClick={copyToClipboard}>
            <CopyIcon className="h-4 w-4 mr-1" />
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button variant="outline" size="sm" onClick={downloadAsFile} disabled={!value.trim()}>
            <DownloadIcon className="h-4 w-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      {isEditing ? (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="font-mono text-sm resize-none rounded-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          style={{
            minHeight,
            maxHeight,
            overflowY: "auto",
            whiteSpace: "pre",
            tabSize: 2,
            padding: "1rem",
          }}
          readOnly={readOnly}
        />
      ) : (
        <div
          className="cursor-pointer"
          onClick={!readOnly ? toggleEditMode : undefined}
          style={{
            minHeight,
            maxHeight: "none",
            overflowY: "auto",
          }}
        >
          <SyntaxHighlighter code={value || placeholder} language={language} showLineNumbers={showLineNumbers} />
        </div>
      )}
    </div>
  )
}
