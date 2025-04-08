"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import {
  Code,
  Palette,
  Hash,
  FileCode,
  Diff,
  FileJson,
  Table,
  Clock,
  Calculator,
  Fingerprint,
  Regex,
  Layers,
  Box,
  Type,
  Paintbrush,
  FileImage,
  FileSpreadsheet,
  FileCheck,
  Percent,
  DollarSign,
  TrendingUp,
  PieChart,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const [open, setOpen] = useState(false)

  if (isMobile) {
    return null
  }

  return (
    <div className={cn("pb-12 w-64 border-r bg-background hidden md:block", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Text & Code Utilities</h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={pathname?.startsWith("/tools/formatters") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/formatters">
                <Code className="mr-2 h-4 w-4" />
                Code Formatters
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/formatters/json") ? "secondary" : "ghost"}
              className="w-full justify-start pl-8"
            >
              <Link href="/tools/formatters/json">
                <FileJson className="mr-2 h-4 w-4" />
                JSON Formatter
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/formatters/html") ? "secondary" : "ghost"}
              className="w-full justify-start pl-8"
            >
              <Link href="/tools/formatters/html">
                <FileCode className="mr-2 h-4 w-4" />
                HTML Formatter
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/text-diff") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/text-diff">
                <Diff className="mr-2 h-4 w-4" />
                Text Diff Checker
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/base64") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/base64">
                <Hash className="mr-2 h-4 w-4" />
                Base64 Encoder/Decoder
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/generators/uuid") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/generators/uuid">
                <Fingerprint className="mr-2 h-4 w-4" />
                UUID Generator
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/regex") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/regex">
                <Regex className="mr-2 h-4 w-4" />
                Regex Tester
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Converters</h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={pathname?.startsWith("/tools/converters/csv-to-json") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/converters/csv-to-json">
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                CSV to JSON
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/converters/html-to-csv") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/converters/html-to-csv">
                <Table className="mr-2 h-4 w-4" />
                HTML Table to CSV
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/converters/yaml-to-json") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/converters/yaml-to-json">
                <Layers className="mr-2 h-4 w-4" />
                YAML to JSON
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/converters/timestamp") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/converters/timestamp">
                <Clock className="mr-2 h-4 w-4" />
                Unix Timestamp Converter
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/converters/number-to-words") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/converters/number-to-words">
                <Calculator className="mr-2 h-4 w-4" />
                Number to Words
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Design Tools</h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={pathname?.startsWith("/tools/design/color-converter") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/design/color-converter">
                <Palette className="mr-2 h-4 w-4" />
                Color Converter
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/design/color-palette") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/design/color-palette">
                <Paintbrush className="mr-2 h-4 w-4" />
                Color Palette Generator
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/design/css-gradient") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/design/css-gradient">
                <Layers className="mr-2 h-4 w-4" />
                CSS Gradient Generator
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/design/box-shadow") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/design/box-shadow">
                <Box className="mr-2 h-4 w-4" />
                Box Shadow Generator
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/design/typography") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/design/typography">
                <Type className="mr-2 h-4 w-4" />
                Typography Scale
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/design/favicon") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/design/favicon">
                <FileImage className="mr-2 h-4 w-4" />
                Favicon Generator
              </Link>
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Business Tools</h2>
          <div className="space-y-1">
            <Button
              asChild
              variant={pathname?.startsWith("/tools/business/invoice") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/business/invoice">
                <FileCheck className="mr-2 h-4 w-4" />
                Invoice Generator
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/business/gst") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/business/gst">
                <Percent className="mr-2 h-4 w-4" />
                GST Calculator
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/business/profit-margin") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/business/profit-margin">
                <DollarSign className="mr-2 h-4 w-4" />
                Profit Margin Calculator
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/business/break-even") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/business/break-even">
                <TrendingUp className="mr-2 h-4 w-4" />
                Break-Even Calculator
              </Link>
            </Button>
            <Button
              asChild
              variant={pathname?.startsWith("/tools/business/budget") ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Link href="/tools/business/budget">
                <PieChart className="mr-2 h-4 w-4" />
                Budget Planner
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
