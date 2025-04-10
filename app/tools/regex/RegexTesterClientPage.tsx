"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Copy } from "lucide-react"

interface Match {
  text: string
  index: number
  length: number
  groups: string[]
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState("g")
  const [testString, setTestString] = useState("")
  const [matches, setMatches] = useState<Match[]>([])
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"test" | "replace">("test")
  const [replaceWith, setReplaceWith] = useState("")
  const [replaceResult, setReplaceResult] = useState("")
  const [highlightedText, setHighlightedText] = useState("")
  const { toast } = useToast()

  // Flag toggles
  const [globalFlag, setGlobalFlag] = useState(true)
  const [caseInsensitiveFlag, setCaseInsensitiveFlag] = useState(false)
  const [multilineFlag, setMultilineFlag] = useState(false)
  const [dotAllFlag, setDotAllFlag] = useState(false)
  const [unicodeFlag, setUnicodeFlag] = useState(false)
  const [stickyFlag, setStickyFlag] = useState(false)

  // Update flags when toggles change
  useEffect(() => {
    let newFlags = ""
    if (globalFlag) newFlags += "g"
    if (caseInsensitiveFlag) newFlags += "i"
    if (multilineFlag) newFlags += "m"
    if (dotAllFlag) newFlags += "s"
    if (unicodeFlag) newFlags += "u"
    if (stickyFlag) newFlags += "y"
    setFlags(newFlags)
  }, [globalFlag, caseInsensitiveFlag, multilineFlag, dotAllFlag, unicodeFlag, stickyFlag])

  // Test regex when pattern, flags, or test string changes
  useEffect(() => {
    if (pattern && testString) {
      testRegex()
    } else {
      setMatches([])
      setHighlightedText("")
      setReplaceResult("")
    }
  }, [pattern, flags, testString])

  // Update replace result when replaceWith changes
  useEffect(() => {
    if (pattern && testString && activeTab === "replace") {
      replaceRegex()
    }
  }, [pattern, flags, testString, replaceWith, activeTab])

  const testRegex = () => {
    try {
      if (!pattern) {
        setMatches([])
        setHighlightedText("")
        setError(null)
        return
      }

      const regex = new RegExp(pattern, flags)
      const foundMatches: Match[] = []
      let match

      // Reset regex if using global flag to start from beginning
      if (flags.includes("g")) {
        regex.lastIndex = 0
      }

      // Find all matches
      while ((match = regex.exec(testString)) !== null) {
        foundMatches.push({
          text: match[0],
          index: match.index,
          length: match[0].length,
          groups: match.slice(1),
        })

        // Prevent infinite loops for zero-length matches (like /^/ or /$/)
        if (match[0].length === 0) {
          regex.lastIndex++
        }

        // Break if not using global flag
        if (!flags.includes("g")) {
          break
        }
      }

      setMatches(foundMatches)
      highlightMatches(foundMatches)
      setError(null)
    } catch (err) {
      setError(`Invalid regular expression: ${(err as Error).message}`)
      setMatches([])
      setHighlightedText("")
      toast({
        title: "Error",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const replaceRegex = () => {
    try {
      if (!pattern) {
        setReplaceResult("")
        return
      }

      const regex = new RegExp(pattern, flags)
      const result = testString.replace(regex, replaceWith)
      setReplaceResult(result)
    } catch (err) {
      setError(`Invalid regular expression: ${(err as Error).message}`)
      setReplaceResult("")
    }
  }

  const highlightMatches = (foundMatches: Match[]) => {
    if (foundMatches.length === 0) {
      setHighlightedText(escapeHtml(testString))
      return
    }

    let result = ""
    let lastIndex = 0

    // Sort matches by index to process them in order
    const sortedMatches = [...foundMatches].sort((a, b) => a.index - b.index)

    for (const match of sortedMatches) {
      // Add text before the match
      if (match.index > lastIndex) {
        result += escapeHtml(testString.substring(lastIndex, match.index))
      }

      // Add the highlighted match
      result += `<mark class="bg-yellow-200 dark:bg-yellow-800">${escapeHtml(match.text)}</mark>`
      lastIndex = match.index + match.length
    }

    // Add any remaining text after the last match
    if (lastIndex < testString.length) {
      result += escapeHtml(testString.substring(lastIndex))
    }

    setHighlightedText(result)
  }

  const escapeHtml = (text: string): string => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard.",
    })
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "test" | "replace")
  }

  const faqs = [
    {
      question: "What is a regular expression?",
      answer:
        "A regular expression (regex) is a sequence of characters that defines a search pattern. It's commonly used for find and replace operations, input validation, and text extraction in programming and text processing.",
    },
    {
      question: "What do the different regex flags mean?",
      answer:
        "g (global): Find all matches rather than stopping after the first match. i (case-insensitive): Ignore case when matching. m (multiline): ^ and $ match the start and end of each line. s (dotAll): . matches newlines as well. u (unicode): Treat pattern as Unicode. y (sticky): Matches only from the index indicated by lastIndex property.",
    },
    {
      question: "How do I use capture groups in regex?",
      answer:
        "Capture groups are created by placing part of the regex inside parentheses (). They allow you to extract specific portions of the matched text. In the replace functionality, you can reference captured groups with $1, $2, etc.",
    },
    {
      question: "What are some common regex patterns?",
      answer:
        "Email: /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/g. URL: /https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/g. Phone number (US): /^(\\+\\d{1,2}\\s)?$$?\\d{3}$$?[\\s.-]\\d{3}[\\s.-]\\d{4}$/g.",
    },
    {
      question: "Is my data secure when using this tool?",
      answer:
        "Yes, all processing happens directly in your browser. Your regex patterns and test strings are never sent to our servers, ensuring complete privacy and security.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Regex Tester</h1>
        <p className="mt-2 text-muted-foreground">Test and debug regular expressions with real-time highlighting</p>
      </div>

      <AdBanner format="horizontal" slot="regex-tester-top" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="pattern">Regular Expression</Label>
                <div className="flex mt-2">
                  <div className="flex-none px-3 py-2 bg-muted border border-r-0 rounded-l-md">/</div>
                  <Input
                    id="pattern"
                    value={pattern}
                    onChange={(e) => setPattern(e.target.value)}
                    placeholder="Enter regex pattern..."
                    className="rounded-none border-x-0"
                  />
                  <div className="flex-none px-3 py-2 bg-muted border border-l-0 rounded-r-md">/{flags}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                <div className="flex items-center space-x-2">
                  <Switch id="global-flag" checked={globalFlag} onCheckedChange={setGlobalFlag} />
                  <Label htmlFor="global-flag">Global (g)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="case-insensitive-flag"
                    checked={caseInsensitiveFlag}
                    onCheckedChange={setCaseInsensitiveFlag}
                  />
                  <Label htmlFor="case-insensitive-flag">Case (i)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="multiline-flag" checked={multilineFlag} onCheckedChange={setMultilineFlag} />
                  <Label htmlFor="multiline-flag">Multiline (m)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="dotall-flag" checked={dotAllFlag} onCheckedChange={setDotAllFlag} />
                  <Label htmlFor="dotall-flag">Dot All (s)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="unicode-flag" checked={unicodeFlag} onCheckedChange={setUnicodeFlag} />
                  <Label htmlFor="unicode-flag">Unicode (u)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="sticky-flag" checked={stickyFlag} onCheckedChange={setStickyFlag} />
                  <Label htmlFor="sticky-flag">Sticky (y)</Label>
                </div>
              </div>

              <Tabs defaultValue="test" onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="test">Test</TabsTrigger>
                  <TabsTrigger value="replace">Replace</TabsTrigger>
                </TabsList>

                <TabsContent value="test" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="test-string">Test String</Label>
                    <Textarea
                      id="test-string"
                      value={testString}
                      onChange={(e) => setTestString(e.target.value)}
                      placeholder="Enter text to test against the regex..."
                      className="mt-2 min-h-[150px] font-mono"
                    />
                  </div>

                  <Button onClick={testRegex} className="w-full">
                    Test Regular Expression
                  </Button>
                </TabsContent>

                <TabsContent value="replace" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="test-string-replace">Test String</Label>
                    <Textarea
                      id="test-string-replace"
                      value={testString}
                      onChange={(e) => setTestString(e.target.value)}
                      placeholder="Enter text to test against the regex..."
                      className="mt-2 min-h-[100px] font-mono"
                    />
                  </div>

                  <div>
                    <Label htmlFor="replace-with">Replace With</Label>
                    <Input
                      id="replace-with"
                      value={replaceWith}
                      onChange={(e) => setReplaceWith(e.target.value)}
                      placeholder="Enter replacement text..."
                      className="mt-2 font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Use $1, $2, etc. to reference capture groups</p>
                  </div>

                  <div>
                    <Label htmlFor="replace-result">Result</Label>
                    <div className="relative mt-2">
                      <Textarea
                        id="replace-result"
                        value={replaceResult}
                        readOnly
                        className="min-h-[100px] font-mono"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(replaceResult)}
                        disabled={!replaceResult}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardContent className="p-6 space-y-4">
              <div>
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Matches ({matches.length})</h3>
                  {matches.length > 0 && <Badge variant="outline">{matches.length} found</Badge>}
                </div>

                {error ? (
                  <div className="p-4 border border-destructive/50 bg-destructive/10 rounded-md text-destructive">
                    {error}
                  </div>
                ) : matches.length > 0 ? (
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {matches.map((match, index) => (
                      <div key={index} className="p-2 border rounded-md">
                        <div className="flex justify-between">
                          <span className="text-xs text-muted-foreground">Match {index + 1}</span>
                          <span className="text-xs text-muted-foreground">Index: {match.index}</span>
                        </div>
                        <div className="font-mono text-sm bg-muted p-1 rounded mt-1 break-all">
                          {match.text || "(empty match)"}
                        </div>
                        {match.groups.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-muted-foreground">Groups:</span>
                            {match.groups.map((group, groupIndex) => (
                              <div
                                key={groupIndex}
                                className="font-mono text-xs bg-muted/50 p-1 rounded mt-1 break-all"
                              >
                                ${groupIndex + 1}: {group || "(empty group)"}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    {pattern ? "No matches found" : "Enter a regex pattern to test"}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium mb-2">Highlighted Matches</h3>
                <div
                  className="p-4 border rounded-md min-h-[100px] max-h-[300px] overflow-auto whitespace-pre-wrap font-mono text-sm"
                  dangerouslySetInnerHTML={{ __html: highlightedText || escapeHtml(testString) }}
                ></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="regex-tester-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Regex Tester</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our Regex Tester tool helps you test and debug regular expressions with real-time highlighting. It's perfect
            for developers who need to work with regex patterns for validation, text extraction, or search and replace
            operations.
          </p>
          <p>
            Regular expressions (regex) are powerful patterns used to match character combinations in strings. They are
            widely used in programming for input validation, text processing, and data extraction.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Test regex patterns against your text in real-time</li>
            <li>See all matches with their positions and captured groups</li>
            <li>Highlight matches in the original text</li>
            <li>Perform search and replace operations</li>
            <li>Toggle different regex flags (g, i, m, s, u, y)</li>
            <li>Copy results to clipboard</li>
          </ul>
        </div>
      </section>

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">Common Regex Patterns</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-medium">Email Address</h3>
            <code className="block p-2 bg-muted rounded-md text-sm">/^[\w-\.]+@([\w-]+\.)+[\w-]{(2, 4)}$/</code>
            <p className="text-sm text-muted-foreground">Matches standard email addresses.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">URL</h3>
            <code className="block p-2 bg-muted rounded-md text-sm">
              /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{(1, 256)}\.[a-zA-Z0-9()]{(1, 6)}
              \b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
            </code>
            <p className="text-sm text-muted-foreground">Matches URLs with or without http/https.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Phone Number (US)</h3>
            <code className="block p-2 bg-muted rounded-md text-sm">
              /^(\+\d{(1, 2)}\s)?$$?\d{3}$$?[\s.-]\d{3}[\s.-]\d{4}$/
            </code>
            <p className="text-sm text-muted-foreground">Matches US phone numbers in various formats.</p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Date (YYYY-MM-DD)</h3>
            <code className="block p-2 bg-muted rounded-md text-sm">
              /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
            </code>
            <p className="text-sm text-muted-foreground">Matches dates in YYYY-MM-DD format.</p>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
