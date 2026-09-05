import { useCurrentPatient, usePatientDashboard } from "@/hooks/usePatientData"
import { GreetingCard } from "@/components/patient/greeting-card"
import { PatientStatusCard } from "@/components/patient/patient-status-card"
import { ScheduleCard } from "@/components/patient/schedule-card"
import { MedicationCard } from "@/components/patient/medication-card"
import { MemoryCard } from "@/components/patient/memory-card"
import { AssistantCard } from "@/components/patient/assistant-card"
import { SosButton } from "@/components/patient/sos-button"
import { markScheduleCompleted, markMedicationTaken } from "@/lib/services/patientService"
import { useState } from "react"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PatientDashboardPage() {
  const { patient, loading: patientLoading, error: patientError, refetch: refetchPatient } = useCurrentPatient()
  const { dashboardData, loading: dashLoading, error: dashError, refetch: refetchDash } = usePatientDashboard(patient?.id)

  const [savingScheduleId, setSavingScheduleId] = useState<string | null>(null)
  const [savingMedId, setSavingMedId] = useState<string | null>(null)

  const handleToggleSchedule = async (scheduleId: string) => {
    if (!patient?.id || !dashboardData) return
    const currentItem = dashboardData.todaySchedule.find((s) => s.id === scheduleId)
    const nextStatus = currentItem?.isCompleted ? "skipped" : "completed"

    setSavingScheduleId(scheduleId)
    try {
      await markScheduleCompleted(patient.id, scheduleId, nextStatus)
      await refetchDash()
    } catch (err) {
      console.error("Failed to update schedule status:", err)
    } finally {
      setSavingScheduleId(null)
    }
  }

  const handleTakeMedication = async (medicationId: string) => {
    if (!patient?.id) return
    setSavingMedId(medicationId)
    try {
      await markMedicationTaken(patient.id, medicationId)
      await refetchDash()
    } catch (err) {
      console.error("Failed to take medication:", err)
    } finally {
      setSavingMedId(null)
    }
  }

  const isLoading = patientLoading || dashLoading

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-xl font-bold text-foreground">Loading your dashboard...</p>
        <p className="text-base text-muted-foreground">Getting your personalized routine and reminders ready.</p>
      </div>
    )
  }

  if (patientError || dashError) {
    return (
      <div className="p-8 border-2 border-red-500/30 rounded-2xl bg-red-500/10 text-center max-w-xl mx-auto my-12 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Unable to load dashboard</h2>
        <p className="text-base text-muted-foreground">
          {patientError || dashError || "Please check your network connection and try again."}
        </p>
        <Button
          onClick={() => {
            refetchPatient()
            refetchDash()
          }}
          className="gap-2 text-base font-bold"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Try Again</span>
        </Button>
      </div>
    )
  }

  const patientFullName = patient?.profile?.full_name || "Friend"
  const firstName = patientFullName.split(" ")[0]

  const todaySchedule = dashboardData?.todaySchedule || []
  const medications = dashboardData?.medications || []

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* 1. Personalized Greeting with real Supabase Name */}
      <GreetingCard name={firstName} />

      {/* 2. Today's Progress / Patient Status Summary Card */}
      <PatientStatusCard
        totalTasks={dashboardData?.totalTasks || 0}
        completedTasks={dashboardData?.completedTasks || 0}
        nextTask={dashboardData?.nextTask || null}
        medicationsTotal={dashboardData?.medicationsTotal || 0}
        medicationsTaken={dashboardData?.medicationsTaken || 0}
      />

      {/* 3. Schedule & Medication Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          <ScheduleCard
            schedules={todaySchedule}
            onToggleComplete={handleToggleSchedule}
            savingId={savingScheduleId}
          />
          {/* Teammate Game module card (kept intact) */}
        </div>

        <div className="space-y-6">
          <MedicationCard
            medications={medications}
            onTakeMedication={handleTakeMedication}
            savingId={savingMedId}
          />
          {/* Teammate Memory module card (kept intact) */}
          <MemoryCard />
        </div>
      </div>

      {/* 4. Teammate Assistant card (kept intact) */}
      <AssistantCard />

      {/* 5. Emergency SOS Card */}
      <div className="pt-2">
        <SosButton patientId={patient?.id} />
      </div>
    </div>
  )
}
