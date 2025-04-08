"use client"

import { MoonIcon, SunIcon, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const isMobile = useMobile()
  const [open, setOpen] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center">
          {isMobile && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <div className="py-4">
                  <h2 className="text-lg font-semibold mb-2">Tools</h2>
                  <nav className="flex flex-col space-y-1">
                    <Link
                      href="/tools/formatters/json"
                      className="px-2 py-1 hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      JSON Formatter
                    </Link>
                    <Link
                      href="/tools/formatters/html"
                      className="px-2 py-1 hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      HTML Formatter
                    </Link>
                    <Link href="/tools/text-diff" className="px-2 py-1 hover:underline" onClick={() => setOpen(false)}>
                      Text Diff Checker
                    </Link>
                    <Link href="/tools/base64" className="px-2 py-1 hover:underline" onClick={() => setOpen(false)}>
                      Base64 Encoder/Decoder
                    </Link>
                    <Link
                      href="/tools/converters/csv-to-json"
                      className="px-2 py-1 hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      CSV to JSON
                    </Link>
                    <Link
                      href="/tools/design/color-converter"
                      className="px-2 py-1 hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      Color Converter
                    </Link>
                    <Link
                      href="/tools/generators/uuid"
                      className="px-2 py-1 hover:underline"
                      onClick={() => setOpen(false)}
                    >
                      UUID Generator
                    </Link>
                  </nav>

                  <h2 className="text-lg font-semibold mt-6 mb-2">Pages</h2>
                  <nav className="flex flex-col space-y-1">
                    <Link href="/about" className="px-2 py-1 hover:underline" onClick={() => setOpen(false)}>
                      About Us
                    </Link>
                    <Link href="/contact" className="px-2 py-1 hover:underline" onClick={() => setOpen(false)}>
                      Contact Us
                    </Link>
                    <Link href="/privacy-policy" className="px-2 py-1 hover:underline" onClick={() => setOpen(false)}>
                      Privacy Policy
                    </Link>
                    <Link href="/terms-of-service" className="px-2 py-1 hover:underline" onClick={() => setOpen(false)}>
                      Terms of Service
                    </Link>
                    <Link href="/disclaimer" className="px-2 py-1 hover:underline" onClick={() => setOpen(false)}>
                      Disclaimer
                    </Link>
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">DevTools</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex space-x-4">
            <Link href="/tools/formatters/json" className="text-sm font-medium hover:text-primary">
              Formatters
            </Link>
            <Link href="/tools/text-diff" className="text-sm font-medium hover:text-primary">
              Text Diff
            </Link>
            <Link href="/tools/base64" className="text-sm font-medium hover:text-primary">
              Base64
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary">
              Contact
            </Link>
          </nav>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" id="theme-toggle">
                <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
