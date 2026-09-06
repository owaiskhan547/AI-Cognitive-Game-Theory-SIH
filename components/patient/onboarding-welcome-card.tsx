import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  Sparkles,
  Images,
  Gamepad2,
  MessageCircle,
  Clock,
  CheckCircle2,
  X,
  ArrowRight,
  HeartHandshake,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface OnboardingWelcomeCardProps {
  patientName: string
  onDismiss?: () => void
}

interface StepItem {
  id: string
  title: string
  description: string
  icon: any
  route: string
  actionLabel: string
}

const ONBOARDING_COMPLETED_KEY = "smriti_onboarding_completed_steps"
const ONBOARDING_DISMISSED_KEY = "smriti_onboarding_dismissed"

export function OnboardingWelcomeCard({ patientName, onDismiss }: OnboardingWelcomeCardProps) {
  const navigate = useNavigate()
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [isVisible, setIsVisible] = useState(true)

  const steps: StepItem[] = [
    {
      id: "memory",
      title: "Add your first memory",
      description: "Upload a cherished photo or record a special story from your life.",
      icon: Images,
      route: "/patient/memories",
      actionLabel: "Add Memory",
    },
    {
      id: "game",
      title: "Play your first cognitive game",
      description: "Engage your mind with fun memory, pattern, and recall activities.",
      icon: Gamepad2,
      route: "/patient/games",
      actionLabel: "Play Now",
    },
    {
      id: "assistant",
      title: "Talk to AI Memory Companion",
      description: "Say hello to your 24/7 caring companion who listens and reminds you.",
      icon: MessageCircle,
      route: "/patient/assistant",
      actionLabel: "Start Chat",
    },
    {
      id: "medication",
      title: "Review today's medication & reminders",
      description: "Check your scheduled medicines and daily routine easily.",
      icon: Clock,
      route: "/patient/medications",
      actionLabel: "View Schedule",
    },
  ]

  useEffect(() => {
    if (typeof window === "undefined") return
    try {
      const saved = JSON.parse(localStorage.getItem(ONBOARDING_COMPLETED_KEY) || "[]")
      if (Array.isArray(saved)) {
        setCompletedSteps(saved)
      }
    } catch {
      setCompletedSteps([])
    }
  }, [])

  const handleCompleteStep = (stepId: string, route: string) => {
    const updated = Array.from(new Set([...completedSteps, stepId]))
    setCompletedSteps(updated)
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_COMPLETED_KEY, JSON.stringify(updated))
      if (updated.length >= steps.length) {
        localStorage.setItem(ONBOARDING_DISMISSED_KEY, "true")
        localStorage.removeItem("smriti_show_onboarding_welcome")
      }
    }
    navigate(route)
  }

  const handleDismiss = () => {
    setIsVisible(false)
    if (typeof window !== "undefined") {
      localStorage.setItem(ONBOARDING_DISMISSED_KEY, "true")
      localStorage.removeItem("smriti_show_onboarding_welcome")
    }
    onDismiss?.()
  }

  if (!isVisible) return null

  const progressPercent = Math.round((completedSteps.length / steps.length) * 100)

  return (
    <Card className="relative overflow-hidden border-2 border-primary/40 bg-gradient-to-br from-primary/10 via-card to-secondary/20 shadow-lg rounded-3xl animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Dismiss button */}
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-background/80 transition-colors z-10"
        title="Dismiss welcome guide"
        aria-label="Dismiss welcome guide"
      >
        <X className="w-5 h-5" />
      </button>

      <CardContent className="p-6 sm:p-8 space-y-6 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-8">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Getting Started Guide</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Welcome to SmritiCare, {patientName}! <span className="inline-block animate-wave">🌿</span>
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              We're honored to accompany you on your journey. SmritiCare is designed to keep your memories bright, your daily routines organized, and your family close. Complete these 4 steps to get comfortable with your new companion:
            </p>
          </div>

          {/* Progress Pill */}
          <div className="shrink-0 flex items-center gap-3 bg-background/80 backdrop-blur-sm border border-border/80 px-4 py-3 rounded-2xl shadow-sm">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted/30 stroke-current"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-primary stroke-current transition-all duration-500 ease-out"
                  strokeDasharray={`${progressPercent}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-xs font-black text-foreground">
                {completedSteps.length}/{steps.length}
              </span>
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Orientation</p>
              <p className="text-[11px] text-muted-foreground">{progressPercent}% complete</p>
            </div>
          </div>
        </div>

        {/* 4 Core Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {steps.map((step, idx) => {
            const isDone = completedSteps.includes(step.id)
            const StepIcon = step.icon

            return (
              <div
                key={step.id}
                className={`flex items-start justify-between gap-3.5 p-4 rounded-2xl border transition-all duration-200 ${
                  isDone
                    ? "bg-primary/5 border-primary/30 opacity-80"
                    : "bg-card hover:bg-accent/40 border-border hover:border-primary/50 shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isDone
                        ? "bg-primary/20 text-primary border border-primary/40"
                        : "bg-secondary text-foreground border border-border"
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    ) : (
                      <StepIcon className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-primary/80">Step {idx + 1}</span>
                      <h3 className={`text-base font-bold ${isDone ? "text-primary line-through" : "text-foreground"}`}>
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground leading-snug pr-2">{step.description}</p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant={isDone ? "outline" : "default"}
                  onClick={() => handleCompleteStep(step.id, step.route)}
                  className={`shrink-0 rounded-xl text-xs font-bold h-9 px-3 gap-1.5 transition-all ${
                    isDone
                      ? "border-primary/30 text-primary hover:bg-primary/10"
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                  }`}
                >
                  <span>{isDone ? "Review" : step.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )
          })}
        </div>

        {/* Footer info & dismiss button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-border/60 text-xs text-muted-foreground">
          <div className="flex items-center gap-2 text-primary font-medium">
            <HeartHandshake className="w-4 h-4 text-primary" />
            <span>Always available: Your data is safe and your caregiver has access when needed.</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-xs text-muted-foreground hover:text-foreground h-8 rounded-lg"
          >
            I'm ready, hide this guide
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}