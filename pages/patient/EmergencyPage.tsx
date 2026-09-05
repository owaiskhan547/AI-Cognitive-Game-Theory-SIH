<<<<<<< HEAD
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PhoneCall, User } from "lucide-react"
import { mockPatient } from "@/lib/mock-data"
import { SosButton } from "@/components/patient/sos-button"

export default function PatientEmergencyPage() {
  const contact = mockPatient.emergencyContact

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Emergency" 
        subtitle="Get help immediately"
        backHref="/patient/dashboard"
      />
      
      <div className="py-4">
        <SosButton />
        <p className="text-center text-muted-foreground mt-4 text-lg">
          Pressing this button will immediately alert your care team and emergency contacts.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Emergency Contact</h2>
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <User className="w-8 h-8 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold">{contact.name}</h3>
                <p className="text-xl text-muted-foreground">{contact.relation}</p>
                <p className="text-xl font-medium mt-1">{contact.phone}</p>
              </div>
            </div>
            
            <Button size="xl" className="w-full rounded-xl text-xl h-16 mt-6 flex items-center gap-3">
              <PhoneCall className="w-6 h-6" />
              Call {contact.name.split(' ')[0]}
            </Button>
          </CardContent>
        </Card>
      </div>
=======
import { useState } from "react"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Users, Plus, Loader2, AlertCircle, RefreshCw, PhoneCall } from "lucide-react"
import { useCurrentPatient, useEmergencyContacts } from "@/hooks/usePatientData"
import { SosButton } from "@/components/patient/sos-button"
import { EmergencyServiceCard } from "@/components/patient/emergency-service-card"
import { EmergencyContactCard } from "@/components/patient/emergency-contact-card"
import { AddEmergencyContactDialog } from "@/components/patient/add-emergency-contact-dialog"
import type { EmergencyContactRow } from "@/lib/services/patientService"

export default function PatientEmergencyPage() {
  const { patient, loading: patientLoading, error: patientError, refetch: refetchPatient } = useCurrentPatient()
  const {
    contacts,
    loading: contactsLoading,
    error: contactsError,
    refetch: refetchContacts,
    addContact,
    updateContact,
    deleteContact,
  } = useEmergencyContacts(patient?.id)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<EmergencyContactRow | null>(null)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleOpenAdd = () => {
    setEditingContact(null)
    setDialogOpen(true)
  }

  const handleOpenEdit = (contact: EmergencyContactRow) => {
    setEditingContact(contact)
    setDialogOpen(true)
  }

  const handleSaveContact = async (data: { name: string; phone: string; relationship: string }) => {
    if (editingContact) {
      await updateContact(editingContact.id, data)
      setFeedback(`Updated contact: ${data.name}`)
    } else {
      await addContact(data)
      setFeedback(`Added emergency contact: ${data.name}`)
    }
    setTimeout(() => setFeedback(null), 3500)
  }

  const handleDeleteContact = async (contactId: string) => {
    await deleteContact(contactId)
    setFeedback("Emergency contact removed.")
    setTimeout(() => setFeedback(null), 3500)
  }

  const isLoading = patientLoading || contactsLoading

  if (isLoading && contacts.length === 0) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Emergency Help & Contacts"
          subtitle="One-tap access to emergency response and trusted care contacts"
          backHref="/patient/dashboard"
        />
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
          <p className="text-xl font-bold text-foreground">Loading emergency contacts...</p>
        </div>
      </div>
    )
  }

  if (patientError || contactsError) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Emergency Help & Contacts"
          subtitle="One-tap access to emergency response and trusted care contacts"
          backHref="/patient/dashboard"
        />
        <div className="p-8 border-2 border-red-500/30 rounded-2xl bg-red-500/10 text-center max-w-xl mx-auto my-12 space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Unable to load emergency contacts</h2>
          <p className="text-base text-muted-foreground">
            {patientError || contactsError || "Please check your network connection and try again."}
          </p>
          <Button
            onClick={() => {
              refetchPatient()
              refetchContacts()
            }}
            className="gap-2 text-base font-bold"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Try Again</span>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-10 pb-16">
      <PageHeader
        title="Emergency Help & Contacts"
        subtitle="One-tap access to emergency response and trusted care contacts"
        backHref="/patient/dashboard"
      />

      {feedback && (
        <div className="p-4 rounded-xl bg-green-500/15 border border-green-500/40 text-green-400 font-bold text-center text-lg animate-in fade-in duration-200">
          {feedback}
        </div>
      )}

      {/* 1. Very Visible SOS Section */}
      <section>
        <SosButton patientId={patient?.id} showDirectCallingAlways={true} />
      </section>

      {/* 2. Official Emergency Services (Ambulance 108 & Emergency Response 112) */}
      <section>
        <EmergencyServiceCard />
      </section>

      {/* 3. Personal Emergency Contacts Section */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <Users className="w-7 h-7 text-primary shrink-0" />
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                Personal Emergency Contacts
              </h2>
              <p className="text-base text-muted-foreground">
                Your designated family members, caregivers, and doctors.
              </p>
            </div>
          </div>

          <Button
            onClick={handleOpenAdd}
            size="xl"
            className="h-14 px-6 rounded-xl font-bold text-lg bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-2 shadow-sm cursor-pointer select-none"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
            <span>+ ADD EMERGENCY CONTACT</span>
          </Button>
        </div>

        {contacts.length === 0 ? (
          <div className="text-center py-16 px-6 border-2 border-dashed border-border/80 rounded-3xl bg-secondary/10 max-w-lg mx-auto space-y-4">
            <PhoneCall className="w-16 h-16 text-muted-foreground/50 mx-auto" />
            <h3 className="text-2xl font-bold text-foreground">
              You have no saved emergency contacts.
            </h3>
            <p className="text-base sm:text-lg text-muted-foreground">
              Add your daughter, son, doctor, or family member so you can call them in one tap.
            </p>
            <div className="pt-2">
              <Button
                onClick={handleOpenAdd}
                size="xl"
                className="h-16 px-8 rounded-xl font-black text-lg bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer shadow-md"
              >
                <Plus className="w-6 h-6 stroke-[3] mr-2" />
                <span>ADD EMERGENCY CONTACT</span>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {contacts.map((contact) => (
              <EmergencyContactCard
                key={contact.id}
                contact={contact}
                onEdit={handleOpenEdit}
                onDelete={handleDeleteContact}
              />
            ))}
          </div>
        )}
      </section>

      {/* Add / Edit Dialog */}
      <AddEmergencyContactDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingContact}
        onSave={handleSaveContact}
      />
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
    </div>
  )
}
