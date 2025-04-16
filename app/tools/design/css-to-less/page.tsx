import type { Metadata } from "next"
import CssToLessClientPage from "./CssToLessClientPage"

export const metadata: Metadata = {
  title: "CSS to LESS Converter | Online Developer Tools",
  description: "Convert your CSS code to LESS with nesting and variable extraction.",
  openGraph: {
    title: "CSS to LESS Converter | Online Developer Tools",
    description: "Convert your CSS code to LESS with nesting and variable extraction.",
    images: ["/og-image.png"],
  },
}

export default function CssToLessPage() {
  return <CssToLessClientPage />
}
