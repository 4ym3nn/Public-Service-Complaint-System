"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

export function DashboardNav() {
  const pathname = usePathname()
  const { user } = useAuth()

  const navItems = [
    {
      href: "/dashboard",
      label: "My Complaints",
      roles: ["citizen"],
    },
    {
      href: "/admin",
      label: "All Complaints",
      roles: ["officer", "admin"],
    },
    {
      href: "/analytics",
      label: "Analytics",
      roles: ["officer", "admin"],
    },
  ]

  const visibleItems = navItems.filter((item) => user && item.roles.includes(user.role))

  if (visibleItems.length <= 1) return null

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8">
          {visibleItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "py-4 px-1 border-b-2 font-medium text-sm transition-colors",
                pathname === item.href
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
