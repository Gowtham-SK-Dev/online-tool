"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Copy } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function NumberToWordsClientPage() {
  const [number, setNumber] = useState("")
  const [words, setWords] = useState("")
  const [roman, setRoman] = useState("")
  const [ordinal, setOrdinal] = useState("")
  const [currency, setCurrency] = useState("USD")
  const [currencyWords, setCurrencyWords] = useState("")
  const [activeTab, setActiveTab] = useState<"words" | "roman" | "ordinal" | "currency">("words")
  const { toast } = useToast()

  const convertToWords = () => {
    try {
      if (!number.trim()) {
        setWords("")
        return
      }

      const num = Number.parseFloat(number)
      if (isNaN(num)) {
        throw new Error("Please enter a valid number")
      }

      // Convert number to words
      setWords(numberToWords(num))

      toast({
        title: "Conversion successful",
        description: "Number has been converted to words",
      })
    } catch (err) {
      toast({
        title: "Conversion failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const convertToRoman = () => {
    try {
      if (!number.trim()) {
        setRoman("")
        return
      }

      const num = Number.parseInt(number, 10)
      if (isNaN(num)) {
        throw new Error("Please enter a valid integer")
      }

      if (num <= 0 || num > 3999) {
        throw new Error("Roman numerals are only supported for numbers between 1 and 3999")
      }

      // Convert number to Roman numerals
      setRoman(numberToRoman(num))

      toast({
        title: "Conversion successful",
        description: "Number has been converted to Roman numerals",
      })
    } catch (err) {
      toast({
        title: "Conversion failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const convertToOrdinal = () => {
    try {
      if (!number.trim()) {
        setOrdinal("")
        return
      }

      const num = Number.parseInt(number, 10)
      if (isNaN(num)) {
        throw new Error("Please enter a valid integer")
      }

      // Convert number to ordinal words
      setOrdinal(numberToOrdinalWords(num))

      toast({
        title: "Conversion successful",
        description: "Number has been converted to ordinal words",
      })
    } catch (err) {
      toast({
        title: "Conversion failed",
        description: (err as Error).message,
        variant: "destructive",
      })
    }
  }

  const convertToCurrency = () => {
    try {
      if (!number.trim()) {
        setCurrencyWords("")
        return
      }

      const num = Number.parseFloat(number)
      if (isNaN(num)) {
        throw new Error("Please enter a valid number")
      }

      // Convert number to currency words
      setCurrencyWords(numberToCurrency(num, currency))

      toast({
        title: "Conversion successful",
        description: "Number has been converted to currency words",
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
      description: `Text has been copied to your clipboard.`,
    })
  }

  const handleTabChange = (value: string) => {
    setActiveTab(value as "words" | "roman" | "ordinal" | "currency")
  }

  // Helper function to convert number to words
  const numberToWords = (num: number): string => {
    const ones = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
      "eleven",
      "twelve",
      "thirteen",
      "fourteen",
      "fifteen",
      "sixteen",
      "seventeen",
      "eighteen",
      "nineteen",
    ]
    const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]
    const scales = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion"]

    if (num === 0) return "zero"

    const isNegative = num < 0
    num = Math.abs(num)

    // Handle decimal part
    const decimalStr = num.toString().includes(".") ? num.toString().split(".")[1] : ""
    num = Math.floor(num)

    let words = ""

    // Convert groups of 3 digits
    let scaleIndex = 0
    while (num > 0) {
      const hundreds = num % 1000
      if (hundreds !== 0) {
        let groupWords = ""

        // Handle hundreds
        if (hundreds >= 100) {
          groupWords += ones[Math.floor(hundreds / 100)] + " hundred "
        }

        // Handle tens and ones
        const tensOnes = hundreds % 100
        if (tensOnes > 0) {
          if (tensOnes < 20) {
            groupWords += ones[tensOnes] + " "
          } else {
            groupWords += tens[Math.floor(tensOnes / 10)] + " "
            if (tensOnes % 10 > 0) {
              groupWords += ones[tensOnes % 10] + " "
            }
          }
        }

        // Add scale (thousand, million, etc.)
        if (scaleIndex > 0) {
          groupWords += scales[scaleIndex] + " "
        }

        words = groupWords + words
      }

      num = Math.floor(num / 1000)
      scaleIndex++
    }

    // Add negative prefix if needed
    if (isNegative) {
      words = "negative " + words
    }

    // Add decimal part if exists
    if (decimalStr) {
      words = words.trim() + " point "
      for (let i = 0; i < decimalStr.length; i++) {
        words += ones[Number.parseInt(decimalStr[i])] + " "
      }
    }

    return words.trim()
  }

  // Helper function to convert number to Roman numerals
  const numberToRoman = (num: number): string => {
    const romanNumerals = [
      { value: 1000, symbol: "M" },
      { value: 900, symbol: "CM" },
      { value: 500, symbol: "D" },
      { value: 400, symbol: "CD" },
      { value: 100, symbol: "C" },
      { value: 90, symbol: "XC" },
      { value: 50, symbol: "L" },
      { value: 40, symbol: "XL" },
      { value: 10, symbol: "X" },
      { value: 9, symbol: "IX" },
      { value: 5, symbol: "V" },
      { value: 4, symbol: "IV" },
      { value: 1, symbol: "I" },
    ]

    let result = ""
    for (const { value, symbol } of romanNumerals) {
      while (num >= value) {
        result += symbol
        num -= value
      }
    }
    return result
  }

  // Helper function to convert number to ordinal words
  const numberToOrdinalWords = (num: number): string => {
    const specialCases: Record<number, string> = {
      1: "first",
      2: "second",
      3: "third",
      5: "fifth",
      8: "eighth",
      9: "ninth",
      12: "twelfth",
      20: "twentieth",
      30: "thirtieth",
      40: "fortieth",
      50: "fiftieth",
      60: "sixtieth",
      70: "seventieth",
      80: "eightieth",
      90: "ninetieth",
    }

    if (num <= 0) return "zeroth"

    if (specialCases[num]) return specialCases[num]

    if (num < 20) {
      return numberToWords(num) + "th"
    }

    const lastDigit = num % 10
    const tensDigit = Math.floor((num % 100) / 10) * 10

    if (lastDigit === 0) {
      return specialCases[tensDigit] || numberToWords(tensDigit) + "th"
    }

    if (specialCases[lastDigit]) {
      return numberToWords(tensDigit) + "-" + specialCases[lastDigit]
    }

    return numberToWords(tensDigit) + "-" + numberToWords(lastDigit) + "th"
  }

  // Helper function to convert number to currency words
  const numberToCurrency = (num: number, currencyCode: string): string => {
    const currencies: Record<string, { major: string; minor: string; minorValue: number }> = {
      USD: { major: "dollar", minor: "cent", minorValue: 100 },
      EUR: { major: "euro", minor: "cent", minorValue: 100 },
      GBP: { major: "pound", minor: "pence", minorValue: 100 },
      INR: { major: "rupee", minor: "paisa", minorValue: 100 },
      JPY: { major: "yen", minor: "sen", minorValue: 100 },
      CAD: { major: "dollar", minor: "cent", minorValue: 100 },
      AUD: { major: "dollar", minor: "cent", minorValue: 100 },
    }

    const currency = currencies[currencyCode] || currencies.USD

    const isNegative = num < 0
    num = Math.abs(num)

    const majorUnits = Math.floor(num)
    const minorUnits = Math.round((num - majorUnits) * currency.minorValue)

    let result = ""

    if (isNegative) {
      result += "negative "
    }

    if (majorUnits > 0) {
      result += numberToWords(majorUnits) + " " + currency.major
      if (majorUnits !== 1) {
        result += "s"
      }
    }

    if (minorUnits > 0) {
      if (majorUnits > 0) {
        result += " and "
      }
      result += numberToWords(minorUnits) + " " + currency.minor
      if (minorUnits !== 1 && currency.minor !== "pence") {
        result += "s"
      }
    }

    if (majorUnits === 0 && minorUnits === 0) {
      result = "zero " + currency.major + "s"
    }

    return result
  }

  const faqs = [
    {
      question: "Why would I need to convert numbers to words?",
      answer:
        "Converting numbers to words is useful for writing checks, legal documents, invoices, and other formal documents where numbers need to be spelled out. It's also helpful for educational purposes and for making content more accessible.",
    },
    {
      question: "What is the largest number this converter can handle?",
      answer:
        "Our converter can handle numbers up to the quintillions (10^18), which is more than sufficient for most practical applications. For Roman numerals, the range is limited to 1-3999 due to traditional Roman numeral notation limitations.",
    },
    {
      question: "What are ordinal numbers?",
      answer:
        "Ordinal numbers are numbers that indicate position or order in a sequence, such as 'first', 'second', 'third', etc. They are used to show the relative position of an item in a list or sequence.",
    },
    {
      question: "Can I convert decimal numbers to words?",
      answer:
        "Yes, our converter handles decimal numbers by converting the integer part and the decimal part separately, with the word 'point' in between. For currency conversion, it converts to major and minor units (e.g., dollars and cents).",
    },
    {
      question: "What currencies are supported for the currency converter?",
      answer:
        "Our converter supports several major currencies including USD (US Dollar), EUR (Euro), GBP (British Pound), INR (Indian Rupee), JPY (Japanese Yen), CAD (Canadian Dollar), and AUD (Australian Dollar).",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Number to Words Converter</h1>
        <p className="mt-2 text-muted-foreground">Convert numbers to words, Roman numerals, ordinals, and currency</p>
      </div>

      <AdBanner format="horizontal" slot="number-words-top" />

      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            <Label htmlFor="number-input">Enter a Number</Label>
            <Input
              id="number-input"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g., 42, 3.14, 1999"
              className="text-lg"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="words" className="mt-6" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="words">Words</TabsTrigger>
          <TabsTrigger value="roman">Roman Numerals</TabsTrigger>
          <TabsTrigger value="ordinal">Ordinal</TabsTrigger>
          <TabsTrigger value="currency">Currency</TabsTrigger>
        </TabsList>

        <TabsContent value="words" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Button onClick={convertToWords} className="w-full">
                Convert to Words
              </Button>

              <div>
                <Label htmlFor="words-output">Result</Label>
                <div className="mt-2 p-4 bg-muted rounded-md min-h-[100px] relative">
                  <p className="whitespace-pre-wrap" id="words-output">
                    {words || "Result will appear here"}
                  </p>
                  {words && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(words)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roman" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Button onClick={convertToRoman} className="w-full">
                Convert to Roman Numerals
              </Button>

              <div>
                <Label htmlFor="roman-output">Result</Label>
                <div className="mt-2 p-4 bg-muted rounded-md min-h-[100px] relative">
                  <p className="whitespace-pre-wrap text-2xl font-serif text-center" id="roman-output">
                    {roman || "Result will appear here"}
                  </p>
                  {roman && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(roman)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                Note: Roman numerals are only supported for integers between 1 and 3999.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ordinal" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <Button onClick={convertToOrdinal} className="w-full">
                Convert to Ordinal Words
              </Button>

              <div>
                <Label htmlFor="ordinal-output">Result</Label>
                <div className="mt-2 p-4 bg-muted rounded-md min-h-[100px] relative">
                  <p className="whitespace-pre-wrap" id="ordinal-output">
                    {ordinal || "Result will appear here"}
                  </p>
                  {ordinal && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(ordinal)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="currency" className="mt-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label htmlFor="currency-select">Select Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="currency-select" className="mt-2">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">US Dollar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="GBP">British Pound (GBP)</SelectItem>
                    <SelectItem value="INR">Indian Rupee (INR)</SelectItem>
                    <SelectItem value="JPY">Japanese Yen (JPY)</SelectItem>
                    <SelectItem value="CAD">Canadian Dollar (CAD)</SelectItem>
                    <SelectItem value="AUD">Australian Dollar (AUD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={convertToCurrency} className="w-full">
                Convert to Currency Words
              </Button>

              <div>
                <Label htmlFor="currency-output">Result</Label>
                <div className="mt-2 p-4 bg-muted rounded-md min-h-[100px] relative">
                  <p className="whitespace-pre-wrap" id="currency-output">
                    {currencyWords || "Result will appear here"}
                  </p>
                  {currencyWords && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(currencyWords)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AdBanner className="my-8" format="rectangle" slot="number-words-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Number to Words Converter</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our Number to Words Converter tool helps you convert numbers into various text formats including words,
            Roman numerals, ordinal words, and currency notation. It's perfect for writing checks, creating formal
            documents, educational purposes, and more.
          </p>

          <h3 className="text-lg font-medium text-foreground mt-6">Features of Our Converter</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Number to Words</strong> - Convert numbers to their word representation (e.g., 42 → "forty-two")
            </li>
            <li>
              <strong>Number to Roman Numerals</strong> - Convert integers to Roman numerals (e.g., 42 → "XLII")
            </li>
            <li>
              <strong>Number to Ordinal Words</strong> - Convert numbers to ordinal words (e.g., 42 → "forty-second")
            </li>
            <li>
              <strong>Number to Currency Words</strong> - Convert numbers to currency notation (e.g., 42.50 → "forty-two
              dollars and fifty cents")
            </li>
            <li>
              <strong>Multiple Currency Support</strong> - Convert to words in various currencies including USD, EUR,
              GBP, and more
            </li>
            <li>
              <strong>Decimal Support</strong> - Properly handle decimal numbers in all conversion types
            </li>
            <li>
              <strong>Copy to Clipboard</strong> - Easily copy conversion results with one click
            </li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-6">Common Use Cases</h3>
          <p>Our Number to Words Converter is useful in many scenarios:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Financial Documents</strong> - Write check amounts in words for legal validity
            </li>
            <li>
              <strong>Legal Documents</strong> - Spell out numbers in contracts and agreements
            </li>
            <li>
              <strong>Education</strong> - Teach number spelling and Roman numerals to students
            </li>
            <li>
              <strong>Accessibility</strong> - Make numerical content more accessible for screen readers
            </li>
            <li>
              <strong>Invoices</strong> - Spell out invoice amounts in words for clarity
            </li>
          </ul>

          <h3 className="text-lg font-medium text-foreground mt-6">How to Use</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Enter a number in the input field</li>
            <li>Select the conversion type (Words, Roman Numerals, Ordinal, or Currency)</li>
            <li>For currency conversion, select the desired currency</li>
            <li>Click the "Convert" button to see the result</li>
            <li>Copy the result to your clipboard if needed</li>
          </ol>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
