import { BarChart3, Clock, Pill } from "lucide-react"
import type { ScheduleItemWithStatus } from "@/lib/services/patientService"

interface PatientStatusCardProps {
  totalTasks: number
  completedTasks: number
  nextTask: ScheduleItemWithStatus | null
  medicationsTotal: number
  medicationsTaken: number
}

function ProgressRing({ value }: { value: number }) {
  const radius = 22
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (value / 100) * circumference
  return (
    <svg viewBox="0 0 56 56" className="size-14 -rotate-90">
      <circle cx="28" cy="28" r={radius} fill="none" stroke="currentColor" className="text-white/10" strokeWidth="6" />
      <circle
        cx="28"
        cy="28"
        r={radius}
        fill="none"
        stroke="currentColor"
        className="text-primary"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
    </svg>
  )
}

export function PatientStatusCard({
  totalTasks,
  completedTasks,
  nextTask,
  medicationsTotal,
  medicationsTaken,
}: PatientStatusCardProps) {
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
  const medsClear = medicationsTotal === 0 || medicationsTaken >= medicationsTotal

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111827] p-4">
        <div className="relative">
          <ProgressRing value={progress} />
          <span className="absolute inset-0 flex items-center justify-center text-[11px] font-bold text-primary">{progress}%</span>
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <BarChart3 className="size-4 text-primary" />
            Today&apos;s Progress
          </div>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {completedTasks}/{totalTasks} activities
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111827] p-4">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary shadow-[0_0_16px_rgba(163,230,53,0.25)]">
          <Pill className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-zinc-400">Medication Reminders</p>
          <p className="mt-1 text-lg font-semibold text-foreground">
            {medicationsTaken}/{medicationsTotal}
          </p>
          <p className="text-xs text-zinc-500">{medsClear ? "All clear for now." : "Doses remaining today."}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-[#111827] p-4">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <Clock className="size-6" />
        </span>
        <div className="min-w-0">
          <p className="text-sm text-zinc-400">Next Activity</p>
          <p className="mt-1 truncate text-lg font-semibold text-foreground">{nextTask?.title || "All caught up."}</p>
          {nextTask?.time && <p className="text-xs text-zinc-500">{nextTask.time}</p>}
        </div>
      </div>
    </div>
  )
}
