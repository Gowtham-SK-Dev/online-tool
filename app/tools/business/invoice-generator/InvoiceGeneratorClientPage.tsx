"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import AdBanner from "@/components/ad-banner"
import FAQSection from "@/components/faq-section"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Download, FileText, Printer } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface InvoiceDetails {
  invoiceNumber: string
  invoiceDate: string
  dueDate: string
  taxRate: number
  currency: string
  notes: string
}

interface BusinessDetails {
  name: string
  address: string
  phone: string
  email: string
  website: string
}

interface ClientDetails {
  name: string
  address: string
  email: string
  phone: string
}

export default function InvoiceGeneratorClientPage() {
  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: "1",
      description: "",
      quantity: 1,
      rate: 0,
      amount: 0,
    },
  ])

  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails>({
    invoiceNumber: `INV-${Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0")}`,
    invoiceDate: format(new Date(), "yyyy-MM-dd"),
    dueDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), "yyyy-MM-dd"),
    taxRate: 18,
    currency: "USD",
    notes: "Thank you for your business!",
  })

  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    name: "Your Business Name",
    address: "123 Business Street, City, Country",
    phone: "+1 234 567 890",
    email: "business@example.com",
    website: "www.yourbusiness.com",
  })

  const [clientDetails, setClientDetails] = useState<ClientDetails>({
    name: "Client Name",
    address: "456 Client Street, City, Country",
    email: "client@example.com",
    phone: "+1 987 654 321",
  })

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const invoiceRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }

          // Recalculate amount if quantity or rate changes
          if (field === "quantity" || field === "rate") {
            updatedItem.amount = Number(updatedItem.quantity) * Number(updatedItem.rate)
          }

          return updatedItem
        }
        return item
      }),
    )
  }

  const addItem = () => {
    setItems((prevItems) => [
      ...prevItems,
      {
        id: Date.now().toString(),
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ])
  }

  const removeItem = (id: string) => {
    if (items.length <= 1) {
      toast({
        title: "Cannot remove item",
        description: "Invoice must have at least one item",
        variant: "destructive",
      })
      return
    }

    setItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0)
  }

  const calculateTax = () => {
    return (calculateSubtotal() * invoiceDetails.taxRate) / 100
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax()
  }

  const formatCurrency = (amount: number) => {
    const currencySymbols: Record<string, string> = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      INR: "₹",
      JPY: "¥",
    }

    const symbol = currencySymbols[invoiceDetails.currency] || ""

    return `${symbol}${amount.toFixed(2)}`
  }

  const handleBusinessDetailsChange = (field: keyof BusinessDetails, value: string) => {
    setBusinessDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleClientDetailsChange = (field: keyof ClientDetails, value: string) => {
    setClientDetails((prev) => ({ ...prev, [field]: value }))
  }

  const handleInvoiceDetailsChange = (field: keyof InvoiceDetails, value: string | number) => {
    setInvoiceDetails((prev) => ({ ...prev, [field]: value }))
  }

  const generatePDF = async () => {
    try {
      const doc = new jsPDF()

      // Add business details
      doc.setFontSize(20)
      doc.text("INVOICE", 14, 22)

      doc.setFontSize(12)
      doc.text(businessDetails.name, 14, 35)
      doc.setFontSize(10)
      const businessAddressLines = businessDetails.address.split(", ")
      businessAddressLines.forEach((line, index) => {
        doc.text(line, 14, 40 + index * 5)
      })
      doc.text(`Phone: ${businessDetails.phone}`, 14, 40 + businessAddressLines.length * 5 + 5)
      doc.text(`Email: ${businessDetails.email}`, 14, 40 + businessAddressLines.length * 5 + 10)
      doc.text(`Website: ${businessDetails.website}`, 14, 40 + businessAddressLines.length * 5 + 15)

      // Add invoice details
      doc.setFontSize(10)
      doc.text(`Invoice Number: ${invoiceDetails.invoiceNumber}`, 140, 35)
      doc.text(`Invoice Date: ${invoiceDetails.invoiceDate}`, 140, 40)
      doc.text(`Due Date: ${invoiceDetails.dueDate}`, 140, 45)

      // Add client details
      doc.setFontSize(12)
      doc.text("Bill To:", 14, 80)
      doc.setFontSize(10)
      doc.text(clientDetails.name, 14, 85)
      const clientAddressLines = clientDetails.address.split(", ")
      clientAddressLines.forEach((line, index) => {
        doc.text(line, 14, 90 + index * 5)
      })
      doc.text(`Email: ${clientDetails.email}`, 14, 90 + clientAddressLines.length * 5 + 5)
      doc.text(`Phone: ${clientDetails.phone}`, 14, 90 + clientAddressLines.length * 5 + 10)

      // Add items table
      const tableY = 120

      autoTable(doc, {
        startY: tableY,
        head: [["Description", "Quantity", "Rate", "Amount"]],
        body: items.map((item) => [
          item.description || "Item description",
          item.quantity.toString(),
          formatCurrency(item.rate),
          formatCurrency(item.amount),
        ]),
        foot: [
          ["", "", "Subtotal", formatCurrency(calculateSubtotal())],
          ["", "", `Tax (${invoiceDetails.taxRate}%)`, formatCurrency(calculateTax())],
          ["", "", "Total", formatCurrency(calculateTotal())],
        ],
        theme: "grid",
        headStyles: { fillColor: [66, 139, 202] },
        footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
      })

      // Add notes
      const finalY = (doc as any).lastAutoTable.finalY + 10
      doc.text("Notes:", 14, finalY)
      doc.text(invoiceDetails.notes, 14, finalY + 5)

      // Save the PDF
      doc.save(`Invoice-${invoiceDetails.invoiceNumber}.pdf`)

      toast({
        title: "PDF Generated",
        description: "Your invoice has been generated and is ready to download",
      })
    } catch (error) {
      toast({
        title: "Error generating PDF",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      })
      console.error("Error generating PDF:", error)
    }
  }

  const printInvoice = () => {
    if (!invoiceRef.current) return

    const printWindow = window.open("", "_blank")
    if (!printWindow) {
      toast({
        title: "Error",
        description: "Could not open print window. Please check your popup settings.",
        variant: "destructive",
      })
      return
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${invoiceDetails.invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #000; background-color: #fff; }
          .invoice-container { max-width: 800px; margin: 0 auto; }
          .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .business-details, .invoice-details { margin-bottom: 20px; }
          .client-details { margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background-color: #f2f2f2; }
          .text-right { text-align: right; }
          .total-row { font-weight: bold; }
          .notes { margin-top: 30px; }
          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="header">
            <div class="business-details">
              <h1>INVOICE</h1>
              <p><strong>${businessDetails.name}</strong></p>
              <p>${businessDetails.address}</p>
              <p>Phone: ${businessDetails.phone}</p>
              <p>Email: ${businessDetails.email}</p>
              <p>Website: ${businessDetails.website}</p>
            </div>
            <div class="invoice-details">
              <p><strong>Invoice Number:</strong> ${invoiceDetails.invoiceNumber}</p>
              <p><strong>Invoice Date:</strong> ${invoiceDetails.invoiceDate}</p>
              <p><strong>Due Date:</strong> ${invoiceDetails.dueDate}</p>
            </div>
          </div>
          
          <div class="client-details">
            <h3>Bill To:</h3>
            <p><strong>${clientDetails.name}</strong></p>
            <p>${clientDetails.address}</p>
            <p>Email: ${clientDetails.email}</p>
            <p>Phone: ${clientDetails.phone}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${items
                .map(
                  (item) => `
                <tr>
                  <td>${item.description || "Item description"}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.rate)}</td>
                  <td>${formatCurrency(item.amount)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2"></td>
                <td class="text-right"><strong>Subtotal:</strong></td>
                <td>${formatCurrency(calculateSubtotal())}</td>
              </tr>
              <tr>
                <td colspan="2"></td>
                <td class="text-right"><strong>Tax (${invoiceDetails.taxRate}%):</strong></td>
                <td>${formatCurrency(calculateTax())}</td>
              </tr>
              <tr class="total-row">
                <td colspan="2"></td>
                <td class="text-right"><strong>Total:</strong></td>
                <td>${formatCurrency(calculateTotal())}</td>
              </tr>
            </tfoot>
          </table>
          
          <div class="notes">
            <h3>Notes:</h3>
            <p>${invoiceDetails.notes}</p>
          </div>
        </div>
        <script>
          window.onload = function() {
            window.print();
            window.setTimeout(function() {
              window.close();
            }, 500);
          };
        </script>
      </body>
      </html>
    `

    printWindow.document.open()
    printWindow.document.write(printContent)
    printWindow.document.close()
  }

  const faqs = [
    {
      question: "How do I create an invoice?",
      answer:
        "Fill in your business details, client information, and add items with descriptions, quantities, and rates. Set the tax rate if applicable, add any notes, and then generate a PDF or print the invoice.",
    },
    {
      question: "Can I customize the tax rate?",
      answer:
        "Yes, you can set any tax rate percentage in the invoice details section. The tax amount will be automatically calculated based on the subtotal and the specified rate.",
    },
    {
      question: "How do I add or remove items from the invoice?",
      answer:
        "Click the 'Add Item' button to add a new row to the invoice. To remove an item, click the trash icon next to the item you want to remove. Note that invoices must have at least one item.",
    },
    {
      question: "Can I save my invoice for later editing?",
      answer:
        "Currently, the tool doesn't support saving invoices for later editing. However, you can generate a PDF and keep it for your records. For frequent invoicing, consider using the same client and business details to save time.",
    },
    {
      question: "Is my invoice data secure?",
      answer:
        "Yes, all processing happens directly in your browser. Your invoice data is never sent to our servers, ensuring complete privacy and security.",
    },
  ]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Invoice Generator</h1>
        <p className="mt-2 text-muted-foreground">Create professional invoices for your clients</p>
      </div>

      <div className="text-center mb-6">
        <AdBanner format="horizontal" slot="invoice-generator-top" />
        <p className="text-xs text-muted-foreground mt-1">Advertisement</p>
      </div>

      <div className="flex justify-center mt-6 mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setActiveTab("edit")}
            className={`px-4 py-2 text-sm font-medium rounded-l-md ${
              activeTab === "edit"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            Edit Invoice
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-4 py-2 text-sm font-medium rounded-r-md ${
              activeTab === "preview"
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            Preview Invoice
          </button>
        </div>
      </div>

      {activeTab === "edit" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Business Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="business-name">Business Name</Label>
                  <Input
                    id="business-name"
                    value={businessDetails.name}
                    onChange={(e) => handleBusinessDetailsChange("name", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="business-address">Business Address</Label>
                  <Textarea
                    id="business-address"
                    value={businessDetails.address}
                    onChange={(e) => handleBusinessDetailsChange("address", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="business-phone">Phone</Label>
                    <Input
                      id="business-phone"
                      value={businessDetails.phone}
                      onChange={(e) => handleBusinessDetailsChange("phone", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="business-email">Email</Label>
                    <Input
                      id="business-email"
                      type="email"
                      value={businessDetails.email}
                      onChange={(e) => handleBusinessDetailsChange("email", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="business-website">Website</Label>
                  <Input
                    id="business-website"
                    value={businessDetails.website}
                    onChange={(e) => handleBusinessDetailsChange("website", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Client Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="client-name">Client Name</Label>
                  <Input
                    id="client-name"
                    value={clientDetails.name}
                    onChange={(e) => handleClientDetailsChange("name", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="client-address">Client Address</Label>
                  <Textarea
                    id="client-address"
                    value={clientDetails.address}
                    onChange={(e) => handleClientDetailsChange("address", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="client-email">Email</Label>
                    <Input
                      id="client-email"
                      type="email"
                      value={clientDetails.email}
                      onChange={(e) => handleClientDetailsChange("email", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="client-phone">Phone</Label>
                    <Input
                      id="client-phone"
                      value={clientDetails.phone}
                      onChange={(e) => handleClientDetailsChange("phone", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Invoice Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <Label htmlFor="invoice-number">Invoice Number</Label>
                  <Input
                    id="invoice-number"
                    value={invoiceDetails.invoiceNumber}
                    onChange={(e) => handleInvoiceDetailsChange("invoiceNumber", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="invoice-date">Invoice Date</Label>
                  <Input
                    id="invoice-date"
                    type="date"
                    value={invoiceDetails.invoiceDate}
                    onChange={(e) => handleInvoiceDetailsChange("invoiceDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="due-date">Due Date</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={invoiceDetails.dueDate}
                    onChange={(e) => handleInvoiceDetailsChange("dueDate", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                  <Input
                    id="tax-rate"
                    type="number"
                    min="0"
                    max="100"
                    value={invoiceDetails.taxRate}
                    onChange={(e) => handleInvoiceDetailsChange("taxRate", Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={invoiceDetails.currency}
                    onValueChange={(value) => handleInvoiceDetailsChange("currency", value)}
                  >
                    <SelectTrigger id="currency" className="mt-1">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                      <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-6">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={invoiceDetails.notes}
                  onChange={(e) => handleInvoiceDetailsChange("notes", e.target.value)}
                  className="mt-1"
                  placeholder="Payment terms, thank you note, etc."
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Invoice Items</h2>
                <Button variant="outline" size="sm" onClick={addItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-1 font-medium">Description</th>
                      <th className="text-left py-2 px-1 font-medium">Quantity</th>
                      <th className="text-left py-2 px-1 font-medium">Rate</th>
                      <th className="text-left py-2 px-1 font-medium">Amount</th>
                      <th className="py-2 px-1 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="py-2 px-1">
                          <Input
                            value={item.description}
                            onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                            placeholder="Item description"
                          />
                        </td>
                        <td className="py-2 px-1">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, "quantity", Number(e.target.value))}
                          />
                        </td>
                        <td className="py-2 px-1">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.rate}
                            onChange={(e) => handleItemChange(item.id, "rate", Number(e.target.value))}
                          />
                        </td>
                        <td className="py-2 px-1">
                          <Input value={formatCurrency(item.amount)} disabled />
                        </td>
                        <td className="py-2 px-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                            disabled={items.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-b">
                      <td colSpan={2}></td>
                      <td className="py-2 px-1 text-right font-medium">Subtotal:</td>
                      <td className="py-2 px-1">
                        <Input value={formatCurrency(calculateSubtotal())} disabled />
                      </td>
                      <td></td>
                    </tr>
                    <tr className="border-b">
                      <td colSpan={2}></td>
                      <td className="py-2 px-1 text-right font-medium">Tax ({invoiceDetails.taxRate}%):</td>
                      <td className="py-2 px-1">
                        <Input value={formatCurrency(calculateTax())} disabled />
                      </td>
                      <td></td>
                    </tr>
                    <tr>
                      <td colSpan={2}></td>
                      <td className="py-2 px-1 text-right font-medium">Total:</td>
                      <td className="py-2 px-1">
                        <Input value={formatCurrency(calculateTotal())} disabled className="font-bold" />
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-end gap-2 mb-4">
              <Button variant="outline" onClick={printInvoice}>
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button onClick={generatePDF}>
                <FileText className="h-4 w-4 mr-2" />
                Generate PDF
              </Button>
            </div>

            <div ref={invoiceRef} className="border rounded-md p-8 bg-white text-black dark:bg-white">
              <div className="flex flex-col md:flex-row justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold mb-2 text-black">INVOICE</h1>
                  <div className="text-sm text-black">
                    <p className="font-semibold">{businessDetails.name}</p>
                    <p>{businessDetails.address}</p>
                    <p>Phone: {businessDetails.phone}</p>
                    <p>Email: {businessDetails.email}</p>
                    <p>Website: {businessDetails.website}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-black">
                    <p>
                      <span className="font-semibold">Invoice Number:</span> {invoiceDetails.invoiceNumber}
                    </p>
                    <p>
                      <span className="font-semibold">Invoice Date:</span> {invoiceDetails.invoiceDate}
                    </p>
                    <p>
                      <span className="font-semibold">Due Date:</span> {invoiceDetails.dueDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2 text-black">Bill To:</h2>
                <div className="text-sm text-black">
                  <p className="font-semibold">{clientDetails.name}</p>
                  <p>{clientDetails.address}</p>
                  <p>Email: {clientDetails.email}</p>
                  <p>Phone: {clientDetails.phone}</p>
                </div>
              </div>

              <div className="overflow-x-auto mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-t border-gray-300">
                      <th className="text-left py-2 px-4 font-semibold text-black bg-gray-100">Description</th>
                      <th className="text-left py-2 px-4 font-semibold text-black bg-gray-100">Quantity</th>
                      <th className="text-left py-2 px-4 font-semibold text-black bg-gray-100">Rate</th>
                      <th className="text-left py-2 px-4 font-semibold text-black bg-gray-100">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item.id} className="border-b border-gray-300">
                        <td className="py-2 px-4 text-black">{item.description || "Item description"}</td>
                        <td className="py-2 px-4 text-black">{item.quantity}</td>
                        <td className="py-2 px-4 text-black">{formatCurrency(item.rate)}</td>
                        <td className="py-2 px-4 text-black">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}></td>
                      <td className="py-2 px-4 text-right font-semibold text-black">Subtotal:</td>
                      <td className="py-2 px-4 text-black">{formatCurrency(calculateSubtotal())}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}></td>
                      <td className="py-2 px-4 text-right font-semibold text-black">
                        Tax ({invoiceDetails.taxRate}%):
                      </td>
                      <td className="py-2 px-4 text-black">{formatCurrency(calculateTax())}</td>
                    </tr>
                    <tr>
                      <td colSpan={2}></td>
                      <td className="py-2 px-4 text-right font-semibold text-black">Total:</td>
                      <td className="py-2 px-4 font-bold text-black">{formatCurrency(calculateTotal())}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-2 text-black">Notes:</h2>
                <p className="text-sm text-black">{invoiceDetails.notes}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-center mt-6 gap-4">
        <Button variant="outline" onClick={() => setActiveTab("edit")} disabled={activeTab === "edit"}>
          Edit Invoice
        </Button>
        <Button variant="outline" onClick={() => setActiveTab("preview")} disabled={activeTab === "preview"}>
          Preview Invoice
        </Button>
        <Button onClick={generatePDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <div className="text-center my-8">
        <AdBanner format="rectangle" slot="invoice-generator-middle" />
        <p className="text-xs text-muted-foreground mt-1">Advertisement</p>
      </div>

      <section className="my-8 py-6 border-t">
        <h2 className="text-2xl font-semibold mb-4">About Invoice Generator</h2>
        <div className="space-y-4 text-muted-foreground">
          <p>
            Our Invoice Generator tool helps you create professional invoices for your clients. Whether you're a
            freelancer, small business owner, or service provider, this tool makes it easy to generate, print, and
            download invoices in PDF format.
          </p>
          <p>
            Invoices are essential documents for business transactions, providing a record of sales and services
            rendered, and requesting payment from clients. A well-designed invoice helps maintain professionalism and
            ensures timely payments.
          </p>
          <p>With our tool, you can:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Create customized invoices with your business details and logo</li>
            <li>Add client information and invoice details</li>
            <li>Include multiple items with descriptions, quantities, and rates</li>
            <li>Calculate subtotals, taxes, and totals automatically</li>
            <li>Add notes and payment terms</li>
            <li>Preview the invoice before generating</li>
            <li>Download the invoice as a PDF file</li>
            <li>Print the invoice directly from your browser</li>
          </ul>
        </div>
      </section>

      <FAQSection faqs={faqs} />
    </div>
  )
}
