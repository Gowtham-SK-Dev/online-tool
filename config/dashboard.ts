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
  Send,
  FileType,
  ContrastIcon as Transition,
  ImageIcon,
  Search,
} from "lucide-react"

export const dashboardConfig = {
  sidebarNav: [
    {
      title: "Text & Code Utilities",
      items: [
        {
          title: "Code Formatters",
          href: "/tools/formatters",
          icon: Code,
        },
        {
          title: "JSON Formatter",
          href: "/tools/formatters/json",
          icon: FileJson,
        },
        {
          title: "HTML Formatter",
          href: "/tools/formatters/html",
          icon: FileCode,
        },
        {
          title: "Text Diff Checker",
          href: "/tools/text-diff",
          icon: Diff,
        },
        {
          title: "Base64 Encoder/Decoder",
          href: "/tools/base64",
          icon: Hash,
        },
        {
          title: "UUID Generator",
          href: "/tools/generators/uuid",
          icon: Fingerprint,
        },
        {
          title: "Regex Tester",
          href: "/tools/regex",
          icon: Regex,
        },
      ],
    },
    {
      title: "Converters",
      items: [
        {
          title: "CSV to JSON",
          href: "/tools/converters/csv-to-json",
          icon: FileSpreadsheet,
        },
        {
          title: "HTML Table to CSV",
          href: "/tools/converters/html-to-csv",
          icon: Table,
        },
        {
          title: "YAML to JSON",
          href: "/tools/converters/yaml-to-json",
          icon: Layers,
        },
        {
          title: "Unix Timestamp Converter",
          href: "/tools/converters/timestamp",
          icon: Clock,
        },
        {
          title: "Number to Words",
          href: "/tools/converters/number-to-words",
          icon: Calculator,
        },
        {
          title: "Image to Base64",
          href: "/tools/converters/image-to-base64",
          icon: ImageIcon,
        },
        {
          title: "Base64 to Image",
          href: "/tools/converters/base64-to-image",
          icon: FileType,
        },
      ],
    },
    {
      title: "Design Tools",
      items: [
        {
          title: "Color Converter",
          href: "/tools/design/color-converter",
          icon: Palette,
        },
        {
          title: "Color Palette Generator",
          href: "/tools/design/color-palette",
          icon: Paintbrush,
        },
        {
          title: "CSS Gradient Generator",
          href: "/tools/design/css-gradient",
          icon: Layers,
        },
        {
          title: "Box Shadow Generator",
          href: "/tools/design/box-shadow",
          icon: Box,
        },
        {
          title: "Typography Scale",
          href: "/tools/design/typography",
          icon: Type,
        },
        {
          title: "Favicon Generator",
          href: "/tools/design/favicon",
          icon: FileImage,
        },
        {
          title: "CSS to LESS Converter",
          href: "/tools/design/css-to-less",
          icon: FileCode,
        },
        {
          title: "Transition Tools",
          href: "/tools/design/transition",
          icon: Transition,
        },
      ],
    },
    {
      title: "Business Tools",
      items: [
        {
          title: "Invoice Generator",
          href: "/tools/business/invoice",
          icon: FileCheck,
        },
        {
          title: "GST Calculator",
          href: "/tools/business/gst",
          icon: Percent,
        },
        {
          title: "Profit Margin Calculator",
          href: "/tools/business/profit-margin",
          icon: DollarSign,
        },
        {
          title: "Break-Even Calculator",
          href: "/tools/business/break-even",
          icon: TrendingUp,
        },
        {
          title: "Budget Planner",
          href: "/tools/business/budget-planner",
          icon: PieChart,
        },
      ],
    },
    {
      title: "Backend Tools",
      items: [
        {
          title: "API Tester",
          href: "/tools/backend/api-tester",
          icon: Send,
        },
      ],
    },
    {
      title: "Website Audit",
      items: [
        {
          title: "Website Audit",
          href: "/tools/audit",
          icon: Search,
        },
      ],
    },
  ],
}
