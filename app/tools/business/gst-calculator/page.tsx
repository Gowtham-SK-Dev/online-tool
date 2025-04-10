import type { Metadata } from "next"
import GstCalculatorClientPage from "./GstCalculatorClientPage"

export const metadata: Metadata = {
  title: "GST Calculator - DevTools",
  description:
    "Calculate GST amounts for Indian goods and services. Add or remove GST at different rates (5%, 12%, 18%, 28%).",
  keywords: "GST calculator, CGST, SGST, tax calculator, Indian tax, GST rates, add GST, remove GST, GST inclusive",
}

export default function GstCalculatorPage() {
  return <GstCalculatorClientPage />
}
