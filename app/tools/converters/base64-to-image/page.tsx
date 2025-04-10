import type { Metadata } from "next"
import Base64ToImageClientPage from "./Base64ToImageClientPage"

export const metadata: Metadata = {
  title: "Base64 to Image Converter - DevTools",
  description:
    "Convert Base64 encoded strings back to viewable and downloadable images. Support for JPEG, PNG, GIF, WebP, and SVG formats.",
  keywords: "base64 to image, base64 decoder, image decoder, data URI, decode base64, convert base64, base64 converter",
}

export default function Base64ToImagePage() {
  return <Base64ToImageClientPage />
}
