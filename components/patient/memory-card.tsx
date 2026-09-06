import { useEffect, useState } from "react"
import { Images } from "lucide-react"
import { Link } from "react-router-dom"
import { useCurrentPatient } from "@/hooks/usePatientData"
import { getPatientMemories } from "@/lib/services/patientService"
import { mockMemories } from "@/lib/mock-data"

const fallbackImages = [
  "https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=400&q=80",
]

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
    <section className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#111827] p-6">
      <h2 className="text-xl font-semibold text-foreground">My Memories</h2>
      <div className="mt-4 grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3">
        {recentMemories.map((memory, index) => (
          <Link key={memory.id} to="/patient/memories" className="group overflow-hidden rounded-xl border border-white/8 bg-black/30">
            <div className="h-24 overflow-hidden bg-muted">
              {memory.media_url || memory.imageUrl || fallbackImages[index] ? (
                <img
                  src={memory.media_url || memory.imageUrl || fallbackImages[index]}
                  alt={memory.title}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Images className="size-6 text-zinc-600" />
                </div>
              )}
            </div>
            <p className="truncate px-2 py-2 text-xs font-medium">{memory.title}</p>
          </Link>
        ))}
        <div className="flex min-h-24 flex-col items-center justify-center rounded-xl border border-dashed border-white/15 bg-black/20 p-3 text-center">
          <p className="text-xs text-zinc-500">More memories coming soon!</p>
        </div>
      </div>
    </section>
  )
}
