import { useState, type ReactNode } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppHeader } from "@/components/app-shell/app-header"
import { AppSidebar, type AppNavItem } from "@/components/app-shell/app-sidebar"
import { cn } from "@/lib/utils"

export function AppShell({
  items,
  homeHref,
  profileHref,
  quote,
  children,
}: {
  items: AppNavItem[]
  homeHref: string
  profileHref: string
  quote?: string
  children: ReactNode
}) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-black text-foreground">
      <div className="flex min-h-screen">
        <div className="hidden lg:block">
          <div className="sticky top-0 h-screen">
            <AppSidebar items={items} homeHref={homeHref} quote={quote} />
          </div>
        </div>

        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button type="button" className="absolute inset-0 bg-black/70" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
            <div className="relative h-full w-[260px]">
              <AppSidebar items={items} homeHref={homeHref} quote={quote} onNavigate={() => setMobileOpen(false)} />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-4 rounded-full"
                onClick={() => setMobileOpen(false)}
              >
                <X className="size-5" />
              </Button>
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <AppHeader
            profileHref={profileHref}
            extra={
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            }
          />
          <main className={cn("mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8")}>{children}</main>
        </div>
      </div>
    </div>
  )
}
