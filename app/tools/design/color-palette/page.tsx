import type { Metadata } from "next"
import ColorPaletteClientPage from "./ColorPaletteClientPage"

export const metadata: Metadata = {
  title: "Color Palette Generator - DevTools",
  description: "Create harmonious color palettes for your designs with this free online tool.",
  keywords: "color palette generator, color scheme, color harmony, web design, UI design, color picker",
}

export default function ColorPalettePage() {
  return <ColorPaletteClientPage />
}
