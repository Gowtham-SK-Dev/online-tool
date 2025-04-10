"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Download, Copy, Check } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ImageFormat = "jpeg" | "png" | "gif" | "webp" | "svg+xml"

export default function FaviconGeneratorClientPage() {
  const [activeTab, setActiveTab] = useState<"upload" | "emoji" | "text">("upload")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [emoji, setEmoji] = useState<string>("🚀")
  const [text, setText] = useState<string>("A")
  const [textColor, setTextColor] = useState<string>("#ffffff")
  const [backgroundColor, setBackgroundColor] = useState<string>("#3b82f6")
  const [fontSize, setFontSize] = useState<number>(48)
  const [borderRadius, setBorderRadius] = useState<number>(0)
  const [padding, setPadding] = useState<number>(10)
  const [fontFamily, setFontFamily] = useState<string>("Arial, sans-serif")
  const [fontWeight, setFontWeight] = useState<string>("bold")
  const [showBackground, setShowBackground] = useState<boolean>(true)
  const [faviconSizes, setFaviconSizes] = useState<number[]>([16, 32, 48, 64, 128, 192])
  const [generatedFavicons, setGeneratedFavicons] = useState<{ size: number; dataUrl: string }[]>([])
  const [htmlCode, setHtmlCode] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [isCopied, setIsCopied] = useState<boolean>(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Generate favicon when parameters change
  useEffect(() => {
    if (activeTab === "emoji" || activeTab === "text") {
      generateFavicon()
    }
  }, [
    activeTab,
    emoji,
    text,
    textColor,
    backgroundColor,
    fontSize,
    borderRadius,
    padding,
    fontFamily,
    fontWeight,
    showBackground,
  ])

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
    const reader = new FileReader()

    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      setImagePreview(dataUrl)
    }

    reader.onerror = () => {
      toast({
        title: "Error",
        description: "Failed to read the image file",
        variant: "destructive",
      })
    }

    reader.readAsDataURL(file)
  }

  const generateFavicon = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size (we'll use 64px as the base size)
    const size = 64
    canvas.width = size
    canvas.height = size

    // Clear canvas
    ctx.clearRect(0, 0, size, size)

    // Draw background if enabled
    if (showBackground) {
      ctx.fillStyle = backgroundColor
      if (borderRadius > 0) {
        // Draw rounded rectangle
        const radius = (borderRadius / 100) * (size / 2)
        ctx.beginPath()
        ctx.moveTo(radius, 0)
        ctx.lineTo(size - radius, 0)
        ctx.quadraticCurveTo(size, 0, size, radius)
        ctx.lineTo(size, size - radius)
        ctx.quadraticCurveTo(size, size, size - radius, size)
        ctx.lineTo(radius, size)
        ctx.quadraticCurveTo(0, size, 0, size - radius)
        ctx.lineTo(0, radius)
        ctx.quadraticCurveTo(0, 0, radius, 0)
        ctx.closePath()
        ctx.fill()
      } else {
        // Draw regular rectangle
        ctx.fillRect(0, 0, size, size)
      }
    }

    // Calculate padding
    const paddingSize = (padding / 100) * size

    if (activeTab === "emoji") {
      // Draw emoji
      ctx.font = `${size - paddingSize * 2}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(emoji, size / 2, size / 2)
    } else if (activeTab === "text") {
      // Draw text
      ctx.fillStyle = textColor
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(text, size / 2, size / 2)
    }

    // Update preview
    setImagePreview(canvas.toDataURL("image/png"))
  }

  const generateAllFavicons = async () => {
    setIsGenerating(true)
    setGeneratedFavicons([])

    try {
      const favicons: { size: number; dataUrl: string }[] = []

      for (const size of faviconSizes) {
        let dataUrl = ""

        if (activeTab === "upload" && imageFile) {
          // Resize uploaded image
          dataUrl = await resizeImage(imageFile, size, size)
        } else {
          // Resize canvas-generated image
          dataUrl = await resizeCanvasImage(size)
        }

        favicons.push({ size, dataUrl })
      }

      setGeneratedFavicons(favicons)

      // Generate HTML code
      const code = generateHtmlCode(favicons)
      setHtmlCode(code)

      toast({
        title: "Favicons generated",
        description: `Generated ${favicons.length} favicon sizes`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate favicons",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const resizeImage = (file: File, width: number, height: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Failed to get canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL("image/png"))
      }
      img.onerror = () => {
        reject(new Error("Failed to load image"))
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const resizeCanvasImage = (size: number): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (!canvasRef.current) {
        reject(new Error("Canvas not available"))
        return
      }

      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext("2d")
        if (!ctx) {
          reject(new Error("Failed to get canvas context"))
          return
        }

        ctx.drawImage(img, 0, 0, size, size)
        resolve(canvas.toDataURL("image/png"))
      }
      img.onerror = () => {
        reject(new Error("Failed to load image"))
      }
      img.src = canvasRef.current.toDataURL("image/png")
    })
  }

  const generateHtmlCode = (favicons: { size: number; dataUrl: string }[]): string => {
    let code = "<!-- Favicon -->\n"

    // Add link tags for each size
    favicons.forEach(({ size }) => {
      code += `<link rel="icon" type="image/png" sizes="${size}x${size}" href="favicon-${size}x${size}.png">\n`
    })

    // Add Apple touch icon
    if (favicons.some((f) => f.size === 180)) {
      code += `<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">\n`
    } else if (favicons.some((f) => f.size === 152)) {
      code += `<link rel="apple-touch-icon" sizes="152x152" href="apple-touch-icon.png">\n`
    } else {
      const largestSize = Math.max(...favicons.map((f) => f.size))
      code += `<link rel="apple-touch-icon" sizes="${largestSize}x${largestSize}" href="favicon-${largestSize}x${largestSize}.png">\n`
    }

    return code
  }

  const downloadFavicon = (dataUrl: string, size: number) => {
    const link = document.createElement("a")
    link.href = dataUrl
    link.download = `favicon-${size}x${size}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const downloadAllFavicons = () => {
    if (generatedFavicons.length === 0) return

    // Create a zip file using JSZip
    import("jszip")
      .then((JSZip) => {
        const zip = new JSZip.default()

        // Add each favicon to the zip
        generatedFavicons.forEach(({ size, dataUrl }) => {
          // Convert data URL to blob
          const byteString = atob(dataUrl.split(",")[1])
          const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0]
          const ab = new ArrayBuffer(byteString.length)
          const ia = new Uint8Array(ab)
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i)
          }
          const blob = new Blob([ab], { type: mimeString })

          // Add to zip
          zip.file(`favicon-${size}x${size}.png`, blob)
        })

        // Add HTML code
        zip.file("favicon-html.txt", htmlCode)

        // Generate and download zip
        zip.generateAsync({ type: "blob" }).then((content) => {
          const link = document.createElement("a")
          link.href = URL.createObjectURL(content)
          link.download = "favicons.zip"
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          toast({
            title: "Download started",
            description: "Your favicons are being downloaded as a zip file",
          })
        })
      })
      .catch(() => {
        toast({
          title: "Error",
          description: "Failed to create zip file",
          variant: "destructive",
        })
      })
  }

  const copyHtmlCode = () => {
    navigator.clipboard.writeText(htmlCode)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
    toast({
      title: "Copied to clipboard",
      description: "HTML code has been copied to your clipboard",
    })
  }

  const faqs = [
    {
      question: "What is a favicon?",
      answer:
        "A favicon (short for 'favorite icon') is a small icon associated with a website or web page. It's displayed in browser tabs, bookmarks, and history lists. Favicons help users identify your site visually and enhance brand recognition.",
    },
    {
      question: "What sizes of favicons do I need?",
      answer:
        "Modern websites typically need multiple favicon sizes for different devices and contexts. Common sizes include 16x16 (browser tabs), 32x32 (Windows taskbar), 48x48 (desktop shortcuts), and 180x180 (Apple touch icon for iOS devices).",
    },
    {
      question: "How do I add a favicon to my website?",
      answer:
        "Add the generated HTML code to the <head> section of your HTML document. Upload all the favicon files to your website's root directory or the location specified in your HTML code.",
    },
    {
      question: "What's the best image format for favicons?",
      answer:
        "PNG is the most widely supported format for favicons and offers good quality with transparency support. Our tool generates PNG favicons for maximum compatibility.",
    },
    {
      question: "Can I use SVG for favicons?",
      answer:
        "While SVG favicons are supported in some modern browsers, PNG remains the most compatible format. For best results, we recommend using the PNG favicons generated by our tool.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Favicon Generator</h1>
        <p className="mt-2 text-muted-foreground">Create favicons from images, emojis, or text for your website</p>
      </div>

      <AdBanner format="horizontal" slot="favicon-generator-top" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="upload" onValueChange={(value) => setActiveTab(value as "upload" | "emoji" | "text")}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upload">Upload Image</TabsTrigger>
                  <TabsTrigger value="emoji">Use Emoji</TabsTrigger>
                  <TabsTrigger value="text">Use Text</TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="mt-4">
                  <div
                    className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-medium">Drag & drop an image here, or click to select</p>
                    <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, GIF, SVG (Max: 5MB)</p>
                  </div>

                  {imagePreview && activeTab === "upload" && (
                    <div className="mt-4 flex justify-center">
                      <img
                        src={imagePreview || "/placeholder.svg"}
                        alt="Preview"
                        className="max-w-full max-h-[200px] object-contain border rounded-md"
                      />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="emoji" className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="emoji-input">Emoji</Label>
                    <Input
                      id="emoji-input"
                      value={emoji}
                      onChange={(e) => setEmoji(e.target.value)}
                      className="text-center text-3xl h-16"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="background-color">Background Color</Label>
                      <div className="flex mt-2">
                        <div className="w-10 h-10 rounded-md border overflow-hidden">
                          <Input
                            type="color"
                            id="background-color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-12 h-12 -m-1 p-0 border-0"
                          />
                        </div>
                        <Input
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="flex-1 ml-2"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="show-background" checked={showBackground} onCheckedChange={setShowBackground} />
                      <Label htmlFor="show-background">Show Background</Label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="border-radius">Border Radius: {borderRadius}%</Label>
                      <Slider
                        id="border-radius"
                        min={0}
                        max={50}
                        step={1}
                        value={[borderRadius]}
                        onValueChange={(value) => setBorderRadius(value[0])}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="padding">Padding: {padding}%</Label>
                      <Slider
                        id="padding"
                        min={0}
                        max={30}
                        step={1}
                        value={[padding]}
                        onValueChange={(value) => setPadding(value[0])}
                        className="mt-2"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="text" className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="text-input">Text</Label>
                    <Input
                      id="text-input"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="text-center text-3xl h-16"
                      maxLength={2}
                    />
                    <p className="text-xs text-muted-foreground mt-1">For best results, use 1-2 characters only</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="text-color">Text Color</Label>
                      <div className="flex mt-2">
                        <div className="w-10 h-10 rounded-md border overflow-hidden">
                          <Input
                            type="color"
                            id="text-color"
                            value={textColor}
                            onChange={(e) => setTextColor(e.target.value)}
                            className="w-12 h-12 -m-1 p-0 border-0"
                          />
                        </div>
                        <Input
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="flex-1 ml-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="background-color-text">Background Color</Label>
                      <div className="flex mt-2">
                        <div className="w-10 h-10 rounded-md border overflow-hidden">
                          <Input
                            type="color"
                            id="background-color-text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-12 h-12 -m-1 p-0 border-0"
                          />
                        </div>
                        <Input
                          value={backgroundColor}
                          onChange={(e) => setBackgroundColor(e.target.value)}
                          className="flex-1 ml-2"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="font-size">Font Size: {fontSize}px</Label>
                      <Slider
                        id="font-size"
                        min={20}
                        max={60}
                        step={1}
                        value={[fontSize]}
                        onValueChange={(value) => setFontSize(value[0])}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="font-family">Font Family</Label>
                      <Select value={fontFamily} onValueChange={setFontFamily}>
                        <SelectTrigger id="font-family" className="mt-2">
                          <SelectValue placeholder="Select font family" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                          <SelectItem value="'Times New Roman', serif">Times New Roman</SelectItem>
                          <SelectItem value="'Courier New', monospace">Courier New</SelectItem>
                          <SelectItem value="Georgia, serif">Georgia</SelectItem>
                          <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                          <SelectItem value="'Trebuchet MS', sans-serif">Trebuchet MS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="font-weight">Font Weight</Label>
                      <Select value={fontWeight} onValueChange={setFontWeight}>
                        <SelectTrigger id="font-weight" className="mt-2">
                          <SelectValue placeholder="Select font weight" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="bold">Bold</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="show-background-text" checked={showBackground} onCheckedChange={setShowBackground} />
                      <Label htmlFor="show-background-text">Show Background</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="border-radius-text">Border Radius: {borderRadius}%</Label>
                    <Slider
                      id="border-radius-text"
                      min={0}
                      max={50}
                      step={1}
                      value={[borderRadius]}
                      onValueChange={(value) => setBorderRadius(value[0])}
                      className="mt-2"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Hidden canvas for generating favicons */}
              <canvas ref={canvasRef} className="hidden"></canvas>

              <div className="mt-6">
                <Button
                  onClick={generateAllFavicons}
                  disabled={(!imagePreview && activeTab === "upload") || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? "Generating..." : "Generate Favicons"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Preview</h3>

              {imagePreview ? (
                <div className="space-y-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-t-md p-2 w-full flex items-center border-b">
                      <div className="w-4 h-4 rounded-full bg-gray-300 dark:bg-gray-600 mr-2"></div>
                      <div className="flex-1 h-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-center p-4 bg-white dark:bg-gray-900 border border-t-0 rounded-b-md w-full">
                      <div className="flex items-center">
                        <img src={imagePreview || "/placeholder.svg"} alt="Favicon preview" className="w-4 h-4 mr-2" />
                        <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <img src={imagePreview || "/placeholder.svg"} alt="16px" className="w-4 h-4 mx-auto" />
                      <p className="text-xs text-muted-foreground mt-1">16px</p>
                    </div>
                    <div className="text-center">
                      <img src={imagePreview || "/placeholder.svg"} alt="32px" className="w-8 h-8 mx-auto" />
                      <p className="text-xs text-muted-foreground mt-1">32px</p>
                    </div>
                    <div className="text-center">
                      <img src={imagePreview || "/placeholder.svg"} alt="48px" className="w-12 h-12 mx-auto" />
                      <p className="text-xs text-muted-foreground mt-1">48px</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-40 bg-muted/30 rounded-md">
                  <p className="text-muted-foreground">Preview will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>

          {generatedFavicons.length > 0 && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Generated Favicons</h3>
                  <Button variant="outline" size="sm" onClick={downloadAllFavicons}>
                    <Download className="h-4 w-4 mr-2" />
                    Download All
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {generatedFavicons.map(({ size, dataUrl }) => (
                    <div key={size} className="text-center">
                      <div className="relative group">
                        <img
                          src={dataUrl || "/placeholder.svg"}
                          alt={`${size}x${size}`}
                          className="mx-auto border rounded p-1"
                          style={{ width: Math.min(size, 64), height: Math.min(size, 64) }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 bg-black/50 rounded"
                          onClick={() => downloadFavicon(dataUrl, size)}
                        >
                          <Download className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {size}x{size}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">HTML Code</h4>
                    <Button variant="ghost" size="sm" onClick={copyHtmlCode}>
                      {isCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {isCopied ? "Copied" : "Copy"}
                    </Button>
                  </div>
                  <pre className="text-xs bg-muted p-2 rounded-md overflow-x-auto max-h-40">
                    <code>{htmlCode}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="favicon-generator-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Favicon Generator</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our Favicon Generator tool helps you create favicons for your website from images, emojis, or text. Favicons
            are small icons displayed in browser tabs, bookmarks, and history lists, helping users identify your site
            visually.
          </p>
          <p>
            A well-designed favicon enhances your brand recognition and improves user experience by making your site
            easily identifiable among multiple open tabs.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create favicons from uploaded images</li>
            <li>Generate favicons from emojis or text</li>
            <li>Customize colors, shapes, and styles</li>
            <li>Generate multiple favicon sizes for different devices and contexts</li>
            <li>Download individual favicons or all sizes as a zip file</li>
            <li>Get the HTML code to add favicons to your website</li>
          </ul>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
