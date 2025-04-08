import type { Metadata } from "next"
import CsvToJsonClientPage from "./CsvToJsonClientPage"

export const metadata: Metadata = {
  title: "CSV to JSON Converter - DevTools",
  description: "Convert between CSV and JSON formats with this free online tool.",
}

export default function CsvToJsonPage() {
  return <CsvToJsonClientPage />
}
