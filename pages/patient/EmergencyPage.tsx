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
    </div>
  )
}
