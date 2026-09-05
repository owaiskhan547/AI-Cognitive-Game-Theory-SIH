import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus, Upload, Loader2 } from 'lucide-react'
import { memoryService } from '@/lib/supabase/services/memory'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface AddMemoryModalProps {
  onMemoryAdded?: () => void
  patientId?: string
}

export function AddMemoryModal({ onMemoryAdded, patientId }: AddMemoryModalProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0]
      setFile(selected)
      setPreviewUrl(URL.createObjectURL(selected))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      toast.error('Please enter a memory title')
      return
    }

    const targetPatientId = patientId || user?.id
    if (!targetPatientId) {
      toast.error('Patient ID not found')
      return
    }

    setLoading(true)
    try {
      let mediaUrl: string | null = null

      if (file) {
        try {
          mediaUrl = await memoryService.uploadMemoryImage(file, targetPatientId)
        } catch (uploadErr) {
          console.warn('Storage bucket upload failed, using local Data URL fallback:', uploadErr)
          mediaUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result as string)
            reader.readAsDataURL(file)
          })
        }
      }

      await memoryService.createMemory({
        patient_id: targetPatientId,
        title,
        description,
        media_url: mediaUrl,
      })

      toast.success('Memory created successfully!')
      setTitle('')
      setDescription('')
      setFile(null)
      setPreviewUrl(null)
      setOpen(false)
      if (onMemoryAdded) onMemoryAdded()
    } catch (err: any) {
      console.error('Error adding memory:', err)
      toast.error(err.message || 'Failed to add memory')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-xl flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Add Memory
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Memory</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">Memory Title</Label>
            <Input
              id="title"
              placeholder="e.g. Grandson's 5th Birthday"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Memory Description / Details</Label>
            <Textarea
              id="description"
              placeholder="Describe who is in the photo or what happened..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Memory Photo or Short Video</Label>
            {previewUrl ? (
              <div className="relative rounded-lg overflow-hidden border border-border h-44 bg-muted flex items-center justify-center">
                {file?.type.startsWith('video/') ? (
                  <video src={previewUrl} controls className="object-cover w-full h-full" />
                ) : (
                  <img src={previewUrl} alt="Preview" className="object-cover w-full h-full" />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 z-10"
                  onClick={() => {
                    setFile(null)
                    setPreviewUrl(null)
                  }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-accent/50 transition">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm font-medium text-muted-foreground">Click to upload photo or short video</span>
                <span className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, MP4, WebM</span>
                <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
              </label>
            )}
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Memory'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
