import type { Metadata } from "next"
import InvoiceGeneratorClientPage from "./InvoiceGeneratorClientPage"

export const metadata: Metadata = {
  title: "Invoice Generator - DevTools",
  description: "Create professional invoices for your clients. Generate, print, and download invoices in PDF format.",
  keywords:
    "invoice generator, create invoice, free invoice maker, invoice template, PDF invoice, business invoice, billing",
}

export default function InvoiceGeneratorPage() {
  return <InvoiceGeneratorClientPage />
}
