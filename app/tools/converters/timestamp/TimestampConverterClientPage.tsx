"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Copy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TimestampConverterClientPage() {
  const [timestamp, setTimestamp] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [convertedDate, setConvertedDate] = useState("")
  const [convertedTimestamp, setConvertedTimestamp] = useState("")
  const [activeTab, setActiveTab] = useState<"toDate" | "toTimestamp">("toDate")
  const [currentTimestamp, setCurrentTimestamp] = useState("")
  const [currentDate, setCurrentDate] = useState("")
  const { toast } = useToast()

  // Update current timestamp and date every second
  useEffect(() => {
    const updateCurrent = () => {
      const now = new Date()
      setCurrentTimestamp(Math.floor(now.getTime() / 1000).toString())

      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, "0")
      const day = String(now.getDate()).padStart(2, "0")
      const hours = String(now.getHours()).padStart(2, "0")
      const minutes = String(now.getMinutes()).padStart(2, "0")
      const seconds = String(now.getSeconds()).padStart(2, "0")

      setCurrentDate(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
    }

    updateCurrent()
    const interval = setInterval(updateCurrent, 1000)

    return () => clearInterval(interval)
  }, [])

  const convertToDate = () => {
    try {
      if (!timestamp.trim()) {
        setConvertedDate("")
        return
      }

      // Convert to number and handle milliseconds vs seconds
      let ts = Number(timestamp)
      if (ts > 253402300799) {
        // If timestamp is in milliseconds (larger than max seconds timestamp)
        ts = Math.floor(ts / 1000)
      }

      const date = new Date(ts * 1000)

      if (isNaN(date.getTime())) {
        throw new Error("Invalid timestamp")
      }

      // Format the date
      const formattedDate = date.toISOString().replace("T", " ").replace("Z", " UTC")
      setConvertedDate(formattedDate)

      toast({
        title: "Conversion successful",
        description: "Timestamp has been converted to date",
      })
    } catch (err) {
      toast({
        title: "Conversion failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const convertToTimestamp = () => {
    try {
      if (!date.trim()) {
        setConvertedTimestamp("")
        return
      }

      // Create date object from input
      let dateObj: Date

      if (time.trim()) {
        dateObj = new Date(`${date}T${time}`)
      } else {
        dateObj = new Date(date)
      }

      if (isNaN(dateObj.getTime())) {
        throw new Error("Invalid date or time format")
      }

      // Convert to timestamp (seconds)
      const ts = Math.floor(dateObj.getTime() / 1000)
      setConvertedTimestamp(ts.toString())

      toast({
        title: "Conversion successful",
        description: "Date has been converted to timestamp",
      })
    } catch (err) {
      toast({
        title: "Conversion failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: `${text} has been copied to your clipboard.`,
    })
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "toDate" | "toTimestamp")
  }

  const faqs = [
    {
      question: "What is a Unix timestamp?",
      answer:
        "A Unix timestamp (also known as Epoch time or POSIX time) is the number of seconds that have elapsed since January 1, 1970 (midnight UTC/GMT), not counting leap seconds. It's a way to track time as a running total of seconds.",
    },
    {
      question: "Why use Unix timestamps?",
      answer:
        "Unix timestamps are useful because they represent a specific point in time in a single number, making them easy to store and manipulate. They're also independent of time zones, which makes them ideal for applications that need to work across different regions.",
    },
    {
      question: "What's the difference between milliseconds and seconds in timestamps?",
      answer:
        "Unix timestamps are traditionally measured in seconds, but some systems use milliseconds (seconds × 1000). Our converter automatically detects if your timestamp is in milliseconds (if it's a very large number) and converts it appropriately.",
    },
    {
      question: "How far can Unix timestamps go?",
      answer:
        "The Unix timestamp will overflow on January 19, 2038, at 03:14:07 UTC on 32-bit systems (known as the Year 2038 problem). On 64-bit systems, the timestamp can represent dates far into the future.",
    },
    {
      question: "How do I get the current Unix timestamp?",
      answer:
        "In JavaScript, you can get the current Unix timestamp with `Math.floor(Date.now() / 1000)`. Our tool also displays the current timestamp at the top of the page for your convenience.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Unix Timestamp Converter</h1>
        <p className="mt-2 text-muted-foreground">Convert between Unix timestamps and human-readable dates</p>
      </div>

      <AdBanner format="horizontal" slot="timestamp-converter-top" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Current Timestamp</h3>
                <p className="text-2xl font-mono">{currentTimestamp}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(currentTimestamp)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Current Date & Time (UTC)</h3>
                <p className="text-2xl font-mono">{currentDate}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(currentDate)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="toDate" className="mt-6" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="toDate">Timestamp to Date</TabsTrigger>
          <TabsTrigger value="toTimestamp">Date to Timestamp</TabsTrigger>
        </TabsList>

        <TabsContent value="toDate" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="timestamp-input">Unix Timestamp (seconds)</Label>
                <div className="flex mt-2">
                  <Input
                    id="timestamp-input"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    placeholder="e.g., 1609459200"
                    className="flex-1"
                  />
                  <Button onClick={convertToDate} className="ml-2">
                    Convert
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Enter a Unix timestamp in seconds or milliseconds</p>
              </div>

              <div>
                <Label htmlFor="date-output">Human-readable Date (UTC)</Label>
                <div className="flex mt-2">
                  <Input id="date-output" value={convertedDate} readOnly className="flex-1 font-mono" />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => copyToClipboard(convertedDate)}
                    disabled={!convertedDate}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="toTimestamp" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date-input">Date</Label>
                  <Input
                    id="date-input"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="time-input">Time (optional)</Label>
                  <Input
                    id="time-input"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              <Button onClick={convertToTimestamp} className="w-full">
                Convert
              </Button>

              <div>
                <Label htmlFor="timestamp-output">Unix Timestamp (seconds)</Label>
                <div className="flex mt-2">
                  <Input id="timestamp-output" value={convertedTimestamp} readOnly className="flex-1 font-mono" />
                  <Button
                    variant="outline"
                    size="icon"
                    className="ml-2"
                    onClick={() => copyToClipboard(convertedTimestamp)}
                    disabled={!convertedTimestamp}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AdBanner className="my-8" format="rectangle" slot="timestamp-converter-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Unix Timestamp Converter</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our Unix Timestamp Converter tool helps you convert between Unix timestamps (Epoch time) and human-readable
            dates. It's perfect for developers, system administrators, and anyone working with time-based data.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6">What is a Unix Timestamp?</h3>
          <p>
            A Unix timestamp (also known as Epoch time or POSIX time) is the number of seconds that have elapsed since
            January 1, 1970 (midnight UTC/GMT), not counting leap seconds. It's a way to track time as a running total
            of seconds.
          </p>
          <p>
            Unix timestamps are widely used in programming, databases, and file systems to represent dates and times in
            a simple, standardized format that's independent of time zones and easy to work with mathematically.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6">Features of Our Converter</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Timestamp to Date Conversion</strong> - Convert Unix timestamps to human-readable dates
            </li>
            <li>
              <strong>Date to Timestamp Conversion</strong> - Convert dates to Unix timestamps
            </li>
            <li>
              <strong>Current Timestamp Display</strong> - See the current Unix timestamp updated in real-time
            </li>
            <li>
              <strong>Automatic Format Detection</strong> - Handles both seconds and milliseconds formats
            </li>
            <li>
              <strong>Copy to Clipboard</strong> - Easily copy conversion results with one click
            </li>
            <li>
              <strong>UTC Time</strong> - All conversions are done in UTC/GMT for consistency
            </li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-6">Common Use Cases</h3>
          <p>Our Unix Timestamp Converter is useful in many scenarios:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Programming</strong> - Convert between timestamps and dates in your code
            </li>
            <li>
              <strong>Database Management</strong> - Work with timestamp fields in databases
            </li>
            <li>
              <strong>Log Analysis</strong> - Convert timestamps in log files to readable dates
            </li>
            <li>
              <strong>API Development</strong> - Handle timestamp formats in API requests and responses
            </li>
            <li>
              <strong>System Administration</strong> - Work with file timestamps and system events
            </li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-6">How to Use</h3>
          <h4 className="font-medium mt-2">Timestamp to Date:</h4>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Enter a Unix timestamp in the input field</li>
            <li>Click "Convert" to see the human-readable date</li>
            <li>Copy the result to your clipboard if needed</li>
          </ol>

          <h4 className="font-medium mt-4">Date to Timestamp:</h4>
          <ol className="list-decimal pl-6 space-y-1">
            <li>Select a date using the date picker</li>
            <li>Optionally, select a time</li>
            <li>Click "Convert" to get the Unix timestamp</li>
            <li>Copy the result to your clipboard if needed</li>
          </ol>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
