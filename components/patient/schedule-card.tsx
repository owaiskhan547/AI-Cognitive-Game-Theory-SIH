import { ArrowRight, CalendarCheck, CheckCircle2, Circle, Loader2 } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import type { ScheduleItemWithStatus } from "@/lib/services/patientService"

interface ScheduleCardProps {
  schedules: ScheduleItemWithStatus[]
  onToggleComplete: (scheduleId: string) => Promise<void>
  savingId: string | null
}

export function ScheduleCard({ schedules, onToggleComplete, savingId }: ScheduleCardProps) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#111827] p-6">
      <h2 className="text-xl font-semibold text-foreground">Today&apos;s Schedule</h2>
      <div className="mt-5 flex flex-1 flex-col items-center justify-center gap-5">
        {schedules.length === 0 ? (
          <>
            <div className="relative">
              <span className="absolute inset-0 rounded-full bg-primary/20 blur-2xl" />
              <CalendarCheck className="relative size-24 text-primary" strokeWidth={1.25} />
            </div>
            <p className="text-center text-zinc-400">No activities scheduled today.</p>
          </>
        ) : (
          <div className="w-full space-y-3">
            {schedules.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center rounded-xl border border-white/8 bg-black/30 p-3",
                  item.isCompleted && "opacity-60",
                )}
              >
                <div className="w-20 shrink-0 text-sm font-semibold text-primary">{item.time}</div>
                <div className="flex-1 px-3 text-base font-medium">{item.title}</div>
                {savingId === item.id ? (
                  <Loader2 className="size-6 animate-spin text-primary" />
                ) : item.isCompleted ? (
                  <CheckCircle2 className="size-6 text-primary" />
                ) : (
                  <button type="button" aria-label={`Mark ${item.title} complete`} onClick={() => onToggleComplete(item.id)}>
                    <Circle className="size-6 text-zinc-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <Link
          to="/patient/schedule"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
        >
          View Full Schedule
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  )
}
