<<<<<<< HEAD
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
export function AdherenceCard({ activeMedications }: { activeMedications: number }) { return <Card><CardHeader><CardTitle>Medication Status</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{activeMedications}</p><p className="text-sm text-muted-foreground">active medications</p><p className="mt-3 text-sm text-muted-foreground">Adherence is not calculated because the current schema has no completion history.</p></CardContent></Card> }
=======
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockMedications, mockCaregiverStats } from "@/lib/mock-data";

export function AdherenceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication Adherence</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-muted-foreground">Overall Adherence</span>
            <span className="font-bold">{mockCaregiverStats.medicationAdherence}%</span>
          </div>
          <Progress value={mockCaregiverStats.medicationAdherence} className="h-2" />
        </div>

        <div className="space-y-4">
          {mockMedications.map((med) => (
            <div key={med.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium">{med.name}</p>
                <p className="text-xs text-muted-foreground">{med.dosage}</p>
              </div>
              <Badge variant={med.taken ? "default" : "outline"}>
                {med.taken ? "Taken" : "Pending"}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
