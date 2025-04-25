import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.BASE_URL || "https://online-tool-demo.netlify.app";

  const tools = [
    { path: "/tools/formatters/json", priority: 0.8 },
    { path: "/tools/formatters/html", priority: 0.8 },
    { path: "/tools/text-diff", priority: 0.8 },
    { path: "/tools/base64", priority: 0.8 },
    { path: "/tools/converters/csv-to-json", priority: 0.8 },
    { path: "/tools/design/color-converter", priority: 0.8 },
    { path: "/tools/generators/uuid", priority: 0.8 },
    { path: "/tools/converters/yaml-to-json", priority: 0.7 },
    { path: "/tools/converters/timestamp", priority: 0.7 },
    { path: "/tools/converters/number-to-words", priority: 0.7 },
    { path: "/tools/design/color-palette", priority: 0.7 },
    { path: "/tools/design/box-shadow", priority: 0.7 },
    { path: "/tools/design/typography", priority: 0.7 },
    { path: "/tools/design/favicon", priority: 0.7 },
    { path: "/tools/business/invoice", priority: 0.7 },
    { path: "/tools/business/gst", priority: 0.7 },
    { path: "/tools/audit", priority: 0.8 },
  ]

  const pages = [
    { path: "/", priority: 1.0 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.6 },
    { path: "/privacy-policy", priority: 0.5 },
    { path: "/terms-of-service", priority: 0.5 },
    { path: "/disclaimer", priority: 0.5 },
  ]

  const allRoutes = [...pages, ...tools].map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route.priority,
  }))

  return allRoutes
}
