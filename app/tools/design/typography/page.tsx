import type { Metadata } from "next"
import TypographyScaleClientPage from "./TypographyScaleClientPage"

export const metadata: Metadata = {
  title: "Typography Scale Generator - DevTools",
  description: "Create harmonious typography scales for your web projects with this free online tool.",
  keywords: "typography scale, type scale, font size calculator, web typography, responsive typography, design tool",
}

export default function TypographyScalePage() {
  return <TypographyScaleClientPage />
}
