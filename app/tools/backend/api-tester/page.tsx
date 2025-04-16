import type { Metadata } from "next"
import ApiTesterClientPage from "./ApiTesterClientPage"

export const metadata: Metadata = {
  title: "API Tester | Online Developer Tools",
  description: "Test and debug APIs with a simple interface. Send HTTP requests and examine responses.",
  openGraph: {
    title: "API Tester | Online Developer Tools",
    description: "Test and debug APIs with a simple interface. Send HTTP requests and examine responses.",
    images: ["/og-image.png"],
  },
}

export default function ApiTesterPage() {
  return <ApiTesterClientPage />
}
