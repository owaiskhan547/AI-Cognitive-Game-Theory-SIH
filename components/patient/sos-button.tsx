import { useState } from "react"
import { CheckCircle2, Loader2, Phone, ShieldAlert } from "lucide-react"
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
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleEmergency}
        disabled={working}
        className="flex h-[72px] w-full items-center justify-center gap-4 rounded-2xl bg-[#7f1d1d] text-white transition hover:bg-[#991b1b] disabled:opacity-80"
      >
        {working ? <Loader2 className="size-8 animate-spin" /> : <ShieldAlert className="size-8" />}
        <span className="text-left">
          <span className="block text-xl font-bold">{working ? "Sending alert..." : "Emergency SOS"}</span>
          <span className="block text-sm font-normal text-red-100/80">Get help immediately.</span>
        </span>
      </button>
      {feedback && (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-center text-sm font-semibold text-green-500">
          <CheckCircle2 className="h-5 w-5" />
          {feedback}
        </div>
      )}
      {showDirectCallingAlways && (
        <a href="tel:112" className="flex h-14 items-center justify-center gap-2 rounded-xl border-2 border-red-500 text-lg font-bold text-red-500">
          <Phone className="h-5 w-5" />
          Call emergency services
        </a>
      )}
    </div>
  )
}
