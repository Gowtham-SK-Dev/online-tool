import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { FileTextIcon, TypeIcon, HashIcon, ListIcon } from "lucide-react"

export default function TextUtilitiesPage() {
  const utilities = [
    {
      title: "Text Case Converter",
      description: "Convert text to uppercase, lowercase, title case, and more",
      href: "/text-utilities/case-converter",
      icon: <TypeIcon className="h-6 w-6" />,
    },
    {
      title: "Word Counter",
      description: "Count words, characters, sentences, and paragraphs",
      href: "/text-utilities/word-counter",
      icon: <HashIcon className="h-6 w-6" />,
    },
    {
      title: "Text Manipulator",
      description: "Add prefix/suffix to words, find and replace text",
      href: "/text-utilities/manipulator",
      icon: <FileTextIcon className="h-6 w-6" />,
    },
    {
      title: "Line Tools",
      description: "Remove duplicates, sort lines, trim spaces",
      href: "/text-utilities/line-tools",
      icon: <ListIcon className="h-6 w-6" />,
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Text Utilities</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
          Tools to manipulate, transform, and analyze text for various purposes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {utilities.map((utility) => (
          <Link href={utility.href} key={utility.title} className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <div className="flex items-center justify-center mb-2 text-primary">{utility.icon}</div>
                <CardTitle className="text-center">{utility.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center">{utility.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
