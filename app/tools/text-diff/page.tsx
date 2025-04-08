import type { Metadata } from "next"
import TextDiffClientPage from "./TextDiffClientPage"

export const metadata: Metadata = {
  title: "Text Diff Checker - DevTools",
  description: "Compare two texts and highlight the differences line by line or word by word.",
}

export default function TextDiffPage() {
  return <TextDiffClientPage />
}
