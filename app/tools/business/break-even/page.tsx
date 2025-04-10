import type { Metadata } from "next"
import BreakEvenClientPage from "./BreakEvenClientPage"

export const metadata: Metadata = {
  title: "Break-Even Calculator - DevTools",
  description:
    "Calculate your break-even point in units and revenue. Determine how many units you need to sell to cover all costs.",
  keywords:
    "break-even calculator, break-even analysis, break-even point, contribution margin, fixed costs, variable costs",
}

export default function BreakEvenPage() {
  return <BreakEvenClientPage />
}
