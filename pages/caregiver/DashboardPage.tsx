import { StatsRow } from "@/components/caregiver/stats-row"
import { PatientOverviewCard } from "@/components/caregiver/patient-overview-card"
import { AdherenceCard } from "@/components/caregiver/adherence-card"
import { ActivityTable } from "@/components/caregiver/activity-table"
import { GreetingCard } from "@/components/patient/greeting-card"
import { PatientSelector } from "@/components/caregiver/patient-selector"
import { useAuth } from "@/contexts/AuthContext"
import { useCaregiverPatients } from "@/features/caregiver/context"
import { ShieldAlert } from "lucide-react"
import { mockCaregiverStats } from "@/lib/mock-data"

export default function CaregiverDashboardPage() {
  const { profile, user } = useAuth()
  const { selectedPatient } = useCaregiverPatients()
  const name = (profile?.full_name || user?.user_metadata?.full_name || "Caregiver").split(/\s+/)[0]
  const patientFirst = selectedPatient?.fullName?.split(/\s+/)[0]

  return (
    <div className="flex flex-col gap-6 pb-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <GreetingCard
          name={name}
          quote={patientFirst ? `Keeping ${patientFirst} safe, one gentle check-in at a time.` : "A calmer mind, a brighter tomorrow."}
        />
        <PatientSelector />
      </div>

      <StatsRow />
      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <PatientOverviewCard />
        <AdherenceCard />
      </div>
      <ActivityTable />
      {mockCaregiverStats.activeAlerts > 0 && (
        <div className="flex h-[72px] items-center justify-center gap-4 rounded-2xl bg-[#7f1d1d] text-white">
          <ShieldAlert className="size-8" />
          <span className="text-left">
            <span className="block text-xl font-bold">Active alerts</span>
            <span className="block text-sm font-normal text-red-100/80">
              {mockCaregiverStats.activeAlerts} items need your attention.
            </span>
          </span>
        </div>
      )}
    </div>
  )
}
