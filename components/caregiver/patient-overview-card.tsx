import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockPatient, mockCaregiverStats } from "@/lib/mock-data"
import type { PatientOverview } from "@/features/caregiver/types"
import { formatDistanceToNow } from "date-fns"

export function PatientOverviewCard({ patient }: { patient?: PatientOverview } = {}) {
  if (patient) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="text-xl">Patient Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 ring-2 ring-primary/70">
              <AvatarImage src={patient.avatarUrl ?? undefined} alt={patient.fullName} />
              <AvatarFallback className="bg-primary text-lg font-bold text-primary-foreground">
                {patient.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-xl font-bold">{patient.fullName}</h3>
              <div className="text-sm text-muted-foreground">
                Age: {patient.age ?? "Not available"} · {patient.relationship ?? "Relationship not specified"}
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="secondary">
                  {patient.latestActivityAt
                    ? `Active ${formatDistanceToNow(new Date(patient.latestActivityAt), { addSuffix: true })}`
                    : "No activity yet"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Emergency Contact:</strong> {patient.emergencyContact ?? "Not specified"}
            </p>
            <p>
              <strong className="text-foreground">Medical Notes:</strong> {patient.medicalNotes ?? "No notes recorded."}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/8 bg-black/30 p-3">
              <p className="text-xs text-zinc-400">Active medications</p>
              <p className="text-2xl font-semibold text-primary">{patient.activeMedications}</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-black/30 p-3">
              <p className="text-xs text-zinc-400">Upcoming reminders</p>
              <p className="text-2xl font-semibold text-primary">{patient.upcomingReminders}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">Patient Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 ring-2 ring-primary/70">
            <AvatarImage src="" alt={mockPatient.name} />
            <AvatarFallback className="bg-primary text-lg font-bold text-primary-foreground">
              {mockPatient.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{mockPatient.name}</h3>
            <div className="text-sm text-muted-foreground">Age: {mockPatient.age}</div>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="secondary">{mockPatient.condition}</Badge>
              <span className="text-xs text-muted-foreground">Active 2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Medication Adherence</span>
              <span className="text-primary">{mockCaregiverStats.medicationAdherence}%</span>
            </div>
            <Progress value={mockCaregiverStats.medicationAdherence} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Cognitive Score</span>
              <span className="text-primary">{mockCaregiverStats.cognitiveScore}/100</span>
            </div>
            <Progress value={mockCaregiverStats.cognitiveScore} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
