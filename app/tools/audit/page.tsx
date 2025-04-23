import type { Metadata } from "next"
import WebsiteAuditClientPage from "./WebsiteAuditClientPage"

export const metadata: Metadata = {
  title: "Website Audit Tool - SEO, Performance & AdSense Compliance",
  description:
    "Comprehensive website audit tool to check SEO, performance, mobile responsiveness, broken links, and content uniqueness for AdSense compliance.",
  keywords:
    "website audit, SEO audit, performance check, mobile responsiveness, broken links, content uniqueness, AdSense compliance, website checker",
}

export default function WebsiteAuditPage() {
  return <WebsiteAuditClientPage />
}
