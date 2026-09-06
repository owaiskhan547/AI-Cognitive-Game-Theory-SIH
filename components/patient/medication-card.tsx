import { Pill, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MedicationWithLogStatus } from "@/lib/services/patientService"

interface MedicationCardProps {
  medications: MedicationWithLogStatus[]
  onTakeMedication: (medicationId: string) => Promise<void>
  savingId: string | null
}

export function MedicationCard({ medications, onTakeMedication, savingId }: MedicationCardProps) {

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Pill className="w-7 h-7 text-primary" />
          Medications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {medications.length === 0 ? <p className="text-muted-foreground">No active medications.</p> : medications.slice(0, 3).map((med) => (
          <div
            key={med.id}
            className={cn(
              "flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border",
              med.isTakenToday ? "bg-secondary/20 border-border/50" : "bg-card border-border"
            )}
          >
            <div className="flex-1">
              <h3 className="text-xl font-bold">{med.name}</h3>
              <p className="text-lg text-muted-foreground">{med.dosage} • {med.frequency}</p>
            </div>
            <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
              {med.isTakenToday ? (
                <div className="flex items-center justify-center sm:justify-start gap-2 text-primary font-medium p-4 bg-primary/10 rounded-xl w-full">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-lg">Taken</span>
                </div>
              ) : (
                <Button
                  onClick={() => onTakeMedication(med.id)}
                  disabled={savingId === med.id}
                  size="xl" 
                  className="w-full sm:w-auto h-16 rounded-xl text-lg px-8"
                >
                  {savingId === med.id ? "Saving..." : "Take Now"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
