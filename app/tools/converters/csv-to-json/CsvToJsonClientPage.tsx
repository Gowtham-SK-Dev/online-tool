"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CodeEditor from "@/components/code-editor"
import DragDropZone from "@/components/drag-drop-zone"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CsvToJsonClientPage() {
  const [csvInput, setCsvInput] = useState("")
  const [jsonInput, setJsonInput] = useState("")
  const [output, setOutput] = useState("")
  const [activeTab, setActiveTab] = useState<"csvToJson" | "jsonToCsv">("csvToJson")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleCsvDrop = (content: string) => {
    setCsvInput(content)
  }

  const handleJsonDrop = (content: string) => {
    setJsonInput(content)
  }

  const csvToJson = () => {
    try {
      if (!csvInput.trim()) {
        setOutput("")
        setError(null)
        return
      }

      // Simple CSV parser
      const lines = csvInput.split(/\r?\n/).filter((line) => line.trim())
      if (lines.length === 0) {
        throw new Error("CSV is empty or invalid")
      }

      const headers = lines[0].split(",").map((header) => header.trim())
      const result = []

      for (let i = 1; i < lines.length; i++) {
        const obj: Record<string, string> = {}
        const currentLine = lines[i].split(",")

        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = currentLine[j]?.trim() || ""
        }

        result.push(obj)
      }

      setOutput(JSON.stringify(result, null, 2))
      setError(null)

      toast({
        title: "Conversion successful",
        description: "CSV has been converted to JSON",
      })
    } catch (err) {
      setError(`Error converting CSV to JSON: ${(err as Error).message}`)
      toast({
        title: "Conversion failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const jsonToCsv = () => {
    try {
      if (!jsonInput.trim()) {
        setOutput("")
        setError(null)
        return
      }

      const json = JSON.parse(jsonInput)

      if (!Array.isArray(json) || json.length === 0) {
        throw new Error("JSON must be an array of objects")
      }

      // Get headers from the first object
      const headers = Object.keys(json[0])

      // Create CSV rows
      const csvRows = []
      csvRows.push(headers.join(","))

      // Add data rows
      for (const item of json) {
        const values = headers.map((header) => {
          const val = item[header]
          // Handle values with commas by wrapping in quotes
          return typeof val === "string" && val.includes(",") ? `"${val}"` : val !== undefined ? String(val) : ""
        })
        csvRows.push(values.join(","))
      }

      setOutput(csvRows.join("\n"))
      setError(null)

      toast({
        title: "Conversion successful",
        description: "JSON has been converted to CSV",
      })
    } catch (err) {
      setError(`Error converting JSON to CSV: ${(err as Error).message}`)
      toast({
        title: "Conversion failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "csvToJson" | "jsonToCsv")
    setOutput("")
    setError(null)
  }

  const faqs = [
    {
      question: "What is CSV?",
      answer:
        "CSV (Comma-Separated Values) is a simple file format used to store tabular data, such as a spreadsheet or database. Each line of the file is a data record, and each record consists of one or more fields, separated by commas.",
    },
    {
      question: "What is JSON?",
      answer:
        "JSON (JavaScript Object Notation) is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate. It is based on a subset of JavaScript language and is commonly used for transmitting data in web applications.",
    },
    {
      question: "Why would I need to convert between CSV and JSON?",
      answer:
        "CSV is often used for spreadsheet data, while JSON is commonly used in web applications and APIs. Converting between these formats allows you to use data from one system in another. For example, you might export data from a spreadsheet as CSV and convert it to JSON for use in a web application.",
    },
    {
      question: "Is my data secure when using this tool?",
      answer:
        "Yes, all processing happens directly in your browser. Your data is never sent to our servers, ensuring complete privacy and security.",
    },
    {
      question: "What happens if my CSV has commas within fields?",
      answer:
        "Our tool handles commas within fields by wrapping those fields in quotes when converting from JSON to CSV. When converting from CSV to JSON, you should ensure that fields containing commas are properly quoted in your input CSV.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">CSV to JSON Converter</h1>
        <p className="mt-2 text-muted-foreground">Convert between CSV and JSON formats</p>
      </div>

      <AdBanner format="horizontal" slot="csv-json-top" />

      <Tabs defaultValue="csvToJson" className="mt-6" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="csvToJson">CSV to JSON</TabsTrigger>
          <TabsTrigger value="jsonToCsv">JSON to CSV</TabsTrigger>
        </TabsList>

        <TabsContent value="csvToJson" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">CSV Input</h2>
              <DragDropZone onFileDrop={handleCsvDrop} accept=".csv,.txt" />
              <CodeEditor
                value={csvInput}
                onChange={setCsvInput}
                language="plaintext"
                placeholder="Paste your CSV here..."
                minHeight="300px"
              />
              <Button onClick={csvToJson} className="w-full">
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

        <TabsContent value="jsonToCsv" className="mt-4">
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
              <Button onClick={jsonToCsv} className="w-full">
                Convert to CSV
              </Button>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">CSV Output</h2>
              {error ? (
                <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive">
                  {error}
                </div>
              ) : (
                <CodeEditor
                  value={output}
                  onChange={() => {}}
                  language="plaintext"
                  readOnly
                  minHeight="300px"
                  placeholder="CSV output will appear here..."
                />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AdBanner className="my-8" format="rectangle" slot="csv-json-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About CSV to JSON Converter</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our CSV to JSON Converter tool helps you convert between CSV (Comma-Separated Values) and JSON (JavaScript
            Object Notation) formats. It's perfect for developers and data analysts who need to work with data in
            different formats.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Convert CSV data to JSON format</li>
            <li>Convert JSON arrays to CSV format</li>
            <li>Drag and drop files for easy conversion</li>
            <li>Copy the converted data to clipboard</li>
            <li>Download the converted data as a file</li>
          </ul>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
