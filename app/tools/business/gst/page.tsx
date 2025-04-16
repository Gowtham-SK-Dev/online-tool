import type { Metadata } from "next"
import GstCalculatorClientPage from "../gst-calculator/GstCalculatorClientPage"

export const metadata: Metadata = {
  title: "GST Calculator | Online Developer Tools",
  description: "Calculate GST amounts for Indian goods and services with our free online GST calculator.",
  keywords: "GST calculator, CGST, SGST, tax calculator, Indian tax, GST inclusive, GST exclusive",
}

export default function GstCalculatorPage() {
  return <GstCalculatorClientPage />
}
