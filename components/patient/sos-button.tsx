import { useState } from "react"
import { AlertCircle, CheckCircle2, Loader2, Phone, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { triggerSOS, type LocationCoordinates } from "@/lib/services/patientService"

interface SosButtonProps {
  patientId?: string | null
  showDirectCallingAlways?: boolean
}

export function SosButton({ patientId, showDirectCallingAlways = false }: SosButtonProps) {
  const [working, setWorking] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const handleEmergency = async () => {
    if (working) return
    setWorking(true)
    setFeedback(null)
    let location: LocationCoordinates | null = null
    if ("geolocation" in navigator) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 8000 })
        })
        location = { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy }
      } catch {
        setFeedback("Location was unavailable. The alert can still be recorded.")
      }
    }
    try {
      if (patientId) {
        const result = await triggerSOS(patientId, location)
        setFeedback(result.smsResult.message)
      } else {
        setFeedback("Emergency alert recorded. Please call emergency services directly.")
      }
    } catch {
      setFeedback("Unable to send the alert. Please call emergency services directly.")
    } finally {
      setWorking(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full">
        {!working && <div className="absolute inset-0 animate-ping rounded-xl bg-red-600 opacity-20" />}
        <Button
        onClick={handleEmergency}
          disabled={working}
          className="relative flex h-24 w-full items-center justify-center gap-4 rounded-xl bg-red-600 text-2xl font-bold text-white shadow-lg hover:bg-red-700"
        >
          {working ? <Loader2 className="h-8 w-8 animate-spin" /> : <ShieldAlert className="h-8 w-8" />}
          <span>{working ? "Sending alert..." : "Emergency SOS"}</span>
        </Button>
      </div>
      {feedback && <div className="flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-center text-sm font-semibold text-green-600"><CheckCircle2 className="h-5 w-5" />{feedback}</div>}
      {showDirectCallingAlways && <a href="tel:112" className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-red-500 text-lg font-bold text-red-600"><Phone className="h-5 w-5" />Call emergency services</a>}
    </div>
  )
}
