"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { dashboardConfig } from "@/config/dashboard"

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-gray-50/50 dark:bg-zinc-900/50 md:block flex-col p-6 w-60">
      <nav className="flex flex-col space-y-1">
        {dashboardConfig.sidebarNav.map((section, sectionIndex) => (
          <div key={sectionIndex} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground px-2">{section.title}</h3>
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
        ))}
      </nav>
    </div>
  )
}
