import type { Metadata } from "next"
import RegexTesterClientPage from "./RegexTesterClientPage"

export const metadata: Metadata = {
  title: "Regex Tester - DevTools",
  description:
    "Test and debug regular expressions with real-time highlighting and visualization. Supports all regex flags and capture groups.",
  keywords:
    "regex tester, regular expression, regex debugger, regex visualizer, regex pattern, regex match, regex replace",
}

export default function RegexTesterPage() {
  return <RegexTesterClientPage />
}
