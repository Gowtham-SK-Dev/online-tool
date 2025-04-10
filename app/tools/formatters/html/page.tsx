import type { Metadata } from "next"
import HtmlFormatterClientPage from "./HtmlFormatterClientPage"

export const metadata: Metadata = {
  title: "HTML Formatter & Beautifier - DevTools",
  description:
    "Format, beautify, and minify HTML code with our free online HTML formatter tool. Supports syntax highlighting and indentation.",
  keywords: "HTML formatter, HTML beautifier, HTML minifier, format HTML, clean HTML, online HTML tool, code formatter",
}

export default function HtmlFormatterPage() {
  return <HtmlFormatterClientPage />
}
