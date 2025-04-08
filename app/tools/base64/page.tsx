import type { Metadata } from "next"
import Base64ClientPage from "./Base64ClientPage"

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder - DevTools",
  description: "Encode text to Base64 or decode Base64 to text with this free online tool.",
}

export default function Base64Page() {
  return <Base64ClientPage />
}
