"use client"

import type React from "react"

import { useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { UploadIcon } from "lucide-react"

interface DragDropZoneProps {
  onFileDrop: (content: string) => void
  accept?: string
  className?: string
}

export default function DragDropZone({
  onFileDrop,
  accept = ".txt,.js,.html,.css,.json,.xml,.md,.py,.java,.php",
  className,
}: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      readFile(file)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      readFile(file)
    }
  }

  const readFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      onFileDrop(content)
    }
    reader.readAsText(file)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50",
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileSelect} accept={accept} />
      <div className="flex flex-col items-center justify-center gap-2">
        <UploadIcon className="h-10 w-10 text-muted-foreground" />
        <p className="text-sm font-medium">
          {isDragging ? "Drop file here" : "Drag & drop a file here, or click to select"}
        </p>
        <p className="text-xs text-muted-foreground">
          Supported file types: {accept.replace(/\./g, "").toUpperCase().replace(/,/g, ", ")}
        </p>
      </div>
    </div>
  )
}
