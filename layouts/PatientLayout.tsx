import React from 'react'
import { Outlet } from 'react-router-dom'
import { PatientNav } from '@/components/patient/patient-nav'

export function PatientLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <PatientNav />
      <main className="pt-20 pb-24 lg:pb-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {children || <Outlet />}
      </main>
    </div>
  )
}
