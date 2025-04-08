import type { Metadata } from "next"
import JsonFormatterClientPageContent from "./JsonFormatterClientPage"

export const metadata: Metadata = {
  title: "JSON Formatter & Validator - DevTools",
  description:
    "Format, beautify, and validate JSON data with our free online JSON formatter tool. Supports minification, validation, and syntax highlighting.",
  keywords:
    "JSON formatter, JSON validator, JSON beautifier, JSON minifier, JSON pretty print, format JSON, validate JSON, online JSON tool",
}

export default function JsonFormatterPage() {
  return <JsonFormatterClientPageContent />
}
