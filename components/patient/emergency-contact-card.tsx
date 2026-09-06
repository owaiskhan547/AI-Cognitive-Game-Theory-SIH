import { useState } from "react"
import { Edit2, Phone, Trash2, User } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { EmergencyContactRow } from "@/lib/services/patientService"

interface EmergencyContactCardProps {
  contact: EmergencyContactRow
  onEdit: (contact: EmergencyContactRow) => void
  onDelete: (contactId: string) => Promise<void>
}

export function EmergencyContactCard({ contact, onEdit, onDelete }: EmergencyContactCardProps) {
  const [deleting, setDeleting] = useState(false)
  const handleDelete = async () => {
    if (!window.confirm(`Remove ${contact.name} from emergency contacts?`)) return
    setDeleting(true)
    try { await onDelete(contact.id) } finally { setDeleting(false) }
  }

  return (
    <Card className="border-2">
      <CardContent className="flex h-full flex-col justify-between gap-5 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary"><User className="h-7 w-7" /></div>
            <div><h3 className="text-xl font-black">{contact.name}</h3><p className="text-primary">{contact.relationship || "Emergency Contact"}</p><p className="text-muted-foreground">{contact.phone}</p></div>
          </div>
          <div className="flex gap-1"><Button variant="ghost" size="icon" onClick={() => onEdit(contact)} title="Edit contact"><Edit2 className="h-4 w-4" /></Button><Button variant="ghost" size="icon" onClick={handleDelete} disabled={deleting} title="Delete contact"><Trash2 className="h-4 w-4 text-red-500" /></Button></div>
        </div>
        <a href={`tel:${contact.phone}`} className="flex h-14 items-center justify-center gap-2 rounded-xl bg-primary font-bold text-primary-foreground"><Phone className="h-5 w-5" /> Call {contact.name.split(" ")[0]}</a>
      </CardContent>
    </Card>
  )
}
