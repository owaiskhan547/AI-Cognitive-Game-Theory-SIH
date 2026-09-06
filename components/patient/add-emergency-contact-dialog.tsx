import { useEffect, useState } from "react"
import { Heart, Phone, User } from "lucide-react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import type { EmergencyContactRow } from "@/lib/services/patientService"

interface AddEmergencyContactDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData?: EmergencyContactRow | null
  onSave: (data: { name: string; phone: string; relationship: string }) => Promise<void>
}

export function AddEmergencyContactDialog({ open, onOpenChange, initialData, onSave }: AddEmergencyContactDialogProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [relationship, setRelationship] = useState("Family")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setName(initialData?.name || "")
    setPhone(initialData?.phone || "")
    setRelationship(initialData?.relationship || "Family")
    setError("")
  }, [initialData, open])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    const cleanName = name.trim()
    const cleanPhone = phone.trim()
    if (!cleanName || !cleanPhone || !/^\+?[0-9\s()\-]{3,}$/.test(cleanPhone)) { setError("Enter a name and valid phone number."); return }
    setSaving(true)
    try { await onSave({ name: cleanName, phone: cleanPhone, relationship: relationship.trim() || "Emergency Contact" }); onOpenChange(false) }
    catch (err: any) { setError(err?.message || "Unable to save contact.") }
    finally { setSaving(false) }
  }

  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>{initialData ? "Edit Emergency Contact" : "Add Emergency Contact"}</DialogTitle></DialogHeader>{error && <p className="rounded-lg bg-red-500/10 p-3 text-sm text-red-500">{error}</p>}<form onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label htmlFor="contact-name">Full Name</Label><div className="relative"><User className="absolute left-3 top-3 h-5 w-5 text-primary" /><Input id="contact-name" className="pl-10" value={name} onChange={(event) => setName(event.target.value)} placeholder="Priya Kumar" /></div></div><div className="space-y-2"><Label htmlFor="contact-relationship">Relationship</Label><div className="relative"><Heart className="absolute left-3 top-3 h-5 w-5 text-primary" /><Input id="contact-relationship" className="pl-10" value={relationship} onChange={(event) => setRelationship(event.target.value)} placeholder="Daughter" /></div></div><div className="space-y-2"><Label htmlFor="contact-phone">Phone Number</Label><div className="relative"><Phone className="absolute left-3 top-3 h-5 w-5 text-primary" /><Input id="contact-phone" type="tel" className="pl-10" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+91 98765 43210" /></div></div><DialogFooter><Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving..." : initialData ? "Save Changes" : "Add Contact"}</Button></DialogFooter></form></DialogContent></Dialog>
}
