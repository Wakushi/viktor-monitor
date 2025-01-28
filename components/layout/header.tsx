"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Bot, LineChart } from "lucide-react"

export default function Header() {
  const pathname = usePathname()

  const links = [
    {
      href: "/",
      label: "Live Analysis",
      icon: Bot,
    },
    {
      href: "/performance",
      label: "Performance History",
      icon: LineChart,
    },
  ]

  return (
    <header className="sticky px-4 top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="h-6 w-6" />
            <span className="font-bold">Viktor ASW</span>
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center space-x-2 transition-colors hover:text-foreground/80",
                pathname === href ? "text-foreground" : "text-foreground/60"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
