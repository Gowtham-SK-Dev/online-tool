import type { Metadata } from "next"
import ImageToBase64ClientPage from "./ImageToBase64ClientPage"

export const metadata: Metadata = {
  title: "Image to Base64 Converter - DevTools",
  description:
    "Convert images to Base64 encoded strings for embedding in HTML, CSS, or JSON. Support for JPG, PNG, GIF, SVG, and WebP formats.",
  keywords: "image to base64, base64 encoder, image encoder, data URI, embed images, inline images, base64 converter",
}

export default function ImageToBase64Page() {
  return <ImageToBase64ClientPage />
}
