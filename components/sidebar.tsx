"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { dashboardConfig } from "@/config/dashboard"
import { ChevronDown, ChevronRight } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>([])

  const toggleSection = (title: string) => {
    if (openSections.includes(title)) {
      setOpenSections(openSections.filter((section) => section !== title))
    } else {
      setOpenSections([...openSections, title])
    }
  }

  return (
    <div className="hidden border-r bg-gray-50/50 dark:bg-zinc-900/50 md:block flex-col p-6 w-60">
      <nav className="flex flex-col space-y-1">
        {dashboardConfig.sidebarNav.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <button
              onClick={() => toggleSection(section.title)}
              className="flex items-center justify-between w-full text-sm font-medium px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground"
            >
              <span>{section.title}</span>
              {openSections.includes(section.title) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {openSections.includes(section.title) && (
              <div className="ml-4 space-y-2">
                {section.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center space-x-2 rounded-md p-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname?.startsWith(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground",
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  )
}
