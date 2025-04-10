"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, ArrowRight } from "lucide-react"

interface ProfitResult {
  costPrice: number
  sellingPrice: number
  profit: number
  profitPercentage: number
  markup: number
  markupPercentage: number
  isProfit: boolean
}

export default function ProfitMarginClientPage() {
  const [costPrice, setCostPrice] = useState<string>("100")
  const [sellingPrice, setSellingPrice] = useState<string>("150")
  const [result, setResult] = useState<ProfitResult | null>(null)
  const [activeTab, setActiveTab] = useState<"calculator" | "formula">("calculator")
  const { toast } = useToast()

  useEffect(() => {
    calculateProfit()
  }, [costPrice, sellingPrice])

  const calculateProfit = () => {
    const parsedCostPrice = Number.parseFloat(costPrice)
    const parsedSellingPrice = Number.parseFloat(sellingPrice)

    if (isNaN(parsedCostPrice) || isNaN(parsedSellingPrice) || parsedCostPrice < 0 || parsedSellingPrice < 0) {
      setResult(null)
      return
    }

    const profit = parsedSellingPrice - parsedCostPrice
    const isProfit = profit >= 0

    // Calculate profit percentage (relative to cost price)
    const profitPercentage = parsedCostPrice !== 0 ? (profit / parsedCostPrice) * 100 : 0

    // Calculate markup (same as profit, but term used in business context)
    const markup = profit

    // Calculate markup percentage (same as profit percentage)
    const markupPercentage = profitPercentage

    setResult({
      costPrice: parsedCostPrice,
      sellingPrice: parsedSellingPrice,
      profit: Math.abs(profit),
      profitPercentage: Math.abs(profitPercentage),
      markup: Math.abs(markup),
      markupPercentage: Math.abs(markupPercentage),
      isProfit,
    })
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatPercentage = (percentage: number): string => {
    return `${percentage.toFixed(2)}%`
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
Profit Margin Calculation
Cost Price: ${formatCurrency(result.costPrice)}
Selling Price: ${formatCurrency(result.sellingPrice)}
${result.isProfit ? "Profit" : "Loss"}: ${formatCurrency(result.profit)}
${result.isProfit ? "Profit" : "Loss"} Percentage: ${formatPercentage(result.profitPercentage)}
Markup: ${formatCurrency(result.markup)}
Markup Percentage: ${formatPercentage(result.markupPercentage)}
    `.trim()
  }

  const faqs = [
    {
      question: "What is profit margin?",
      answer:
        "Profit margin is the percentage of revenue that represents profit after all costs are deducted. It's calculated as (Selling Price - Cost Price) / Selling Price × 100%. It indicates how much of each dollar of revenue is profit.",
    },
    {
      question: "What's the difference between profit margin and markup?",
      answer:
        "Markup is calculated as (Selling Price - Cost Price) / Cost Price × 100%. While profit margin is based on the selling price, markup is based on the cost price. Markup tells you how much you've increased the cost price to arrive at the selling price.",
    },
    {
      question: "How do I determine the right profit margin for my business?",
      answer:
        "The right profit margin varies by industry, business model, and strategy. Research industry benchmarks, consider your costs (fixed and variable), analyze competitors' pricing, and factor in your value proposition. Most retail businesses aim for a 50% markup (33% profit margin).",
    },
    {
      question: "Why is my profit positive but my business is still struggling?",
      answer:
        "Profit calculations only consider the cost price and selling price of individual items. Your business may have other expenses like rent, salaries, marketing, and utilities that aren't included in this calculation. For a complete picture, you need to analyze your overall business profitability.",
    },
    {
      question: "How can I increase my profit margin?",
      answer:
        "You can increase profit margin by: 1) Increasing your selling price, 2) Reducing your cost price by negotiating with suppliers or finding alternatives, 3) Increasing sales volume to benefit from economies of scale, 4) Reducing overhead costs, or 5) Focusing on higher-margin products or services.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Profit Margin Calculator</h1>
        <p className="mt-2 text-muted-foreground">Calculate profit, loss, and markup percentages for your business</p>
      </div>

      <AdBanner format="horizontal" slot="profit-margin-top" />

      <Tabs defaultValue="calculator" onValueChange={(value) => setActiveTab(value as "calculator" | "formula")}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="formula">Formulas</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Profit Margin Calculator</h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="cost-price" className="text-base">
                      Cost Price
                    </Label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-muted-foreground">$</span>
                      </div>
                      <Input
                        id="cost-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={costPrice}
                        onChange={(e) => setCostPrice(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <ArrowRight className="text-muted-foreground" />
                  </div>

                  <div>
                    <Label htmlFor="selling-price" className="text-base">
                      Selling Price
                    </Label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-muted-foreground">$</span>
                      </div>
                      <Input
                        id="selling-price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={sellingPrice}
                        onChange={(e) => setSellingPrice(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Calculation Result</h2>
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
                        <p className="text-sm text-muted-foreground">Cost Price</p>
                        <p className="text-lg font-medium">{formatCurrency(result.costPrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Selling Price</p>
                        <p className="text-lg font-medium">{formatCurrency(result.sellingPrice)}</p>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-4 rounded-md space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">{result.isProfit ? "Profit" : "Loss"}</p>
                        <p className="font-medium">{formatCurrency(result.profit)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          {result.isProfit ? "Profit" : "Loss"} Percentage
                        </p>
                        <p className="font-medium">{formatPercentage(result.profitPercentage)}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Markup</p>
                          <p className="font-medium">{formatCurrency(result.markup)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Markup Percentage</p>
                          <p className="font-medium">{formatPercentage(result.markupPercentage)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 bg-muted/30 rounded-md">
                    <p className="text-muted-foreground">Enter valid prices to see the calculation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="formula" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Profit Margin Formulas</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium">Profit or Loss</h3>
                  <div className="bg-muted/30 p-4 rounded-md mt-2">
                    <p className="font-mono">Profit/Loss = Selling Price - Cost Price</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    If the result is positive, it's a profit. If negative, it's a loss.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Profit Percentage</h3>
                  <div className="bg-muted/30 p-4 rounded-md mt-2">
                    <p className="font-mono">Profit Percentage = (Profit / Cost Price) × 100%</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This shows the profit as a percentage of the cost price.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Markup</h3>
                  <div className="bg-muted/30 p-4 rounded-md mt-2">
                    <p className="font-mono">Markup = Selling Price - Cost Price</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Markup is the same as profit but is the term commonly used in business contexts.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Markup Percentage</h3>
                  <div className="bg-muted/30 p-4 rounded-md mt-2">
                    <p className="font-mono">Markup Percentage = (Markup / Cost Price) × 100%</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This shows how much the cost price was increased by, as a percentage.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Profit Margin</h3>
                  <div className="bg-muted/30 p-4 rounded-md mt-2">
                    <p className="font-mono">Profit Margin = (Profit / Selling Price) × 100%</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This shows what percentage of the selling price is profit.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Selling Price from Cost Price and Markup Percentage</h3>
                  <div className="bg-muted/30 p-4 rounded-md mt-2">
                    <p className="font-mono">Selling Price = Cost Price × (1 + Markup Percentage / 100)</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium">Cost Price from Selling Price and Profit Margin</h3>
                  <div className="bg-muted/30 p-4 rounded-md mt-2">
                    <p className="font-mono">Cost Price = Selling Price × (1 - Profit Margin / 100)</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AdBanner className="my-8" format="rectangle" slot="profit-margin-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Profit Margin Calculator</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our Profit Margin Calculator helps you determine the profit or loss on your products or services. It
            calculates profit amount, profit percentage, markup, and markup percentage based on the cost price and
            selling price you provide.
          </p>
          <p>
            Understanding profit margins is crucial for any business. It helps you price your products correctly,
            evaluate your business performance, and make informed decisions about your pricing strategy.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Calculate profit or loss amount based on cost and selling prices</li>
            <li>Determine profit or loss as a percentage of the cost price</li>
            <li>Calculate markup and markup percentage</li>
            <li>Understand the difference between profit percentage and profit margin</li>
            <li>Copy the calculation results for your records</li>
          </ul>
        </div>
      </section>

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">Understanding Profit vs. Markup</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Profit Percentage</h3>
            <div className="bg-muted/30 p-4 rounded-md">
              <p className="font-mono">Profit % = (Profit / Cost Price) × 100%</p>
            </div>
            <p className="text-sm">
              Profit percentage is calculated relative to the cost price. It tells you how much profit you've made
              compared to what you paid for the item.
            </p>
            <p className="text-sm">
              <strong>Example:</strong> If you buy an item for $100 and sell it for $150, your profit is $50, and your
              profit percentage is 50%.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Profit Margin</h3>
            <div className="bg-muted/30 p-4 rounded-md">
              <p className="font-mono">Profit Margin = (Profit / Selling Price) × 100%</p>
            </div>
            <p className="text-sm">
              Profit margin is calculated relative to the selling price. It tells you what percentage of your revenue is
              profit.
            </p>
            <p className="text-sm">
              <strong>Example:</strong> If you sell an item for $150 that cost you $100, your profit is $50, and your
              profit margin is 33.33%.
            </p>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
