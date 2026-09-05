<<<<<<< HEAD
import { useEffect, useState } from 'react'; import { format, isPast } from 'date-fns'; import { Edit, Plus, Trash2 } from 'lucide-react'; import { toast } from 'sonner'; import { PageHeader } from '@/components/shared/page-header'; import { Button } from '@/components/ui/button'; import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'; import { Input } from '@/components/ui/input'; import { Label } from '@/components/ui/label'; import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; import { Textarea } from '@/components/ui/textarea'; import { Skeleton } from '@/components/ui/skeleton'; import { PatientSelector } from '@/components/caregiver/patient-selector'; import { useCaregiverPatients } from '@/features/caregiver/context'; import { CaregiverRepository } from '@/features/caregiver/repository'; import type { Reminder, ReminderFormData, ReminderType } from '@/features/caregiver/types'
const blank = (): ReminderFormData => ({ title: '', description: '', date: format(new Date(), 'yyyy-MM-dd'), time: '09:00', type: 'routine' }); const types: ReminderType[] = ['medication','game','appointment','routine','memory']
export default function CaregiverRemindersPage() { const { selectedPatient } = useCaregiverPatients(); const [items, setItems] = useState<Reminder[]>([]); const [editing, setEditing] = useState<Reminder | null>(null); const [form, setForm] = useState<ReminderFormData>(blank()); const [open, setOpen] = useState(false); const [filter, setFilter] = useState('all'); const [loading, setLoading] = useState(false); const load = async () => { if (!selectedPatient) return; setLoading(true); try { setItems(await CaregiverRepository.getReminders(selectedPatient.patientId)) } catch (e) { console.error(e); toast.error('Unable to load reminders. Please try again.') } finally { setLoading(false) } }; useEffect(() => { void load() }, [selectedPatient?.patientId]); const save = async (event: React.FormEvent) => { event.preventDefault(); if (!form.title.trim() || !form.date || !form.time || !selectedPatient) return toast.error('Title, date, and time are required.'); try { editing ? await CaregiverRepository.updateReminder(editing.id, form) : await CaregiverRepository.createReminder(selectedPatient.patientId, form); toast.success(editing ? 'Reminder updated.' : 'Reminder created.'); setOpen(false); await load() } catch (e) { console.error(e); toast.error('Unable to save reminder. Please try again.') } }; const filtered = items.filter((item) => filter === 'all' || item.type === filter); if (!selectedPatient) return <p className="text-muted-foreground">No patients assigned yet.</p>; return <div className="space-y-6"><div className="flex flex-col gap-4 sm:flex-row sm:justify-between"><PageHeader title="Reminders" subtitle="Manage medication and activity reminders"/><div className="flex gap-2"><PatientSelector/><Button onClick={() => { setEditing(null); setForm(blank()); setOpen(true) }}><Plus className="mr-2 h-4 w-4"/>Add Reminder</Button></div></div><div className="flex flex-wrap gap-2">{['all',...types].map((type) => <Button key={type} size="sm" variant={filter === type ? 'default' : 'outline'} onClick={() => setFilter(type)} className="capitalize">{type}</Button>)}</div>{loading ? <Skeleton className="h-48 w-full"/> : <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{filtered.length ? filtered.map((item) => <Card key={item.id}><CardHeader className="pb-2"><CardTitle className="flex justify-between gap-2 text-base"><span>{item.title}</span><span className="text-xs capitalize text-muted-foreground">{isPast(new Date(`${item.date}T${item.time}`)) ? 'Past' : item.type}</span></CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p>{item.description || 'No description'}</p><p className="text-muted-foreground">{item.date} · {item.time}</p><div className="flex gap-2"><Button variant="outline" size="sm" aria-label={`Edit ${item.title}`} onClick={() => { setEditing(item); setForm({ title:item.title, description:item.description ?? '', date:item.date, time:item.time, type:item.type as ReminderType }); setOpen(true) }}><Edit className="mr-1 h-3 w-3"/>Edit</Button><Button variant="destructive" size="sm" aria-label={`Delete ${item.title}`} onClick={async () => { if (window.confirm(`Delete reminder “${item.title}”?`)) { try { await CaregiverRepository.deleteReminder(item.id); toast.success('Reminder deleted.'); await load() } catch { toast.error('Unable to delete reminder.') } } }}><Trash2 className="mr-1 h-3 w-3"/>Delete</Button></div></CardContent></Card>) : <p className="text-muted-foreground">No reminders scheduled.</p>}</div>}<Dialog open={open} onOpenChange={setOpen}><DialogContent><DialogHeader><DialogTitle>{editing ? 'Edit reminder' : 'Add reminder'}</DialogTitle></DialogHeader><form onSubmit={save} className="space-y-4"><div><Label htmlFor="title">Title</Label><Input id="title" required value={form.title} onChange={(e) => setForm({...form,title:e.target.value})}/></div><div><Label htmlFor="description">Description</Label><Textarea id="description" value={form.description} onChange={(e) => setForm({...form,description:e.target.value})}/></div><div className="grid grid-cols-2 gap-3"><div><Label htmlFor="date">Date</Label><Input id="date" type="date" required value={form.date} onChange={(e) => setForm({...form,date:e.target.value})}/></div><div><Label htmlFor="time">Time</Label><Input id="time" type="time" required value={form.time} onChange={(e) => setForm({...form,time:e.target.value})}/></div></div><div><Label>Type</Label><Select value={form.type} onValueChange={(type: ReminderType) => setForm({...form,type})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{types.map((type) => <SelectItem key={type} value={type} className="capitalize">{type}</SelectItem>)}</SelectContent></Select></div><Button type="submit" className="w-full">{editing ? 'Save changes' : 'Create reminder'}</Button></form></DialogContent></Dialog></div> }
=======
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockReminders } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export default function CaregiverRemindersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <PageHeader title="Reminders" subtitle="Manage medication and activity reminders" />
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Reminder
        </Button>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockReminders.map((reminder) => (
          <Card key={reminder.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-base font-bold">{reminder.title}</CardTitle>
                <Badge variant={reminder.status === "active" ? "default" : "secondary"}>
                  {reminder.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Time: <span className="font-medium text-foreground">{reminder.time}</span></p>
                <p>Days: <span className="font-medium text-foreground">{Array.isArray(reminder.days) ? reminder.days.join(", ") : reminder.days}</span></p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
