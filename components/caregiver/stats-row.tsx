import { Brain, Pill, Gamepad2, AlertTriangle, Bell, type LucideProps } from "lucide-react"
import { mockCaregiverStats } from "@/lib/mock-data"
import type { CaregiverStats } from "@/features/caregiver/types"
import type { ComponentType } from "react"

function StatusTile({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string
  value: string | number
  hint?: string
  icon: ComponentType<LucideProps>
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111827] p-4">
      <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary shadow-[0_0_16px_rgba(163,230,53,0.25)]">
        <Icon className="size-6" />
      </span>
      <div className="min-w-0">
        <p className="text-sm text-zinc-400">{label}</p>
        <p className="mt-1 text-lg font-semibold text-foreground">{value}</p>
        {hint && <p className="text-xs text-zinc-500">{hint}</p>}
      </div>
    </div>
  )
}

export function StatsRow({ stats }: { stats?: CaregiverStats } = {}) {
  if (stats) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatusTile label="Average cognitive score" value={stats.averageScore ?? "—"} icon={Brain} />
        <StatusTile label="Games played" value={stats.gamesPlayed} icon={Gamepad2} />
        <StatusTile label="Active medications" value={stats.activeMedications} icon={Pill} />
        <StatusTile label="Upcoming reminders" value={stats.upcomingReminders} icon={Bell} />
      </div>
    )
  }

  const { cognitiveScore, cognitiveScoreTrend, medicationAdherence, adherenceTrend, gamesPlayed, gamesTrend, activeAlerts, alertsTrend } =
    mockCaregiverStats

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatusTile label="Cognitive Score" value={cognitiveScore} hint={cognitiveScoreTrend} icon={Brain} />
      <StatusTile label="Med Adherence" value={`${medicationAdherence}%`} hint={adherenceTrend} icon={Pill} />
      <StatusTile label="Games Played" value={gamesPlayed} hint={`${gamesTrend} this week`} icon={Gamepad2} />
      <StatusTile label="Active Alerts" value={activeAlerts} hint={alertsTrend === "0" ? "No change" : alertsTrend} icon={AlertTriangle} />
    </div>
  )
}
