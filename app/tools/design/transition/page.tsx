import type { Metadata } from "next"
import TransitionToolsClientPage from "./TransitionToolsClientPage"

export const metadata: Metadata = {
  title: "CSS Transition Generator | Online Developer Tools",
  description: "Create smooth CSS transitions with a visual editor.",
  openGraph: {
    title: "CSS Transition Generator | Online Developer Tools",
    description: "Create smooth CSS transitions with a visual editor.",
    images: ["/og-image.png"],
  },
}

export default function TransitionToolsPage() {
  return <TransitionToolsClientPage />
}
