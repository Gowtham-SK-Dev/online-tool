"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Download } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type ScaleType = "custom" | "minorThird" | "majorThird" | "perfectFourth" | "goldenRatio"

interface TypographySettings {
  baseSize: number
  baseLineHeight: number
  scaleRatio: number
  scaleType: ScaleType
  unit: "px" | "rem" | "em"
  levels: number
}

interface FontSettings {
  family: string
  weight: number
  letterSpacing: number
}

export default function TypographyScaleClientPage() {
  const [settings, setSettings] = useState<TypographySettings>({
    baseSize: 16,
    baseLineHeight: 1.5,
    scaleRatio: 1.25,
    scaleType: "majorThird",
    unit: "rem",
    levels: 6,
  })

  const [fontSettings, setFontSettings] = useState<FontSettings>({
    family: "Inter, sans-serif",
    weight: 400,
    letterSpacing: 0,
  })

  const [scale, setScale] = useState<{ size: number; lineHeight: number }[]>([])
  const [activeTab, setActiveTab] = useState<"preview" | "css" | "tailwind">("preview")
  const { toast } = useToast()

  // Predefined scale ratios
  const scaleRatios: Record<ScaleType, number> = {
    custom: 1.25,
    minorThird: 1.2,
    majorThird: 1.25,
    perfectFourth: 1.333,
    goldenRatio: 1.618,
  }

  // Update scale ratio when scale type changes
  useEffect(() => {
    if (settings.scaleType !== "custom") {
      setSettings((prevSettings) => ({ ...prevSettings, scaleRatio: scaleRatios[settings.scaleType] }))
    }
  }, [settings, settings.scaleType])

  // Generate the typography scale
  useEffect(() => {
    generateScale()
  }, [settings, fontSettings])

  const generateScale = () => {
    const { baseSize, baseLineHeight, scaleRatio, levels } = settings

    const newScale = []

    // Generate scale from largest to smallest
    for (let i = levels - 1; i >= 0; i--) {
      const size = baseSize * Math.pow(scaleRatio, i)
      const lineHeight = baseLineHeight - i * 0.05 // Decrease line height as size increases

      newScale.push({
        size,
        lineHeight: Math.max(1.1, lineHeight), // Ensure line height doesn't go below 1.1
      })
    }

    setScale(newScale)
  }

  // Format size with the selected unit
  const formatSize = (size: number): string => {
    if (settings.unit === "px") {
      return `${Math.round(size)}px`
    } else if (settings.unit === "rem") {
      return `${(size / 16).toFixed(3)}rem`
    } else {
      return `${(size / settings.baseSize).toFixed(3)}em`
    }
  }

  // Generate CSS code
  const generateCSS = (): string => {
    let css = `:root {\n`

    // Add variables
    scale.forEach((item, index) => {
      const level = scale.length - index
      css += `  --font-size-${level}: ${formatSize(item.size)};\n`
      css += `  --line-height-${level}: ${item.lineHeight.toFixed(2)};\n`
    })

    css += `}\n\n`

    // Add typography classes
    scale.forEach((item, index) => {
      const level = scale.length - index
      css += `.text-${level} {\n`
      css += `  font-size: var(--font-size-${level});\n`
      css += `  line-height: var(--line-height-${level});\n`
      css += `  font-family: ${fontSettings.family};\n`
      css += `  font-weight: ${fontSettings.weight};\n`
      if (fontSettings.letterSpacing !== 0) {
        css += `  letter-spacing: ${fontSettings.letterSpacing}px;\n`
      }
      css += `}\n\n`
    })

    return css
  }

  // Generate Tailwind config
  const generateTailwindConfig = (): string => {
    let config = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {`

    scale.forEach((item, index) => {
      const level = scale.length - index
      config += `
        '${level}': ['${formatSize(item.size)}', {
          lineHeight: '${item.lineHeight.toFixed(2)}',
          letterSpacing: '${fontSettings.letterSpacing}px',
          fontWeight: ${fontSettings.weight},
        }],`
    })

    config += `
      },
      fontFamily: {
        sans: ['${fontSettings.family.split(",")[0].trim()}', 'sans-serif'],
      },
    },
  },
}`

    return config
  }

  const copyToClipboard = (text: string) => {
    try {
      navigator.clipboard.writeText(text)
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied to your clipboard.",
      })
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard. Please try again.",
        variant: "destructive",
      })
    }
  }

  const downloadCSS = () => {
    const css = generateCSS()
    const blob = new Blob([css], { type: "text/css" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "typography-scale.css"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "CSS Downloaded",
      description: "Typography scale CSS has been downloaded.",
    })
  }

  const faqs = [
    {
      question: "What is a typography scale?",
      answer:
        "A typography scale is a system of font sizes that follow a mathematical ratio, creating a harmonious progression from small to large text. It helps establish visual hierarchy and consistency in your designs.",
    },
    {
      question: "What scale ratio should I use?",
      answer:
        "Common scale ratios include the Minor Third (1.2), Major Third (1.25), Perfect Fourth (1.333), and Golden Ratio (1.618). The Minor Third creates a subtle progression suitable for content-heavy designs, while the Golden Ratio creates dramatic size differences better for minimal designs.",
    },
    {
      question: "How many levels should my typography scale have?",
      answer:
        "Most typography scales have 5-7 levels, which is enough to cover headings (h1-h6) and body text. Too many levels can make your design inconsistent, while too few might not provide enough visual hierarchy.",
    },
    {
      question: "What's the difference between px, rem, and em units?",
      answer:
        "Pixels (px) are fixed units that don't scale with user preferences. Rem units are relative to the root element's font size, making them ideal for responsive design. Em units are relative to the parent element's font size, useful for component-specific scaling.",
    },
    {
      question: "How do I implement this scale in my project?",
      answer:
        "You can copy the generated CSS and include it in your stylesheet, or use the Tailwind config in your Tailwind CSS project. For CSS variables, you'll reference them like `font-size: var(--font-size-1);` in your styles.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Typography Scale Generator</h1>
        <p className="mt-2 text-muted-foreground">Create harmonious typography scales for your web projects</p>
      </div>

      <AdBanner format="horizontal" slot="typography-top" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6 space-y-6">
            <div>
              <Label htmlFor="base-size">Base Size: {settings.baseSize}px</Label>
              <Slider
                id="base-size"
                min={12}
                max={24}
                step={1}
                value={[settings.baseSize]}
                onValueChange={(value) => setSettings({ ...settings, baseSize: value[0] })}
                className="mt-2"
                aria-label="Base font size"
              />
            </div>

            <div>
              <Label htmlFor="base-line-height">Base Line Height: {settings.baseLineHeight}</Label>
              <Slider
                id="base-line-height"
                min={1}
                max={2}
                step={0.05}
                value={[settings.baseLineHeight]}
                onValueChange={(value) => setSettings({ ...settings, baseLineHeight: value[0] })}
                className="mt-2"
                aria-label="Base line height"
              />
            </div>

            <div>
              <Label htmlFor="scale-type">Scale Type</Label>
              <Select
                value={settings.scaleType}
                onValueChange={(value) => setSettings({ ...settings, scaleType: value as ScaleType })}
              >
                <SelectTrigger id="scale-type" className="mt-2">
                  <SelectValue placeholder="Select scale type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minorThird">Minor Third (1.2)</SelectItem>
                  <SelectItem value="majorThird">Major Third (1.25)</SelectItem>
                  <SelectItem value="perfectFourth">Perfect Fourth (1.333)</SelectItem>
                  <SelectItem value="goldenRatio">Golden Ratio (1.618)</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {settings.scaleType === "custom" && (
              <div>
                <Label htmlFor="scale-ratio">Scale Ratio: {settings.scaleRatio}</Label>
                <Slider
                  id="scale-ratio"
                  min={1.1}
                  max={2}
                  step={0.01}
                  value={[settings.scaleRatio]}
                  onValueChange={(value) => setSettings({ ...settings, scaleRatio: value[0] })}
                  className="mt-2"
                  aria-label="Scale ratio"
                />
              </div>
            )}

            <div>
              <Label htmlFor="levels">Number of Levels: {settings.levels}</Label>
              <Slider
                id="levels"
                min={3}
                max={9}
                step={1}
                value={[settings.levels]}
                onValueChange={(value) => setSettings({ ...settings, levels: value[0] })}
                className="mt-2"
                aria-label="Number of levels"
              />
            </div>

            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={settings.unit}
                onValueChange={(value) => setSettings({ ...settings, unit: value as "px" | "rem" | "em" })}
              >
                <SelectTrigger id="unit" className="mt-2">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="px">Pixels (px)</SelectItem>
                  <SelectItem value="rem">Root EM (rem)</SelectItem>
                  <SelectItem value="em">EM (em)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">Font Settings</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="font-family">Font Family</Label>
                  <Input
                    id="font-family"
                    value={fontSettings.family}
                    onChange={(e) => setFontSettings({ ...fontSettings, family: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="font-weight">Font Weight: {fontSettings.weight}</Label>
                  <Select
                    value={fontSettings.weight.toString()}
                    onValueChange={(value) => setFontSettings({ ...fontSettings, weight: Number.parseInt(value) })}
                  >
                    <SelectTrigger id="font-weight" className="mt-2">
                      <SelectValue placeholder="Select font weight" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="300">Light (300)</SelectItem>
                      <SelectItem value="400">Regular (400)</SelectItem>
                      <SelectItem value="500">Medium (500)</SelectItem>
                      <SelectItem value="600">Semibold (600)</SelectItem>
                      <SelectItem value="700">Bold (700)</SelectItem>
                      <SelectItem value="800">Extrabold (800)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="letter-spacing">Letter Spacing: {fontSettings.letterSpacing}px</Label>
                  <Slider
                    id="letter-spacing"
                    min={-2}
                    max={5}
                    step={0.1}
                    value={[fontSettings.letterSpacing]}
                    onValueChange={(value) => setFontSettings({ ...fontSettings, letterSpacing: value[0] })}
                    className="mt-2"
                    aria-label="Letter spacing"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-2">
          <Tabs defaultValue="preview" onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="css">CSS</TabsTrigger>
              <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
            </TabsList>

            <TabsContent value="preview" className="mt-4">
              <Card>
                <CardContent className="p-6 space-y-8">
                  <h3 className="font-medium mb-4">Typography Scale Preview</h3>

                  <div className="space-y-6">
                    {scale.map((item, index) => {
                      const level = scale.length - index
                      return (
                        <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-2 md:mb-0 text-sm text-muted-foreground">
                            <span className="font-mono">Level {level}: </span>
                            <span>{formatSize(item.size)}</span>
                            <span className="mx-1">/</span>
                            <span>{item.lineHeight.toFixed(2)}</span>
                          </div>
                          <div
                            style={{
                              fontSize: formatSize(item.size),
                              lineHeight: item.lineHeight,
                              fontFamily: fontSettings.family,
                              fontWeight: fontSettings.weight,
                              letterSpacing: `${fontSettings.letterSpacing}px`,
                            }}
                          >
                            {level === scale.length ? "Body text" : `Heading ${level}`}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="css" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">CSS Code</h3>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateCSS())}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadCSS}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto text-xs md:text-sm">
                    <code>{generateCSS()}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tailwind" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Tailwind Config</h3>
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(generateTailwindConfig())}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>

                  <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto text-xs md:text-sm">
                    <code>{generateTailwindConfig()}</code>
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="typography-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Typography Scale Generator</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our Typography Scale Generator helps you create harmonious typography scales for your web projects. A
            well-designed typography scale establishes visual hierarchy, improves readability, and creates a consistent
            and professional look across your website or application.
          </p>
          <p className="mt-2">
            Typography is a fundamental aspect of web design that significantly impacts user experience, readability,
            and brand perception. A well-implemented typography scale ensures consistency across your website while
            creating visual hierarchy that guides users through your content.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6">Understanding Typography Scales</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h4 className="font-medium">What is a Typography Scale?</h4>
              <p>
                A typography scale is a system of font sizes that follow a mathematical ratio, creating a harmonious
                progression from small to large text. It helps establish visual hierarchy and consistency in your
                designs.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Base Size</h4>
              <p>
                The base size is the foundation of your typography scale, typically used for body text. Common base
                sizes range from 16px to 18px for web content, ensuring readability across devices.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Scale Ratio</h4>
              <p>
                The scale ratio determines how quickly your font sizes increase or decrease. Common ratios include the
                Minor Third (1.2), Major Third (1.25), Perfect Fourth (1.333), and Golden Ratio (1.618).
              </p>
            </div>

            <div>
              <h4 className="font-medium">Line Height</h4>
              <p>
                Line height (or leading) is the vertical space between lines of text. It's crucial for readability,
                especially for longer text. Line height typically decreases as font size increases.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-medium text-foreground mt-6">How to Use This Tool</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Adjust the base size to set your body text size</li>
            <li>Choose a scale type or set a custom ratio</li>
            <li>Set the number of levels in your scale</li>
            <li>Choose your preferred unit (px, rem, or em)</li>
            <li>Customize font settings like family, weight, and letter spacing</li>
            <li>Preview your scale in real-time</li>
            <li>Copy or download the generated CSS or Tailwind config</li>
          </ol>

          <h3 className="text-lg font-medium text-foreground mt-6">Tips for Using Typography Scales</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Start with a good base size</strong> - 16px is a good default for body text on the web
            </li>
            <li>
              <strong>Choose an appropriate ratio</strong> - Smaller ratios (1.2-1.25) work well for content-heavy
              sites, while larger ratios create more dramatic contrast for minimal designs
            </li>
            <li>
              <strong>Consider line height</strong> - Longer text needs more line height (1.5-1.6) for readability,
              while headings can use tighter line heights (1.1-1.3)
            </li>
            <li>
              <strong>Be consistent</strong> - Use your scale consistently throughout your design
            </li>
            <li>
              <strong>Test on different devices</strong> - Ensure your typography scale works well on both desktop and
              mobile
            </li>
          </ul>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
