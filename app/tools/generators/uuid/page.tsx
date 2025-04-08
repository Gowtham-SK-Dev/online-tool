import type { Metadata } from "next"
import UuidGeneratorClientPage from "./UuidGeneratorClientPage"

export const metadata: Metadata = {
  title: "UUID Generator - DevTools",
  description: "Generate random UUIDs for your applications with this free online tool.",
}

export default function UuidGeneratorPage() {
  return <UuidGeneratorClientPage />
}
