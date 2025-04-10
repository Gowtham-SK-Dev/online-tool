import type { Metadata } from "next"
import ProfitMarginClientPage from "./ProfitMarginClientPage"

export const metadata: Metadata = {
  title: "Profit Margin Calculator - DevTools",
  description:
    "Calculate profit, loss, markup, and profit margins for your business. Determine optimal pricing strategies.",
  keywords:
    "profit calculator, profit margin, markup calculator, pricing calculator, business calculator, profit percentage",
}

export default function ProfitMarginPage() {
  return <ProfitMarginClientPage />
}
