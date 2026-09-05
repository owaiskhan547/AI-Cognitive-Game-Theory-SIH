import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock } from "lucide-react"
import { mockMedications, markMedicationTaken } from "@/lib/mock-data"

export default function PatientMedicationsPage() {
  const [meds, setMeds] = useState(mockMedications)

  const handleTake = (id: string) => {
    markMedicationTaken(id)
    setMeds(meds.map(m => m.id === id ? { ...m, taken: true } : m))
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Medications" 
        subtitle="Track your daily medications"
        backHref="/patient/dashboard"
      />
      
      <div className="space-y-4">
        {meds.map((med) => (
          <Card key={med.id} className={med.taken ? "bg-secondary/10" : ""}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 justify-between sm:items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold">{med.name}</h3>
                    {med.taken && (
                      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 text-sm">
                        Taken
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-lg text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-5 h-5" />
                      {med.time}
                    </span>
                    <span>•</span>
                    <span>{med.dosage}</span>
                    <span>•</span>
                    <span>{med.frequency}</span>
                  </div>
                </div>
                
                <div className="shrink-0">
                  {med.taken ? (
                    <div className="flex items-center justify-center gap-2 text-primary font-medium p-4 bg-primary/10 rounded-xl h-16 w-full sm:w-40">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="text-lg">Done</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleTake(med.id)} 
                      size="xl" 
                      className="w-full sm:w-40 h-16 rounded-xl text-lg"
                    >
                      Take Now
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
