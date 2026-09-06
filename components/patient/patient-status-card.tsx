import { CheckCircle2, Clock, Pill } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { ScheduleItemWithStatus } from "@/lib/services/patientService"

interface PatientStatusCardProps {
  totalTasks: number
  completedTasks: number
  nextTask: ScheduleItemWithStatus | null
  medicationsTotal: number
  medicationsTaken: number
}

export function PatientStatusCard({ totalTasks, completedTasks, nextTask, medicationsTotal, medicationsTaken }: PatientStatusCardProps) {
  const progress = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0
  return (
    <Card className="border-2">
      <CardContent className="grid gap-5 p-5 sm:grid-cols-3">
        <div className="flex items-center gap-3"><CheckCircle2 className="h-8 w-8 text-primary" /><div><p className="text-sm text-muted-foreground">Today&apos;s progress</p><p className="text-2xl font-black">{completedTasks}/{totalTasks} <span className="text-base text-primary">({progress}%)</span></p></div></div>
        <div className="flex items-center gap-3"><Pill className="h-8 w-8 text-primary" /><div><p className="text-sm text-muted-foreground">Medication reminders</p><p className="text-2xl font-black">{medicationsTaken}/{medicationsTotal}</p></div></div>
        <div className="flex items-center gap-3"><Clock className="h-8 w-8 text-primary" /><div><p className="text-sm text-muted-foreground">Next activity</p><p className="truncate text-lg font-bold">{nextTask?.title || "All caught up"}</p></div></div>
      </CardContent>
    </Card>
  )
}
