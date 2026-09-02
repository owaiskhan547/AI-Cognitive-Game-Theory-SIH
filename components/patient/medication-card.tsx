"use client"

import { Pill, CheckCircle2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { mockMedications, markMedicationTaken } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { cn } from "@/lib/utils"

export function MedicationCard() {
  const [meds, setMeds] = useState(mockMedications.slice(0, 2))

  const handleTake = (id: string) => {
    markMedicationTaken(id)
    setMeds(meds.map(m => m.id === id ? { ...m, taken: true } : m))
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Pill className="w-7 h-7 text-primary" />
          Medications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {meds.map((med) => (
          <div
            key={med.id}
            className={cn(
              "flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-xl border",
              med.taken ? "bg-secondary/20 border-border/50" : "bg-card border-border"
            )}
          >
            <div className="flex-1">
              <h3 className="text-xl font-bold">{med.name}</h3>
              <p className="text-lg text-muted-foreground">{med.dosage} • {med.time}</p>
            </div>
            <div className="shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
              {med.taken ? (
                <div className="flex items-center justify-center sm:justify-start gap-2 text-primary font-medium p-4 bg-primary/10 rounded-xl w-full">
                  <CheckCircle2 className="w-6 h-6" />
                  <span className="text-lg">Taken</span>
                </div>
              ) : (
                <Button 
                  onClick={() => handleTake(med.id)} 
                  size="xl" 
                  className="w-full sm:w-auto h-16 rounded-xl text-lg px-8"
                >
                  Take Now
                </Button>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
