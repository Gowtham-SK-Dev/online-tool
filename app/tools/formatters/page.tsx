import type { Metadata } from "next"
import Link from "next/link"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import AdBanner from "@/components/ad-banner"

export const metadata: Metadata = {
  title: "Code Formatters | DevTools",
  description:
    "Format your code with our collection of code formatting tools. Make your code readable and maintainable with JSON and HTML formatters.",
  openGraph: {
    title: "Code Formatters | DevTools",
    description:
      "Format your code with our collection of code formatting tools. Make your code readable and maintainable with JSON and HTML formatters.",
    type: "website",
    url: "https://devtools.example.com/tools/formatters",
  },
}

export default function FormattersPage() {
  const formatters = [
    {
      title: "JSON Formatter",
      description: "Format, validate and beautify JSON data with our easy-to-use JSON formatter tool.",
      href: "/tools/formatters/json",
    },
    {
      title: "HTML Formatter",
      description: "Clean up and format HTML code to make it readable and maintainable.",
      href: "/tools/formatters/html",
    },
  ]

  return (
    <div className="container py-8 max-w-6xl">
      <div flex flex-col items-center justify-center py-6 text-center>
      <h1 className="text-3xl font-bold mb-2">Code Formatters</h1>
      <p className="text-muted-foreground mb-8">
        Format your code with our collection of code formatting tools. Make your code readable and maintainable.
      </p>
    </div>
      <div className="mb-8">
        <AdBanner className="my-6" />
        <p className="text-xs text-center text-muted-foreground">Advertisement</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {formatters.map((formatter) => (
          <Link key={formatter.title} href={formatter.href} className="block group">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle>{formatter.title}</CardTitle>
                <CardDescription>{formatter.description}</CardDescription>
              </CardHeader>
              <CardFooter className="flex justify-end">
                <span className="text-sm flex items-center text-primary group-hover:underline">
                  Try it now <ChevronRight className="ml-1 h-4 w-4" />
                </span>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
