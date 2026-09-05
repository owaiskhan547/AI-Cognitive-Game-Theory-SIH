<<<<<<< HEAD
import { Images } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { mockMemories } from "@/lib/mock-data"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function MemoryCard() {
  const recentMemories = mockMemories.slice(0, 2)
=======
import { useEffect, useState } from "react"
import { Images } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useCurrentPatient } from "@/hooks/usePatientData"
import { getPatientMemories } from "@/lib/services/patientService"

export function MemoryCard() {
  const { patient } = useCurrentPatient()
  const [recentMemories, setRecentMemories] = useState<any[]>([])

  useEffect(() => {
    if (!patient?.id) return
    getPatientMemories(patient.id)
      .then((memories) => setRecentMemories(memories.slice(0, 2)))
      .catch((error) => console.error("Failed to load dashboard memories:", error))
  }, [patient?.id])
>>>>>>> c803a0274886f346c6bb60935235b314baec755d

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
<<<<<<< HEAD
          {recentMemories.map((memory) => (
=======
          {recentMemories.length > 0 ? recentMemories.map((memory) => (
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
            <div
              key={memory.id}
              className="p-4 rounded-xl border border-border bg-card flex flex-col gap-2"
            >
              <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
<<<<<<< HEAD
                <Images className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-bold">{memory.title}</h3>
              <p className="text-sm text-muted-foreground">{memory.date}</p>
            </div>
          ))}
=======
                {memory.media_url ? <img src={memory.media_url} alt={memory.title} className="h-full w-full rounded-lg object-cover" /> : <Images className="w-8 h-8 text-muted-foreground/50" />}
              </div>
              <h3 className="text-lg font-bold">{memory.title}</h3>
              <p className="text-sm text-muted-foreground">{new Date(memory.created_at).toLocaleDateString()}</p>
            </div>
          )) : <p className="text-muted-foreground">No memories added yet.</p>}
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
        </div>
        <Button asChild variant="outline" size="xl" className="w-full rounded-xl text-lg h-16">
          <Link to="/patient/memories">View All Memories</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
