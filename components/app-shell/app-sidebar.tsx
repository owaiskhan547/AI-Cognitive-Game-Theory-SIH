import { Link, useLocation } from "react-router-dom"
import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { SmritiLogo } from "@/components/app-shell/smriti-logo"

export type AppNavItem = {
  name: string
  href: string
  icon: LucideIcon
  destructive?: boolean
}

export function AppSidebar({
  items,
  homeHref,
  quote = "Small steps every day lead to brighter tomorrows.",
  onNavigate,
}: {
  items: AppNavItem[]
  homeHref: string
  quote?: string
  onNavigate?: () => void
}) {
  const location = useLocation()
  const pathname = location.pathname

  return (
    <aside className="flex h-full w-[260px] flex-col border-r border-white/8 bg-black px-4 py-5">
      <SmritiLogo to={homeHref} />

      <nav className="mt-8 flex flex-1 flex-col gap-1.5">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-medium transition-colors",
                item.destructive
                  ? isActive
                    ? "bg-red-600 text-white"
                    : "text-red-400 hover:bg-red-500/10"
                  : isActive
                    ? "bg-primary text-primary-foreground shadow-[0_0_24px_rgba(163,230,53,0.35)]"
                    : "text-zinc-400 hover:bg-white/5 hover:text-foreground",
              )}
            >
              <Icon className="size-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <p className="px-2 pb-2 text-center font-script text-[17px] leading-snug text-primary">
        {quote}
      </p>
    </aside>
  )
}
