import type { Metadata } from "next"
import FaviconGeneratorClientPage from "./FaviconGeneratorClientPage"

export const metadata: Metadata = {
  title: "Favicon Generator - DevTools",
  description:
    "Create favicons for your website from images, emojis, or text. Generate multiple sizes and download with HTML code.",
  keywords: "favicon generator, website icon, browser icon, favicon maker, custom favicon, emoji favicon, text favicon",
}

export default function FaviconGeneratorPage() {
  return <FaviconGeneratorClientPage />
}
