"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy } from "lucide-react"

export default function ColorConverterClientPage() {
  const [hex, setHex] = useState("#3b82f6")
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [activeTab, setActiveTab] = useState("hex")
  const { toast } = useToast()

  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    // Remove # if present
    hex = hex.replace(/^#/, "")

    // Parse hex
    let r, g, b
    if (hex.length === 3) {
      r = Number.parseInt(hex[0] + hex[0], 16)
      g = Number.parseInt(hex[1] + hex[1], 16)
      b = Number.parseInt(hex[2] + hex[2], 16)
    } else {
      r = Number.parseInt(hex.substring(0, 2), 16)
      g = Number.parseInt(hex.substring(2, 4), 16)
      b = Number.parseInt(hex.substring(4, 6), 16)
    }

    return { r, g, b }
  }

  // Convert RGB to hex
  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255
    g /= 255
    b /= 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0,
      s = 0,
      l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }

      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  // Convert HSL to RGB
  const hslToRgb = (h: number, s: number, l: number) => {
    h /= 360
    s /= 100
    l /= 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1 / 6) return p + (q - p) * 6 * t
        if (t < 1 / 2) return q
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q

      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255),
    }
  }

  // Update values when hex changes
  const handleHexChange = (value: string) => {
    if (/^#?([0-9A-F]{3}){1,2}$/i.test(value)) {
      const hexValue = value.startsWith("#") ? value : `#${value}`
      setHex(hexValue)
      const rgbValue = hexToRgb(hexValue)
      setRgb(rgbValue)
      setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b))
    }
  }

  // Update values when RGB changes
  const handleRgbChange = (component: "r" | "g" | "b", value: number) => {
    const newRgb = { ...rgb, [component]: value }
    setRgb(newRgb)
    setHex(rgbToHex(newRgb.r, newRgb.g, newRgb.b))
    setHsl(rgbToHsl(newRgb.r, newRgb.g, newRgb.b))
  }

  // Update values when HSL changes
  const handleHslChange = (component: "h" | "s" | "l", value: number) => {
    const newHsl = { ...hsl, [component]: value }
    setHsl(newHsl)
    const rgbValue = hslToRgb(newHsl.h, newHsl.s, newHsl.l)
    setRgb(rgbValue)
    setHex(rgbToHex(rgbValue.r, rgbValue.g, rgbValue.b))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${text} has been copied to your clipboard.`,
    })
  }

  const faqs = [
    {
      question: "What is HEX color code?",
      answer:
        "HEX (hexadecimal) color code is a way of specifying color using hexadecimal values. The code consists of a pound sign (#) followed by six hex digits, which specify the red, green, and blue components of the color.",
    },
    {
      question: "What is RGB color model?",
      answer:
        "RGB (Red, Green, Blue) is an additive color model in which red, green, and blue light are added together in various ways to reproduce a broad array of colors. The RGB values range from 0 to 255.",
    },
    {
      question: "What is HSL color model?",
      answer:
        "HSL (Hue, Saturation, Lightness) is a color model that represents colors in terms of hue (0-360 degrees), saturation (0-100%), and lightness (0-100%). It's often considered more intuitive for adjusting colors than RGB.",
    },
    {
      question: "Why would I need to convert between color formats?",
      answer:
        "Different applications and programming languages may require different color formats. For example, CSS supports all three formats, but some design tools might only work with one specific format. Converting between formats allows you to use the same color across different platforms.",
    },
    {
      question: "Is there a difference in the colors when using different formats?",
      answer:
        "No, the different formats (HEX, RGB, HSL) are just different ways to represent the same color. Converting between them should not change the actual color, though there might be slight rounding differences in some cases.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Color Converter</h1>
        <p className="mt-2 text-muted-foreground">Convert between HEX, RGB, and HSL color formats</p>
      </div>

      <AdBanner format="horizontal" slot="color-converter-top" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-6">
                <div>
                  <Label htmlFor="color-preview">Color Preview</Label>
                  <div
                    id="color-preview"
                    className="h-24 rounded-md mt-2 border"
                    style={{ backgroundColor: hex }}
                  ></div>
                </div>

                <Tabs defaultValue="hex" onValueChange={setActiveTab}>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="hex">HEX</TabsTrigger>
                    <TabsTrigger value="rgb">RGB</TabsTrigger>
                    <TabsTrigger value="hsl">HSL</TabsTrigger>
                  </TabsList>

                  <TabsContent value="hex" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="hex-input">HEX Color</Label>
                        <div className="flex mt-2">
                          <Input
                            id="hex-input"
                            value={hex}
                            onChange={(e) => handleHexChange(e.target.value)}
                            placeholder="#000000"
                            className="flex-1"
                          />
                          <Button variant="outline" size="icon" className="ml-2" onClick={() => copyToClipboard(hex)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="rgb" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="rgb-r">Red (0-255)</Label>
                        <div className="flex mt-2">
                          <Input
                            id="rgb-r"
                            type="number"
                            min="0"
                            max="255"
                            value={rgb.r}
                            onChange={(e) => handleRgbChange("r", Number.parseInt(e.target.value) || 0)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="rgb-g">Green (0-255)</Label>
                        <div className="flex mt-2">
                          <Input
                            id="rgb-g"
                            type="number"
                            min="0"
                            max="255"
                            value={rgb.g}
                            onChange={(e) => handleRgbChange("g", Number.parseInt(e.target.value) || 0)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="rgb-b">Blue (0-255)</Label>
                        <div className="flex mt-2">
                          <Input
                            id="rgb-b"
                            type="number"
                            min="0"
                            max="255"
                            value={rgb.b}
                            onChange={(e) => handleRgbChange("b", Number.parseInt(e.target.value) || 0)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="flex">
                        <Button
                          variant="outline"
                          className="ml-auto"
                          onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy RGB
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="hsl" className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="hsl-h">Hue (0-360)</Label>
                        <div className="flex mt-2">
                          <Input
                            id="hsl-h"
                            type="number"
                            min="0"
                            max="360"
                            value={hsl.h}
                            onChange={(e) => handleHslChange("h", Number.parseInt(e.target.value) || 0)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="hsl-s">Saturation (0-100)</Label>
                        <div className="flex mt-2">
                          <Input
                            id="hsl-s"
                            type="number"
                            min="0"
                            max="100"
                            value={hsl.s}
                            onChange={(e) => handleHslChange("s", Number.parseInt(e.target.value) || 0)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="hsl-l">Lightness (0-100)</Label>
                        <div className="flex mt-2">
                          <Input
                            id="hsl-l"
                            type="number"
                            min="0"
                            max="100"
                            value={hsl.l}
                            onChange={(e) => handleHslChange("l", Number.parseInt(e.target.value) || 0)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                      <div className="flex">
                        <Button
                          variant="outline"
                          className="ml-auto"
                          onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy HSL
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Color Values</h2>
              <div className="space-y-4">
                <div>
                  <Label>HEX</Label>
                  <div className="flex items-center mt-2">
                    <div className="w-6 h-6 rounded-md mr-2" style={{ backgroundColor: hex }}></div>
                    <code className="bg-muted p-1 rounded text-sm flex-1">{hex}</code>
                    <Button variant="ghost" size="icon" className="ml-2" onClick={() => copyToClipboard(hex)}>
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>RGB</Label>
                  <div className="flex items-center mt-2">
                    <div className="w-6 h-6 rounded-md mr-2" style={{ backgroundColor: hex }}></div>
                    <code className="bg-muted p-1 rounded text-sm flex-1">
                      rgb({rgb.r}, {rgb.g}, {rgb.b})
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>HSL</Label>
                  <div className="flex items-center mt-2">
                    <div className="w-6 h-6 rounded-md mr-2" style={{ backgroundColor: hex }}></div>
                    <code className="bg-muted p-1 rounded text-sm flex-1">
                      hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">CSS Code</h2>
              <div className="space-y-4">
                <div>
                  <Label>CSS Variable</Label>
                  <div className="flex items-center mt-2">
                    <code className="bg-muted p-1 rounded text-sm flex-1">--color: {hex};</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => copyToClipboard(`--color: ${hex};`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Background Color</Label>
                  <div className="flex items-center mt-2">
                    <code className="bg-muted p-1 rounded text-sm flex-1">background-color: {hex};</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => copyToClipboard(`background-color: ${hex};`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Tailwind CSS</Label>
                  <div className="flex items-center mt-2">
                    <code className="bg-muted p-1 rounded text-sm flex-1">className="bg-[{hex}]"</code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2"
                      onClick={() => copyToClipboard(`className="bg-[${hex}]"`)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="color-converter-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Color Converter</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our Color Converter tool helps you convert between different color formats: HEX, RGB, and HSL. It's perfect
            for web developers, designers, and anyone working with colors in digital media.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Convert colors between HEX, RGB, and HSL formats</li>
            <li>See a live preview of the color</li>
            <li>Copy color values to clipboard in different formats</li>
            <li>Get CSS code snippets for your color</li>
            <li>Experiment with different color values</li>
          </ul>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
