"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Upload, Download } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function ImageToBase64ClientPage() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [base64Output, setBase64Output] = useState<string>("")
  const [dataUrlOutput, setDataUrlOutput] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"upload" | "url">("upload")
  const [imageUrl, setImageUrl] = useState<string>("")
  const [includeDataUrl, setIncludeDataUrl] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith("image/")) {
      processImageFile(file)
    } else {
      toast({
        title: "Invalid file",
        description: "Please drop an image file",
        variant: "destructive",
      })
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const processImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please select an image file",
        variant: "destructive",
      })
      return
    }

    setImageFile(file)
    setError(null)
    setIsLoading(true)

    const reader = new FileReader()

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setImagePreview(dataUrl)
      setDataUrlOutput(dataUrl)

      // Extract the base64 part from the data URL
      const base64 = dataUrl.split(",")[1]
      setBase64Output(base64)

      setIsLoading(false)
    }

    reader.onerror = () => {
      setError("Error reading the image file")
      setIsLoading(false)
      toast({
        title: "Error",
        description: "Failed to read the image file",
        variant: "destructive",
      })
    }

    reader.readAsDataURL(file)
  }

  const fetchImageFromUrl = async () => {
    if (!imageUrl) {
      toast({
        title: "URL required",
        description: "Please enter an image URL",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Create a proxy URL to avoid CORS issues
      const proxyUrl = `https://cors-anywhere.herokuapp.com/${imageUrl}`

      // Fetch the image
      const response = await fetch(proxyUrl)

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`)
      }

      // Check if the response is an image
      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.startsWith("image/")) {
        throw new Error("The URL does not point to an image")
      }

      // Convert the image to a blob
      const blob = await response.blob()

      // Create a File object from the blob
      const file = new File([blob], "image.jpg", { type: contentType })

      // Process the file
      processImageFile(file)
    } catch (err) {
      setError(`Error fetching image: ${(err as Error).message}`)
      setIsLoading(false)
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Base64 data has been copied to your clipboard",
    })
  }

  const downloadBase64AsImage = () => {
    if (!imagePreview) return

    const link = document.createElement("a")
    link.href = imagePreview
    link.download = imageFile?.name || "image.jpg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download started",
      description: "Your image is being downloaded",
    })
  }

  const getOutputText = () => {
    if (includeDataUrl) {
      return dataUrlOutput
    } else {
      return base64Output
    }
  }

  const faqs = [
    {
      question: "What is Base64 encoding for images?",
      answer:
        "Base64 encoding is a way to convert binary data, like images, into ASCII text format. This allows images to be embedded directly in HTML, CSS, or JSON without requiring a separate file.",
    },
    {
      question: "Why would I convert an image to Base64?",
      answer:
        "Converting images to Base64 is useful for embedding images directly in HTML/CSS (reducing HTTP requests), storing images in JSON, sending images in API requests, or creating data URIs for small images and icons.",
    },
    {
      question: "What's the difference between Base64 and Data URL?",
      answer:
        "Base64 is just the encoded binary data, while a Data URL includes a prefix that specifies the MIME type (e.g., 'data:image/jpeg;base64,'). Data URLs can be used directly in img src attributes or CSS background-image properties.",
    },
    {
      question: "Are there any downsides to using Base64 encoded images?",
      answer:
        "Yes, Base64 encoding increases the file size by about 33%, can't be cached separately by browsers, and may slow down initial page rendering for large images. It's best used for small images like icons or in situations where separate image files aren't practical.",
    },
    {
      question: "Is there a size limit for images I can convert?",
      answer:
        "While this tool can handle most images, very large images (over 5MB) might cause performance issues in the browser. Also, Base64 encoded images increase in size by about 33%, so a 1MB image will result in approximately 1.33MB of Base64 text.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Image to Base64 Converter</h1>
        <p className="mt-2 text-muted-foreground">
          Convert images to Base64 encoded strings for embedding in HTML, CSS, or JSON
        </p>
      </div>

      <AdBanner format="horizontal" slot="image-to-base64-top" />

      <Tabs defaultValue="upload" className="mt-6" onValueChange={(value) => setActiveTab(value as "upload" | "url")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Image</TabsTrigger>
          <TabsTrigger value="url">Image URL</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div
                className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium">
                  {isLoading ? "Processing..." : "Drag & drop an image here, or click to select"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, GIF, SVG, WebP (Max: 5MB)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="url" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="image-url">Image URL</Label>
                <div className="flex mt-2">
                  <Input
                    id="image-url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1"
                  />
                  <Button onClick={fetchImageFromUrl} className="ml-2" disabled={isLoading}>
                    {isLoading ? "Loading..." : "Fetch"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Note: Some websites may block image fetching due to CORS policies
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {error && (
        <div className="mt-4 p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive">
          {error}
        </div>
      )}

      {imagePreview && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Image Preview</h2>
            <Card>
              <CardContent className="p-4 flex items-center justify-center">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Converted image"
                  className="max-w-full max-h-[300px] object-contain"
                />
              </CardContent>
            </Card>
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                {imageFile && (
                  <span>
                    {imageFile.name} ({(imageFile.size / 1024).toFixed(2)} KB)
                  </span>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={downloadBase64AsImage}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Base64 Output</h2>
              <div className="flex items-center space-x-2">
                <Switch id="include-data-url" checked={includeDataUrl} onCheckedChange={setIncludeDataUrl} />
                <Label htmlFor="include-data-url">Include Data URL prefix</Label>
              </div>
            </div>
            <div className="relative">
              <Textarea value={getOutputText()} readOnly className="font-mono text-xs h-[300px] resize-none" />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(getOutputText())}
                disabled={!base64Output}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {base64Output && (
                <span>
                  Base64 length: {base64Output.length} characters ({(base64Output.length / 1024).toFixed(2)} KB)
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      <AdBanner className="my-8" format="rectangle" slot="image-to-base64-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Image to Base64 Converter</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our Image to Base64 Converter tool helps you convert images to Base64 encoded strings. This is useful for
            embedding images directly in HTML, CSS, or JSON without requiring a separate file.
          </p>
          <p>
            Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It's
            commonly used to embed image data in web pages, CSS files, or JSON data.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Convert any image to a Base64 encoded string</li>
            <li>Get the Base64 data with or without the Data URL prefix</li>
            <li>Preview the image before and after conversion</li>
            <li>Copy the Base64 string to clipboard for use in your projects</li>
            <li>Convert images from your device or from a URL</li>
          </ul>
        </div>
      </section>

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">How to Use Base64 Images</h2>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">In HTML:</h3>
          <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
            {`<img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..." alt="Base64 Image" />`}
          </pre>

          <h3 className="text-lg font-medium">In CSS:</h3>
          <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
            {`.element {\n  background-image: url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...");\n}`}
          </pre>

          <h3 className="text-lg font-medium">In JavaScript:</h3>
          <pre className="p-4 bg-muted rounded-md overflow-x-auto text-sm">
            {`const img = new Image();\nimg.src = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD...";\ndocument.body.appendChild(img);`}
          </pre>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
