import { Ambulance, Phone, ShieldAlert } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { EMERGENCY_SERVICES, getEmergencyServicesList, type EmergencyServiceConfig } from "@/config/emergencyServices"

export function EmergencyServiceCard({ services = getEmergencyServicesList() }: { services?: EmergencyServiceConfig[] }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ShieldAlert className="h-6 w-6 text-red-500" />
        <h2 className="text-2xl font-extrabold">Emergency Services</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {services.map((service) => {
          const ambulance = service.id === EMERGENCY_SERVICES.AMBULANCE.id
          return (
            <Card key={service.id} className={ambulance ? "border-2 border-red-500/50" : "border-2 border-blue-500/50"}>
              <CardContent className="flex h-full flex-col justify-between gap-4 p-6">
                <div className="flex items-start gap-4">
                  {ambulance ? <Ambulance className="h-10 w-10 shrink-0 text-red-500" /> : <ShieldAlert className="h-10 w-10 shrink-0 text-blue-500" />}
                  <div><h3 className="text-xl font-black">{service.title}</h3><p className="text-muted-foreground">{service.subtitle}</p><p className="text-sm text-muted-foreground">{service.description}</p></div>
                </div>
                <a href={`tel:${service.phone}`} className={ambulance ? "flex h-14 items-center justify-center gap-2 rounded-xl bg-red-600 font-bold text-white" : "flex h-14 items-center justify-center gap-2 rounded-xl bg-blue-600 font-bold text-white"}>
                  <Phone className="h-5 w-5" /> Call {service.phone}
                </a>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
