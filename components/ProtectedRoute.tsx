import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { UserRole } from '@/types/database.types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: UserRole
}

function dashboardPath(role: UserRole) {
  return role === 'caregiver' ? '/caregiver/dashboard' : '/patient/dashboard'
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth()
  const location = useLocation()

  if (loading || (user && !role)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (requiredRole && role && role !== requiredRole) {
    return <Navigate to={dashboardPath(role)} replace />
  }

  return <>{children}</>
}
