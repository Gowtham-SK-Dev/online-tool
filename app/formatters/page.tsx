import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { CodeIcon } from "lucide-react"

export default function FormattersPage() {
  const formatters = [
    {
      title: "JSON Formatter",
      description: "Beautify and minify JSON data",
      href: "/formatters/json",
      icon: <CodeIcon className="h-6 w-6" />,
    },
    {
      title: "HTML Formatter",
      description: "Format and clean up messy HTML code",
      href: "/formatters/html",
      icon: <CodeIcon className="h-6 w-6" />,
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Code Formatters</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Tools to beautify, minify, and format your code for better readability and efficiency.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {formatters.map((formatter) => (
          <Link href={formatter.href} key={formatter.title} className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-center mb-2 text-primary">{formatter.icon}</div>
                <CardTitle className="text-center">{formatter.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">{formatter.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
