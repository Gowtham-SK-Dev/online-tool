import type { Metadata } from "next"
import BoxShadowClientPage from "./BoxShadowClientPage"

export const metadata: Metadata = {
  title: "Box Shadow Generator - DevTools",
  description: "Create and customize CSS box shadows for your web projects with this free online tool.",
  keywords: "box shadow generator, CSS shadow, web design, UI design, shadow effects, CSS generator",
}

export default function BoxShadowPage() {
  return <BoxShadowClientPage />
}
