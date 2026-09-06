import { useEffect, useState } from "react"
import { Images } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useCurrentPatient } from "@/hooks/usePatientData"
import { getPatientMemories } from "@/lib/services/patientService"
import { mockMemories } from "@/lib/mock-data"

export function MemoryCard() {
  const { patient } = useCurrentPatient()
  const [recentMemories, setRecentMemories] = useState<any[]>([])

  useEffect(() => {
    if (!patient?.id) {
      setRecentMemories(mockMemories.slice(0, 2))
      return
    }
    getPatientMemories(patient.id)
      .then((memories) => {
        if (memories && memories.length > 0) {
          setRecentMemories(memories.slice(0, 2))
        } else {
          setRecentMemories(mockMemories.slice(0, 2))
        }
      })
      .catch((error) => {
        console.error("Failed to load dashboard memories:", error)
        setRecentMemories(mockMemories.slice(0, 2))
      })
  }, [patient?.id])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-3">
          <Images className="w-7 h-7 text-primary" />
          My Memories
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          {recentMemories.map((memory) => (
            <div
              key={memory.id}
              className="p-4 rounded-xl border border-border bg-card flex flex-col gap-2"
            >
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                {memory.media_url ? (
                  <img src={memory.media_url} alt={memory.title} className="h-full w-full rounded-lg object-cover" />
                ) : (
                  <Images className="w-8 h-8 text-muted-foreground/50" />
                )}
              </div>
              <h3 className="text-lg font-bold">{memory.title}</h3>
              <p className="text-sm text-muted-foreground">
                {memory.created_at ? new Date(memory.created_at).toLocaleDateString() : memory.date || "Recent"}
              </p>
            </div>
          ))}
        </div>
        <Button asChild variant="outline" size="xl" className="w-full rounded-xl text-lg h-16">
          <Link to="/patient/memories">View All Memories</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
