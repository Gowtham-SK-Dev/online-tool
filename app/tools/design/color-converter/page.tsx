import type { Metadata } from "next"
import ColorConverterClientPage from "./ColorConverterClientPage"

export const metadata: Metadata = {
  title: "Color Converter - DevTools",
  description: "Convert between HEX, RGB, and HSL color formats with this free online tool.",
}

export default function ColorConverterPage() {
  return <ColorConverterClientPage />
}
