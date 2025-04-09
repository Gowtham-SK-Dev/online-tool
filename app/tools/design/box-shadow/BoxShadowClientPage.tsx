"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Copy } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ShadowSettings {
  horizontalOffset: number
  verticalOffset: number
  blur: number
  spread: number
  color: string
  opacity: number
  inset: boolean
}

export default function BoxShadowClientPage() {
  const [settings, setSettings] = useState<ShadowSettings>({
    horizontalOffset: 5,
    verticalOffset: 5,
    blur: 10,
    spread: 0,
    color: "#000000",
    opacity: 20,
    inset: false,
  })

  const [boxColor, setBoxColor] = useState("#ffffff")
  const [boxWidth, setBoxWidth] = useState(200)
  const [boxHeight, setBoxHeight] = useState(200)
  const [boxRadius, setBoxRadius] = useState(8)
  const [presets, setPresets] = useState<{ name: string; settings: ShadowSettings }[]>([
    {
      name: "Soft",
      settings: {
        horizontalOffset: 0,
        verticalOffset: 4,
        blur: 8,
        spread: 0,
        color: "#000000",
        opacity: 10,
        inset: false,
      },
    },
    {
      name: "Medium",
      settings: {
        horizontalOffset: 0,
        verticalOffset: 6,
        blur: 12,
        spread: -2,
        color: "#000000",
        opacity: 15,
        inset: false,
      },
    },
    {
      name: "Hard",
      settings: {
        horizontalOffset: 0,
        verticalOffset: 8,
        blur: 16,
        spread: -2,
        color: "#000000",
        opacity: 25,
        inset: false,
      },
    },
    {
      name: "Layered",
      settings: {
        horizontalOffset: 0,
        verticalOffset: 2,
        blur: 4,
        spread: -1,
        color: "#000000",
        opacity: 10,
        inset: false,
      },
    },
    {
      name: "Inset",
      settings: {
        horizontalOffset: 0,
        verticalOffset: 5,
        blur: 15,
        spread: -3,
        color: "#000000",
        opacity: 15,
        inset: true,
      },
    },
    {
      name: "Neon",
      settings: {
        horizontalOffset: 0,
        verticalOffset: 0,
        blur: 20,
        spread: 5,
        color: "#ff00ff",
        opacity: 50,
        inset: false,
      },
    },
  ])

  const [multiShadow, setMultiShadow] = useState<ShadowSettings[]>([{ ...settings }])

  const [activeTab, setActiveTab] = useState<"single" | "multiple" | "presets">("single")
  const { toast } = useToast()

  // Generate the box shadow CSS
  const generateBoxShadow = (shadowSettings: ShadowSettings): string => {
    const { horizontalOffset, verticalOffset, blur, spread, color, opacity, inset } = shadowSettings

    // Convert hex color to rgba
    const hexToRgba = (hex: string, opacity: number) => {
      const r = Number.parseInt(hex.slice(1, 3), 16)
      const g = Number.parseInt(hex.slice(3, 5), 16)
      const b = Number.parseInt(hex.slice(5, 7), 16)
      return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`
    }

    const rgba = hexToRgba(color, opacity)

    return `${inset ? "inset " : ""}${horizontalOffset}px ${verticalOffset}px ${blur}px ${spread}px ${rgba}`
  }

  // Generate CSS for multiple shadows
  const generateMultiShadowCSS = (): string => {
    return multiShadow.map((shadow) => generateBoxShadow(shadow)).join(", ")
  }

  // Get the current shadow CSS based on active tab
  const getCurrentShadowCSS = (): string => {
    if (activeTab === "single") {
      return generateBoxShadow(settings)
    } else if (activeTab === "multiple") {
      return generateMultiShadowCSS()
    } else {
      // For presets tab, we'll just use the single shadow settings
      return generateBoxShadow(settings)
    }
  }

  // Get the full CSS rule
  const getFullCSS = (): string => {
    return `.element {\n  box-shadow: ${getCurrentShadowCSS()};\n}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "CSS has been copied to your clipboard.",
    })
  }

  const addShadow = () => {
    setMultiShadow([
      ...multiShadow,
      {
        horizontalOffset: 0,
        verticalOffset: 0,
        blur: 10,
        spread: 0,
        color: "#000000",
        opacity: 20,
        inset: false,
      },
    ])
  }

  const removeShadow = (index: number) => {
    if (multiShadow.length > 1) {
      const newShadows = [...multiShadow]
      newShadows.splice(index, 1)
      setMultiShadow(newShadows)
    }
  }

  const updateMultiShadow = (index: number, newSettings: Partial<ShadowSettings>) => {
    const newShadows = [...multiShadow]
    newShadows[index] = { ...newShadows[index], ...newSettings }
    setMultiShadow(newShadows)
  }

  const applyPreset = (presetSettings: ShadowSettings) => {
    setSettings(presetSettings)
  }

  const faqs = [
    {
      question: "What is a box shadow?",
      answer:
        "A box shadow is a CSS property that adds shadow effects around an element's frame. You can set the horizontal and vertical offsets, blur radius, spread radius, color, and whether the shadow is inset or not.",
    },
    {
      question: "What's the difference between blur and spread?",
      answer:
        "The blur radius determines how blurry the shadow will be. A larger value will create a more diffuse shadow. The spread radius determines the size of the shadow. Positive values increase the size, negative values decrease it.",
    },
    {
      question: "Can I use multiple box shadows?",
      answer:
        "Yes, you can apply multiple box shadows to a single element by separating each shadow with a comma. This allows you to create complex shadow effects like layered shadows or glows.",
    },
    {
      question: "What does the 'inset' option do?",
      answer:
        "The inset keyword changes the shadow from an outer shadow (outset) to an inner shadow. Instead of the shadow being drawn outside the box, it's drawn inside the box, as if the content was depressed inside the frame.",
    },
    {
      question: "How do I make a shadow more subtle?",
      answer:
        "To create a subtle shadow, use a low opacity (10-20%), a small offset (2-4px), and a moderate blur (5-10px). This creates a soft shadow that doesn't overpower your design but still provides depth.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Box Shadow Generator</h1>
        <p className="mt-2 text-muted-foreground">Create and customize CSS box shadows for your web projects</p>
      </div>

      <AdBanner format="horizontal" slot="box-shadow-top" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div>
          <Tabs defaultValue="single" onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="single">Single Shadow</TabsTrigger>
              <TabsTrigger value="multiple">Multiple Shadows</TabsTrigger>
              <TabsTrigger value="presets">Presets</TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="space-y-4 mt-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="horizontal-offset">Horizontal Offset: {settings.horizontalOffset}px</Label>
                    <Slider
                      id="horizontal-offset"
                      min={-50}
                      max={50}
                      step={1}
                      value={[settings.horizontalOffset]}
                      onValueChange={(value) => setSettings({ ...settings, horizontalOffset: value[0] })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="vertical-offset">Vertical Offset: {settings.verticalOffset}px</Label>
                    <Slider
                      id="vertical-offset"
                      min={-50}
                      max={50}
                      step={1}
                      value={[settings.verticalOffset]}
                      onValueChange={(value) => setSettings({ ...settings, verticalOffset: value[0] })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="blur">Blur Radius: {settings.blur}px</Label>
                    <Slider
                      id="blur"
                      min={0}
                      max={100}
                      step={1}
                      value={[settings.blur]}
                      onValueChange={(value) => setSettings({ ...settings, blur: value[0] })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="spread">Spread Radius: {settings.spread}px</Label>
                    <Slider
                      id="spread"
                      min={-50}
                      max={50}
                      step={1}
                      value={[settings.spread]}
                      onValueChange={(value) => setSettings({ ...settings, spread: value[0] })}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="opacity">Opacity: {settings.opacity}%</Label>
                    <Slider
                      id="opacity"
                      min={0}
                      max={100}
                      step={1}
                      value={[settings.opacity]}
                      onValueChange={(value) => setSettings({ ...settings, opacity: value[0] })}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="shadow-color">Shadow Color</Label>
                    <Input
                      id="shadow-color"
                      type="color"
                      value={settings.color}
                      onChange={(e) => setSettings({ ...settings, color: e.target.value })}
                      className="w-12 p-1 h-10"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="inset">Inset Shadow</Label>
                    <Switch
                      id="inset"
                      checked={settings.inset}
                      onCheckedChange={(checked) => setSettings({ ...settings, inset: checked })}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="multiple" className="space-y-4 mt-4">
              <div className="flex justify-end">
                <Button onClick={addShadow} size="sm">
                  Add Shadow
                </Button>
              </div>

              {multiShadow.map((shadow, index) => (
                <Card key={index} className="relative">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Shadow {index + 1}</h3>
                      {multiShadow.length > 1 && (
                        <Button variant="destructive" size="sm" onClick={() => removeShadow(index)}>
                          Remove
                        </Button>
                      )}
                    </div>

                    <div>
                      <Label>Horizontal: {shadow.horizontalOffset}px</Label>
                      <Slider
                        min={-50}
                        max={50}
                        step={1}
                        value={[shadow.horizontalOffset]}
                        onValueChange={(value) => updateMultiShadow(index, { horizontalOffset: value[0] })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Vertical: {shadow.verticalOffset}px</Label>
                      <Slider
                        min={-50}
                        max={50}
                        step={1}
                        value={[shadow.verticalOffset]}
                        onValueChange={(value) => updateMultiShadow(index, { verticalOffset: value[0] })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Blur: {shadow.blur}px</Label>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[shadow.blur]}
                        onValueChange={(value) => updateMultiShadow(index, { blur: value[0] })}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Spread: {shadow.spread}px</Label>
                      <Slider
                        min={-50}
                        max={50}
                        step={1}
                        value={[shadow.spread]}
                        onValueChange={(value) => updateMultiShadow(index, { spread: value[0] })}
                        className="mt-2"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Label>Color</Label>
                        <Input
                          type="color"
                          value={shadow.color}
                          onChange={(e) => updateMultiShadow(index, { color: e.target.value })}
                          className="w-12 p-1 h-10"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Label>Opacity: {shadow.opacity}%</Label>
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={[shadow.opacity]}
                          onValueChange={(value) => updateMultiShadow(index, { opacity: value[0] })}
                          className="w-24"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label>Inset Shadow</Label>
                      <Switch
                        checked={shadow.inset}
                        onCheckedChange={(checked) => updateMultiShadow(index, { inset: checked })}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="presets" className="mt-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {presets.map((preset, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => applyPreset(preset.settings)}
                  >
                    <CardContent className="p-4">
                      <div className="mb-2 font-medium text-center">{preset.name}</div>
                      <div
                        className="w-full aspect-square rounded-md bg-white dark:bg-gray-800"
                        style={{ boxShadow: generateBoxShadow(preset.settings) }}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Box Properties</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="box-width">Width: {boxWidth}px</Label>
                  <Slider
                    id="box-width"
                    min={50}
                    max={400}
                    step={1}
                    value={[boxWidth]}
                    onValueChange={(value) => setBoxWidth(value[0])}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="box-height">Height: {boxHeight}px</Label>
                  <Slider
                    id="box-height"
                    min={50}
                    max={400}
                    step={1}
                    value={[boxHeight]}
                    onValueChange={(value) => setBoxHeight(value[0])}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="box-radius">Border Radius: {boxRadius}px</Label>
                  <Slider
                    id="box-radius"
                    min={0}
                    max={200}
                    step={1}
                    value={[boxRadius]}
                    onValueChange={(value) => setBoxRadius(value[0])}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="box-color">Box Color</Label>
                  <div className="flex mt-2">
                    <Input
                      id="box-color"
                      type="color"
                      value={boxColor}
                      onChange={(e) => setBoxColor(e.target.value)}
                      className="w-full p-1 h-10"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">Preview</h3>
              </div>

              <div className="flex items-center justify-center p-8 bg-gray-100 dark:bg-gray-800 rounded-md">
                <div
                  style={{
                    width: `${boxWidth}px`,
                    height: `${boxHeight}px`,
                    borderRadius: `${boxRadius}px`,
                    backgroundColor: boxColor,
                    boxShadow: getCurrentShadowCSS(),
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium">CSS Code</h3>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(getFullCSS())}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy CSS
                </Button>
              </div>

              <pre className="p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto">
                <code>{getFullCSS()}</code>
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="box-shadow-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Box Shadow Generator</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our Box Shadow Generator helps you create and customize CSS box shadows for your web projects. Box shadows
            add depth and dimension to elements, making your designs more visually appealing and realistic.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6">Understanding Box Shadow Properties</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h4 className="font-medium">Horizontal & Vertical Offset</h4>
              <p>
                These values determine the position of the shadow. Positive horizontal values move the shadow right,
                negative values move it left. Positive vertical values move the shadow down, negative values move it up.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Blur Radius</h4>
              <p>
                The blur radius determines how blurry the shadow will be. A larger value will create a more diffuse
                shadow, while a value of 0 will create a sharp shadow with no blur.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Spread Radius</h4>
              <p>
                The spread radius determines the size of the shadow. Positive values increase the size of the shadow,
                negative values decrease it. A value of 0 means the shadow will be the same size as the element.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Color & Opacity</h4>
              <p>
                The color and opacity determine the appearance of the shadow. Lower opacity values create more subtle
                shadows, while higher values create more pronounced shadows.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Inset</h4>
              <p>
                The inset keyword changes the shadow from an outer shadow to an inner shadow. This is useful for
                creating effects like pressed buttons or recessed elements.
              </p>
            </div>

            <div>
              <h4 className="font-medium">Multiple Shadows</h4>
              <p>
                You can apply multiple shadows to a single element by separating each shadow with a comma. This allows
                you to create complex shadow effects like layered shadows or glows.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-medium text-foreground mt-6">How to Use This Tool</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Adjust the shadow properties using the sliders and controls</li>
            <li>Preview the shadow in real-time</li>
            <li>Customize the box properties to see how the shadow looks on different elements</li>
            <li>Copy the generated CSS code to use in your project</li>
            <li>For multiple shadows, add additional shadows and customize each one</li>
            <li>Try the presets for quick, professionally designed shadow effects</li>
          </ol>

          <h3 className="text-lg font-medium text-foreground mt-6">Tips for Using Box Shadows</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Use subtle shadows</strong> - In most cases, subtle shadows look more professional than harsh
              ones. Use low opacity values and moderate blur for a natural look.
            </li>
            <li>
              <strong>Consider light direction</strong> - Shadows should be consistent with your light source. If light
              comes from above, shadows should appear below elements.
            </li>
            <li>
              <strong>Layer shadows for depth</strong> - Using multiple shadows with different properties can create a
              more realistic and nuanced effect.
            </li>
            <li>
              <strong>Use inset shadows for inner depth</strong> - Inset shadows are great for creating recessed
              elements or showing pressed states for buttons.
            </li>
            <li>
              <strong>Consider performance</strong> - Complex shadows can impact performance, especially on mobile
              devices. Use them judiciously.
            </li>
          </ul>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
