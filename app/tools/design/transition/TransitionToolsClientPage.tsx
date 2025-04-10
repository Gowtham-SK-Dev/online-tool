"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Play, Pause, RefreshCw } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"

type TransitionProperty =
  | "all"
  | "opacity"
  | "transform"
  | "background-color"
  | "color"
  | "width"
  | "height"
  | "border-color"
  | "box-shadow"

type TimingFunction = "ease" | "linear" | "ease-in" | "ease-out" | "ease-in-out" | "cubic-bezier"

interface TransitionSettings {
  property: TransitionProperty
  duration: number
  delay: number
  timingFunction: TimingFunction
  cubicBezier: {
    x1: number
    y1: number
    x2: number
    y2: number
  }
  infinite: boolean
}

interface TransformSettings {
  translateX: number
  translateY: number
  rotate: number
  scale: number
  opacity: number
  backgroundColor: string
  width: number
  height: number
  borderColor: string
  boxShadow: string
}

export default function TransitionToolsClientPage() {
  const [transition, setTransition] = useState<TransitionSettings>({
    property: "transform",
    duration: 1,
    delay: 0,
    timingFunction: "ease-in-out",
    cubicBezier: {
      x1: 0.42,
      y1: 0,
      x2: 0.58,
      y2: 1,
    },
    infinite: false,
  })

  const [transform, setTransform] = useState<TransformSettings>({
    translateX: 0,
    translateY: 0,
    rotate: 0,
    scale: 1,
    opacity: 1,
    backgroundColor: "#3b82f6",
    width: 100,
    height: 100,
    borderColor: "#1d4ed8",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  })

  const [finalTransform, setFinalTransform] = useState<TransformSettings>({
    translateX: 200,
    translateY: 0,
    rotate: 180,
    scale: 1.5,
    opacity: 0.5,
    backgroundColor: "#ef4444",
    width: 150,
    height: 150,
    borderColor: "#b91c1c",
    boxShadow: "0 10px 15px rgba(0, 0, 0, 0.3)",
  })

  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [cssCode, setCssCode] = useState<string>("")
  const [activeTab, setActiveTab] = useState<"initial" | "final">("initial")
  const previewRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    generateCssCode()
  }, [transition, transform, finalTransform])

  useEffect(() => {
    if (isPlaying) {
      startAnimation()
    } else {
      stopAnimation()
    }

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying])

  const generateCssCode = () => {
    const { property, duration, delay, timingFunction, cubicBezier } = transition

    let timingFunctionValue = timingFunction
    if (timingFunction === "cubic-bezier") {
      timingFunctionValue = `cubic-bezier(${cubicBezier.x1}, ${cubicBezier.y1}, ${cubicBezier.x2}, ${cubicBezier.y2})`
    }

    let css = `.element {\n`

    // Initial state
    if (property === "transform" || property === "all") {
      css += `  transform: translateX(${transform.translateX}px) translateY(${transform.translateY}px) rotate(${transform.rotate}deg) scale(${transform.scale});\n`
    }

    if (property === "opacity" || property === "all") {
      css += `  opacity: ${transform.opacity};\n`
    }

    if (property === "background-color" || property === "all") {
      css += `  background-color: ${transform.backgroundColor};\n`
    }

    if (property === "width" || property === "all") {
      css += `  width: ${transform.width}px;\n`
    }

    if (property === "height" || property === "all") {
      css += `  height: ${transform.height}px;\n`
    }

    if (property === "border-color" || property === "all") {
      css += `  border: 2px solid ${transform.borderColor};\n`
    }

    if (property === "box-shadow" || property === "all") {
      css += `  box-shadow: ${transform.boxShadow};\n`
    }

    // Transition property
    css += `  transition: ${property} ${duration}s ${timingFunctionValue}${delay > 0 ? ` ${delay}s` : ""};\n`
    css += `}\n\n`

    // Hover state
    css += `.element:hover {\n`

    // Final state
    if (property === "transform" || property === "all") {
      css += `  transform: translateX(${finalTransform.translateX}px) translateY(${finalTransform.translateY}px) rotate(${finalTransform.rotate}deg) scale(${finalTransform.scale});\n`
    }

    if (property === "opacity" || property === "all") {
      css += `  opacity: ${finalTransform.opacity};\n`
    }

    if (property === "background-color" || property === "all") {
      css += `  background-color: ${finalTransform.backgroundColor};\n`
    }

    if (property === "width" || property === "all") {
      css += `  width: ${finalTransform.width}px;\n`
    }

    if (property === "height" || property === "all") {
      css += `  height: ${finalTransform.height}px;\n`
    }

    if (property === "border-color" || property === "all") {
      css += `  border: 2px solid ${finalTransform.borderColor};\n`
    }

    if (property === "box-shadow" || property === "all") {
      css += `  box-shadow: ${finalTransform.boxShadow};\n`
    }

    css += `}`

    setCssCode(css)
  }

  const startAnimation = () => {
    if (!previewRef.current) return

    const element = previewRef.current

    // Apply transition
    element.style.transition = `${transition.property} ${transition.duration}s ${
      transition.timingFunction === "cubic-bezier"
        ? `cubic-bezier(${transition.cubicBezier.x1}, ${transition.cubicBezier.y1}, ${transition.cubicBezier.x2}, ${transition.cubicBezier.y2})`
        : transition.timingFunction
    } ${transition.delay}s`

    // Apply final state
    if (transition.property === "transform" || transition.property === "all") {
      element.style.transform = `translateX(${finalTransform.translateX}px) translateY(${finalTransform.translateY}px) rotate(${finalTransform.rotate}deg) scale(${finalTransform.scale})`
    }

    if (transition.property === "opacity" || transition.property === "all") {
      element.style.opacity = finalTransform.opacity.toString()
    }

    if (transition.property === "background-color" || transition.property === "all") {
      element.style.backgroundColor = finalTransform.backgroundColor
    }

    if (transition.property === "width" || transition.property === "all") {
      element.style.width = `${finalTransform.width}px`
    }

    if (transition.property === "height" || transition.property === "all") {
      element.style.height = `${finalTransform.height}px`
    }

    if (transition.property === "border-color" || transition.property === "all") {
      element.style.border = `2px solid ${finalTransform.borderColor}`
    }

    if (transition.property === "box-shadow" || transition.property === "all") {
      element.style.boxShadow = finalTransform.boxShadow
    }

    // If infinite, set up a loop
    if (transition.infinite) {
      const totalDuration = (transition.duration + transition.delay) * 1000

      const toggleState = () => {
        animationRef.current = window.setTimeout(() => {
          // Toggle between initial and final states
          if (element.style.transform.includes(`translateX(${finalTransform.translateX}px)`)) {
            // Apply initial state
            if (transition.property === "transform" || transition.property === "all") {
              element.style.transform = `translateX(${transform.translateX}px) translateY(${transform.translateY}px) rotate(${transform.rotate}deg) scale(${transform.scale})`
            }

            if (transition.property === "opacity" || transition.property === "all") {
              element.style.opacity = transform.opacity.toString()
            }

            if (transition.property === "background-color" || transition.property === "all") {
              element.style.backgroundColor = transform.backgroundColor
            }

            if (transition.property === "width" || transition.property === "all") {
              element.style.width = `${transform.width}px`
            }

            if (transition.property === "height" || transition.property === "all") {
              element.style.height = `${transform.height}px`
            }

            if (transition.property === "border-color" || transition.property === "all") {
              element.style.border = `2px solid ${transform.borderColor}`
            }

            if (transition.property === "box-shadow" || transition.property === "all") {
              element.style.boxShadow = transform.boxShadow
            }
          } else {
            // Apply final state
            if (transition.property === "transform" || transition.property === "all") {
              element.style.transform = `translateX(${finalTransform.translateX}px) translateY(${finalTransform.translateY}px) rotate(${finalTransform.rotate}deg) scale(${finalTransform.scale})`
            }

            if (transition.property === "opacity" || transition.property === "all") {
              element.style.opacity = finalTransform.opacity.toString()
            }

            if (transition.property === "background-color" || transition.property === "all") {
              element.style.backgroundColor = finalTransform.backgroundColor
            }

            if (transition.property === "width" || transition.property === "all") {
              element.style.width = `${finalTransform.width}px`
            }

            if (transition.property === "height" || transition.property === "all") {
              element.style.height = `${finalTransform.height}px`
            }

            if (transition.property === "border-color" || transition.property === "all") {
              element.style.border = `2px solid ${finalTransform.borderColor}`
            }

            if (transition.property === "box-shadow" || transition.property === "all") {
              element.style.boxShadow = finalTransform.boxShadow
            }
          }

          if (isPlaying) {
            toggleState()
          }
        }, totalDuration)
      }

      toggleState()
    }
  }

  const stopAnimation = () => {
    if (!previewRef.current) return

    if (animationRef.current !== null) {
      clearTimeout(animationRef.current)
      animationRef.current = null
    }

    const element = previewRef.current

    // Reset to initial state
    element.style.transition = "none"

    if (transition.property === "transform" || transition.property === "all") {
      element.style.transform = `translateX(${transform.translateX}px) translateY(${transform.translateY}px) rotate(${transform.rotate}deg) scale(${transform.scale})`
    }

    if (transition.property === "opacity" || transition.property === "all") {
      element.style.opacity = transform.opacity.toString()
    }

    if (transition.property === "background-color" || transition.property === "all") {
      element.style.backgroundColor = transform.backgroundColor
    }

    if (transition.property === "width" || transition.property === "all") {
      element.style.width = `${transform.width}px`
    }

    if (transition.property === "height" || transition.property === "all") {
      element.style.height = `${transform.height}px`
    }

    if (transition.property === "border-color" || transition.property === "all") {
      element.style.border = `2px solid ${transform.borderColor}`
    }

    if (transition.property === "box-shadow" || transition.property === "all") {
      element.style.boxShadow = transform.boxShadow
    }
  }

  const resetAnimation = () => {
    setIsPlaying(false)
    stopAnimation()
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(cssCode)
    toast({
      title: "Copied to clipboard",
      description: "CSS code has been copied to your clipboard",
    })
  }

  const updateTransition = (field: keyof TransitionSettings, value: any) => {
    setTransition((prev) => ({ ...prev, [field]: value }))
  }

  const updateCubicBezier = (field: keyof TransitionSettings["cubicBezier"], value: number) => {
    setTransition((prev) => ({
      ...prev,
      cubicBezier: {
        ...prev.cubicBezier,
        [field]: value,
      },
    }))
  }

  const updateTransform = (field: keyof TransformSettings, value: any) => {
    if (activeTab === "initial") {
      setTransform((prev) => ({ ...prev, [field]: value }))
    } else {
      setFinalTransform((prev) => ({ ...prev, [field]: value }))
    }
  }

  const faqs = [
    {
      question: "What are CSS transitions?",
      answer:
        "CSS transitions allow you to change property values smoothly over a specified duration. They provide a way to control animation speed when changing CSS properties, instead of having the changes take effect immediately.",
    },
    {
      question: "What properties can be transitioned?",
      answer:
        "Not all CSS properties can be transitioned, but many can, including: colors, opacity, transforms (scale, rotate, translate), dimensions (width, height), positions, shadows, and more. Properties like 'display' cannot be transitioned.",
    },
    {
      question: "What is a timing function?",
      answer:
        "A timing function determines the speed curve of the transition. Common values include 'ease' (starts slow, speeds up, then slows down), 'linear' (constant speed), 'ease-in' (starts slow, ends fast), 'ease-out' (starts fast, ends slow), and 'cubic-bezier' for custom curves.",
    },
    {
      question: "What is the difference between transitions and animations?",
      answer:
        "Transitions are simpler and are triggered by state changes (like hover). They go from A to B. Animations are more complex, can have multiple keyframes, can loop infinitely, and don't require a trigger. Use transitions for simple state changes and animations for more complex, multi-step animations.",
    },
    {
      question: "How do I make transitions work in all browsers?",
      answer:
        "Modern browsers support CSS transitions well, but for older browsers, you might need vendor prefixes (-webkit-, -moz-, -o-). However, most developers now use tools like Autoprefixer to handle this automatically. For very old browsers that don't support transitions at all, the changes will simply happen instantly.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">CSS Transition Generator</h1>
        <p className="mt-2 text-muted-foreground">Create smooth CSS transitions with a visual editor</p>
      </div>

      <AdBanner format="horizontal" slot="transition-generator-top" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Transition Preview</h2>
                <div className="flex items-center space-x-2">
                  <Button
                    variant={isPlaying ? "destructive" : "default"}
                    size="sm"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {isPlaying ? "Stop" : "Play"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={resetAnimation}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center bg-muted/30 rounded-md h-80 relative overflow-hidden">
                <div
                  ref={previewRef}
                  style={{
                    width: `${transform.width}px`,
                    height: `${transform.height}px`,
                    backgroundColor: transform.backgroundColor,
                    opacity: transform.opacity,
                    transform: `translateX(${transform.translateX}px) translateY(${transform.translateY}px) rotate(${transform.rotate}deg) scale(${transform.scale})`,
                    border: `2px solid ${transform.borderColor}`,
                    boxShadow: transform.boxShadow,
                  }}
                  className="absolute"
                ></div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">CSS Code</h3>
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm font-mono">{cssCode}</pre>
                  <Button variant="ghost" size="sm" className="absolute top-2 right-2" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Transition Settings</h2>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="property">Property</Label>
                  <Select
                    value={transition.property}
                    onValueChange={(value) => updateTransition("property", value as TransitionProperty)}
                  >
                    <SelectTrigger id="property" className="mt-1">
                      <SelectValue placeholder="Select property" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="transform">Transform</SelectItem>
                      <SelectItem value="opacity">Opacity</SelectItem>
                      <SelectItem value="background-color">Background Color</SelectItem>
                      <SelectItem value="width">Width</SelectItem>
                      <SelectItem value="height">Height</SelectItem>
                      <SelectItem value="border-color">Border Color</SelectItem>
                      <SelectItem value="box-shadow">Box Shadow</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration: {transition.duration}s</Label>
                  <Slider
                    id="duration"
                    min={0.1}
                    max={5}
                    step={0.1}
                    value={[transition.duration]}
                    onValueChange={(value) => updateTransition("duration", value[0])}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="delay">Delay: {transition.delay}s</Label>
                  <Slider
                    id="delay"
                    min={0}
                    max={2}
                    step={0.1}
                    value={[transition.delay]}
                    onValueChange={(value) => updateTransition("delay", value[0])}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="timing-function">Timing Function</Label>
                  <Select
                    value={transition.timingFunction}
                    onValueChange={(value) => updateTransition("timingFunction", value as TimingFunction)}
                  >
                    <SelectTrigger id="timing-function" className="mt-1">
                      <SelectValue placeholder="Select timing function" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ease">Ease</SelectItem>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="ease-in">Ease In</SelectItem>
                      <SelectItem value="ease-out">Ease Out</SelectItem>
                      <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                      <SelectItem value="cubic-bezier">Cubic Bezier</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {transition.timingFunction === "cubic-bezier" && (
                  <div className="space-y-2">
                    <Label>Cubic Bezier Controls</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="x1" className="text-xs">
                          X1: {transition.cubicBezier.x1}
                        </Label>
                        <Slider
                          id="x1"
                          min={0}
                          max={1}
                          step={0.01}
                          value={[transition.cubicBezier.x1]}
                          onValueChange={(value) => updateCubicBezier("x1", value[0])}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="y1" className="text-xs">
                          Y1: {transition.cubicBezier.y1}
                        </Label>
                        <Slider
                          id="y1"
                          min={0}
                          max={1}
                          step={0.01}
                          value={[transition.cubicBezier.y1]}
                          onValueChange={(value) => updateCubicBezier("y1", value[0])}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="x2" className="text-xs">
                          X2: {transition.cubicBezier.x2}
                        </Label>
                        <Slider
                          id="x2"
                          min={0}
                          max={1}
                          step={0.01}
                          value={[transition.cubicBezier.x2]}
                          onValueChange={(value) => updateCubicBezier("x2", value[0])}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="y2" className="text-xs">
                          Y2: {transition.cubicBezier.y2}
                        </Label>
                        <Slider
                          id="y2"
                          min={0}
                          max={1}
                          step={0.01}
                          value={[transition.cubicBezier.y2]}
                          onValueChange={(value) => updateCubicBezier("y2", value[0])}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Switch
                    id="infinite"
                    checked={transition.infinite}
                    onCheckedChange={(checked) => updateTransition("infinite", checked)}
                  />
                  <Label htmlFor="infinite">Infinite Loop</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Element Properties</h2>

              <Tabs defaultValue="initial" onValueChange={(value) => setActiveTab(value as "initial" | "final")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="initial">Initial State</TabsTrigger>
                  <TabsTrigger value="final">Final State</TabsTrigger>
                </TabsList>

                <TabsContent value="initial" className="mt-4 space-y-4">
                  {(transition.property === "transform" || transition.property === "all") && (
                    <div className="space-y-2">
                      <Label>Transform</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="translateX" className="text-xs">
                            TranslateX: {transform.translateX}px
                          </Label>
                          <Slider
                            id="translateX"
                            min={-200}
                            max={200}
                            step={1}
                            value={[transform.translateX]}
                            onValueChange={(value) => updateTransform("translateX", value[0])}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="translateY" className="text-xs">
                            TranslateY: {transform.translateY}px
                          </Label>
                          <Slider
                            id="translateY"
                            min={-200}
                            max={200}
                            step={1}
                            value={[transform.translateY]}
                            onValueChange={(value) => updateTransform("translateY", value[0])}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="rotate" className="text-xs">
                            Rotate: {transform.rotate}deg
                          </Label>
                          <Slider
                            id="rotate"
                            min={0}
                            max={360}
                            step={1}
                            value={[transform.rotate]}
                            onValueChange={(value) => updateTransform("rotate", value[0])}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="scale" className="text-xs">
                            Scale: {transform.scale}
                          </Label>
                          <Slider
                            id="scale"
                            min={0.5}
                            max={2}
                            step={0.1}
                            value={[transform.scale]}
                            onValueChange={(value) => updateTransform("scale", value[0])}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(transition.property === "opacity" || transition.property === "all") && (
                    <div>
                      <Label htmlFor="opacity">Opacity: {transform.opacity}</Label>
                      <Slider
                        id="opacity"
                        min={0}
                        max={1}
                        step={0.1}
                        value={[transform.opacity]}
                        onValueChange={(value) => updateTransform("opacity", value[0])}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {(transition.property === "background-color" || transition.property === "all") && (
                    <div>
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex mt-1">
                        <div className="w-10 h-10 rounded-md border overflow-hidden">
                          <Input
                            type="color"
                            id="backgroundColor"
                            value={transform.backgroundColor}
                            onChange={(e) => updateTransform("backgroundColor", e.target.value)}
                            className="w-12 h-12 -m-1 p-0 border-0"
                          />
                        </div>
                        <Input
                          value={transform.backgroundColor}
                          onChange={(e) => updateTransform("backgroundColor", e.target.value)}
                          className="flex-1 ml-2"
                        />
                      </div>
                    </div>
                  )}

                  {(transition.property === "width" || transition.property === "all") && (
                    <div>
                      <Label htmlFor="width">Width: {transform.width}px</Label>
                      <Slider
                        id="width"
                        min={50}
                        max={300}
                        step={1}
                        value={[transform.width]}
                        onValueChange={(value) => updateTransform("width", value[0])}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {(transition.property === "height" || transition.property === "all") && (
                    <div>
                      <Label htmlFor="height">Height: {transform.height}px</Label>
                      <Slider
                        id="height"
                        min={50}
                        max={300}
                        step={1}
                        value={[transform.height]}
                        onValueChange={(value) => updateTransform("height", value[0])}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {(transition.property === "border-color" || transition.property === "all") && (
                    <div>
                      <Label htmlFor="borderColor">Border Color</Label>
                      <div className="flex mt-1">
                        <div className="w-10 h-10 rounded-md border overflow-hidden">
                          <Input
                            type="color"
                            id="borderColor"
                            value={transform.borderColor}
                            onChange={(e) => updateTransform("borderColor", e.target.value)}
                            className="w-12 h-12 -m-1 p-0 border-0"
                          />
                        </div>
                        <Input
                          value={transform.borderColor}
                          onChange={(e) => updateTransform("borderColor", e.target.value)}
                          className="flex-1 ml-2"
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="final" className="mt-4 space-y-4">
                  {(transition.property === "transform" || transition.property === "all") && (
                    <div className="space-y-2">
                      <Label>Transform</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="translateX-final" className="text-xs">
                            TranslateX: {finalTransform.translateX}px
                          </Label>
                          <Slider
                            id="translateX-final"
                            min={-200}
                            max={200}
                            step={1}
                            value={[finalTransform.translateX]}
                            onValueChange={(value) => updateTransform("translateX", value[0])}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="translateY-final" className="text-xs">
                            TranslateY: {finalTransform.translateY}px
                          </Label>
                          <Slider
                            id="translateY-final"
                            min={-200}
                            max={200}
                            step={1}
                            value={[finalTransform.translateY]}
                            onValueChange={(value) => updateTransform("translateY", value[0])}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="rotate-final" className="text-xs">
                            Rotate: {finalTransform.rotate}deg
                          </Label>
                          <Slider
                            id="rotate-final"
                            min={0}
                            max={360}
                            step={1}
                            value={[finalTransform.rotate]}
                            onValueChange={(value) => updateTransform("rotate", value[0])}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="scale-final" className="text-xs">
                            Scale: {finalTransform.scale}
                          </Label>
                          <Slider
                            id="scale-final"
                            min={0.5}
                            max={2}
                            step={0.1}
                            value={[finalTransform.scale]}
                            onValueChange={(value) => updateTransform("scale", value[0])}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {(transition.property === "opacity" || transition.property === "all") && (
                    <div>
                      <Label htmlFor="opacity-final">Opacity: {finalTransform.opacity}</Label>
                      <Slider
                        id="opacity-final"
                        min={0}
                        max={1}
                        step={0.1}
                        value={[finalTransform.opacity]}
                        onValueChange={(value) => updateTransform("opacity", value[0])}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {(transition.property === "background-color" || transition.property === "all") && (
                    <div>
                      <Label htmlFor="backgroundColor-final">Background Color</Label>
                      <div className="flex mt-1">
                        <div className="w-10 h-10 rounded-md border overflow-hidden">
                          <Input
                            type="color"
                            id="backgroundColor-final"
                            value={finalTransform.backgroundColor}
                            onChange={(e) => updateTransform("backgroundColor", e.target.value)}
                            className="w-12 h-12 -m-1 p-0 border-0"
                          />
                        </div>
                        <Input
                          value={finalTransform.backgroundColor}
                          onChange={(e) => updateTransform("backgroundColor", e.target.value)}
                          className="flex-1 ml-2"
                        />
                      </div>
                    </div>
                  )}

                  {(transition.property === "width" || transition.property === "all") && (
                    <div>
                      <Label htmlFor="width-final">Width: {finalTransform.width}px</Label>
                      <Slider
                        id="width-final"
                        min={50}
                        max={300}
                        step={1}
                        value={[finalTransform.width]}
                        onValueChange={(value) => updateTransform("width", value[0])}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {(transition.property === "height" || transition.property === "all") && (
                    <div>
                      <Label htmlFor="height-final">Height: {finalTransform.height}px</Label>
                      <Slider
                        id="height-final"
                        min={50}
                        max={300}
                        step={1}
                        value={[finalTransform.height]}
                        onValueChange={(value) => updateTransform("height", value[0])}
                        className="mt-1"
                      />
                    </div>
                  )}

                  {(transition.property === "border-color" || transition.property === "all") && (
                    <div>
                      <Label htmlFor="borderColor-final">Border Color</Label>
                      <div className="flex mt-1">
                        <div className="w-10 h-10 rounded-md border overflow-hidden">
                          <Input
                            type="color"
                            id="borderColor-final"
                            value={finalTransform.borderColor}
                            onChange={(e) => updateTransform("borderColor", e.target.value)}
                            className="w-12 h-12 -m-1 p-0 border-0"
                          />
                        </div>
                        <Input
                          value={finalTransform.borderColor}
                          onChange={(e) => updateTransform("borderColor", e.target.value)}
                          className="flex-1 ml-2"
                        />
                      </div>
                    </div>
                  )}

                  {(transition.property === "box-shadow" || transition.property === "all") && (
                    <div>
                      <Label htmlFor="boxShadow-final">Box Shadow</Label>
                      <Input
                        id="boxShadow-final"
                        value={finalTransform.boxShadow}
                        onChange={(e) => updateTransform("boxShadow", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="transition-generator-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About CSS Transition Generator</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our CSS Transition Generator tool helps you create smooth transitions between different states of an
            element. CSS transitions provide a way to control animation speed when changing CSS properties, instead of
            having them take effect immediately.
          </p>
          <p>
            Transitions can be applied to a wide range of CSS properties, including position, size, color, opacity, and
            transforms. They're perfect for creating subtle animations that enhance user experience without being
            distracting.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Choose which property to animate (or animate all properties at once)</li>
            <li>Set the duration and delay of the transition</li>
            <li>Select from predefined timing functions or create custom cubic-bezier curves</li>
            <li>Define initial and final states for your element</li>
            <li>Preview the transition in real-time</li>
            <li>Get the generated CSS code to use in your projects</li>
          </ul>
        </div>
      </section>

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">CSS Transition Syntax</h2>
        <div className="space-y-4">
          <p className="text-muted-foreground">
            The CSS transition property is a shorthand property for setting the four transition properties in a single
            declaration:
          </p>

          <div className="bg-muted/30 p-4 rounded-md">
            <pre className="text-sm font-mono">transition: [property] [duration] [timing-function] [delay];</pre>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Property</h3>
              <p className="text-sm text-muted-foreground">
                Specifies the name of the CSS property the transition effect is for. You can use "all" to transition all
                properties that can be animated.
              </p>
              <div className="bg-muted/30 p-2 rounded-md">
                <pre className="text-xs font-mono">transition-property: opacity;</pre>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Duration</h3>
              <p className="text-sm text-muted-foreground">
                Specifies how many seconds or milliseconds the transition effect takes to complete. A value of 0s means
                no transition.
              </p>
              <div className="bg-muted/30 p-2 rounded-md">
                <pre className="text-xs font-mono">transition-duration: 0.5s;</pre>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Timing Function</h3>
              <p className="text-sm text-muted-foreground">
                Specifies the speed curve of the transition effect. It allows the transition to change speed over its
                duration.
              </p>
              <div className="bg-muted/30 p-2 rounded-md">
                <pre className="text-xs font-mono">transition-timing-function: ease-in-out;</pre>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Delay</h3>
              <p className="text-sm text-muted-foreground">
                Specifies when the transition effect will start. A value of 0s means no delay.
              </p>
              <div className="bg-muted/30 p-2 rounded-md">
                <pre className="text-xs font-mono">transition-delay: 0.2s;</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
