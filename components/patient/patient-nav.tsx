import { Link, useLocation } from "react-router-dom"
import { Home, Pill, Images, Phone, Brain, User, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

export function PatientNav() {
  const location = useLocation()
  const pathname = location.pathname

  const navItems = [
    { name: "Home", href: "/patient/dashboard", icon: Home },
    { name: "Schedule", href: "/patient/schedule", icon: CalendarDays },
    { name: "Meds", href: "/patient/medications", icon: Pill },
    { name: "Memories", href: "/patient/memories", icon: Images },
    { name: "SOS", href: "/patient/emergency", icon: Phone, destructive: true },
  ]

  return (
    <>
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-background/80 backdrop-blur-xl border-b border-border z-50">
        <div className="max-w-4xl mx-auto px-4 h-full flex items-center justify-between">
          <Link to="/patient/dashboard" className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold tracking-tight text-foreground">SmritiCare</span>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary px-3 py-2 rounded-lg",
                    isActive ? "text-primary bg-primary/10" : "text-muted-foreground",
                    item.destructive && "text-red-500 hover:text-red-600 hover:bg-red-500/10"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          <Link
            to="/patient/profile"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
          >
            <User className="w-6 h-6 text-secondary-foreground" />
          </Link>
        </div>
      </header>

      {/* Bottom Nav (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-24 bg-background/80 backdrop-blur-xl border-t border-border z-50">
        <div className="max-w-4xl mx-auto px-2 h-full flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1.5 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground",
                  item.destructive && (isActive ? "text-red-500" : "text-red-400")
                )}
              >
                <item.icon className={cn("w-7 h-7", isActive && "stroke-[2.5px]")} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
