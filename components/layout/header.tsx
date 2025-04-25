"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Bot, ChartBarIncreasing, EclipseIcon, Shield } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  const links = [
    {
      href: "/",
      label: "Analysis",
      icon: ChartBarIncreasing,
    },
    {
      href: "/confidence",
      label: "Confidence",
      icon: EclipseIcon,
    },
    {
      href: "/login",
      label: "Login",
      icon: Shield,
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <span className="font-bold hidden sm:inline">Viktor ASW</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-1 sm:space-x-6 text-sm font-medium">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center space-x-1 sm:space-x-2 px-2 py-1 rounded-md transition-colors hover:text-foreground hover:bg-muted",
                  isActive
                    ? "text-foreground bg-muted font-semibold"
                    : "text-foreground/60"
                )}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
