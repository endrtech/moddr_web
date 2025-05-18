"use client"

import { useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { type LucideIcon, User, CreditCard, Settings, Bell, Lock, LayoutDashboard } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  id: string
}

const items: NavItem[] = [
  /*{
    title: "Appearance",
    href: "/settings?tab=appearance",
    icon: Settings,
    id: "appearance",
  },
  {
    title: "Notifications",
    href: "/settings?tab=notifications",
    icon: Bell,
    id: "notifications",
  },*/
  {
    title: "Security",
    href: "/settings?tab=security",
    icon: Lock,
    id: "security",
  },
]

export function SettingsTabs() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tab = searchParams.get("tab") || "security"

  // Show the active tab content
  useEffect(() => {
    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        if (item.id === tab) {
          element.classList.remove("hidden")
        } else {
          element.classList.add("hidden")
        }
      }
    })
  }, [tab])

  return (
    <nav className="flex flex-col text-white space-y-1 w-full lg:w-[200px]">
      {items.map((item) => (
        <Button
          key={item.id}
          variant={item.id === tab ? "default" : "ghost"}
          className={cn("justify-start", item.id === tab && "bg-primary text-primary-foreground")}
          onClick={() => {
            router.push(`${pathname}?tab=${item.id}`)
          }}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Button>
      ))}
    </nav>
  )
}