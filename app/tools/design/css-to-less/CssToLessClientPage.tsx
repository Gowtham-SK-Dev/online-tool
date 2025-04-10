"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Copy, Download, Upload, ArrowRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CssToLessClientPage() {
  const [cssInput, setCssInput] = useState<string>(
    `.header {
  background-color: #f5f5f5;
  padding: 20px;
  margin-bottom: 20px;
}

.header h1 {
  color: #333;
  font-size: 24px;
  margin: 0;
}

.header p {
  color: #666;
  font-size: 16px;
}

.content {
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
}

.content h2 {
  color: #333;
  font-size: 20px;
  margin-top: 0;
}

.content p {
  color: #666;
  font-size: 16px;
}

.footer {
  background-color: #f5f5f5;
  padding: 20px;
  margin-top: 20px;
  text-align: center;
}

.footer p {
  color: #666;
  font-size: 14px;
  margin: 0;
}`,
  )
  const [lessOutput, setLessOutput] = useState<string>("")
  const [isConverting, setIsConverting] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<"basic" | "variables">("basic")
  const { toast } = useToast()

  const convertCssToLess = () => {
    if (!cssInput.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some CSS to convert",
        variant: "destructive",
      })
      return
    }

    setIsConverting(true)

    try {
      // Parse CSS
      const parsedCss = parseCSS(cssInput)

      // Convert to LESS
      const lessCode = activeTab === "basic" ? convertToBasicLess(parsedCss) : convertToLessWithVariables(parsedCss)

      setLessOutput(lessCode)
    } catch (error) {
      toast({
        title: "Conversion error",
        description: (error as Error).message || "Failed to convert CSS to LESS",
        variant: "destructive",
      })
    } finally {
      setIsConverting(false)
    }
  }

  interface CssRule {
    selector: string
    properties: { property: string; value: string }[]
  }

  const parseCSS = (css: string): CssRule[] => {
    const rules: CssRule[] = []

    // Remove comments
    const cssWithoutComments = css.replace(/\/\*[\s\S]*?\*\//g, "")

    // Split into rule blocks
    const ruleBlocks = cssWithoutComments.split(/}/).filter((block) => block.trim())

    for (const block of ruleBlocks) {
      const parts = block.split(/{/)

      if (parts.length !== 2) {
        continue // Skip invalid blocks
      }

      const selector = parts[0].trim()
      const propertiesText = parts[1].trim()

      // Parse properties
      const properties = propertiesText
        .split(/;/)
        .filter((prop) => prop.trim())
        .map((prop) => {
          const [property, value] = prop.split(/:/).map((p) => p.trim())
          return { property, value }
        })
        .filter((prop) => prop.property && prop.value) // Filter out invalid properties

      rules.push({ selector, properties })
    }

    return rules
  }

  const convertToBasicLess = (rules: CssRule[]): string => {
    // Group rules by selector hierarchy
    const ruleTree: Record<string, any> = {}

    for (const rule of rules) {
      const selectorParts = rule.selector.split(/\s+/)

      let currentLevel = ruleTree
      let currentSelector = ""

      for (let i = 0; i < selectorParts.length; i++) {
        const part = selectorParts[i]

        if (i === 0) {
          currentSelector = part
        } else {
          currentSelector = `${currentSelector} ${part}`
        }

        if (i === selectorParts.length - 1) {
          // Last part, add properties
          if (!currentLevel[part]) {
            currentLevel[part] = { properties: rule.properties, children: {} }
          } else {
            currentLevel[part].properties = rule.properties
          }
        } else {
          // Not last part, add to tree
          if (!currentLevel[part]) {
            currentLevel[part] = { properties: [], children: {} }
          }
          currentLevel = currentLevel[part].children
        }
      }
    }

    // Convert tree to LESS
    return generateLessFromTree(ruleTree, 0)
  }

  const generateLessFromTree = (tree: Record<string, any>, level: number): string => {
    let less = ""
    const indent = "  ".repeat(level)

    for (const selector in tree) {
      const node = tree[selector]

      less += `${indent}${selector} {\n`

      // Add properties
      for (const prop of node.properties) {
        less += `${indent}  ${prop.property}: ${prop.value};\n`
      }

      // Add children
      if (Object.keys(node.children).length > 0) {
        less += generateLessFromTree(node.children, level + 1)
      }

      less += `${indent}}\n\n`
    }

    return less
  }

  const convertToLessWithVariables = (rules: CssRule[]): string => {
    // Extract potential variables
    const colorValues = new Map<string, string>()
    const fontSizeValues = new Map<string, string>()
    const spacingValues = new Map<string, string>()

    // First pass: collect potential variables
    for (const rule of rules) {
      for (const prop of rule.properties) {
        // Colors
        if (prop.value.match(/#[0-9a-f]{3,6}/i) || prop.value.match(/rgba?$$.*$$/i)) {
          colorValues.set(prop.value, prop.value)
        }

        // Font sizes
        if (prop.property === "font-size") {
          fontSizeValues.set(prop.value, prop.value)
        }

        // Spacing (padding, margin)
        if (prop.property.match(/padding|margin/) && prop.value.match(/\d+px/)) {
          spacingValues.set(prop.value, prop.value)
        }
      }
    }

    // Create variables
    let lessVariables = "// Variables\n"

    // Colors
    const colorVars = new Map<string, string>()
    Array.from(colorValues.keys()).forEach((color, index) => {
      const varName = `@color-${index + 1}`
      colorVars.set(color, varName)
      lessVariables += `${varName}: ${color};\n`
    })

    // Font sizes
    const fontSizeVars = new Map<string, string>()
    Array.from(fontSizeValues.keys()).forEach((size, index) => {
      const varName = `@font-size-${index + 1}`
      fontSizeVars.set(size, varName)
      lessVariables += `${varName}: ${size};\n`
    })

    // Spacing
    const spacingVars = new Map<string, string>()
    Array.from(spacingValues.keys()).forEach((spacing, index) => {
      const varName = `@spacing-${index + 1}`
      spacingVars.set(spacing, varName)
      lessVariables += `${varName}: ${spacing};\n`
    })

    lessVariables += "\n"

    // Convert rules to LESS with variables
    const basicLess = convertToBasicLess(rules)

    // Replace values with variables
    let lessWithVars = basicLess

    colorVars.forEach((varName, color) => {
      lessWithVars = lessWithVars.replace(new RegExp(escapeRegExp(color), "g"), varName)
    })

    fontSizeVars.forEach((varName, size) => {
      lessWithVars = lessWithVars.replace(
        new RegExp(`font-size: ${escapeRegExp(size)};`, "g"),
        `font-size: ${varName};`,
      )
    })

    spacingVars.forEach((varName, spacing) => {
      lessWithVars = lessWithVars.replace(new RegExp(`: ${escapeRegExp(spacing)};`, "g"), `: ${varName};`)
    })

    return lessVariables + lessWithVars
  }

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(lessOutput)
    toast({
      title: "Copied to clipboard",
      description: "LESS code has been copied to your clipboard",
    })
  }

  const downloadLess = () => {
    const blob = new Blob([lessOutput], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "converted.less"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download started",
      description: "Your LESS file is being downloaded",
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      setCssInput(content)
    }

    reader.readAsText(file)

    // Reset the input
    event.target.value = ""
  }

  const faqs = [
    {
      question: "What is LESS?",
      answer:
        "LESS (Leaner Style Sheets) is a backward-compatible language extension for CSS. It adds features like variables, mixins, functions, and nesting that make CSS more maintainable and extendable. LESS code is compiled into standard CSS that works in all browsers.",
    },
    {
      question: "What are the advantages of using LESS over CSS?",
      answer:
        "LESS offers several advantages: 1) Variables for reusing values, 2) Nesting for clearer hierarchy, 3) Mixins for reusing groups of properties, 4) Operations for calculations, 5) Functions for manipulating values, and 6) Importing for modular code organization. These features make your stylesheets more maintainable and DRY (Don't Repeat Yourself).",
    },
    {
      question: "How does the CSS to LESS converter work?",
      answer:
        "Our converter parses your CSS code, analyzes its structure, and transforms it into LESS format. In basic mode, it primarily adds nesting to your selectors. In variables mode, it also identifies repeated values (like colors and font sizes) and extracts them into LESS variables for better maintainability.",
    },
    {
      question: "Can I convert any CSS to LESS?",
      answer:
        "Yes, any valid CSS can be converted to LESS. However, the quality of the conversion depends on how well-structured your original CSS is. CSS with consistent naming conventions and clear selector hierarchies will convert more elegantly to LESS.",
    },
    {
      question: "How do I use the converted LESS code?",
      answer:
        "To use LESS code, you need a LESS compiler that converts it to standard CSS. You can use tools like less.js, Node.js-based compilers, or build tools like Webpack, Gulp, or Grunt. Many code editors also have LESS compilation extensions. After compilation, you include the resulting CSS file in your HTML.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">CSS to LESS Converter</h1>
        <p className="mt-2 text-muted-foreground">Convert your CSS code to LESS with nesting and variable extraction</p>
      </div>

      <AdBanner format="horizontal" slot="css-to-less-top" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">CSS Input</h2>
              <div className="flex items-center space-x-2">
                <input type="file" id="css-file" className="hidden" accept=".css" onChange={handleFileUpload} />
                <Button variant="outline" size="sm" onClick={() => document.getElementById("css-file")?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload CSS
                </Button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={cssInput}
                onChange={(e) => setCssInput(e.target.value)}
                className="w-full h-[500px] p-4 font-mono text-sm bg-muted/30 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Paste your CSS code here..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Conversion Options</h2>
              </div>

              <Tabs defaultValue="basic" onValueChange={(value) => setActiveTab(value as "basic" | "variables")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Nesting</TabsTrigger>
                  <TabsTrigger value="variables">With Variables</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="mt-4">
                  <p className="text-muted-foreground">
                    Basic conversion applies nesting to your CSS selectors, making the hierarchy clearer and more
                    maintainable.
                  </p>
                </TabsContent>

                <TabsContent value="variables" className="mt-4">
                  <p className="text-muted-foreground">
                    Advanced conversion extracts repeated values (colors, font sizes, spacing) into LESS variables and
                    applies nesting to your selectors.
                  </p>
                </TabsContent>
              </Tabs>

              <Button onClick={convertCssToLess} className="w-full mt-4" disabled={isConverting || !cssInput.trim()}>
                <ArrowRight className="h-4 w-4 mr-2" />
                {isConverting ? "Converting..." : "Convert to LESS"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">LESS Output</h2>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!lessOutput}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm" onClick={downloadLess} disabled={!lessOutput}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="relative">
                <pre className="w-full h-[400px] p-4 font-mono text-sm bg-muted/30 rounded-md overflow-auto">
                  {lessOutput || "Converted LESS will appear here..."}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="css-to-less-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About CSS to LESS Converter</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our CSS to LESS Converter tool helps you transform standard CSS code into LESS (Leaner Style Sheets) format.
            LESS extends CSS with dynamic behavior such as variables, mixins, operations, and functions, making your
            stylesheets more maintainable and easier to work with.
          </p>
          <p>This converter offers two conversion modes:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium text-foreground">Basic Nesting:</span> Converts your CSS to use LESS's
              nesting capabilities, which helps organize your code by visually representing the HTML hierarchy in your
              stylesheets.
            </li>
            <li>
              <span className="font-medium text-foreground">With Variables:</span> In addition to nesting, this mode
              identifies repeated values in your CSS (like colors, font sizes, and spacing) and extracts them into LESS
              variables, making your code more maintainable and consistent.
            </li>
          </ul>
          <p>
            By converting your CSS to LESS, you can take advantage of features that make your stylesheets more
            maintainable, reusable, and easier to understand.
          </p>
        </div>
      </section>

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">LESS Features and Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Variables</h3>
            <div className="bg-muted/30 p-4 rounded-md">
              <pre className="text-sm font-mono">
                {`@primary-color: #3b82f6;

.button {
  background-color: @primary-color;
  color: white;
}

.link {
  color: @primary-color;
}`}
              </pre>
            </div>
            <p className="text-sm">
              Variables allow you to specify a value once and reuse it throughout your stylesheet. If you need to change
              the value, you only need to update it in one place.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Nesting</h3>
            <div className="bg-muted/30 p-4 rounded-md">
              <pre className="text-sm font-mono">
                {`.header {
  background-color: #f5f5f5;
  
  h1 {
    color: #333;
    font-size: 24px;
  }
  
  p {
    color: #666;
    font-size: 16px;
  }
}`}
              </pre>
            </div>
            <p className="text-sm">
              Nesting allows you to organize your CSS in a way that follows the HTML hierarchy, making it more readable
              and maintainable.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Mixins</h3>
            <div className="bg-muted/30 p-4 rounded-md">
              <pre className="text-sm font-mono">
                {`.border-radius(@radius) {
  border-radius: @radius;
  -webkit-border-radius: @radius;
  -moz-border-radius: @radius;
}

.button {
  .border-radius(5px);
}`}
              </pre>
            </div>
            <p className="text-sm">
              Mixins allow you to embed all the properties of a class into another class. They can also take parameters,
              making them powerful for creating reusable style patterns.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Operations</h3>
            <div className="bg-muted/30 p-4 rounded-md">
              <pre className="text-sm font-mono">
                {`@base-size: 16px;
@large-size: @base-size * 1.5;

.title {
  font-size: @large-size;
  margin-bottom: @base-size + 8px;
}`}
              </pre>
            </div>
            <p className="text-sm">
              LESS allows you to perform arithmetic operations on values, making it easier to create consistent sizing
              and spacing in your designs.
            </p>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
