import React from 'react'
import { Outlet } from 'react-router-dom'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { CaregiverSidebar } from '@/components/caregiver/caregiver-sidebar'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { CaregiverPatientsProvider } from '@/features/caregiver/context'

export function CaregiverLayout({ children }: { children?: React.ReactNode }) {
  return (
    <CaregiverPatientsProvider><SidebarProvider>
      <CaregiverSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm text-muted-foreground">Caregiver Dashboard</span>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children || <Outlet />}
        </main>
      </SidebarInset>
    </SidebarProvider></CaregiverPatientsProvider>
  )
}
