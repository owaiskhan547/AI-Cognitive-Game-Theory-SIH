import type { ReactNode } from "react"
import { Outlet } from "react-router-dom"
import { CalendarDays, Gamepad2, Home, Images, MessageCircle, Pill, Settings, ShieldAlert } from "lucide-react"
import { AppShell } from "@/components/app-shell/app-shell"

const navItems = [
  { name: "Home", href: "/patient/dashboard", icon: Home },
  { name: "Games", href: "/patient/games", icon: Gamepad2 },
  { name: "Schedule", href: "/patient/schedule", icon: CalendarDays },
  { name: "Medications", href: "/patient/medications", icon: Pill },
  { name: "Memories", href: "/patient/memories", icon: Images },
  { name: "AI Assistant", href: "/patient/assistant", icon: MessageCircle },
  { name: "SOS", href: "/patient/emergency", icon: ShieldAlert, destructive: true },
  { name: "Settings", href: "/patient/profile", icon: Settings },
]

export function PatientLayout({ children }: { children?: ReactNode }) {
  return (
    <AppShell items={navItems} homeHref="/patient/dashboard" profileHref="/patient/profile">
      {children || <Outlet />}
    </AppShell>
  )
}
