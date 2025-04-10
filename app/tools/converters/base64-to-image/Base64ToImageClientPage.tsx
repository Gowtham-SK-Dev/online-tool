"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Upload, Copy, FileType } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

type ImageFormat = "jpeg" | "png" | "gif" | "webp" | "svg+xml"

export default function Base64ToImageClientPage() {
  const [base64Input, setBase64Input] = useState<string>("")
  const [imagePreview, setImagePreview] = useState<string>("")
  const [imageFormat, setImageFormat] = useState<ImageFormat>("jpeg")
  const [fileName, setFileName] = useState<string>("image")
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const { toast } = useToast()

  // Process base64 input when it changes
  useEffect(() => {
    if (base64Input.trim()) {
      convertBase64ToImage()
    } else {
      setImagePreview("")
      setError(null)
    }
  }, [base64Input, imageFormat])

  const convertBase64ToImage = () => {
    setIsProcessing(true)
    setError(null)

    try {
      // Clean up the input
      let cleanBase64 = base64Input.trim()

      // Check if it's a data URL and extract the base64 part if needed
      if (cleanBase64.startsWith("data:")) {
        const parts = cleanBase64.split(",")
        if (parts.length > 1) {
          // Extract the MIME type if present
          const mimeMatch = parts[0].match(/data:(image\/([^;]+));base64/)
          if (mimeMatch && mimeMatch[2]) {
            setImageFormat(mimeMatch[2] as ImageFormat)
          }

          cleanBase64 = parts[1]
        } else {
          throw new Error("Invalid data URL format")
        }
      }

      // Validate base64 string
      if (!/^[A-Za-z0-9+/=]+$/.test(cleanBase64)) {
        throw new Error("Input contains invalid base64 characters")
      }

      // Create data URL
      const dataUrl = `data:image/${imageFormat};base64,${cleanBase64}`

      // Test if the image can be loaded
      const img = new Image()
      img.onload = () => {
        setImagePreview(dataUrl)
        setIsProcessing(false)
      }
      img.onerror = () => {
        setError("Failed to load image. The base64 data may be invalid or corrupted.")
        setImagePreview("")
        setIsProcessing(false)
      }
      img.src = dataUrl
    } catch (err) {
      setError(`Error converting base64 to image: ${(err as Error).message}`)
      setImagePreview("")
      setIsProcessing(false)
      toast({
        title: "Conversion failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      if (result) {
        // Extract the base64 part from the data URL
        const base64 = result.split(",")[1]
        setBase64Input(base64)

        // Set the image format based on the file type
        const format = file.type.split("/")[1] as ImageFormat
        if (format) {
          setImageFormat(format)
        }

        // Set the file name without extension
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
        setFileName(nameWithoutExt)
      }
    }
    reader.readAsDataURL(file)
  }

  const downloadImage = () => {
    if (!imagePreview) return

    const link = document.createElement("a")
    link.href = imagePreview
    link.download = `${fileName}.${imageFormat}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download started",
      description: "Your image is being downloaded",
    })
  }

  const copyImageUrl = () => {
    if (!imagePreview) return

    navigator.clipboard.writeText(imagePreview)
    toast({
      title: "Copied to clipboard",
      description: "Data URL has been copied to your clipboard",
    })
  }

  const faqs = [
    {
      question: "What is Base64 to Image conversion?",
      answer:
        "Base64 to Image conversion is the process of decoding a Base64 encoded string back into its original binary image format. This allows you to view, save, or use the image that was previously encoded as text.",
    },
    {
      question: "Why would I need to convert Base64 to an image?",
      answer:
        "You might need to convert Base64 to an image when working with APIs that return image data as Base64, extracting images from data URIs in HTML/CSS, or when dealing with image data stored in JSON or databases.",
    },
    {
      question: "What image formats are supported?",
      answer:
        "This tool supports converting Base64 to JPEG, PNG, GIF, WebP, and SVG formats. The format selection determines the MIME type in the data URL and the file extension when downloading.",
    },
    {
      question: "How do I know if my Base64 string is valid?",
      answer:
        "Valid Base64 strings contain only characters A-Z, a-z, 0-9, +, /, and = (for padding). If your string contains other characters or is corrupted, the image won't display properly. Our tool validates the input and shows an error message for invalid Base64 data.",
    },
    {
      question: "Is my data secure when using this tool?",
      answer:
        "Yes, all processing happens directly in your browser. Your Base64 data and images are never sent to our servers, ensuring complete privacy and security.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Base64 to Image Converter</h1>
        <p className="mt-2 text-muted-foreground">Convert Base64 encoded strings back to viewable images</p>
      </div>

      <AdBanner format="horizontal" slot="base64-to-image-top" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Base64 Input</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Paste Base64 string or upload an image file</p>
            <div>
              <Input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleFileUpload} />
              <Button variant="outline" size="sm" onClick={() => document.getElementById("file-upload")?.click()}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Image
              </Button>
            </div>
          </div>
          <Textarea
            value={base64Input}
            onChange={(e) => setBase64Input(e.target.value)}
            placeholder="Paste your Base64 encoded string here..."
            className="font-mono text-xs min-h-[200px]"
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="image-format">Image Format</Label>
              <Select value={imageFormat} onValueChange={(value) => setImageFormat(value as ImageFormat)}>
                <SelectTrigger id="image-format" className="mt-2">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jpeg">JPEG</SelectItem>
                  <SelectItem value="png">PNG</SelectItem>
                  <SelectItem value="gif">GIF</SelectItem>
                  <SelectItem value="webp">WebP</SelectItem>
                  <SelectItem value="svg+xml">SVG</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="file-name">File Name</Label>
              <Input id="file-name" value={fileName} onChange={(e) => setFileName(e.target.value)} className="mt-2" />
            </div>
          </div>
          <Button onClick={convertBase64ToImage} className="w-full" disabled={!base64Input.trim() || isProcessing}>
            {isProcessing ? "Processing..." : "Convert to Image"}
          </Button>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Image Preview</h2>
          <Card className="overflow-hidden">
            <CardContent className="p-0 min-h-[300px] flex items-center justify-center bg-muted/30">
              {error ? (
                <div className="p-4 text-center text-destructive">
                  <FileType className="h-12 w-12 mx-auto mb-2 text-destructive/50" />
                  <p>{error}</p>
                </div>
              ) : imagePreview ? (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Converted from Base64"
                  className="max-w-full max-h-[300px] object-contain"
                />
              ) : (
                <div className="p-4 text-center text-muted-foreground">
                  <FileType className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                  <p>Image preview will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={downloadImage} disabled={!imagePreview}>
              <Download className="h-4 w-4 mr-2" />
              Download Image
            </Button>
            <Button variant="outline" className="flex-1" onClick={copyImageUrl} disabled={!imagePreview}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Data URL
            </Button>
          </div>
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="base64-to-image-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Base64 to Image Converter</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our Base64 to Image Converter tool helps you convert Base64 encoded strings back to viewable and
            downloadable images. This is useful when working with APIs, databases, or web applications that store or
            transmit images as Base64 encoded strings.
          </p>
          <p>
            Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's
            commonly used to embed image data in web pages, CSS files, or JSON data.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Convert Base64 encoded strings to viewable images</li>
            <li>Support for multiple image formats (JPEG, PNG, GIF, WebP, SVG)</li>
            <li>Preview the image before downloading</li>
            <li>Download the converted image to your device</li>
            <li>Copy the data URL for use in HTML, CSS, or JavaScript</li>
          </ul>
        </div>
      </section>

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
        <div className="space-y-4">
          <ol className="list-decimal pl-6 space-y-2">
            <li>Paste your Base64 encoded string into the input field (with or without the data URL prefix)</li>
            <li>Select the appropriate image format (JPEG, PNG, GIF, WebP, or SVG)</li>
            <li>Enter a file name for downloading the image</li>
            <li>Click "Convert to Image" to see the preview</li>
            <li>Download the image or copy the data URL for use in your projects</li>
          </ol>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
