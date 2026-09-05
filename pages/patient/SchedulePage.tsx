import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Circle, Calendar, Loader2, AlertCircle, RefreshCw, Plus, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCurrentPatient, useTodaySchedule } from "@/hooks/usePatientData"
import { addScheduleItem, deleteScheduleItem, updateScheduleItem } from "@/lib/services/patientService"

export default function PatientSchedulePage() {
  const { patient, loading: patientLoading, error: patientError } = useCurrentPatient()
  const { schedules, loading: schedLoading, savingId, error: schedError, refetch, markCompleted } = useTodaySchedule(patient?.id)

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<any | null>(null)
  const [form, setForm] = useState({ title: "", description: "", date: new Date().toISOString().slice(0, 10), time: "09:00", type: "routine" })

  const resetForm = () => {
    setForm({ title: "", description: "", date: new Date().toISOString().slice(0, 10), time: "09:00", type: "routine" })
    setEditingItem(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    if (!patient?.id) return
    if (!form.title.trim()) {
      setFeedbackMsg("Activity title is required.")
      setTimeout(() => setFeedbackMsg(null), 3000)
      return
    }

    try {
      if (editingItem) {
        await updateScheduleItem(patient.id, editingItem.id, form)
        setFeedbackMsg("Schedule updated.")
      } else {
        await addScheduleItem(patient.id, form)
        setFeedbackMsg("Schedule item added.")
      }
      resetForm()
      await refetch()
    } catch (err: any) {
      console.error("Failed to save schedule item:", err)
      setFeedbackMsg(err?.message || "Unable to save schedule item.")
    }
    setTimeout(() => setFeedbackMsg(null), 3000)
  }

  const handleDelete = async (scheduleId: string, title: string) => {
    if (!patient?.id) return
    try {
      await deleteScheduleItem(patient.id, scheduleId)
      setFeedbackMsg(`Deleted ${title}.`)
      await refetch()
    } catch (err: any) {
      console.error("Failed to delete schedule item:", err)
      setFeedbackMsg(err?.message || "Unable to delete schedule item.")
    }
    setTimeout(() => setFeedbackMsg(null), 3000)
  }

  const handleToggle = async (scheduleId: string, currentlyCompleted: boolean) => {
    try {
      const nextStatus = currentlyCompleted ? "skipped" : "completed"
      await markCompleted(scheduleId, nextStatus)
      setFeedbackMsg(nextStatus === "completed" ? "Activity marked completed!" : "Activity marked pending.")
      setTimeout(() => setFeedbackMsg(null), 3000)
    } catch (err: any) {
      console.error("Failed to update activity completion:", err)
      setFeedbackMsg("Failed to update activity. Please try again.")
      setTimeout(() => setFeedbackMsg(null), 3000)
    }
  }

  const isLoading = patientLoading || schedLoading

  if (isLoading && schedules.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Today's Schedule" 
          subtitle="Your appointments and daily activities"
          backHref="/patient/dashboard"
        />
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-xl font-bold text-foreground">Loading your schedule...</p>
        </div>
      </div>
    )
  }

  if (patientError || schedError) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="Today's Schedule" 
          subtitle="Your appointments and daily activities"
          backHref="/patient/dashboard"
        />
        <div className="p-8 border-2 border-red-500/30 rounded-2xl bg-red-500/10 text-center max-w-xl mx-auto my-12 space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Unable to load schedule</h2>
          <p className="text-base text-muted-foreground">
            {patientError || schedError || "Please check your network connection and try again."}
          </p>
          <Button onClick={() => refetch()} className="gap-2 text-base font-bold">
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="Today's Schedule" 
        subtitle="Your appointments and daily activities"
        backHref="/patient/dashboard"
      />

      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-primary/15 border border-primary/30 text-primary font-bold text-center text-lg animate-in fade-in duration-200">
          {feedbackMsg}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={() => { setEditingItem(null); setForm({ title: "", description: "", date: new Date().toISOString().slice(0, 10), time: "09:00", type: "routine" }); setShowForm(true) }} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Activity
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 border border-border">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Morning walk" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional details" />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Time</Label>
              <Input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Type</Label>
              <Input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} placeholder="routine, appointment, exercise" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingItem ? "Save Changes" : "Add Activity"}</Button>
          </div>
        </Card>
      )}

      {schedules.length === 0 ? (
        <div className="text-center py-16 px-6 border-2 border-dashed border-border/70 rounded-2xl bg-secondary/10 max-w-xl mx-auto space-y-3">
          <Calendar className="w-16 h-16 text-muted-foreground/50 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-foreground">No activities scheduled for today.</h3>
          <p className="text-lg text-muted-foreground">
            You have no planned events, appointments, or exercises scheduled today. Enjoy your day!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((item) => {
            const isSaving = savingId === item.id

            return (
              <Card
                key={item.id}
                className={cn(
                  "overflow-hidden border-2 transition-all shadow-sm rounded-2xl",
                  item.isCompleted
                    ? "border-green-500/30 bg-green-500/5 opacity-85"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6 border-l-8",
                  item.isCompleted ? "border-l-green-500" : "border-l-primary"
                )}>
                  {/* Left: Time & Activity Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 flex-1">
                    <div className="w-28 shrink-0">
                      <div className="text-2xl sm:text-3xl font-black text-foreground">
                        {item.time}
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "mt-1 text-xs sm:text-sm font-bold uppercase",
                          item.isCompleted ? "border-green-500/40 text-green-500" : "border-border"
                        )}
                      >
                        {item.type || "Routine"}
                      </Badge>
                    </div>

                    <div className="space-y-1 sm:border-l sm:border-border/60 sm:pl-6 flex-1">
                      <h3 className={cn(
                        "text-xl sm:text-2xl font-bold text-foreground",
                        item.isCompleted && "line-through text-muted-foreground"
                      )}>
                        {item.title}
                      </h3>
                      {item.description && (
                        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Interactive Completion Action Button */}
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <Button
                      onClick={() => handleToggle(item.id, item.isCompleted)}
                      disabled={isSaving}
                      size="xl"
                      variant={item.isCompleted ? "outline" : "default"}
                      className={cn(
                        "h-16 px-6 rounded-xl text-lg font-bold flex items-center gap-3 w-full sm:w-auto transition-all cursor-pointer select-none",
                        item.isCompleted
                          ? "border-2 border-green-500/40 text-green-500 hover:bg-green-500/10 hover:border-green-500"
                          : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm"
                      )}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="w-6 h-6 animate-spin" />
                          <span>SAVING...</span>
                        </>
                      ) : item.isCompleted ? (
                        <>
                          <CheckCircle2 className="w-7 h-7 text-green-500 fill-green-500/20" />
                          <span>✓ Completed</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-7 h-7 text-primary-foreground/70" />
                          <span>Mark Done</span>
                        </>
                      )}
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditingItem(item); setForm({ title: item.title, description: item.description || "", date: item.date, time: item.time, type: item.type || "routine" }); setShowForm(true) }}>
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id, item.title)}>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
