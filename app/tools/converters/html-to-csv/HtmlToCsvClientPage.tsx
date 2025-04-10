"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import CodeEditor from "@/components/code-editor"
import DragDropZone from "@/components/drag-drop-zone"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Download, Copy } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function HtmlToCsvClientPage() {
  const [htmlInput, setHtmlInput] = useState("")
  const [csvOutput, setCsvOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [includeHeaders, setIncludeHeaders] = useState(true)
  const { toast } = useToast()

  const handleFileDrop = (content: string) => {
    setHtmlInput(content)
  }

  const convertHtmlToCsv = () => {
    try {
      if (!htmlInput.trim()) {
        setCsvOutput("")
        setError(null)
        return
      }

      // Create a DOM parser to parse the HTML
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlInput, "text/html")

      // Find all tables in the document
      const tables = doc.querySelectorAll("table")

      if (tables.length === 0) {
        throw new Error("No tables found in the HTML input")
      }

      // Use the first table (or let user select which table in a more advanced version)
      const table = tables[0]
      const rows = table.querySelectorAll("tr")

      if (rows.length === 0) {
        throw new Error("No rows found in the table")
      }

      const csvRows: string[] = []

      // Process each row
      rows.forEach((row, rowIndex) => {
        // Skip header row if includeHeaders is false and it's the first row
        if (!includeHeaders && rowIndex === 0) {
          return
        }

        const cells = row.querySelectorAll("th, td")
        const csvCells: string[] = []

        cells.forEach((cell) => {
          // Get the text content and escape any quotes
          let cellText = cell.textContent?.trim() || ""

          // If the cell contains a comma, quote, or newline, wrap it in quotes
          if (cellText.includes(",") || cellText.includes('"') || cellText.includes("\n")) {
            // Escape any quotes by doubling them
            cellText = cellText.replace(/"/g, '""')
            // Wrap in quotes
            cellText = `"${cellText}"`
          }

          csvCells.push(cellText)
        })

        csvRows.push(csvCells.join(","))
      })

      setCsvOutput(csvRows.join("\n"))
      setError(null)

      toast({
        title: "Conversion successful",
        description: "HTML table has been converted to CSV",
      })
    } catch (err) {
      setError(`Error converting HTML to CSV: ${(err as Error).message}`)
      setCsvOutput("")
      toast({
        title: "Conversion failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = () => {
    if (!csvOutput) return

    navigator.clipboard.writeText(csvOutput)
    toast({
      title: "Copied to clipboard",
      description: "CSV has been copied to your clipboard",
    })
  }

  const downloadCsv = () => {
    if (!csvOutput) return

    const blob = new Blob([csvOutput], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", "table.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Download started",
      description: "Your CSV file is being downloaded",
    })
  }

  const faqs = [
    {
      question: "What is HTML to CSV conversion?",
      answer:
        "HTML to CSV conversion is the process of extracting data from HTML tables and converting it into CSV (Comma-Separated Values) format, which is a simple text format that can be opened in spreadsheet applications like Excel or Google Sheets.",
    },
    {
      question: "Why would I need to convert HTML tables to CSV?",
      answer:
        "You might need to extract data from a webpage for analysis, reporting, or data processing. Converting HTML tables to CSV makes the data more accessible for use in spreadsheet applications, databases, or data analysis tools.",
    },
    {
      question: "Can this tool handle multiple tables?",
      answer:
        "Currently, this tool processes the first table found in the HTML input. For multiple tables, you can process them one at a time by copying each table separately into the input field.",
    },
    {
      question: "What happens to formatting in the HTML table?",
      answer:
        "This converter extracts only the text content from the table cells. Formatting such as colors, fonts, and styles are not preserved in the CSV output, as CSV is a plain text format that doesn't support styling.",
    },
    {
      question: "Is my data secure when using this tool?",
      answer:
        "Yes, all processing happens directly in your browser. Your HTML and CSV data are never sent to our servers, ensuring complete privacy and security.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">HTML to CSV Converter</h1>
        <p className="mt-2 text-muted-foreground">Convert HTML tables to CSV format for use in spreadsheets</p>
      </div>

      <AdBanner format="horizontal" slot="html-to-csv-top" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">HTML Input</h2>
          <DragDropZone onFileDrop={handleFileDrop} accept=".html,.htm,.xml,.txt" />
          <CodeEditor
            value={htmlInput}
            onChange={setHtmlInput}
            language="html"
            placeholder="Paste your HTML table here..."
            minHeight="300px"
          />
          <div className="flex items-center space-x-2">
            <Switch id="include-headers" checked={includeHeaders} onCheckedChange={setIncludeHeaders} />
            <Label htmlFor="include-headers">Include table headers in CSV</Label>
          </div>
          <Button onClick={convertHtmlToCsv} className="w-full">
            Convert to CSV
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">CSV Output</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={copyToClipboard} disabled={!csvOutput}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" size="sm" onClick={downloadCsv} disabled={!csvOutput}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {error ? (
            <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive">
              {error}
            </div>
          ) : (
            <Card>
              <CardContent className="p-4">
                <pre className="whitespace-pre-wrap font-mono text-sm overflow-auto max-h-[300px]">
                  {csvOutput || "CSV output will appear here..."}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="html-to-csv-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About HTML to CSV Converter</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our HTML to CSV Converter tool helps you extract data from HTML tables and convert it into CSV
            (Comma-Separated Values) format. This is useful for data extraction, analysis, and processing.
          </p>
          <p>
            CSV (Comma-Separated Values) is a simple file format used to store tabular data, such as a spreadsheet or
            database. Files in the CSV format can be imported to and exported from programs that store data in tables,
            such as Microsoft Excel or Google Sheets.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Convert HTML tables to CSV format with a single click</li>
            <li>Choose whether to include table headers in the CSV output</li>
            <li>Copy the CSV data to clipboard for easy pasting into other applications</li>
            <li>Download the CSV file for use in spreadsheet applications</li>
            <li>Process tables from any HTML source, including web pages and HTML files</li>
          </ul>
        </div>
      </section>

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">How to Use</h2>
        <div className="space-y-4">
          <ol className="list-decimal pl-6 space-y-2">
            <li>Paste your HTML code containing a table into the input field, or drag and drop an HTML file</li>
            <li>Choose whether to include table headers in the CSV output</li>
            <li>Click the "Convert to CSV" button</li>
            <li>View the CSV output in the output field</li>
            <li>Copy the CSV data to clipboard or download it as a file</li>
          </ol>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
