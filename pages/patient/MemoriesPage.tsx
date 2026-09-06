import { useEffect, useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Images, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AddMemoryModal } from "@/components/memory/add-memory-modal"
import { memoryService, type Memory } from "@/lib/supabase/services/memory"
import { useAuth } from "@/contexts/AuthContext"
import { useCurrentPatient } from "@/hooks/usePatientData"
import { updateMemory } from "@/lib/services/patientService"
// Inline mock memories for development
const mockMemories = [
  {
    id: "mem1",
    patient_id: "demo-patient",
    title: "First Memory",
    description: "Visited the park with family.",
    media_url: null,
    created_at: new Date().toISOString(),
  },
  {
    id: "mem2",
    patient_id: "demo-patient",
    title: "Medical Checkup",
    description: "Annual health checkup results.",
    media_url: null,
    created_at: new Date().toISOString(),
  },
];
import { toast } from "sonner"

export default function PatientMemoriesPage() {
  const { user } = useAuth()
  const { patient } = useCurrentPatient()
  const [memories, setMemories] = useState<Memory[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMemories = async () => {
    const lookupId = patient?.id || user?.id
    if (!lookupId) return
    try {
      setLoading(true)
      const data = await memoryService.getPatientMemories(lookupId)
      setMemories(data)
    } catch (err: unknown) {
      console.error("Error fetching memories:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchMemories()
  }, [user?.id, patient?.id])

  const handleDelete = async (id: string) => {
    try {
      await memoryService.deleteMemory(id)
      toast.success("Memory deleted")
      void fetchMemories()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to delete memory"
      toast.error(message)
    }
  }

  const handleEdit = async (memory: Memory) => {
    if (!patient?.id) {
      toast.error("Unable to edit until your patient profile is loaded.")
      return
    }
    const nextTitle = window.prompt("Memory title", memory.title)
    if (nextTitle == null) return
    const nextDescription = window.prompt("Memory description", memory.description || "")
    if (nextDescription == null) return
    try {
      await updateMemory(patient.id, memory.id, {
        title: nextTitle.trim() || memory.title,
        description: nextDescription,
        media_url: memory.media_url,
      })
      toast.success("Memory updated")
      void fetchMemories()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update memory"
      toast.error(message)
    }
  }

  const isVideo = (url?: string | null) => {
    if (!url) return false
    return url.startsWith("data:video") || url.endsWith(".mp4") || url.endsWith(".webm")
  }

  const displayList = memories.length > 0 ? memories : !loading ? (mockMemories as Memory[]) : []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title="My Memories"
          subtitle="Cherished moments to revisit"
          backHref="/patient/dashboard"
        />
        <AddMemoryModal onMemoryAdded={fetchMemories} patientId={patient?.id || user?.id} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {displayList.map((memory) => (
          <Card key={memory.id} className="overflow-hidden group relative flex flex-col justify-between">
            <div>
              {memory.media_url ? (
                <div className="w-full h-56 bg-muted overflow-hidden relative">
                  {isVideo(memory.media_url) ? (
                    <video src={memory.media_url} controls className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src={memory.media_url}
                      alt={memory.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
                    />
                  )}
                </div>
              ) : (
                <div className="w-full h-48 bg-muted flex items-center justify-center">
                  <Images className="w-12 h-12 text-muted-foreground/30" />
                </div>
              )}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-muted-foreground font-medium">
                    {memory.created_at ? new Date(memory.created_at).toLocaleDateString() : ""}
                  </span>
                  <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
                    {isVideo(memory.media_url) ? "Video Memory" : "Photo Memory"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{memory.title}</CardTitle>
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:bg-accent"
                      title="Edit Memory"
                      onClick={() => void handleEdit(memory)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 transition-opacity"
                      title="Delete Memory"
                      onClick={() => void handleDelete(memory.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-base sm:text-lg">
                  {memory.description}
                </p>
              </CardContent>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
