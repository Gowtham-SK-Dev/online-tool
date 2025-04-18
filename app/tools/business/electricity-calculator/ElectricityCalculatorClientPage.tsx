"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Zap } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Define the structure for region slab rates
interface SlabRate {
  min: number
  max: number | null
  rate: number
  description: string
}

interface Region {
  id: string
  name: string
  slabs: SlabRate[]
  fixedCharges: number
  surcharges?: {
    name: string
    value: number
    type: "fixed" | "percentage"
  }[]
}

// Define regions with their slab rates
const regions: Region[] = [
  {
    id: "tamil-nadu",
    name: "Tamil Nadu",
    slabs: [
      { min: 0, max: 100, rate: 0, description: "0-100 units" },
      { min: 101, max: 200, rate: 1.5, description: "101-200 units" },
      { min: 201, max: 500, rate: 3, description: "201-500 units" },
      { min: 501, max: null, rate: 5, description: "501+ units" },
    ],
    fixedCharges: 50,
    surcharges: [{ name: "Fuel Adjustment Charge", value: 0.1, type: "percentage" }],
  },
  {
    id: "karnataka",
    name: "Karnataka",
    slabs: [
      { min: 0, max: 50, rate: 1, description: "0-50 units" },
      { min: 51, max: 100, rate: 2, description: "51-100 units" },
      { min: 101, max: 250, rate: 3.5, description: "101-250 units" },
      { min: 251, max: null, rate: 6, description: "251+ units" },
    ],
    fixedCharges: 60,
    surcharges: [{ name: "Electricity Tax", value: 0.08, type: "percentage" }],
  },
  {
    id: "maharashtra",
    name: "Maharashtra",
    slabs: [
      { min: 0, max: 100, rate: 1.2, description: "0-100 units" },
      { min: 101, max: 300, rate: 2.5, description: "101-300 units" },
      { min: 301, max: 500, rate: 4, description: "301-500 units" },
      { min: 501, max: null, rate: 6.5, description: "501+ units" },
    ],
    fixedCharges: 80,
    surcharges: [
      { name: "Wheeling Charge", value: 25, type: "fixed" },
      { name: "Regulatory Asset Charge", value: 0.05, type: "percentage" },
    ],
  },
  {
    id: "delhi",
    name: "Delhi",
    slabs: [
      { min: 0, max: 200, rate: 2, description: "0-200 units" },
      { min: 201, max: 400, rate: 4.5, description: "201-400 units" },
      { min: 401, max: 800, rate: 6, description: "401-800 units" },
      { min: 801, max: 1200, rate: 7, description: "801-1200 units" },
      { min: 1201, max: null, rate: 8, description: "1201+ units" },
    ],
    fixedCharges: 100,
    surcharges: [
      { name: "Fixed Tax", value: 20, type: "fixed" },
      { name: "Pension Trust Surcharge", value: 0.05, type: "percentage" },
    ],
  },
  {
    id: "gujarat",
    name: "Gujarat",
    slabs: [
      { min: 0, max: 50, rate: 1.5, description: "0-50 units" },
      { min: 51, max: 150, rate: 3, description: "51-150 units" },
      { min: 151, max: 300, rate: 4.1, description: "151-300 units" },
      { min: 301, max: null, rate: 5.2, description: "301+ units" },
    ],
    fixedCharges: 70,
    surcharges: [{ name: "Fuel Price and Power Purchase Adjustment", value: 0.12, type: "percentage" }],
  },
  // Adding more regions
  {
    id: "kerala",
    name: "Kerala",
    slabs: [
      { min: 0, max: 50, rate: 1.9, description: "0-50 units" },
      { min: 51, max: 100, rate: 3.0, description: "51-100 units" },
      { min: 101, max: 150, rate: 4.1, description: "101-150 units" },
      { min: 151, max: 200, rate: 5.8, description: "151-200 units" },
      { min: 201, max: 250, rate: 7.0, description: "201-250 units" },
      { min: 251, max: null, rate: 8.5, description: "251+ units" },
    ],
    fixedCharges: 65,
    surcharges: [
      { name: "Fuel Surcharge", value: 0.15, type: "percentage" },
      { name: "Duty", value: 10, type: "fixed" },
    ],
  },
  {
    id: "andhra-pradesh",
    name: "Andhra Pradesh",
    slabs: [
      { min: 0, max: 50, rate: 1.45, description: "0-50 units" },
      { min: 51, max: 100, rate: 2.6, description: "51-100 units" },
      { min: 101, max: 200, rate: 3.6, description: "101-200 units" },
      { min: 201, max: 300, rate: 6.7, description: "201-300 units" },
      { min: 301, max: 500, rate: 7.2, description: "301-500 units" },
      { min: 501, max: null, rate: 8.5, description: "501+ units" },
    ],
    fixedCharges: 55,
    surcharges: [
      { name: "Fuel Adjustment Cost", value: 0.12, type: "percentage" },
      { name: "Customer Charge", value: 15, type: "fixed" },
    ],
  },
  {
    id: "goa",
    name: "Goa",
    slabs: [
      { min: 0, max: 100, rate: 1.4, description: "0-100 units" },
      { min: 101, max: 200, rate: 2.1, description: "101-200 units" },
      { min: 201, max: 300, rate: 2.8, description: "201-300 units" },
      { min: 301, max: 400, rate: 3.5, description: "301-400 units" },
      { min: 401, max: null, rate: 4.2, description: "401+ units" },
    ],
    fixedCharges: 40,
    surcharges: [{ name: "Electricity Duty", value: 0.08, type: "percentage" }],
  },
  {
    id: "pondicherry",
    name: "Puducherry",
    slabs: [
      { min: 0, max: 100, rate: 0, description: "0-100 units" },
      { min: 101, max: 200, rate: 1.0, description: "101-200 units" },
      { min: 201, max: 300, rate: 2.0, description: "201-300 units" },
      { min: 301, max: null, rate: 4.0, description: "301+ units" },
    ],
    fixedCharges: 30,
    surcharges: [{ name: "Electricity Tax", value: 0.05, type: "percentage" }],
  },
  {
    id: "madhya-pradesh",
    name: "Madhya Pradesh",
    slabs: [
      { min: 0, max: 50, rate: 2.0, description: "0-50 units" },
      { min: 51, max: 150, rate: 3.2, description: "51-150 units" },
      { min: 151, max: 300, rate: 4.3, description: "151-300 units" },
      { min: 301, max: 500, rate: 5.5, description: "301-500 units" },
      { min: 501, max: null, rate: 6.5, description: "501+ units" },
    ],
    fixedCharges: 75,
    surcharges: [
      { name: "Electricity Duty", value: 0.09, type: "percentage" },
      { name: "Regulatory Charge", value: 5, type: "fixed" },
    ],
  },
  {
    id: "uttar-pradesh",
    name: "Uttar Pradesh",
    slabs: [
      { min: 0, max: 150, rate: 3.0, description: "0-150 units" },
      { min: 151, max: 300, rate: 4.5, description: "151-300 units" },
      { min: 301, max: 500, rate: 5.5, description: "301-500 units" },
      { min: 501, max: null, rate: 6.5, description: "501+ units" },
    ],
    fixedCharges: 90,
    surcharges: [
      { name: "Regulatory Surcharge", value: 0.06, type: "percentage" },
      { name: "Fixed Charge", value: 30, type: "fixed" },
    ],
  },
  {
    id: "west-bengal",
    name: "West Bengal",
    slabs: [
      { min: 0, max: 102, rate: 2.75, description: "0-102 units" },
      { min: 103, max: 180, rate: 3.25, description: "103-180 units" },
      { min: 181, max: 300, rate: 5.0, description: "181-300 units" },
      { min: 301, max: 600, rate: 5.8, description: "301-600 units" },
      { min: 601, max: 900, rate: 6.6, description: "601-900 units" },
      { min: 901, max: null, rate: 8.5, description: "901+ units" },
    ],
    fixedCharges: 45,
    surcharges: [
      { name: "Meter Rent", value: 15, type: "fixed" },
      { name: "Electricity Duty", value: 0.12, type: "percentage" },
    ],
  },
  {
    id: "telangana",
    name: "Telangana",
    slabs: [
      { min: 0, max: 50, rate: 1.45, description: "0-50 units" },
      { min: 51, max: 100, rate: 2.6, description: "51-100 units" },
      { min: 101, max: 200, rate: 3.6, description: "101-200 units" },
      { min: 201, max: 300, rate: 6.9, description: "201-300 units" },
      { min: 301, max: 400, rate: 7.2, description: "301-400 units" },
      { min: 401, max: 800, rate: 8.0, description: "401-800 units" },
      { min: 801, max: null, rate: 9.0, description: "801+ units" },
    ],
    fixedCharges: 65,
    surcharges: [
      { name: "Fuel Surcharge Adjustment", value: 0.15, type: "percentage" },
      { name: "Customer Service Charge", value: 20, type: "fixed" },
    ],
  },
  {
    id: "rajasthan",
    name: "Rajasthan",
    slabs: [
      { min: 0, max: 50, rate: 3.0, description: "0-50 units" },
      { min: 51, max: 150, rate: 4.75, description: "51-150 units" },
      { min: 151, max: 300, rate: 6.0, description: "151-300 units" },
      { min: 301, max: 500, rate: 6.5, description: "301-500 units" },
      { min: 501, max: null, rate: 7.0, description: "501+ units" },
    ],
    fixedCharges: 80,
    surcharges: [
      { name: "Fuel Surcharge", value: 0.16, type: "percentage" },
      { name: "Urban Cess", value: 10, type: "fixed" },
    ],
  },
  {
    id: "punjab",
    name: "Punjab",
    slabs: [
      { min: 0, max: 100, rate: 3.49, description: "0-100 units" },
      { min: 101, max: 300, rate: 5.84, description: "101-300 units" },
      { min: 301, max: 500, rate: 6.84, description: "301-500 units" },
      { min: 501, max: null, rate: 7.14, description: "501+ units" },
    ],
    fixedCharges: 85,
    surcharges: [
      { name: "Electricity Duty", value: 0.13, type: "percentage" },
      { name: "Infrastructure Development Cess", value: 5, type: "fixed" },
    ],
  },
  {
    id: "haryana",
    name: "Haryana",
    slabs: [
      { min: 0, max: 50, rate: 2.0, description: "0-50 units" },
      { min: 51, max: 150, rate: 2.5, description: "51-150 units" },
      { min: 151, max: 250, rate: 5.25, description: "151-250 units" },
      { min: 251, max: 500, rate: 6.3, description: "251-500 units" },
      { min: 501, max: null, rate: 7.1, description: "501+ units" },
    ],
    fixedCharges: 70,
    surcharges: [
      { name: "Fuel Surcharge Adjustment", value: 0.11, type: "percentage" },
      { name: "Municipal Tax", value: 15, type: "fixed" },
    ],
  },
  {
    id: "bihar",
    name: "Bihar",
    slabs: [
      { min: 0, max: 50, rate: 1.4, description: "0-50 units" },
      { min: 51, max: 100, rate: 1.8, description: "51-100 units" },
      { min: 101, max: 200, rate: 2.2, description: "101-200 units" },
      { min: 201, max: 300, rate: 2.8, description: "201-300 units" },
      { min: 301, max: null, rate: 3.5, description: "301+ units" },
    ],
    fixedCharges: 40,
    surcharges: [{ name: "Electricity Duty", value: 0.06, type: "percentage" }],
  },
  {
    id: "jharkhand",
    name: "Jharkhand",
    slabs: [
      { min: 0, max: 200, rate: 3.25, description: "0-200 units" },
      { min: 201, max: 400, rate: 4.75, description: "201-400 units" },
      { min: 401, max: null, rate: 5.75, description: "401+ units" },
    ],
    fixedCharges: 50,
    surcharges: [{ name: "Electricity Duty", value: 0.05, type: "percentage" }],
  },
]

interface BillBreakdown {
  slabUnits: number
  rate: number
  amount: number
  description: string
}

interface BillResult {
  totalUnits: number
  regionName: string
  breakdown: BillBreakdown[]
  fixedCharges: number
  surcharges: {
    name: string
    amount: number
  }[]
  totalAmount: number
}

export default function ElectricityCalculatorClientPage() {
  const [selectedRegion, setSelectedRegion] = useState<string>("tamil-nadu")
  const [unitsConsumed, setUnitsConsumed] = useState<string>("150")
  const [billResult, setBillResult] = useState<BillResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Calculate bill based on region and units
  const calculateBill = (regionId: string, units: string) => {
    setError(null)

    const unitsNum = Number.parseInt(units)
    if (isNaN(unitsNum) || unitsNum < 0) {
      setError("Please enter a valid positive number for units consumed")
      return
    }

    const region = regions.find((r) => r.id === regionId)
    if (!region) {
      setError("Selected region not found")
      return
    }

    let remainingUnits = unitsNum
    let totalAmount = 0
    const breakdown: BillBreakdown[] = []

    // Calculate slab-wise charges
    for (const slab of region.slabs) {
      if (remainingUnits <= 0) break

      const slabMax = slab.max === null ? Number.POSITIVE_INFINITY : slab.max
      const slabMin = slab.min
      let unitsInThisSlab = 0

      if (slabMin === 0) {
        // For the first slab that starts from 0
        unitsInThisSlab = Math.min(remainingUnits, slabMax)
      } else if (unitsNum >= slabMin) {
        // For subsequent slabs
        unitsInThisSlab = Math.min(remainingUnits, slabMax - slabMin + 1)
      }

      if (unitsInThisSlab > 0) {
        const slabAmount = unitsInThisSlab * slab.rate
        totalAmount += slabAmount
        breakdown.push({
          slabUnits: unitsInThisSlab,
          rate: slab.rate,
          amount: slabAmount,
          description: slab.description,
        })
        remainingUnits -= unitsInThisSlab
      }
    }

    // Add fixed charges
    totalAmount += region.fixedCharges

    // Calculate surcharges
    const surchargeDetails =
      region.surcharges?.map((surcharge) => {
        let surchargeAmount = 0
        if (surcharge.type === "fixed") {
          surchargeAmount = surcharge.value
        } else {
          // Percentage surcharge
          surchargeAmount = totalAmount * surcharge.value
        }
        totalAmount += surchargeAmount
        return {
          name: surcharge.name,
          amount: surchargeAmount,
        }
      }) || []

    // Set the bill result
    setBillResult({
      totalUnits: unitsNum,
      regionName: region.name,
      breakdown,
      fixedCharges: region.fixedCharges,
      surcharges: surchargeDetails,
      totalAmount,
    })
  }

  // Calculate bill whenever region or units change
  useEffect(() => {
    calculateBill(selectedRegion, unitsConsumed)
  }, [selectedRegion, unitsConsumed])

  // Handle region change
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value)
  }

  // Handle units change
  const handleUnitsChange = (value: string) => {
    setUnitsConsumed(value)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Electricity Bill Calculator</h1>
        <Zap className="h-8 w-8 text-yellow-500" />
      </div>

      <p className="text-muted-foreground mb-6">
        Calculate your electricity bill based on your region and units consumed. The calculator uses region-specific
        slab rates and includes applicable fixed charges and surcharges.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Input Details</CardTitle>
            <CardDescription>Enter your electricity consumption details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="region">Select Region/State</Label>
              <Select value={selectedRegion} onValueChange={handleRegionChange}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Select Region" />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region.id} value={region.id}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="units">Units Consumed (kWh)</Label>
              <Input
                id="units"
                type="number"
                min="0"
                value={unitsConsumed}
                onChange={(e) => handleUnitsChange(e.target.value)}
                placeholder="Enter units consumed"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bill Breakdown</CardTitle>
            <CardDescription>
              {billResult ? `${billResult.regionName} - ${billResult.totalUnits} units` : "No calculation yet"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {billResult && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Slab</TableHead>
                      <TableHead className="text-right">Units</TableHead>
                      <TableHead className="text-right">Rate (₹)</TableHead>
                      <TableHead className="text-right">Amount (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billResult.breakdown.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-right">{item.slabUnits}</TableCell>
                        <TableCell className="text-right">{item.rate.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{item.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>Fixed Charges</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">-</TableCell>
                      <TableCell className="text-right">{billResult.fixedCharges.toFixed(2)}</TableCell>
                    </TableRow>
                    {billResult.surcharges.map((surcharge, index) => (
                      <TableRow key={`surcharge-${index}`}>
                        <TableCell>{surcharge.name}</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right">-</TableCell>
                        <TableCell className="text-right">{surcharge.amount.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-between items-center pt-4 border-t">
                  <span className="text-lg font-semibold">Total Bill Amount:</span>
                  <span className="text-xl font-bold">₹{billResult.totalAmount.toFixed(2)}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Slab Rates for {regions.find((r) => r.id === selectedRegion)?.name}</CardTitle>
          <CardDescription>Reference rates used for calculation</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Slab</TableHead>
                <TableHead className="text-right">Rate (₹/unit)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {regions
                .find((r) => r.id === selectedRegion)
                ?.slabs.map((slab, index) => (
                  <TableRow key={index}>
                    <TableCell>{slab.description}</TableCell>
                    <TableCell className="text-right">{slab.rate.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
