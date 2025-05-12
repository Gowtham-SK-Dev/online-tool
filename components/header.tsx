"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, MenuIcon, XIcon } from "lucide-react"
import { useTheme } from "next-themes"
import { useMobile } from "@/hooks/use-mobile"

export default function Header() {
  const { setTheme, theme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const isMobile = useMobile()

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Close menu when window resizes from mobile to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false)
    }
  }, [isMobile])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const mainNavItems = [
    { name: "Home", href: "/" },
    { name: "Tools", href: "#", hasDropdown: true },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ]

  const toolsDropdownItems = [
    {
      name: "Formatters",
      href: "/tools/formatters",
      items: [
        { name: "JSON Formatter", href: "/tools/formatters/json" },
        { name: "HTML Formatter", href: "/tools/formatters/html" },
      ],
    },
    {
      name: "Converters",
      items: [
        { name: "CSV to JSON", href: "/tools/converters/csv-to-json" },
        { name: "YAML to JSON", href: "/tools/converters/yaml-to-json" },
        { name: "HTML to CSV", href: "/tools/converters/html-to-csv" },
        { name: "Timestamp Converter", href: "/tools/converters/timestamp" },
        { name: "Number to Words", href: "/tools/converters/number-to-words" },
        { name: "Image to Base64", href: "/tools/converters/image-to-base64" },
        { name: "Base64 to Image", href: "/tools/converters/base64-to-image" },
      ],
    },
    {
      name: "Design",
      items: [
        { name: "Color Converter", href: "/tools/design/color-converter" },
        { name: "Color Palette", href: "/tools/design/color-palette" },
        { name: "CSS Gradient", href: "/tools/design/css-gradient" },
        { name: "Box Shadow", href: "/tools/design/box-shadow" },
        { name: "Typography Scale", href: "/tools/design/typography" },
        { name: "Favicon Generator", href: "/tools/design/favicon" },
        { name: "CSS to LESS", href: "/tools/design/css-to-less" },
        { name: "Transition Generator", href: "/tools/design/transition" },
      ],
    },
    {
      name: "Generators",
      items: [{ name: "UUID Generator", href: "/tools/generators/uuid" }],
    },
    {
      name: "Text Tools",
      items: [
        { name: "Base64 Encoder/Decoder", href: "/tools/base64" },
        { name: "Text Diff", href: "/tools/text-diff" },
        { name: "Regex Tester", href: "/tools/regex" },
      ],
    },
    {
      name: "Business",
      items: [
        { name: "Invoice Generator", href: "/tools/business/invoice-generator" },
        { name: "GST Calculator", href: "/tools/business/gst-calculator" },
        { name: "Profit Margin Calculator", href: "/tools/business/profit-margin" },
        { name: "Break-even Calculator", href: "/tools/business/break-even" },
        // { name: "Budget Planner", href: "/tools/business/budget-planner" },
      ],
    },
    {
      name: "Backend",
      items: [{ name: "API Tester", href: "/tools/backend/api-tester" }],
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">DevTools</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {mainNavItems.map((item) =>
              item.hasDropdown ? (
                <div key={item.name} className="relative group">
                  <span className="flex items-center gap-1 cursor-pointer">
                    {item.name}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="group-hover:rotate-180 transition-transform duration-200"
                    >
                      <path
                        d="M6 8.5L2 4.5H10L6 8.5Z"
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="0.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <div className="absolute left-0 top-full hidden group-hover:block bg-background border rounded-md shadow-md p-2 w-[200px] z-50">
                    <div className="grid grid-cols-1 gap-1">
                      {toolsDropdownItems.map((category) => (
                        <div key={category.name} className="group/category">
                          <Link
                            href={category.href || "#"}
                            className="block px-2 py-1.5 font-medium text-sm hover:bg-muted rounded-sm"
                          >
                            {category.name}
                          </Link>
                          <div className="absolute left-[200px] top-0 hidden group-hover/category:block bg-background border rounded-md shadow-md p-2 w-[200px]">
                            {category.items.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block px-2 py-1.5 text-sm hover:bg-muted rounded-sm"
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                  }`}
                >
                  {item.name}
                </Link>
              ),
            )}
          </nav>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center justify-between space-x-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-6">
            {theme === "dark" ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" />
          <div className="fixed inset-y-0 right-0 z-50 w-full border-l bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold text-xl">DevTools</span>
              </Link>
              <Button variant="ghost" size="icon" onClick={toggleMenu}>
                <XIcon className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            <nav className="mt-6 flex flex-col space-y-4">
              {mainNavItems.map((item) =>
                item.hasDropdown ? (
                  <div key={item.name} className="space-y-4">
                    <Link
                      href={item.href || "#"}
                      className="font-medium text-sm hover:text-foreground"
                      onClick={item.href ? toggleMenu : undefined}
                    >
                      {item.name}
                    </Link>
                    <div className="ml-4 space-y-4">
                      {toolsDropdownItems.map((category) => (
                        <div key={category.name} className="space-y-4">
                          <Link
                            href={category.href || "#"}
                            className="font-medium text-sm hover:text-foreground"
                            onClick={category.href ? toggleMenu : undefined}
                          >
                            {category.name}
                          </Link>
                          <div className="ml-4 space-y-2">
                            {category.items.map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className="block text-sm text-muted-foreground hover:text-foreground"
                                onClick={toggleMenu}
                              >
                                {subItem.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-base font-medium text-muted-foreground hover:text-foreground"
                    onClick={toggleMenu}
                  >
                    {item.name}
                  </Link>
                ),
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  )
}
