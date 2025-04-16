import type { Metadata } from "next"
import InvoiceGeneratorClientPage from "../invoice-generator/InvoiceGeneratorClientPage"

export const metadata: Metadata = {
  title: "Invoice Generator | Online Developer Tools",
  description: "Create professional invoices for your clients with our free online invoice generator tool.",
  keywords: "invoice generator, create invoice, business invoice, PDF invoice, free invoice tool",
}

export default function InvoiceGeneratorPage() {
  return <InvoiceGeneratorClientPage />
}
