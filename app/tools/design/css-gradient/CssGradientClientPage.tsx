"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Plus, Trash2 } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type GradientType = "linear" | "radial" | "conic"
type ColorStop = {
  color: string
  position: number
}

export default function CssGradientClientPage() {
  const [gradientType, setGradientType] = useState<GradientType>("linear")
  const [angle, setAngle] = useState<number>(90)
  const [colorStops, setColorStops] = useState<ColorStop[]>([
    { color: "#3b82f6", position: 0 },
    { color: "#8b5cf6", position: 100 },
  ])
  const [radialShape, setRadialShape] = useState<string>("circle")
  const [radialPosition, setRadialPosition] = useState<string>("center")
  const [conicAngle, setConicAngle] = useState<number>(0)
  const [conicPosition, setConicPosition] = useState<string>("center")
  const [cssCode, setCssCode] = useState<string>("")
  const [tailwindCode, setTailwindCode] = useState<string>("")
  const { toast } = useToast()

  // Generate gradient CSS when parameters change
  useEffect(() => {
    generateGradientCSS()
  }, [gradientType, angle, colorStops, radialShape, radialPosition, conicAngle, conicPosition])

  const generateGradientCSS = () => {
    let gradient = ""
    let tailwind = ""

    // Sort color stops by position
    const sortedStops = [...colorStops].sort((a, b) => a.position - b.position)

    if (gradientType === "linear") {
      gradient = `linear-gradient(${angle}deg, ${sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`
      tailwind = `bg-gradient-to-${getDirectionClass(angle)} from-[${sortedStops[0].color}] to-[${sortedStops[sortedStops.length - 1].color}]${sortedStops.length > 2 ? ` via-[${sortedStops[1].color}]` : ""}`
    } else if (gradientType === "radial") {
      gradient = `radial-gradient(${radialShape} at ${radialPosition}, ${sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`
      tailwind = `bg-[radial-gradient(${radialShape}_at_${radialPosition.replace(" ", "_")},${sortedStops.map((stop) => `${stop.color.replace("#", "")}_${stop.position}%`).join(",")}))]`
    } else if (gradientType === "conic") {
      gradient = `conic-gradient(from ${conicAngle}deg at ${conicPosition}, ${sortedStops.map((stop) => `${stop.color} ${stop.position}%`).join(", ")})`
      tailwind = `bg-[conic-gradient(from_${conicAngle}deg_at_${conicPosition.replace(" ", "_")},${sortedStops.map((stop) => `${stop.color.replace("#", "")}_${stop.position}%`).join(",")}))]`
    }

    setCssCode(`background: ${gradient}`)
    setTailwindCode(tailwind)
  }

  // Helper function to convert angle to Tailwind direction class
  const getDirectionClass = (angle: number): string => {
    // Normalize angle to 0-359
    const normalizedAngle = ((angle % 360) + 360) % 360

    if (normalizedAngle >= 337.5 || normalizedAngle < 22.5) return "r"
    if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) return "tr"
    if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) return "t"
    if (normalizedAngle >= 112.5 && normalizedAngle < 157.5) return "tl"
    if (normalizedAngle >= 157.5 && normalizedAngle < 202.5) return "l"
    if (normalizedAngle >= 202.5 && normalizedAngle < 247.5) return "bl"
    if (normalizedAngle >= 247.5 && normalizedAngle < 292.5) return "b"
    if (normalizedAngle >= 292.5 && normalizedAngle < 337.5) return "br"

    return "r" // Default
  }

  const addColorStop = () => {
    if (colorStops.length >= 5) {
      toast({
        title: "Maximum color stops reached",
        description: "You can have a maximum of 5 color stops",
        variant: "destructive",
      })
      return
    }

    // Calculate a position between the last two stops or at the end
    let newPosition = 50
    if (colorStops.length >= 2) {
      const sortedStops = [...colorStops].sort((a, b) => a.position - b.position)
      const lastPosition = sortedStops[sortedStops.length - 1].position
      const secondLastPosition = sortedStops[sortedStops.length - 2].position
      newPosition = Math.min(100, lastPosition + (lastPosition - secondLastPosition) / 2)
    }

    setColorStops([...colorStops, { color: "#9333ea", position: newPosition }])
  }

  const removeColorStop = (index: number) => {
    if (colorStops.length <= 2) {
      toast({
        title: "Minimum color stops required",
        description: "You need at least 2 color stops",
        variant: "destructive",
      })
      return
    }

    setColorStops(colorStops.filter((_, i) => i !== index))
  }

  const updateColorStop = (index: number, field: keyof ColorStop, value: string | number) => {
    const newStops = [...colorStops]
    newStops[index] = { ...newStops[index], [field]: value }
    setColorStops(newStops)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Code has been copied to your clipboard",
    })
  }

  const faqs = [
    {
      question: "What is a CSS gradient?",
      answer:
        "A CSS gradient is a visual effect that creates a smooth transition between two or more colors. CSS gradients are created using the linear-gradient(), radial-gradient(), or conic-gradient() functions and can be used as backgrounds for elements.",
    },
    {
      question: "What's the difference between linear, radial, and conic gradients?",
      answer:
        "Linear gradients transition colors along a straight line. Radial gradients transition colors outward from a central point in a circular or elliptical pattern. Conic gradients transition colors around a center point (like a color wheel).",
    },
    {
      question: "How do I use the generated CSS code?",
      answer:
        "Copy the CSS code and paste it into your stylesheet. You can apply it to any HTML element by using the appropriate selector. For example: .my-element { background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%); }",
    },
    {
      question: "Can I use these gradients with Tailwind CSS?",
      answer:
        "Yes! Our tool generates Tailwind CSS classes for your gradient. For simple gradients, you can use Tailwind's built-in gradient utilities. For more complex gradients, you can use the arbitrary value syntax with the generated code.",
    },
    {
      question: "Are CSS gradients supported in all browsers?",
      answer:
        "Linear and radial gradients are well-supported in all modern browsers. Conic gradients have good support in modern browsers but may require prefixes or fallbacks for older browsers. Our tool generates standard CSS that works in current browser versions.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">CSS Gradient Generator</h1>
        <p className="mt-2 text-muted-foreground">Create beautiful CSS gradients for your web projects</p>
      </div>

      <AdBanner format="horizontal" slot="css-gradient-top" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col space-y-6">
                <div>
                  <Label htmlFor="gradient-type">Gradient Type</Label>
                  <Select value={gradientType} onValueChange={(value) => setGradientType(value as GradientType)}>
                    <SelectTrigger id="gradient-type" className="mt-2">
                      <SelectValue placeholder="Select gradient type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear Gradient</SelectItem>
                      <SelectItem value="radial">Radial Gradient</SelectItem>
                      <SelectItem value="conic">Conic Gradient</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {gradientType === "linear" && (
                  <div>
                    <Label htmlFor="angle">Angle: {angle}°</Label>
                    <Slider
                      id="angle"
                      min={0}
                      max={360}
                      step={1}
                      value={[angle]}
                      onValueChange={(value) => setAngle(value[0])}
                      className="mt-2"
                    />
                  </div>
                )}

                {gradientType === "radial" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="radial-shape">Shape</Label>
                      <Select value={radialShape} onValueChange={setRadialShape}>
                        <SelectTrigger id="radial-shape" className="mt-2">
                          <SelectValue placeholder="Select shape" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="circle">Circle</SelectItem>
                          <SelectItem value="ellipse">Ellipse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="radial-position">Position</Label>
                      <Select value={radialPosition} onValueChange={setRadialPosition}>
                        <SelectTrigger id="radial-position" className="mt-2">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="top left">Top Left</SelectItem>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="top right">Top Right</SelectItem>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="bottom left">Bottom Left</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                          <SelectItem value="bottom right">Bottom Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {gradientType === "conic" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="conic-angle">Angle: {conicAngle}°</Label>
                      <Slider
                        id="conic-angle"
                        min={0}
                        max={360}
                        step={1}
                        value={[conicAngle]}
                        onValueChange={(value) => setConicAngle(value[0])}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="conic-position">Position</Label>
                      <Select value={conicPosition} onValueChange={setConicPosition}>
                        <SelectTrigger id="conic-position" className="mt-2">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="top left">Top Left</SelectItem>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="top right">Top Right</SelectItem>
                          <SelectItem value="left">Left</SelectItem>
                          <SelectItem value="right">Right</SelectItem>
                          <SelectItem value="bottom left">Bottom Left</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                          <SelectItem value="bottom right">Bottom Right</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label>Color Stops</Label>
                    <Button variant="outline" size="sm" onClick={addColorStop}>
                      <Plus className="h-4 w-4 mr-1" />
                      Add Color
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {colorStops.map((stop, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-md border overflow-hidden">
                          <Input
                            type="color"
                            value={stop.color}
                            onChange={(e) => updateColorStop(index, "color", e.target.value)}
                            className="w-12 h-12 -m-1 p-0 border-0"
                          />
                        </div>
                        <div className="flex-1">
                          <Label htmlFor={`position-${index}`} className="sr-only">
                            Position
                          </Label>
                          <Slider
                            id={`position-${index}`}
                            min={0}
                            max={100}
                            step={1}
                            value={[stop.position]}
                            onValueChange={(value) => updateColorStop(index, "position", value[0])}
                          />
                        </div>
                        <div className="w-12">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            value={stop.position}
                            onChange={(e) => updateColorStop(index, "position", Number(e.target.value))}
                            className="h-8 p-1 text-center"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeColorStop(index)}
                          disabled={colorStops.length <= 2}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Preview</h3>
              <div
                className="w-full h-40 rounded-md border"
                style={{ background: cssCode.replace("background: ", "") }}
              ></div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <Tabs defaultValue="css">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
                </TabsList>
                <TabsContent value="css" className="mt-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                      <code>{cssCode}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(cssCode)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="tailwind" className="mt-4">
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
                      <code>{tailwindCode}</code>
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(tailwindCode)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="css-gradient-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About CSS Gradient Generator</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our CSS Gradient Generator tool helps you create beautiful CSS gradients for your web projects. Gradients
            are smooth transitions between two or more colors that can add depth and visual interest to your designs.
          </p>
          <p>
            CSS gradients are a powerful way to enhance the visual appeal of your website without using images. They
            load faster than image backgrounds and can be easily modified with CSS.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create linear, radial, and conic gradients</li>
            <li>Customize the angle and direction of your gradients</li>
            <li>Add multiple color stops for complex gradient effects</li>
            <li>Generate both standard CSS and Tailwind CSS code</li>
            <li>Preview your gradient in real-time</li>
            <li>Copy the code to clipboard for use in your projects</li>
          </ul>
        </div>
      </section>

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">Gradient Types Explained</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium">Linear Gradient</h3>
            <div
              className="h-24 rounded-md"
              style={{ background: "linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)" }}
            ></div>
            <p className="text-sm text-muted-foreground">
              Transitions colors along a straight line. You can control the angle of the line.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Radial Gradient</h3>
            <div
              className="h-24 rounded-md"
              style={{ background: "radial-gradient(circle at center, #3b82f6 0%, #8b5cf6 100%)" }}
            ></div>
            <p className="text-sm text-muted-foreground">
              Transitions colors outward from a central point in a circular or elliptical pattern.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Conic Gradient</h3>
            <div
              className="h-24 rounded-md"
              style={{ background: "conic-gradient(from 0deg at center, #3b82f6 0%, #8b5cf6 100%)" }}
            ></div>
            <p className="text-sm text-muted-foreground">
              Transitions colors around a center point (like a color wheel or pie chart).
            </p>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
