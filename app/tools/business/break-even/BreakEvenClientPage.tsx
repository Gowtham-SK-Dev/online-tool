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
import { Copy, Info } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"

interface BreakEvenResult {
  breakEvenUnits: number
  breakEvenRevenue: number
  contributionMargin: number
  contributionMarginRatio: number
}

export default function BreakEvenClientPage() {
  const [fixedCosts, setFixedCosts] = useState<string>("10000")
  const [variableCostPerUnit, setVariableCostPerUnit] = useState<string>("15")
  const [pricePerUnit, setPricePerUnit] = useState<string>("25")
  const [result, setResult] = useState<BreakEvenResult | null>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"calculator" | "formula">("calculator")
  const { toast } = useToast()

  useEffect(() => {
    calculateBreakEven()
  }, [fixedCosts, variableCostPerUnit, pricePerUnit])

  const calculateBreakEven = () => {
    const parsedFixedCosts = Number.parseFloat(fixedCosts)
    const parsedVariableCostPerUnit = Number.parseFloat(variableCostPerUnit)
    const parsedPricePerUnit = Number.parseFloat(pricePerUnit)

    if (
      isNaN(parsedFixedCosts) ||
      isNaN(parsedVariableCostPerUnit) ||
      isNaN(parsedPricePerUnit) ||
      parsedFixedCosts < 0 ||
      parsedVariableCostPerUnit < 0 ||
      parsedPricePerUnit <= 0
    ) {
      setResult(null)
      setChartData([])
      return
    }

    // Calculate contribution margin per unit
    const contributionMargin = parsedPricePerUnit - parsedVariableCostPerUnit

    // Check if contribution margin is zero or negative
    if (contributionMargin <= 0) {
      toast({
        title: "Warning",
        description: "Price per unit must be greater than variable cost per unit to reach break-even.",
        variant: "destructive",
      })
      setResult(null)
      setChartData([])
      return
    }

    // Calculate contribution margin ratio
    const contributionMarginRatio = contributionMargin / parsedPricePerUnit

    // Calculate break-even point in units
    const breakEvenUnits = parsedFixedCosts / contributionMargin

    // Calculate break-even point in revenue
    const breakEvenRevenue = breakEvenUnits * parsedPricePerUnit

    setResult({
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
      contributionMarginRatio,
    })

    // Generate chart data
    generateChartData(parsedFixedCosts, parsedVariableCostPerUnit, parsedPricePerUnit, breakEvenUnits)
  }

  const generateChartData = (
    fixedCosts: number,
    variableCostPerUnit: number,
    pricePerUnit: number,
    breakEvenUnits: number,
  ) => {
    const data = []
    const maxUnits = Math.ceil(breakEvenUnits * 2)
    const step = Math.max(1, Math.floor(maxUnits / 10))

    for (let units = 0; units <= maxUnits; units += step) {
      const revenue = units * pricePerUnit
      const totalVariableCosts = units * variableCostPerUnit
      const totalCosts = fixedCosts + totalVariableCosts
      const profit = revenue - totalCosts

      data.push({
        units,
        revenue,
        totalCosts,
        fixedCosts,
        profit,
      })
    }

    setChartData(data)
  }

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  const formatNumber = (number: number): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number)
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
Break-Even Analysis
Fixed Costs: ${formatCurrency(Number.parseFloat(fixedCosts))}
Variable Cost Per Unit: ${formatCurrency(Number.parseFloat(variableCostPerUnit))}
Price Per Unit: ${formatCurrency(Number.parseFloat(pricePerUnit))}
Contribution Margin Per Unit: ${formatCurrency(result.contributionMargin)}
Contribution Margin Ratio: ${formatPercentage(result.contributionMarginRatio * 100)}
Break-Even Point (Units): ${formatNumber(result.breakEvenUnits)}
Break-Even Point (Revenue): ${formatCurrency(result.breakEvenRevenue)}
    `.trim()
  }

  const faqs = [
    {
      question: "What is a break-even analysis?",
      answer:
        "Break-even analysis is a financial calculation that determines the point at which total costs equal total revenue. At this point, there is no profit or loss – the business has 'broken even.' It helps businesses understand how many units they need to sell to cover all costs.",
    },
    {
      question: "What are fixed costs?",
      answer:
        "Fixed costs are expenses that remain constant regardless of production or sales volume. Examples include rent, insurance, salaries, property taxes, interest on loans, and depreciation of assets. These costs must be paid even if no units are produced or sold.",
    },
    {
      question: "What are variable costs?",
      answer:
        "Variable costs are expenses that change in proportion to production or sales volume. Examples include raw materials, direct labor, packaging, shipping costs, sales commissions, and utilities directly tied to production. These costs increase as more units are produced or sold.",
    },
    {
      question: "What is contribution margin?",
      answer:
        "Contribution margin is the difference between the selling price per unit and the variable cost per unit. It represents the portion of each sales dollar that contributes to covering fixed costs and, once fixed costs are covered, generates profit.",
    },
    {
      question: "How can I lower my break-even point?",
      answer:
        "You can lower your break-even point by: 1) Reducing fixed costs, 2) Reducing variable costs per unit, 3) Increasing the selling price per unit, or 4) Changing your product mix to focus on items with higher contribution margins.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Break-Even Calculator</h1>
        <p className="mt-2 text-muted-foreground">Calculate how many units you need to sell to cover your costs</p>
      </div>

      <AdBanner format="horizontal" slot="break-even-top" />

      <Tabs defaultValue="calculator" onValueChange={(value) => setActiveTab(value as "calculator" | "formula")}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="formula">Formulas</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Break-Even Calculator</h2>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="fixed-costs" className="text-base">
                      Fixed Costs (Total)
                    </Label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-muted-foreground">$</span>
                      </div>
                      <Input
                        id="fixed-costs"
                        type="number"
                        min="0"
                        step="100"
                        value={fixedCosts}
                        onChange={(e) => setFixedCosts(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total fixed costs that don't change with production volume (rent, salaries, etc.)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="variable-cost" className="text-base">
                      Variable Cost Per Unit
                    </Label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-muted-foreground">$</span>
                      </div>
                      <Input
                        id="variable-cost"
                        type="number"
                        min="0"
                        step="0.01"
                        value={variableCostPerUnit}
                        onChange={(e) => setVariableCostPerUnit(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cost that changes with each unit produced (materials, direct labor, etc.)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="price-per-unit" className="text-base">
                      Price Per Unit
                    </Label>
                    <div className="relative mt-2">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-muted-foreground">$</span>
                      </div>
                      <Input
                        id="price-per-unit"
                        type="number"
                        min="0"
                        step="0.01"
                        value={pricePerUnit}
                        onChange={(e) => setPricePerUnit(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Selling price for each unit of your product or service
                    </p>
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
                    <div className="bg-muted/30 p-4 rounded-md space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Break-Even Point (Units)</p>
                        <p className="text-xl font-bold">{formatNumber(result.breakEvenUnits)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Break-Even Point (Revenue)</p>
                        <p className="text-lg font-medium">{formatCurrency(result.breakEvenRevenue)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Contribution Margin Per Unit</p>
                        <p className="font-medium">{formatCurrency(result.contributionMargin)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Contribution Margin Ratio</p>
                        <p className="font-medium">{formatPercentage(result.contributionMarginRatio * 100)}</p>
                      </div>
                    </div>

                    <div className="flex items-center p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-md text-sm">
                      <Info className="h-4 w-4 mr-2 flex-shrink-0" />
                      <p>
                        You need to sell {formatNumber(result.breakEvenUnits)} units to cover all your costs. After this
                        point, you'll start making a profit.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40 bg-muted/30 rounded-md">
                    <p className="text-muted-foreground">Enter valid values to see the calculation</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {result && chartData.length > 0 && (
              <Card className="lg:col-span-2">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Break-Even Chart</h2>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="units" label={{ value: "Units", position: "insideBottomRight", offset: -10 }} />
                        <YAxis
                          label={{ value: "Amount ($)", angle: -90, position: "insideLeft" }}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                          formatter={(value) => [`$${Number(value).toFixed(2)}`, ""]}
                          labelFormatter={(value) => `Units: ${value}`}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" activeDot={{ r: 8 }} />
                        <Line
                          type="monotone"
                          dataKey="totalCosts"
                          name="Total Costs"
                          stroke="#ef4444"
                          activeDot={{ r: 8 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="fixedCosts"
                          name="Fixed Costs"
                          stroke="#f97316"
                          strokeDasharray="5 5"
                        />
                        <Line type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeDasharray="3 3" />
                        <ReferenceLine
                          x={result.breakEvenUnits}
                          stroke="#6b7280"
                          strokeDasharray="3 3"
                          label={{
                            value: "Break-Even",
                            position: "top",
                            fill: "#6b7280",
                          }}
                        />
                        <ReferenceLine y={0} stroke="#6b7280" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    The break-even point is where the revenue line intersects with the total costs line. At this point,
                    the profit is zero.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="formula" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Break-Even Formulas</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium">Contribution Margin Per Unit</h3>
                  <div className="bg-muted/30 p-4 rounded-md mt-2">
                    <p className="font-mono">Contribution Margin = Price Per Unit - Variable Cost Per Unit</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This is the amount each unit contributes towards covering fixed costs and generating profit.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Contribution Margin Ratio</h3>
                  <div className="bg-muted/30 p-4 rounded-md mt-2">
                    <p className="font-mono">Contribution Margin Ratio = Contribution Margin / Price Per Unit</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This ratio shows what percentage of each sales dollar is available to cover fixed costs and profit.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Break-Even Point in Units</h3>
                  <div className="bg-muted/30 p-4 rounded-md mt-2">
                    <p className="font-mono">Break-Even Units = Fixed Costs / Contribution Margin Per Unit</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This is the number of units you need to sell to cover all costs (both fixed and variable).
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Break-Even Point in Revenue</h3>
                  <div className="bg-muted/30 p-4 rounded-md mt-2">
                    <p className="font-mono">Break-Even Revenue = Break-Even Units × Price Per Unit</p>
                    <p className="font-mono mt-2">OR</p>
                    <p className="font-mono">Break-Even Revenue = Fixed Costs / Contribution Margin Ratio</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This is the total revenue needed to cover all costs.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Target Profit Analysis</h3>
                  <div className="bg-muted/30 p-4 rounded-md mt-2">
                    <p className="font-mono">
                      Units for Target Profit = (Fixed Costs + Target Profit) / Contribution Margin Per Unit
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This formula helps you determine how many units you need to sell to achieve a specific profit
                    target.
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Margin of Safety</h3>
                  <div className="bg-muted/30 p-4 rounded-md mt-2">
                    <p className="font-mono">Margin of Safety = Current Sales - Break-Even Sales</p>
                    <p className="font-mono mt-2">Margin of Safety % = (Margin of Safety / Current Sales) × 100%</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This shows how much sales can drop before reaching the break-even point (i.e., before incurring
                    losses).
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AdBanner className="my-8" format="rectangle" slot="break-even-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Break-Even Analysis</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Break-even analysis is a financial calculation that determines the point at which total costs equal total
            revenue. At this point, there is no profit or loss – the business has "broken even." This analysis is
            crucial for business planning, pricing strategies, and financial decision-making.
          </p>
          <p>
            Understanding your break-even point helps you set realistic sales targets, make informed pricing decisions,
            evaluate new product viability, and assess the impact of changes in costs or prices on your business's
            profitability.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Calculate how many units you need to sell to cover all costs</li>
            <li>Determine the revenue required to break even</li>
            <li>Visualize the relationship between costs, revenue, and profit</li>
            <li>Understand your contribution margin and contribution margin ratio</li>
            <li>Make informed decisions about pricing, costs, and sales targets</li>
          </ul>
        </div>
      </section>

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">Key Components of Break-Even Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Fixed Costs</h3>
            <p className="text-sm">
              Expenses that remain constant regardless of production or sales volume. These must be paid even if no
              units are produced or sold.
            </p>
            <p className="text-sm font-medium">Examples:</p>
            <ul className="text-sm list-disc pl-5">
              <li>Rent and utilities</li>
              <li>Salaries and wages</li>
              <li>Insurance premiums</li>
              <li>Loan payments</li>
              <li>Depreciation</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Variable Costs</h3>
            <p className="text-sm">
              Expenses that change in proportion to production or sales volume. These increase as more units are
              produced or sold.
            </p>
            <p className="text-sm font-medium">Examples:</p>
            <ul className="text-sm list-disc pl-5">
              <li>Raw materials</li>
              <li>Direct labor</li>
              <li>Packaging</li>
              <li>Shipping costs</li>
              <li>Sales commissions</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Contribution Margin</h3>
            <p className="text-sm">
              The difference between the selling price per unit and the variable cost per unit. It represents the
              portion of each sales dollar that contributes to covering fixed costs and generating profit.
            </p>
            <p className="text-sm">
              A higher contribution margin means each unit sold contributes more to covering fixed costs and generating
              profit, resulting in a lower break-even point.
            </p>
          </div>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
