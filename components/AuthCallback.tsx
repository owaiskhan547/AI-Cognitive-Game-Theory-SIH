import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export function AuthCallback() {
  const navigate = useNavigate()
  const { user, role, loading } = useAuth()

  useEffect(() => {
    if (loading) return

    if (user) {
      const pendingRole = typeof window !== "undefined" ? localStorage.getItem("smriti_pending_oauth_role") : null
      const targetRole = role || pendingRole || "patient"

      if (targetRole === "caregiver") {
        navigate("/caregiver/dashboard", { replace: true })
      } else {
        navigate("/patient/dashboard", { replace: true })
      }
    } else {
      navigate("/login", { replace: true })
    }
  }, [user, role, loading, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-base font-medium text-foreground">Completing sign in...</p>
        <p className="text-xs text-muted-foreground">Redirecting you to your dashboard</p>
      </div>
    </div>
  )
}
