import type { Metadata } from "next"
import YamlToJsonClientPage from "./YamlToJsonClientPage"

export const metadata: Metadata = {
  title: "YAML to JSON Converter - DevTools",
  description: "Convert between YAML and JSON formats with this free online tool.",
  keywords: "YAML to JSON, JSON to YAML, YAML converter, JSON converter, YAML parser, JSON parser, online converter",
}

export default function YamlToJsonPage() {
  return <YamlToJsonClientPage />
}
