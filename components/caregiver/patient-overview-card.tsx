<<<<<<< HEAD
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; import type { PatientOverview } from '@/features/caregiver/types'
export function PatientOverviewCard({ patient }: { patient: PatientOverview }) { return <Card><CardHeader><CardTitle>Patient Overview</CardTitle></CardHeader><CardContent className="flex items-center gap-4"><Avatar><AvatarImage src={patient.avatarUrl ?? undefined}/><AvatarFallback>{patient.fullName[0]}</AvatarFallback></Avatar><div><p className="font-semibold">{patient.fullName}</p><p className="text-sm text-muted-foreground">Age: {patient.age ?? 'Not available'} · {patient.relationship ?? 'Not specified'}</p><p className="text-sm text-muted-foreground">{patient.medicalNotes ?? 'No medical notes recorded.'}</p></div></CardContent></Card> }
=======
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockPatient, mockCaregiverStats } from "@/lib/mock-data";

export function PatientOverviewCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src="" alt={mockPatient.name} />
            <AvatarFallback>{mockPatient.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-xl font-bold">{mockPatient.name}</h3>
            <div className="text-sm text-muted-foreground">Age: {mockPatient.age}</div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">{mockPatient.condition}</Badge>
              <span className="text-xs text-muted-foreground">Active 2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Medication Adherence</span>
              <span>{mockCaregiverStats.medicationAdherence}%</span>
            </div>
            <Progress value={mockCaregiverStats.medicationAdherence} className="h-2" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Cognitive Score</span>
              <span>{mockCaregiverStats.cognitiveScore}/100</span>
            </div>
            <Progress value={mockCaregiverStats.cognitiveScore} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
