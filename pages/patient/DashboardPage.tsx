import { GreetingCard } from "@/components/patient/greeting-card"
import { ScheduleCard } from "@/components/patient/schedule-card"
import { MedicationCard } from "@/components/patient/medication-card"
import { GameCard } from "@/components/patient/game-card"
import { MemoryCard } from "@/components/patient/memory-card"
import { AssistantCard } from "@/components/patient/assistant-card"
import { SosButton } from "@/components/patient/sos-button"
import { useAuth } from "@/contexts/AuthContext"

export default function PatientDashboardPage() {
  const { profile, user } = useAuth()
  const displayName = (profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there').trim().split(/\s+/)[0]

  return (
    <div className="flex flex-col gap-8 pb-8">
      <GreetingCard name={displayName} />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-6">
          <ScheduleCard />
          <GameCard />
        </div>
        <div className="space-y-6">
          <MedicationCard />
          <MemoryCard />
        </div>
      </div>
      
      <AssistantCard />
      
      <div className="pt-4">
        <SosButton />
      </div>
    </div>
  )
}
