import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { Brain, User, Mail, Lock, Eye, EyeOff, Check, ShieldCheck, Heart, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/AuthContext"

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  )
}

export default function SignupPage() {
  const navigate = useNavigate()
  const { user, role: userRole, signUp, signInWithGoogle, loading } = useAuth()
  const [role, setRole] = useState<"patient" | "caregiver">("patient")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  // Auto redirect if already authenticated
  useEffect(() => {
    if (!loading && user) {
      if (userRole === "caregiver") {
        navigate("/caregiver/dashboard", { replace: true })
      } else {
        navigate("/patient/dashboard", { replace: true })
      }
    }
  }, [user, userRole, loading, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg("")

    try {
      await signUp({
        email,
        password,
        fullName: name,
        role,
      })
<<<<<<< HEAD
=======
      if (!isSupabaseConfigured) {
        navigate("/login", { replace: true })
        return
      }
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
      if (role === "patient") {
        navigate("/patient/dashboard")
      } else {
        navigate("/caregiver/dashboard")
      }
    } catch (error: any) {
      console.error("Signup failed:", error)
      setErrorMsg(error?.message || "Failed to create account. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true)
    setErrorMsg("")
    try {
      await signInWithGoogle(role)
    } catch (error: any) {
      console.error("Google sign up failed:", error)
      setErrorMsg(error?.message || "Google sign up failed. Please try again.")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#070707] text-white px-4 py-8 relative overflow-hidden">
      {/* Background Subtle Lime Glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-lime-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Dual-Panel Container */}
      <div className="w-full max-w-5xl bg-[#0f0f0f] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 lg:p-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Brand & Visual */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
            {/* Logo and Brand */}
            <div>
              <div className="w-16 h-16 rounded-full border-2 border-lime-400 bg-lime-950/40 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(163,230,53,0.3)]">
                <Brain className="w-9 h-9 text-lime-400" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Smriti<span className="text-lime-400">Care</span>
              </h1>
              <p className="text-xs text-neutral-400 mt-1 font-medium">
                Remember. Connect. Live independently.
              </p>

              {/* Heart Divider */}
              <div className="flex items-center gap-3 my-5 opacity-40">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/40" />
                <Heart className="w-3.5 h-3.5 text-lime-400 fill-lime-400/30" />
                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/40" />
              </div>

              {/* Welcome Message */}
              <div className="space-y-1.5">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  Join SmritiCare! <span className="inline-block animate-bounce">🌟</span>
                </h2>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Create an account to start personalized cognitive care and memory assistance.
                </p>
              </div>
            </div>

            {/* Couple Illustration */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black/40">
              <img
                src="/couple-illustration.jpg"
                alt="Elderly couple illustration"
                className="w-full h-48 sm:h-56 object-cover object-top opacity-90 hover:opacity-100 transition-opacity"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f0f] via-transparent to-transparent opacity-80" />
            </div>

            {/* Privacy / Security Badge */}
            <div className="bg-[#141414] border border-white/5 rounded-2xl p-4 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-lime-500/10 border border-lime-400/30 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-lime-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-lime-400">Your data is safe with us</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">We prioritize your privacy and security.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-white mb-4">I am a...</h3>

            {/* Role Selection Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Patient Card */}
              <div
                onClick={() => setRole("patient")}
                className={`relative cursor-pointer rounded-2xl p-5 text-center transition-all duration-300 border flex flex-col items-center justify-center ${
                  role === "patient"
                    ? "border-lime-400 bg-lime-950/20 shadow-[0_0_25px_rgba(163,230,53,0.18)]"
                    : "border-white/10 bg-[#141414] hover:border-white/20 opacity-70 hover:opacity-100"
                }`}
              >
                {role === "patient" && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-lime-400 flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />
                  </div>
                )}
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-lime-400/40 bg-neutral-900 shadow-inner">
                  <img
                    src="/patient-avatar.jpg"
                    alt="Patient Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className={`text-base font-bold ${role === "patient" ? "text-lime-400" : "text-white"}`}>
                  Patient
                </h4>
                <p className="text-xs text-neutral-400 mt-1 leading-snug">
                  Simple & supportive access for patients
                </p>
              </div>

              {/* Caregiver Card */}
              <div
                onClick={() => setRole("caregiver")}
                className={`relative cursor-pointer rounded-2xl p-5 text-center transition-all duration-300 border flex flex-col items-center justify-center ${
                  role === "caregiver"
                    ? "border-lime-400 bg-lime-950/20 shadow-[0_0_25px_rgba(163,230,53,0.18)]"
                    : "border-white/10 bg-[#141414] hover:border-white/20 opacity-70 hover:opacity-100"
                }`}
              >
                {role === "caregiver" && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-lime-400 flex items-center justify-center shadow-md">
                    <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />
                  </div>
                )}
                <div className="w-20 h-20 rounded-full overflow-hidden mb-3 border-2 border-lime-400/40 bg-neutral-900 shadow-inner">
                  <img
                    src="/caregiver-avatar.jpg"
                    alt="Caregiver Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className={`text-base font-bold ${role === "caregiver" ? "text-lime-400" : "text-white"}`}>
                  Caregiver
                </h4>
                <p className="text-xs text-neutral-400 mt-1 leading-snug">
                  Manage and support your loved one's care
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0f0f0f] px-3 text-neutral-500 font-medium">or</span>
              </div>
            </div>

            {/* Error message alert */}
            {errorMsg && (
              <div className="p-3.5 mb-4 text-xs sm:text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs text-neutral-300 font-medium">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="w-4 h-4 text-lime-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-10 h-12 bg-[#161616] border-white/10 text-white placeholder:text-neutral-500 rounded-xl focus-visible:ring-lime-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-neutral-300 font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-lime-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-[#161616] border-white/10 text-white placeholder:text-neutral-500 rounded-xl focus-visible:ring-lime-400"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs text-neutral-300 font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-lime-400/80 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 bg-[#161616] border-white/10 text-white placeholder:text-neutral-500 rounded-xl focus-visible:ring-lime-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading || isGoogleLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-lime-400 to-lime-500 hover:from-lime-300 hover:to-lime-400 text-neutral-950 font-bold text-base shadow-[0_0_20px_rgba(163,230,53,0.3)] transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
              >
                <span>{isLoading ? "Creating account..." : "Sign Up with Email"}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Button>

              {/* Google Button */}
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading || isLoading}
                className="w-full h-12 rounded-xl bg-[#161616] hover:bg-[#202020] border-white/10 text-white font-medium text-sm transition-all flex items-center justify-center cursor-pointer"
              >
                <GoogleIcon />
                <span>{isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}</span>
              </Button>

              {/* Footer text */}
              <div className="text-center text-xs text-neutral-400 pt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-lime-400 hover:underline font-semibold ml-1">
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer tagline */}
      <footer className="mt-8 flex items-center gap-2 text-xs text-neutral-500 font-medium">
        <Brain className="w-4 h-4 text-lime-400" />
        <span>
          <strong className="text-neutral-400">SmritiCare</strong> – Caring Today, Supporting Tomorrow.
        </span>
      </footer>
    </div>
  )
}
