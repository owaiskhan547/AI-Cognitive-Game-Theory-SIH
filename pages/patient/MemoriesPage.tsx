import { useEffect, useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Images, Plus, Pencil, Trash2, Upload, X } from "lucide-react"
import { useCurrentPatient } from "@/hooks/usePatientData"
import { createMemory, deleteMemory, getPatientMemories, updateMemory } from "@/lib/services/patientService"

const MAX_PHOTO_SIZE = 1200

function compressPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("Unable to read that photo."))
    reader.onload = () => {
      const image = new Image()
      image.onerror = () => reject(new Error("That file is not a supported image."))
      image.onload = () => {
        const scale = Math.min(1, MAX_PHOTO_SIZE / Math.max(image.width, image.height))
        const canvas = document.createElement("canvas")
        canvas.width = Math.max(1, Math.round(image.width * scale))
        canvas.height = Math.max(1, Math.round(image.height * scale))
        const context = canvas.getContext("2d")
        if (!context) {
          reject(new Error("Unable to process that photo."))
          return
        }
        context.drawImage(image, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL("image/jpeg", 0.82))
      }
      image.src = String(reader.result)
    }
    reader.readAsDataURL(file)
  })
}

export default function PatientMemoriesPage() {
  const { patient } = useCurrentPatient()
  const [memories, setMemories] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingMemory, setEditingMemory] = useState<any | null>(null)
  const [form, setForm] = useState({ title: "", description: "", media_url: null as string | null })
  const [status, setStatus] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const loadMemories = async () => {
    if (!patient?.id) return
    try {
      const data = await getPatientMemories(patient.id)
      setMemories(data)
    } catch (err) {
      console.error("Failed to load memories:", err)
    }
  }

  useEffect(() => {
    loadMemories()
  }, [patient?.id])

  const resetForm = () => {
    setForm({ title: "", description: "", media_url: null })
    setEditingMemory(null)
    setShowForm(false)
  }

  const openNewMemoryForm = () => {
    setEditingMemory(null)
    setForm({ title: "", description: "", media_url: null })
    setShowForm(true)
  }

  const handlePhotoChange = async (file?: File) => {
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setStatus("Please choose an image file.")
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      setStatus("Please choose an image smaller than 10 MB.")
      return
    }

    try {
      const media_url = await compressPhoto(file)
      setForm((current) => ({ ...current, media_url }))
      setStatus(null)
    } catch (err: any) {
      setStatus(err?.message || "Unable to process that photo.")
    }
  }

  const handleSubmit = async () => {
    if (!patient?.id) return
    if (!form.title.trim()) {
      setStatus("Memory title is required.")
      return
    }

    try {
      setIsSaving(true)
      if (editingMemory) {
        await updateMemory(patient.id, editingMemory.id, {
          ...form,
          media_url: form.media_url,
        })
        setStatus("Memory updated.")
      } else {
        await createMemory(patient.id, form)
        setStatus("Memory added.")
      }
      resetForm()
      await loadMemories()
    } catch (err: any) {
      console.error("Failed to save memory:", err)
      setStatus(err?.message || "Unable to save memory.")
    } finally {
      setIsSaving(false)
    }
    setTimeout(() => setStatus(null), 2500)
  }

  const handleDelete = async (memoryId: string, title: string) => {
    if (!patient?.id) return
    try {
      await deleteMemory(patient.id, memoryId)
      setStatus(`Deleted ${title}.`)
      await loadMemories()
    } catch (err: any) {
      console.error("Failed to delete memory:", err)
      setStatus(err?.message || "Unable to delete memory.")
    }
    setTimeout(() => setStatus(null), 2500)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <PageHeader 
          title="My Memories" 
          subtitle="Cherished moments to revisit"
          backHref="/patient/dashboard"
        />
        <Button onClick={openNewMemoryForm} variant="outline" size="lg" className="rounded-xl hidden sm:flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Memory
        </Button>
      </div>

      {status && (
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary font-medium text-center">{status}</div>
      )}

      <Button onClick={openNewMemoryForm} variant="outline" size="xl" className="w-full rounded-xl sm:hidden flex items-center gap-2 mb-6">
        <Plus className="w-6 h-6" />
        Add New Memory
      </Button>

      {showForm && (
        <Card className="p-4 border border-border">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Family picnic" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe this special memory" />
            </div>
            <div className="space-y-2">
              <Label>Photo</Label>
              <div className="flex flex-wrap items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  <Upload className="w-4 h-4" />
                  Choose photo
                  <input type="file" accept="image/*" className="sr-only" onChange={(event) => handlePhotoChange(event.target.files?.[0])} />
                </label>
                {form.media_url && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => setForm({ ...form, media_url: null })}>
                    <X className="w-4 h-4" />
                    Remove photo
                  </Button>
                )}
              </div>
              {form.media_url && <img src={form.media_url} alt="Selected memory preview" className="mt-3 h-40 w-full rounded-lg object-cover" />}
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isSaving}>{isSaving ? "Saving..." : editingMemory ? "Save Changes" : "Add Memory"}</Button>
          </div>
        </Card>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {memories.map((memory) => (
          <Card key={memory.id} className="overflow-hidden">
            <div className="w-full h-48 bg-muted flex items-center justify-center">
              {memory.media_url ? <img src={memory.media_url} alt={memory.title} className="h-full w-full object-cover" /> : <Images className="w-12 h-12 text-muted-foreground/30" />}
            </div>
            <CardHeader>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground font-medium">{new Date(memory.created_at).toLocaleDateString()}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Memory</span>
              </div>
              <CardTitle className="text-xl">{memory.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-lg">
                {memory.description}
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditingMemory(memory); setForm({ title: memory.title, description: memory.description || "", media_url: memory.media_url || null }); setShowForm(true) }}>
                  <Pencil className="w-4 h-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDelete(memory.id, memory.title)}>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
