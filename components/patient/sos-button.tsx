"use client"

import { Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { triggerEmergency } from "@/lib/mock-data"

export function SosButton() {
  const handleEmergency = () => {
    triggerEmergency()
    alert("Emergency SOS triggered! Contacting your emergency contacts and care team.")
  }

  return (
    <div className="relative w-full">
      {/* Pulsing background effect */}
      <div className="absolute inset-0 bg-red-600 rounded-xl animate-ping opacity-20"></div>
      
      <Button 
        onClick={handleEmergency}
        className="relative w-full min-h-20 h-20 rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center justify-center gap-4"
      >
        <Phone className="w-8 h-8 fill-current" />
        <span className="text-2xl font-bold tracking-wide">Emergency SOS</span>
      </Button>
    </div>
  )
}
