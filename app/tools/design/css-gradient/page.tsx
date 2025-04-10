import type { Metadata } from "next"
import CssGradientClientPage from "./CssGradientClientPage"

export const metadata: Metadata = {
  title: "CSS Gradient Generator - DevTools",
  description:
    "Create beautiful CSS gradients for your web projects. Generate linear, radial, and conic gradients with custom colors and angles.",
  keywords:
    "CSS gradient, gradient generator, linear gradient, radial gradient, conic gradient, CSS background, web design, Tailwind CSS",
}

export default function CssGradientPage() {
  return <CssGradientClientPage />
}
