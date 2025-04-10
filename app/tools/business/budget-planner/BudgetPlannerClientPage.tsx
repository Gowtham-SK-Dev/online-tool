"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Trash2, Download, Copy, Save, Upload } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface BudgetItem {
  id: string
  name: string
  amount: number
  category: string
  type: "income" | "expense"
}

interface BudgetSummary {
  totalIncome: number
  totalExpenses: number
  balance: number
  savingsRate: number
}

const DEFAULT_INCOME_CATEGORIES = ["Salary", "Freelance", "Business", "Investments", "Rental", "Other Income"]

const DEFAULT_EXPENSE_CATEGORIES = [
  "Housing",
  "Transportation",
  "Food",
  "Utilities",
  "Insurance",
  "Healthcare",
  "Debt Payments",
  "Entertainment",
  "Personal",
  "Education",
  "Savings",
  "Other Expenses",
]

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f97316",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f59e0b",
  "#6366f1",
  "#14b8a6",
  "#d946ef",
  "#84cc16",
  "#64748b",
]

export default function BudgetPlannerClientPage() {
  const [items, setItems] = useState<BudgetItem[]>([
    { id: "1", name: "Salary", amount: 5000, category: "Salary", type: "income" },
    { id: "2", name: "Rent", amount: 1500, category: "Housing", type: "expense" },
    { id: "3", name: "Groceries", amount: 500, category: "Food", type: "expense" },
    { id: "4", name: "Utilities", amount: 200, category: "Utilities", type: "expense" },
    { id: "5", name: "Car Payment", amount: 300, category: "Transportation", type: "expense" },
    { id: "6", name: "Savings", amount: 500, category: "Savings", type: "expense" },
  ])

  const [newItem, setNewItem] = useState<Omit<BudgetItem, "id">>({
    name: "",
    amount: 0,
    category: "",
    type: "expense",
  })

  const [summary, setSummary] = useState<BudgetSummary>({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    savingsRate: 0,
  })

  const [incomeChartData, setIncomeChartData] = useState<any[]>([])
  const [expenseChartData, setExpenseChartData] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<"income" | "expenses">("expenses")
  const { toast } = useToast()

  useEffect(() => {
    calculateSummary()
    generateChartData()
  }, [items])

  const calculateSummary = () => {
    const totalIncome = items.filter((item) => item.type === "income").reduce((sum, item) => sum + item.amount, 0)

    const totalExpenses = items.filter((item) => item.type === "expense").reduce((sum, item) => sum + item.amount, 0)

    const balance = totalIncome - totalExpenses

    // Calculate savings rate (savings as percentage of income)
    const savingsAmount = items
      .filter((item) => item.type === "expense" && item.category === "Savings")
      .reduce((sum, item) => sum + item.amount, 0)

    const savingsRate = totalIncome > 0 ? (savingsAmount / totalIncome) * 100 : 0

    setSummary({
      totalIncome,
      totalExpenses,
      balance,
      savingsRate,
    })
  }

  const generateChartData = () => {
    // Generate income chart data grouped by category
    const incomeByCategory = items
      .filter((item) => item.type === "income")
      .reduce(
        (acc, item) => {
          const existingCategory = acc.find((cat) => cat.name === item.category)
          if (existingCategory) {
            existingCategory.value += item.amount
          } else {
            acc.push({ name: item.category, value: item.amount })
          }
          return acc
        },
        [] as { name: string; value: number }[],
      )

    setIncomeChartData(incomeByCategory)

    // Generate expense chart data grouped by category
    const expensesByCategory = items
      .filter((item) => item.type === "expense")
      .reduce(
        (acc, item) => {
          const existingCategory = acc.find((cat) => cat.name === item.category)
          if (existingCategory) {
            existingCategory.value += item.amount
          } else {
            acc.push({ name: item.category, value: item.amount })
          }
          return acc
        },
        [] as { name: string; value: number }[],
      )

    setExpenseChartData(expensesByCategory)
  }

  const handleAddItem = () => {
    if (!newItem.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a name for the item",
        variant: "destructive",
      })
      return
    }

    if (newItem.amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Amount must be greater than zero",
        variant: "destructive",
      })
      return
    }

    if (!newItem.category) {
      toast({
        title: "Missing category",
        description: "Please select a category",
        variant: "destructive",
      })
      return
    }

    const newItemWithId: BudgetItem = {
      ...newItem,
      id: Date.now().toString(),
    }

    setItems((prevItems) => [...prevItems, newItemWithId])

    // Reset form
    setNewItem({
      name: "",
      amount: 0,
      category: "",
      type: "expense",
    })

    toast({
      title: "Item added",
      description: `Added ${newItem.name} to your budget`,
    })
  }

  const handleRemoveItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id))

    toast({
      title: "Item removed",
      description: "The item has been removed from your budget",
    })
  }

  const handleNewItemChange = (field: keyof Omit<BudgetItem, "id">, value: string | number) => {
    setNewItem((prev) => ({ ...prev, [field]: value }))
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
    return `${percentage.toFixed(1)}%`
  }

  const saveBudget = () => {
    try {
      const budgetData = JSON.stringify(items)
      localStorage.setItem("budget-planner-data", budgetData)

      toast({
        title: "Budget saved",
        description: "Your budget has been saved to your browser's local storage",
      })
    } catch (error) {
      toast({
        title: "Error saving budget",
        description: "There was an error saving your budget",
        variant: "destructive",
      })
    }
  }

  const loadBudget = () => {
    try {
      const savedBudget = localStorage.getItem("budget-planner-data")
      if (savedBudget) {
        const parsedBudget = JSON.parse(savedBudget)
        setItems(parsedBudget)

        toast({
          title: "Budget loaded",
          description: "Your saved budget has been loaded",
        })
      } else {
        toast({
          title: "No saved budget",
          description: "There is no saved budget to load",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error loading budget",
        description: "There was an error loading your budget",
        variant: "destructive",
      })
    }
  }

  const exportBudget = () => {
    try {
      const budgetData = JSON.stringify(items, null, 2)
      const blob = new Blob([budgetData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "budget-planner.json"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Budget exported",
        description: "Your budget has been exported as a JSON file",
      })
    } catch (error) {
      toast({
        title: "Error exporting budget",
        description: "There was an error exporting your budget",
        variant: "destructive",
      })
    }
  }

  const importBudget = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const parsedBudget = JSON.parse(content)

        if (
          Array.isArray(parsedBudget) &&
          parsedBudget.every(
            (item) => "id" in item && "name" in item && "amount" in item && "category" in item && "type" in item,
          )
        ) {
          setItems(parsedBudget)

          toast({
            title: "Budget imported",
            description: "Your budget has been imported successfully",
          })
        } else {
          throw new Error("Invalid budget format")
        }
      } catch (error) {
        toast({
          title: "Error importing budget",
          description: "The selected file is not a valid budget file",
          variant: "destructive",
        })
      }
    }

    reader.readAsText(file)

    // Reset the input
    event.target.value = ""
  }

  const copyToClipboard = () => {
    const summaryText = `
Budget Summary
Total Income: ${formatCurrency(summary.totalIncome)}
Total Expenses: ${formatCurrency(summary.totalExpenses)}
Balance: ${formatCurrency(summary.balance)}
Savings Rate: ${formatPercentage(summary.savingsRate)}

Income:
${items
  .filter((item) => item.type === "income")
  .map((item) => `${item.name} (${item.category}): ${formatCurrency(item.amount)}`)
  .join("\n")}

Expenses:
${items
  .filter((item) => item.type === "expense")
  .map((item) => `${item.name} (${item.category}): ${formatCurrency(item.amount)}`)
  .join("\n")}
    `.trim()

    navigator.clipboard.writeText(summaryText)

    toast({
      title: "Copied to clipboard",
      description: "Budget summary has been copied to your clipboard",
    })
  }

  const faqs = [
    {
      question: "What is a budget planner?",
      answer:
        "A budget planner is a tool that helps you track your income and expenses, allowing you to see where your money is coming from and where it's going. It helps you make informed financial decisions, set savings goals, and ensure you're living within your means.",
    },
    {
      question: "How do I create an effective budget?",
      answer:
        "Start by listing all sources of income and all expenses. Be honest and thorough. Categorize your expenses to identify spending patterns. Set realistic goals for saving and debt reduction. Review and adjust your budget regularly as your financial situation changes.",
    },
    {
      question: "What is a good savings rate?",
      answer:
        "Financial experts often recommend saving at least 20% of your income, but the ideal savings rate depends on your personal goals and circumstances. If you're just starting, even 5-10% is a good beginning. As your income increases or debts decrease, try to increase your savings rate.",
    },
    {
      question: "How can I reduce my expenses?",
      answer:
        "Review your budget to identify non-essential spending. Look for subscriptions you rarely use, dining out expenses that could be reduced, or shopping habits that could be modified. Consider negotiating bills like insurance, phone, or internet. Small changes across multiple categories can add up to significant savings.",
    },
    {
      question: "How often should I update my budget?",
      answer:
        "It's best to review your budget monthly to track your progress and make adjustments. Additionally, update your budget whenever there's a significant change in your financial situation, such as a new job, major expense, or change in living situation.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Budget Planner</h1>
        <p className="mt-2 text-muted-foreground">Track your income and expenses to manage your finances better</p>
      </div>

      <AdBanner format="horizontal" slot="budget-planner-top" />

      <div className="flex justify-end gap-2 mt-6">
        <input type="file" id="import-budget" className="hidden" accept=".json" onChange={importBudget} />
        <Button variant="outline" size="sm" onClick={() => document.getElementById("import-budget")?.click()}>
          <Upload className="h-4 w-4 mr-2" />
          Import
        </Button>
        <Button variant="outline" size="sm" onClick={exportBudget}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline" size="sm" onClick={saveBudget}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={loadBudget}>
          <Upload className="h-4 w-4 mr-2" />
          Load
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Add New Item</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="item-name">Item Name</Label>
                  <Input
                    id="item-name"
                    value={newItem.name}
                    onChange={(e) => handleNewItemChange("name", e.target.value)}
                    placeholder="e.g., Salary, Rent, Groceries"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="item-amount">Amount</Label>
                  <div className="relative mt-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <span className="text-muted-foreground">$</span>
                    </div>
                    <Input
                      id="item-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={newItem.amount || ""}
                      onChange={(e) => handleNewItemChange("amount", Number.parseFloat(e.target.value) || 0)}
                      className="pl-8"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="item-type">Type</Label>
                  <Select
                    value={newItem.type}
                    onValueChange={(value) => handleNewItemChange("type", value as "income" | "expense")}
                  >
                    <SelectTrigger id="item-type" className="mt-1">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="item-category">Category</Label>
                  <Select value={newItem.category} onValueChange={(value) => handleNewItemChange("category", value)}>
                    <SelectTrigger id="item-category" className="mt-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {newItem.type === "income"
                        ? DEFAULT_INCOME_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))
                        : DEFAULT_EXPENSE_CATEGORIES.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleAddItem} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Budget Summary</h2>
                <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Total Income</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(summary.totalIncome)}
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Total Expenses</p>
                  <p className="text-xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(summary.totalExpenses)}
                  </p>
                </div>

                <div
                  className={`${
                    summary.balance >= 0 ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
                  } p-4 rounded-md`}
                >
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p
                    className={`text-xl font-bold ${
                      summary.balance >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {formatCurrency(summary.balance)}
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md">
                  <p className="text-sm text-muted-foreground">Savings Rate</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {formatPercentage(summary.savingsRate)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="p-6">
              <Tabs defaultValue="expenses" onValueChange={(value) => setActiveTab(value as "income" | "expenses")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="income">
                    Income ({items.filter((item) => item.type === "income").length})
                  </TabsTrigger>
                  <TabsTrigger value="expenses">
                    Expenses ({items.filter((item) => item.type === "expense").length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="income" className="mt-4">
                  {items.filter((item) => item.type === "income").length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-1 font-medium">Name</th>
                            <th className="text-left py-2 px-1 font-medium">Category</th>
                            <th className="text-right py-2 px-1 font-medium">Amount</th>
                            <th className="py-2 px-1 w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {items
                            .filter((item) => item.type === "income")
                            .map((item) => (
                              <tr key={item.id} className="border-b">
                                <td className="py-2 px-1">{item.name}</td>
                                <td className="py-2 px-1">{item.category}</td>
                                <td className="py-2 px-1 text-right">{formatCurrency(item.amount)}</td>
                                <td className="py-2 px-1">
                                  <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={2} className="py-2 px-1 text-right font-medium">
                              Total Income:
                            </td>
                            <td className="py-2 px-1 text-right font-bold">{formatCurrency(summary.totalIncome)}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No income items added yet.</p>
                      <p className="text-sm mt-1">Add your sources of income to get started.</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="expenses" className="mt-4">
                  {items.filter((item) => item.type === "expense").length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-1 font-medium">Name</th>
                            <th className="text-left py-2 px-1 font-medium">Category</th>
                            <th className="text-right py-2 px-1 font-medium">Amount</th>
                            <th className="py-2 px-1 w-10"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {items
                            .filter((item) => item.type === "expense")
                            .map((item) => (
                              <tr key={item.id} className="border-b">
                                <td className="py-2 px-1">{item.name}</td>
                                <td className="py-2 px-1">{item.category}</td>
                                <td className="py-2 px-1 text-right">{formatCurrency(item.amount)}</td>
                                <td className="py-2 px-1">
                                  <Button variant="ghost" size="icon" onClick={() => handleRemoveItem(item.id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={2} className="py-2 px-1 text-right font-medium">
                              Total Expenses:
                            </td>
                            <td className="py-2 px-1 text-right font-bold">{formatCurrency(summary.totalExpenses)}</td>
                            <td></td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No expense items added yet.</p>
                      <p className="text-sm mt-1">Add your expenses to get started.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Expense Breakdown</h2>

              {expenseChartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={expenseChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {expenseChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 bg-muted/30 rounded-md">
                  <p className="text-muted-foreground">Add expenses to see the breakdown</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Income Breakdown</h2>

              {incomeChartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={incomeChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {incomeChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="flex items-center justify-center h-80 bg-muted/30 rounded-md">
                  <p className="text-muted-foreground">Add income sources to see the breakdown</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Budget Tips</h2>

              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <span className="font-medium text-foreground">50/30/20 Rule:</span> Allocate 50% of your income to
                  needs, 30% to wants, and 20% to savings and debt repayment.
                </li>
                <li>
                  <span className="font-medium text-foreground">Emergency Fund:</span> Aim to save 3-6 months of
                  expenses for emergencies.
                </li>
                <li>
                  <span className="font-medium text-foreground">Pay Yourself First:</span> Set aside savings as soon as
                  you receive income, before paying other expenses.
                </li>
                <li>
                  <span className="font-medium text-foreground">Track Spending:</span> Regularly review your expenses to
                  identify areas where you can cut back.
                </li>
                <li>
                  <span className="font-medium text-foreground">Automate Savings:</span> Set up automatic transfers to
                  your savings account on payday.
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <AdBanner className="my-8" format="rectangle" slot="budget-planner-middle" />

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Budget Planner</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our Budget Planner tool helps you track your income and expenses to better manage your finances. Creating
            and following a budget is one of the most effective ways to take control of your financial life, reduce
            stress, and achieve your financial goals.
          </p>
          <p>
            A well-planned budget allows you to see exactly where your money is going, identify areas where you can cut
            back, and ensure you're saving enough for future goals and emergencies.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Add and categorize your income sources and expenses</li>
            <li>Visualize your spending patterns with interactive charts</li>
            <li>Calculate your total income, expenses, and balance</li>
            <li>Track your savings rate</li>
            <li>Save, load, export, and import your budget data</li>
            <li>Get a comprehensive overview of your financial situation</li>
          </ul>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
