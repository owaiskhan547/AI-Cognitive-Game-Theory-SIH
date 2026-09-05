import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/types/database.types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading session...</p>
        </div>
      </div>
    )
  }

  // Not authenticated -> redirect to login with redirect path
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Mismatched role -> redirect to appropriate dashboard
  if (requiredRole && role && role !== requiredRole) {
    const targetDashboard = role === 'patient' ? '/patient/dashboard' : '/caregiver/dashboard'
    return <Navigate to={targetDashboard} replace />
  }

  return <>{children}</>
}
