import type { Metadata } from "next"
import HtmlToCsvClientPage from "./HtmlToCsvClientPage"

export const metadata: Metadata = {
  title: "HTML to CSV Converter - DevTools",
  description:
    "Convert HTML tables to CSV format for use in spreadsheets and data analysis. Extract data from web pages easily.",
  keywords:
    "HTML to CSV, table converter, HTML table extractor, CSV generator, data extraction, web scraping, spreadsheet",
}

export default function HtmlToCsvPage() {
  return <HtmlToCsvClientPage />
}
