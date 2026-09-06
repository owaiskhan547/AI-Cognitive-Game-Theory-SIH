import type { ReactNode } from "react"
import { Outlet } from "react-router-dom"
import { Bell, FileText, LayoutDashboard, Sparkles, TrendingUp } from "lucide-react"
import { AppShell } from "@/components/app-shell/app-shell"
import { CaregiverPatientsProvider } from "@/features/caregiver/context"

const navItems = [
  { name: "Home", href: "/caregiver/dashboard", icon: LayoutDashboard },
  { name: "Insights", href: "/caregiver/insights", icon: Sparkles },
  { name: "Progress", href: "/caregiver/progress", icon: TrendingUp },
  { name: "Reminders", href: "/caregiver/reminders", icon: Bell },
  { name: "Reports", href: "/caregiver/reports", icon: FileText },
]

export function CaregiverLayout({ children }: { children?: ReactNode }) {
  return (
    <CaregiverPatientsProvider>
      <AppShell items={navItems} homeHref="/caregiver/dashboard" profileHref="/caregiver/dashboard">
        {children || <Outlet />}
      </AppShell>
    </CaregiverPatientsProvider>
  )
}
