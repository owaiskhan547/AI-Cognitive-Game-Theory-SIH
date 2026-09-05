import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
<<<<<<< HEAD
import { CheckCircle2, Clock } from "lucide-react"
import { mockMedications, markMedicationTaken } from "@/lib/mock-data"

export default function PatientMedicationsPage() {
  const [meds, setMeds] = useState(mockMedications)

  const handleTake = (id: string) => {
    markMedicationTaken(id)
    setMeds(meds.map(m => m.id === id ? { ...m, taken: true } : m))
  }

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Medications" 
        subtitle="Track your daily medications"
        backHref="/patient/dashboard"
      />
      
      <div className="space-y-4">
        {meds.map((med) => (
          <Card key={med.id} className={med.taken ? "bg-secondary/10" : ""}>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-6 justify-between sm:items-center">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold">{med.name}</h3>
                    {med.taken && (
                      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 text-sm">
                        Taken
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-lg text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-5 h-5" />
                      {med.time}
                    </span>
                    <span>•</span>
                    <span>{med.dosage}</span>
                    <span>•</span>
                    <span>{med.frequency}</span>
                  </div>
                </div>
                
                <div className="shrink-0">
                  {med.taken ? (
                    <div className="flex items-center justify-center gap-2 text-primary font-medium p-4 bg-primary/10 rounded-xl h-16 w-full sm:w-40">
                      <CheckCircle2 className="w-6 h-6" />
                      <span className="text-lg">Done</span>
                    </div>
                  ) : (
                    <Button 
                      onClick={() => handleTake(med.id)} 
                      size="xl" 
                      className="w-full sm:w-40 h-16 rounded-xl text-lg"
                    >
                      Take Now
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
=======
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Clock, Pill, Loader2, AlertCircle, RefreshCw, Sparkles, Plus, Pencil, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCurrentPatient, usePatientMedications } from "@/hooks/usePatientData"
import { addMedication, deleteMedication, updateMedication } from "@/lib/services/patientService"

export default function PatientMedicationsPage() {
  const { patient, loading: patientLoading, error: patientError } = useCurrentPatient()
  const {
    medications,
    loading: medsLoading,
    savingId,
    error: medsError,
    refetch,
    markTaken,
  } = usePatientMedications(patient?.id)

  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingMed, setEditingMed] = useState<any | null>(null)
  const [form, setForm] = useState({ name: "", dosage: "", frequency: "", instructions: "" })

  const resetForm = () => {
    setForm({ name: "", dosage: "", frequency: "", instructions: "" })
    setEditingMed(null)
    setShowForm(false)
  }

  const handleSubmit = async () => {
    if (!patient?.id) return
    if (!form.name.trim() || !form.dosage.trim() || !form.frequency.trim()) {
      setFeedbackMsg("Please fill in the medication name, dosage, and frequency.")
      setTimeout(() => setFeedbackMsg(null), 3000)
      return
    }

    try {
      if (editingMed) {
        await updateMedication(patient.id, editingMed.id, form)
        setFeedbackMsg("Medication updated.")
      } else {
        await addMedication(patient.id, form)
        setFeedbackMsg("Medication added.")
      }
      resetForm()
      await refetch()
    } catch (err: any) {
      console.error("Failed to save medication:", err)
      setFeedbackMsg(err?.message || "Unable to save medication.")
    }
    setTimeout(() => setFeedbackMsg(null), 3000)
  }

  const handleDelete = async (medicationId: string, medicationName: string) => {
    if (!patient?.id) return
    try {
      await deleteMedication(patient.id, medicationId)
      setFeedbackMsg(`Deleted ${medicationName}.`)
      await refetch()
    } catch (err: any) {
      console.error("Failed to delete medication:", err)
      setFeedbackMsg(err?.message || "Unable to delete medication.")
    }
    setTimeout(() => setFeedbackMsg(null), 3000)
  }

  const handleTakeNow = async (medicationId: string, medicationName: string) => {
    try {
      await markTaken(medicationId)
      setFeedbackMsg(`✓ Recorded: ${medicationName} taken for today!`)
      setTimeout(() => setFeedbackMsg(null), 3500)
    } catch (err: any) {
      console.error("Failed to record medication taken:", err)
      setFeedbackMsg("Could not record medication. Please try again.")
      setTimeout(() => setFeedbackMsg(null), 3500)
    }
  }

  const isLoading = patientLoading || medsLoading

  if (isLoading && medications.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="My Medications" 
          subtitle="Track your daily medications and doses"
          backHref="/patient/dashboard"
        />
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-xl font-bold text-foreground">Loading your medication reminders...</p>
        </div>
      </div>
    )
  }

  if (patientError || medsError) {
    return (
      <div className="space-y-6">
        <PageHeader 
          title="My Medications" 
          subtitle="Track your daily medications and doses"
          backHref="/patient/dashboard"
        />
        <div className="p-8 border-2 border-red-500/30 rounded-2xl bg-red-500/10 text-center max-w-xl mx-auto my-12 space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Unable to load medications</h2>
          <p className="text-base text-muted-foreground">
            {patientError || medsError || "Please check your connection and try again."}
          </p>
          <Button onClick={() => refetch()} className="gap-2 text-base font-bold">
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </Button>
        </div>
      </div>
    )
  }

  const takenCount = medications.filter((m) => m.isTakenToday).length
  const totalCount = medications.length

  return (
    <div className="space-y-6 pb-12">
      <PageHeader 
        title="My Medications" 
        subtitle="Track your daily medications and doses"
        backHref="/patient/dashboard"
      />

      {feedbackMsg && (
        <div className="p-4 rounded-xl bg-green-500/15 border border-green-500/40 text-green-400 font-bold text-center text-lg animate-in fade-in duration-200">
          {feedbackMsg}
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={() => { setEditingMed(null); setForm({ name: "", dosage: "", frequency: "", instructions: "" }); setShowForm(true) }} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Medication
        </Button>
      </div>

      {showForm && (
        <Card className="p-4 border border-border">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Donepezil" />
            </div>
            <div className="space-y-2">
              <Label>Dosage</Label>
              <Input value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} placeholder="10 mg" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Frequency</Label>
              <Input value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })} placeholder="Once daily" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Instructions</Label>
              <Input value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} placeholder="Take after breakfast" />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSubmit}>{editingMed ? "Save Changes" : "Add Medication"}</Button>
          </div>
        </Card>
      )}

      {/* Daily Medication Summary Banner */}
      {totalCount > 0 && (
        <div className="p-6 rounded-2xl border-2 border-border/80 bg-card shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Pill className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Today's Dosage Status</h2>
              <p className="text-base text-muted-foreground">
                {takenCount === totalCount
                  ? "All daily medications taken. Excellent!"
                  : `${takenCount} of ${totalCount} doses completed.`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-3xl sm:text-4xl font-black text-foreground">{takenCount}</span>
            <span className="text-xl font-bold text-muted-foreground">/ {totalCount} Taken</span>
          </div>
        </div>
      )}

      {medications.length === 0 ? (
        <div className="text-center py-16 px-6 border-2 border-dashed border-border/70 rounded-2xl bg-secondary/10 max-w-xl mx-auto space-y-3">
          <Pill className="w-16 h-16 text-muted-foreground/50 mx-auto mb-2" />
          <h3 className="text-2xl font-bold text-foreground">No medication reminders for today.</h3>
          <p className="text-lg text-muted-foreground">
            You do not have any active medication reminders scheduled right now.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {medications.map((med) => {
            const isSaving = savingId === med.id

            return (
              <Card
                key={med.id}
                className={cn(
                  "overflow-hidden border-2 transition-all shadow-sm rounded-2xl",
                  med.isTakenToday
                    ? "border-green-500/30 bg-green-500/5 opacity-85"
                    : "border-border hover:border-primary/50 bg-card"
                )}
              >
                <div className={cn(
                  "flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-6 border-l-8",
                  med.isTakenToday ? "border-l-green-500" : "border-l-primary"
                )}>
                  {/* Left: Medicine Name, Dosage, Frequency, Instructions */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                        {med.name}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="text-base font-bold bg-primary/15 text-primary border-primary/30 px-3 py-1"
                      >
                        {med.dosage}
                      </Badge>
                      {med.isTakenToday && (
                        <Badge className="bg-green-500/15 text-green-500 border border-green-500/40 text-sm font-bold px-3 py-1">
                          ✓ TAKEN
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-base sm:text-lg text-muted-foreground">
                      <span className="flex items-center gap-1.5 font-semibold text-foreground">
                        <Clock className="w-5 h-5 text-primary shrink-0" />
                        {med.frequency}
                      </span>
                      {med.instructions && (
                        <>
                          <span>•</span>
                          <span className="text-muted-foreground">{med.instructions}</span>
                        </>
                      )}
                    </div>

                    {med.isTakenToday && med.lastTakenAt && (
                      <p className="text-xs sm:text-sm text-green-500/90 font-medium">
                        Taken today at {new Date(med.lastTakenAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>

                  {/* Right: Interactive Take Now / Taken Button */}
                  <div className="shrink-0 w-full sm:w-auto flex flex-col gap-2">
                    {med.isTakenToday ? (
                      <div className="flex items-center justify-center gap-2.5 px-6 py-4 bg-green-500/15 border-2 border-green-500/30 text-green-500 font-black rounded-xl text-xl w-full sm:w-44 h-16 shadow-inner">
                        <CheckCircle2 className="w-7 h-7 shrink-0" />
                        <span>✓ TAKEN</span>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleTakeNow(med.id, med.name)}
                        disabled={isSaving}
                        size="xl"
                        className="w-full sm:w-44 h-16 rounded-xl text-xl font-black bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>SAVING...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            <span>TAKE NOW</span>
                          </>
                        )}
                      </Button>
                    )}
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditingMed(med); setForm({ name: med.name, dosage: med.dosage, frequency: med.frequency, instructions: med.instructions || "" }); setShowForm(true) }}>
                        <Pencil className="w-4 h-4" />
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" className="flex-1" onClick={() => handleDelete(med.id, med.name)}>
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
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
    </div>
  )
}
