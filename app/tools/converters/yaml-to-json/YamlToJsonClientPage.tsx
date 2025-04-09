"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CodeEditor from "@/components/code-editor"
import DragDropZone from "@/components/drag-drop-zone"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { parse, stringify } from "yaml"

export default function YamlToJsonClientPage() {
  const [yamlInput, setYamlInput] = useState("")
  const [jsonInput, setJsonInput] = useState("")
  const [output, setOutput] = useState("")
  const [activeTab, setActiveTab] = useState<"yamlToJson" | "jsonToYaml">("yamlToJson")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleYamlDrop = (content: string) => {
    setYamlInput(content)
  }

  const handleJsonDrop = (content: string) => {
    setJsonInput(content)
  }

  const yamlToJson = () => {
    try {
      if (!yamlInput.trim()) {
        setOutput("")
        setError(null)
        return
      }

      const parsedYaml = parse(yamlInput)
      const jsonOutput = JSON.stringify(parsedYaml, null, 2)
      setOutput(jsonOutput)
      setError(null)

      toast({
        title: "Conversion successful",
        description: "YAML has been converted to JSON",
      })
    } catch (err) {
      setError(`Error converting YAML to JSON: ${(err as Error).message}`)
      toast({
        title: "Conversion failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const jsonToYaml = () => {
    try {
      if (!jsonInput.trim()) {
        setOutput("")
        setError(null)
        return
      }

      const parsedJson = JSON.parse(jsonInput)
      const yamlOutput = stringify(parsedJson)
      setOutput(yamlOutput)
      setError(null)

      toast({
        title: "Conversion successful",
        description: "JSON has been converted to YAML",
      })
    } catch (err) {
      setError(`Error converting JSON to YAML: ${(err as Error).message}`)
      toast({
        title: "Conversion failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "yamlToJson" | "jsonToYaml")
    setOutput("")
    setError(null)
  }

  const faqs = [
    {
      question: "What is YAML?",
      answer:
        "YAML (YAML Ain't Markup Language) is a human-readable data serialization format. It's commonly used for configuration files and in applications where data is being stored or transmitted.",
    },
    {
      question: "What is JSON?",
      answer:
        "JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate. It is based on a subset of JavaScript language and is commonly used for transmitting data in web applications.",
    },
    {
      question: "Why would I need to convert between YAML and JSON?",
      answer:
        "YAML is often preferred for configuration files due to its readability, while JSON is widely used in web APIs and data exchange. Converting between these formats allows you to use data from one system in another. For example, you might have a YAML configuration file that you need to use in a system that only accepts JSON.",
    },
    {
      question: "Is my data secure when using this tool?",
      answer:
        "Yes, all processing happens directly in your browser. Your data is never sent to our servers, ensuring complete privacy and security.",
    },
    {
      question: "What are the main differences between YAML and JSON?",
      answer:
        "YAML supports comments, uses indentation for structure (no curly braces), allows for multiple documents in a single file, and has more data types. JSON is more strict, uses curly braces and square brackets for structure, and doesn't support comments.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">YAML to JSON Converter</h1>
        <p className="mt-2 text-muted-foreground">Convert between YAML and JSON formats</p>
      </div>

      <AdBanner format="horizontal" slot="yaml-json-top" />

      <Tabs defaultValue="yamlToJson" className="mt-6" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="yamlToJson">YAML to JSON</TabsTrigger>
          <TabsTrigger value="jsonToYaml">JSON to YAML</TabsTrigger>
        </TabsList>

        <TabsContent value="yamlToJson" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">YAML Input</h2>
              <DragDropZone onFileDrop={handleYamlDrop} accept=".yaml,.yml,.txt" />
              <CodeEditor
                value={yamlInput}
                onChange={setYamlInput}
                language="yaml"
                placeholder="Paste your YAML here..."
                minHeight="300px"
              />
              <Button onClick={yamlToJson} className="w-full">
                Convert to JSON
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">JSON Output</h2>
              {error ? (
                <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive">
                  {error}
                </div>
              ) : (
                <CodeEditor
                  value={output}
                  onChange={() => {}}
                  language="json"
                  readOnly
                  minHeight="300px"
                  placeholder="JSON output will appear here..."
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="jsonToYaml" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">JSON Input</h2>
              <DragDropZone onFileDrop={handleJsonDrop} accept=".json,.txt" />
              <CodeEditor
                value={jsonInput}
                onChange={setJsonInput}
                language="json"
                placeholder="Paste your JSON here..."
                minHeight="300px"
              />
              <Button onClick={jsonToYaml} className="w-full">
                Convert to YAML
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">YAML Output</h2>
              {error ? (
                <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive">
                  {error}
                </div>
              ) : (
                <CodeEditor
                  value={output}
                  onChange={() => {}}
                  language="yaml"
                  readOnly
                  minHeight="300px"
                  placeholder="YAML output will appear here..."
                />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AdBanner className="my-8" format="rectangle" slot="yaml-json-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About YAML to JSON Converter</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our YAML to JSON Converter tool helps you convert between YAML (YAML Ain't Markup Language) and JSON
            (JavaScript Object Notation) formats. It's perfect for developers who work with configuration files, data
            exchange, and APIs.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6">What is YAML?</h3>
          <p>
            YAML is a human-readable data serialization format that is commonly used for configuration files. It uses
            indentation to represent data structure, making it more readable than JSON for complex configurations. YAML
            supports comments, complex data types, and multiple documents in a single file.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6">What is JSON?</h3>
          <p>
            JSON is a lightweight data-interchange format that is easy for humans to read and write and easy for
            machines to parse and generate. It is based on a subset of JavaScript language and is widely used for data
            exchange in web applications, APIs, and configuration files.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6">Features of Our Converter</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>YAML to JSON Conversion</strong> - Convert YAML data to JSON format with proper formatting
            </li>
            <li>
              <strong>JSON to YAML Conversion</strong> - Convert JSON data to YAML format with proper indentation
            </li>
            <li>
              <strong>Syntax Highlighting</strong> - Different colors for keys, values, and punctuation make both
              formats easier to read
            </li>
            <li>
              <strong>Error Handling</strong> - Clear error messages to help you identify and fix issues in your YAML or
              JSON
            </li>
            <li>
              <strong>Copy to Clipboard</strong> - Easily copy the converted data with one click
            </li>
            <li>
              <strong>Download as File</strong> - Save the converted data to your device
            </li>
            <li>
              <strong>Drag and Drop</strong> - Simply drag and drop your YAML or JSON files for quick conversion
            </li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-6">Common Use Cases</h3>
          <p>Our YAML to JSON Converter is useful in many scenarios:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Configuration Management</strong> - Convert between configuration file formats for different
              systems
            </li>
            <li>
              <strong>API Development</strong> - Convert API responses or requests between formats
            </li>
            <li>
              <strong>DevOps</strong> - Work with Kubernetes, Docker, or other configuration files that use YAML
            </li>
            <li>
              <strong>Data Migration</strong> - Move data between systems that use different formats
            </li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-6">How to Use</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Select the conversion direction (YAML to JSON or JSON to YAML)</li>
            <li>Paste your data into the input area or drag and drop a file</li>
            <li>Click the "Convert" button to perform the conversion</li>
            <li>View the converted output in the output area</li>
            <li>Copy the converted data or download it as a file</li>
          </ol>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
