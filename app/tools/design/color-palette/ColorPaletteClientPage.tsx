"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, RefreshCw, Download } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type ColorHarmony = "analogous" | "monochromatic" | "triadic" | "complementary" | "split-complementary" | "tetradic"

interface ColorPalette {
  colors: string[]
  name: string
}

export default function ColorPaletteClientPage() {
  const [baseColor, setBaseColor] = useState("#3b82f6")
  const [colorInput, setColorInput] = useState("#3b82f6")
  const [harmony, setHarmony] = useState<ColorHarmony>("analogous")
  const [palettes, setPalettes] = useState<ColorPalette[]>([])
  const [shades, setShades] = useState<string[]>([])
  const [numColors, setNumColors] = useState(5)
  const { toast } = useToast()

  // Generate palettes when base color or harmony changes
  useEffect(() => {
    generatePalettes()
    generateShades()
  }, [baseColor, harmony, numColors])

  // Update color input when base color changes
  useEffect(() => {
    setColorInput(baseColor)
  }, [baseColor])

  const handleColorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColorInput(e.target.value)
  }

  const handleColorInputBlur = () => {
    // Validate color
    if (/^#[0-9A-F]{6}$/i.test(colorInput)) {
      setBaseColor(colorInput)
    } else {
      setColorInput(baseColor)
      toast({
        title: "Invalid color",
        description: "Please enter a valid hex color code (e.g., #3b82f6)",
        variant: "destructive",
      })
    }
  }

  const handleColorPickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseColor(e.target.value)
  }

  const generateRandomColor = () => {
    const randomColor =
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")
    setBaseColor(randomColor)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${text} has been copied to your clipboard.`,
    })
  }

  const downloadPalette = (palette: ColorPalette) => {
    // Create CSS variables
    let cssContent = `:root {\n`
    palette.colors.forEach((color, index) => {
      cssContent += `  --color-${palette.name.toLowerCase()}-${index + 1}: ${color};\n`
    })
    cssContent += `}\n`

    // Create a blob and download
    const blob = new Blob([cssContent], { type: "text/css" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${palette.name.toLowerCase()}-palette.css`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Palette downloaded",
      description: `${palette.name} palette has been downloaded as CSS variables.`,
    })
  }

  // Convert hex to HSL
  const hexToHSL = (hex: string): [number, number, number] => {
    // Remove the # if present
    hex = hex.replace(/^#/, "")

    // Parse the hex values
    const r = Number.parseInt(hex.substring(0, 2), 16) / 255
    const g = Number.parseInt(hex.substring(2, 4), 16) / 255
    const b = Number.parseInt(hex.substring(4, 6), 16) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

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

    return [h * 360, s * 100, l * 100]
  }

  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number): string => {
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

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  // Generate color palettes based on harmony
  const generatePalettes = () => {
    const [h, s, l] = hexToHSL(baseColor)
    const newPalettes: ColorPalette[] = []

    // Analogous colors (adjacent on the color wheel)
    if (harmony === "analogous" || harmony === "all") {
      const analogous = Array.from({ length: numColors }, (_, i) => {
        const newH = (h + (i - Math.floor(numColors / 2)) * 30) % 360
        return hslToHex(newH < 0 ? newH + 360 : newH, s, l)
      })
      newPalettes.push({ colors: analogous, name: "Analogous" })
    }

    // Monochromatic colors (same hue, different saturation/lightness)
    if (harmony === "monochromatic" || harmony === "all") {
      const monochromatic = Array.from({ length: numColors }, (_, i) => {
        const newL = Math.max(20, Math.min(80, l - 30 + (i * 60) / (numColors - 1)))
        return hslToHex(h, s, newL)
      })
      newPalettes.push({ colors: monochromatic, name: "Monochromatic" })
    }

    // Triadic colors (evenly spaced on the color wheel)
    if (harmony === "triadic" || harmony === "all") {
      const triadic = Array.from({ length: numColors }, (_, i) => {
        const newH = (h + (i * 360) / numColors) % 360
        return hslToHex(newH, s, l)
      })
      newPalettes.push({ colors: triadic, name: "Triadic" })
    }

    // Complementary colors (opposite on the color wheel)
    if (harmony === "complementary" || harmony === "all") {
      const complementary = Array.from({ length: numColors }, (_, i) => {
        const ratio = i / (numColors - 1)
        const newH = h + ratio * 180
        return hslToHex(newH % 360, s, l)
      })
      newPalettes.push({ colors: complementary, name: "Complementary" })
    }

    // Split-complementary colors
    if (harmony === "split-complementary" || harmony === "all") {
      const splitComplementary = Array.from({ length: numColors }, (_, i) => {
        let newH
        if (i === 0) {
          newH = h
        } else if (i === 1) {
          newH = (h + 150) % 360
        } else if (i === 2) {
          newH = (h + 210) % 360
        } else {
          // For additional colors, interpolate between the main three
          const segment = Math.floor(i / 3)
          const segmentPosition = (i % 3) / 2
          if (segment === 0) {
            newH = h + segmentPosition * 150
          } else {
            newH = h + 150 + segmentPosition * 60
          }
        }
        return hslToHex(newH % 360, s, l)
      })
      newPalettes.push({ colors: splitComplementary, name: "Split Complementary" })
    }

    // Tetradic colors (rectangle on the color wheel)
    if (harmony === "tetradic" || harmony === "all") {
      const tetradic = Array.from({ length: numColors }, (_, i) => {
        const segment = i % 4
        let newH
        if (segment === 0) newH = h
        else if (segment === 1) newH = (h + 90) % 360
        else if (segment === 2) newH = (h + 180) % 360
        else newH = (h + 270) % 360
        return hslToHex(newH, s, l)
      })
      newPalettes.push({ colors: tetradic, name: "Tetradic" })
    }

    setPalettes(newPalettes)
  }

  // Generate shades and tints of the base color
  const generateShades = () => {
    const [h, s, l] = hexToHSL(baseColor)

    // Generate 10 shades from light to dark
    const newShades = Array.from({ length: 10 }, (_, i) => {
      const newL = 95 - i * 9 // From 95% to 5% lightness
      return hslToHex(h, s, newL)
    })

    setShades(newShades)
  }

  const faqs = [
    {
      question: "What is a color palette?",
      answer:
        "A color palette is a collection of colors chosen to work together in a design. A well-designed color palette creates harmony and consistency in your project, whether it's a website, app, or graphic design.",
    },
    {
      question: "What are color harmonies?",
      answer:
        "Color harmonies are color combinations that are pleasing to the eye. They're based on the color wheel and include: Analogous (colors next to each other), Monochromatic (variations of one color), Triadic (three evenly spaced colors), Complementary (opposite colors), Split-complementary (a color and two adjacent to its complement), and Tetradic (four colors forming a rectangle on the color wheel).",
    },
    {
      question: "How do I choose a good base color?",
      answer:
        "Choose a base color that represents the mood or brand you're designing for. Blues convey trust and professionalism, reds convey energy and passion, greens convey growth and health, etc. You can also use your brand's primary color as a starting point.",
    },
    {
      question: "How many colors should I use in my design?",
      answer:
        "A good rule of thumb is to use 3-5 colors in your design: a primary color, a secondary color, and an accent color, plus black and white or shades of gray. Too many colors can make a design look cluttered and unprofessional.",
    },
    {
      question: "What's the 60-30-10 rule in color design?",
      answer:
        "The 60-30-10 rule is a classic design principle that helps create balanced color schemes. Use your dominant color for 60% of the design, your secondary color for 30%, and an accent color for 10%. This creates visual hierarchy and balance.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Color Palette Generator</h1>
        <p className="mt-2 text-muted-foreground">Create harmonious color palettes for your designs</p>
      </div>

      <AdBanner format="horizontal" slot="color-palette-top" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6 space-y-6">
            <div>
              <Label htmlFor="base-color">Base Color</Label>
              <div className="flex mt-2 gap-2">
                <div className="relative flex-1">
                  <Input
                    id="base-color"
                    value={colorInput}
                    onChange={handleColorInputChange}
                    onBlur={handleColorInputBlur}
                    className="pl-10"
                  />
                  <div
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-md border"
                    style={{ backgroundColor: baseColor }}
                  />
                </div>
                <Input type="color" value={baseColor} onChange={handleColorPickerChange} className="w-12 p-1 h-10" />
                <Button variant="outline" size="icon" onClick={generateRandomColor} title="Generate random color">
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="harmony-select">Color Harmony</Label>
              <Select value={harmony} onValueChange={(value) => setHarmony(value as ColorHarmony)}>
                <SelectTrigger id="harmony-select" className="mt-2">
                  <SelectValue placeholder="Select harmony" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analogous">Analogous</SelectItem>
                  <SelectItem value="monochromatic">Monochromatic</SelectItem>
                  <SelectItem value="triadic">Triadic</SelectItem>
                  <SelectItem value="complementary">Complementary</SelectItem>
                  <SelectItem value="split-complementary">Split Complementary</SelectItem>
                  <SelectItem value="tetradic">Tetradic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="num-colors">Number of Colors: {numColors}</Label>
              <Slider
                id="num-colors"
                min={3}
                max={9}
                step={1}
                value={[numColors]}
                onValueChange={(value) => setNumColors(value[0])}
                className="mt-2"
              />
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Shades & Tints</h3>
              <div className="grid grid-cols-10 gap-1 h-8">
                {shades.map((shade, index) => (
                  <div
                    key={index}
                    className="h-full rounded-sm cursor-pointer hover:scale-110 transition-transform"
                    style={{ backgroundColor: shade }}
                    onClick={() => copyToClipboard(shade)}
                    title={shade}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          {palettes.map((palette, paletteIndex) => (
            <Card key={paletteIndex}>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">{palette.name} Palette</h3>
                  <Button variant="outline" size="sm" onClick={() => downloadPalette(palette)}>
                    <Download className="h-4 w-4 mr-2" />
                    Download CSS
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {palette.colors.map((color, colorIndex) => (
                    <div key={colorIndex} className="flex flex-col items-center" onClick={() => copyToClipboard(color)}>
                      <div
                        className="w-full aspect-square rounded-md mb-2 cursor-pointer hover:scale-105 transition-transform relative group"
                        style={{ backgroundColor: color }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 rounded-md">
                          <Copy className="h-5 w-5 text-white drop-shadow-md" />
                        </div>
                      </div>
                      <span className="text-xs font-mono">{color}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="color-palette-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Color Palette Generator</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our Color Palette Generator helps you create harmonious color combinations for your design projects. Whether
            you're designing a website, app, or graphic, having a cohesive color palette is essential for creating a
            professional and visually appealing result.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6">Color Harmonies Explained</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h4 className="font-medium">Analogous</h4>
              <p>
                Analogous color schemes use colors that are adjacent to each other on the color wheel. They usually
                match well and create serene and comfortable designs. Analogous color schemes are often found in nature.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Monochromatic</h4>
              <p>
                Monochromatic color schemes use variations in lightness and saturation of a single color. This creates a
                cohesive look that's easy on the eyes and can help establish a mood.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Triadic</h4>
              <p>
                Triadic color schemes use three colors that are evenly spaced around the color wheel. This tends to be
                quite vibrant, even if you use pale or unsaturated versions of your colors.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Complementary</h4>
              <p>
                Complementary color schemes use colors that are opposite each other on the color wheel. This creates a
                high-contrast, vibrant look. It's best to use one color as the dominant color and the other for accents.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Split Complementary</h4>
              <p>
                Split complementary schemes use a base color and two colors adjacent to its complement. This provides
                high contrast but less tension than a complementary scheme.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Tetradic</h4>
              <p>
                Tetradic (or double complementary) schemes use four colors arranged in two complementary pairs. This
                rich color scheme offers many possibilities for variation but can be challenging to balance.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-medium text-foreground mt-6">How to Use This Tool</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Select a base color using the color picker or by entering a hex code</li>
            <li>Choose a color harmony type that fits your design needs</li>
            <li>Adjust the number of colors in your palette using the slider</li>
            <li>Click on any color to copy its hex code to your clipboard</li>
            <li>Download the palette as CSS variables for easy implementation in your project</li>
          </ol>

          <h3 className="text-lg font-medium text-foreground mt-6">Tips for Using Color Palettes</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Follow the 60-30-10 rule</strong> - Use your dominant color for 60% of the design, your secondary
              color for 30%, and an accent color for 10%
            </li>
            <li>
              <strong>Consider accessibility</strong> - Ensure there's enough contrast between text and background
              colors for readability
            </li>
            <li>
              <strong>Test your palette</strong> - Try your colors in different contexts to ensure they work well
              together
            </li>
            <li>
              <strong>Be consistent</strong> - Use your palette consistently throughout your design for a cohesive look
            </li>
            <li>
              <strong>Consider color psychology</strong> - Different colors evoke different emotions and associations
            </li>
          </ul>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
