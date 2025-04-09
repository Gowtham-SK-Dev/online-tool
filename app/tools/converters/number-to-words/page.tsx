import type { Metadata } from "next"
import NumberToWordsClientPage from "./NumberToWordsClientPage"

export const metadata: Metadata = {
  title: "Number to Words Converter - DevTools",
  description: "Convert numbers to words, Roman numerals, ordinals, and currency notation with this free online tool.",
  keywords: "number to words, number converter, Roman numerals, ordinal numbers, currency converter, spell numbers",
}

export default function NumberToWordsPage() {
  return <NumberToWordsClientPage />
}
