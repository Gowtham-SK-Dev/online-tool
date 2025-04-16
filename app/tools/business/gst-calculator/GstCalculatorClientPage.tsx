"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Copy } from "lucide-react"

type CalculationType = "add" | "remove"
type GSTRate = "5" | "12" | "18" | "28"

interface GSTResult {
  originalAmount: number
  gstAmount: number
  cgst: number
  sgst: number
  totalAmount: number
}

export default function GstCalculatorClientPage() {
  const [calculationType, setCalculationType] = useState<CalculationType>("add")
  const [gstRate, setGstRate] = useState<GSTRate>("18")
  const [amount, setAmount] = useState<string>("1000")
  const [result, setResult] = useState<GSTResult | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    calculateGST()
  }, [calculationType, gstRate, amount])

  const calculateGST = () => {
    const parsedAmount = Number.parseFloat(amount)

    if (isNaN(parsedAmount) || parsedAmount < 0) {
      setResult(null)
      return
    }

    const rate = Number.parseFloat(gstRate) / 100

    if (calculationType === "add") {
      // Add GST to amount (exclusive GST)
      const gstAmount = parsedAmount * rate
      const totalAmount = parsedAmount + gstAmount

      setResult({
        originalAmount: parsedAmount,
        gstAmount: gstAmount,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        totalAmount: totalAmount,
      })
    } else {
      // Remove GST from amount (inclusive GST)
      const originalAmount = parsedAmount / (1 + rate)
      const gstAmount = parsedAmount - originalAmount

      setResult({
        originalAmount: originalAmount,
        gstAmount: gstAmount,
        cgst: gstAmount / 2,
        sgst: gstAmount / 2,
        totalAmount: parsedAmount,
      })
    }
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied to clipboard",
      description: "The calculation has been copied to your clipboard",
    })
  }

  const getResultText = (): string => {
    if (!result) return ""

    return `
GST Calculation (${calculationType === "add" ? "Adding GST" : "Removing GST"})
Original Amount: ${formatCurrency(result.originalAmount)}
GST Rate: ${gstRate}%
CGST (${Number.parseFloat(gstRate) / 2}%): ${formatCurrency(result.cgst)}
SGST (${Number.parseFloat(gstRate) / 2}%): ${formatCurrency(result.sgst)}
Total GST: ${formatCurrency(result.gstAmount)}
Final Amount: ${formatCurrency(result.totalAmount)}
    `.trim()
  }

  const faqs = [
    {
      question: "What is GST?",
      answer:
        "GST (Goods and Services Tax) is a comprehensive indirect tax levied on the supply of goods and services in India. It replaced multiple taxes like VAT, Service Tax, and Excise Duty to create a unified tax system.",
    },
    {
      question: "What are CGST and SGST?",
      answer:
        "CGST (Central Goods and Services Tax) is collected by the central government, while SGST (State Goods and Services Tax) is collected by the state government. For intra-state transactions, both are applied at equal rates that sum up to the total GST rate.",
    },
    {
      question: "What are the different GST rates in India?",
      answer:
        "India has a multi-tier GST structure with rates of 0%, 5%, 12%, 18%, and 28%. Essential goods are taxed at lower rates or exempted, while luxury and sin goods may have additional cess beyond the 28% rate.",
    },
    {
      question: "When should I use 'Add GST' vs 'Remove GST'?",
      answer:
        "Use 'Add GST' when you have a base price and need to calculate the final amount after adding GST. Use 'Remove GST' when you have a GST-inclusive amount and need to find the original base price and the GST component.",
    },
    {
      question: "How is GST calculated?",
      answer:
        "To add GST: Multiply the base amount by the GST rate percentage and add it to the base amount. To remove GST: Divide the total amount by (1 + GST rate as a decimal) to get the base amount, then subtract to find the GST amount.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">GST Calculator</h1>
        <p className="mt-2 text-muted-foreground">Calculate GST amounts for Indian goods and services</p>
      </div>

      <AdBanner format="horizontal" slot="gst-calculator-top" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">GST Calculator</h2>

            <div className="space-y-6">
              <div>
                <Label className="text-base">Calculation Type</Label>
                <RadioGroup
                  value={calculationType}
                  onValueChange={(value) => setCalculationType(value as CalculationType)}
                  className="flex flex-col space-y-1 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="add" id="add-gst" />
                    <Label htmlFor="add-gst" className="font-normal">
                      Add GST to amount
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="remove" id="remove-gst" />
                    <Label htmlFor="remove-gst" className="font-normal">
                      Remove GST from amount (GST inclusive)
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="amount" className="text-base">
                  {calculationType === "add" ? "Original Amount (without GST)" : "Total Amount (with GST)"}
                </Label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-muted-foreground">₹</span>
                  </div>
                  <Input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              <div>
                <Label className="text-base">GST Rate</Label>
                <Tabs defaultValue={gstRate} onValueChange={(value) => setGstRate(value as GSTRate)} className="mt-2">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="5">5%</TabsTrigger>
                    <TabsTrigger value="12">12%</TabsTrigger>
                    <TabsTrigger value="18">18%</TabsTrigger>
                    <TabsTrigger value="28">28%</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">GST Calculation Result</h2>
              {result && (
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(getResultText())}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>

            {result ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {calculationType === "add" ? "Original Amount" : "Base Amount (excluding GST)"}
                    </p>
                    <p className="text-lg font-medium">{formatCurrency(result.originalAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">GST Rate</p>
                    <p className="text-lg font-medium">{gstRate}%</p>
                  </div>
                </div>

                <div className="bg-muted/30 p-4 rounded-md space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">CGST ({Number.parseFloat(gstRate) / 2}%)</p>
                      <p className="font-medium">{formatCurrency(result.cgst)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">SGST ({Number.parseFloat(gstRate) / 2}%)</p>
                      <p className="font-medium">{formatCurrency(result.sgst)}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total GST Amount</p>
                    <p className="font-medium">{formatCurrency(result.gstAmount)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm text-muted-foreground">
                    {calculationType === "add" ? "Final Amount (including GST)" : "Total Amount (including GST)"}
                  </p>
                  <p className="text-xl font-bold">{formatCurrency(result.totalAmount)}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-40 bg-muted/30 rounded-md">
                <p className="text-muted-foreground">Enter a valid amount to see the calculation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="gst-calculator-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About GST Calculator</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our GST Calculator tool helps you calculate Goods and Services Tax (GST) amounts for products and services
            in India. GST is a comprehensive indirect tax that replaced multiple taxes to create a unified tax system
            across the country.
          </p>
          <p>
            This calculator supports both adding GST to a base amount and removing GST from a GST-inclusive amount. It
            also breaks down the GST into its CGST (Central GST) and SGST (State GST) components, which are typically
            equal halves of the total GST amount for intra-state transactions.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Calculate GST at different rates (5%, 12%, 18%, 28%)</li>
            <li>Add GST to a base amount to get the final price</li>
            <li>Remove GST from a GST-inclusive amount to find the base price</li>
            <li>See the breakdown of CGST and SGST components</li>
            <li>Copy the calculation results for your records</li>
          </ul>
        </div>
      </section>

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">GST Rates in India</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="border p-2 text-left">GST Rate</th>
                <th className="border p-2 text-left">CGST</th>
                <th className="border p-2 text-left">SGST</th>
                <th className="border p-2 text-left">Applicable Items (Examples)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">5%</td>
                <td className="border p-2">2.5%</td>
                <td className="border p-2">2.5%</td>
                <td className="border p-2">
                  Household necessities, packaged food items, transport services, small restaurants
                </td>
              </tr>
              <tr>
                <td className="border p-2">12%</td>
                <td className="border p-2">6%</td>
                <td className="border p-2">6%</td>
                <td className="border p-2">
                  Processed food, business class air tickets, hotel rooms (₹1,000-₹7,500/day), mobile phones
                </td>
              </tr>
              <tr>
                <td className="border p-2">18%</td>
                <td className="border p-2">9%</td>
                <td className="border p-2">9%</td>
                <td className="border p-2">
                  Most items including electronics, software, telecom services, financial services, restaurant services
                </td>
              </tr>
              <tr>
                <td className="border p-2">28%</td>
                <td className="border p-2">14%</td>
                <td className="border p-2">14%</td>
                <td className="border p-2">
                  Luxury items, premium cars, tobacco products, aerated drinks, high-end hotel rooms
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Note: For inter-state transactions, IGST (Integrated GST) applies instead of CGST and SGST, at the full GST
          rate.
        </p>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
