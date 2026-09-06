import { CheckCircle2, Pill } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MedicationWithLogStatus } from "@/lib/services/patientService"

interface MedicationCardProps {
  medications: MedicationWithLogStatus[]
  onTakeMedication: (medicationId: string) => Promise<void>
  savingId: string | null
}

function PillBottle() {
  return (
    <div className="relative flex justify-center py-2">
      <span className="absolute inset-0 m-auto size-24 rounded-full bg-primary/15 blur-2xl" />
      <svg viewBox="0 0 80 96" className="relative h-24 w-20 text-primary" aria-hidden>
        <rect x="22" y="6" width="36" height="12" rx="3" fill="currentColor" opacity="0.9" />
        <rect x="18" y="16" width="44" height="8" rx="2" fill="currentColor" />
        <path d="M16 28h48v52a12 12 0 0 1-12 12H28a12 12 0 0 1-12-12V28Z" fill="#1f2937" stroke="currentColor" strokeWidth="2" />
        <path d="M34 44h12M28 56h24M32 68h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <circle cx="58" cy="34" r="10" fill="#14532d" />
        <path d="M58 28v12M52 34h12" stroke="#A3E635" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export function MedicationCard({ medications, onTakeMedication, savingId }: MedicationCardProps) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-white/10 bg-[#111827] p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Medications</h2>
        <Link to="/patient/medications" className="text-sm font-medium text-primary hover:underline">
          View All
        </Link>
      </div>
      <div className="mt-4 flex flex-1 flex-col justify-center">
        {medications.length === 0 ? (
          <div className="text-center">
            <PillBottle />
            <p className="mt-2 font-medium text-foreground">No active medications</p>
            <p className="text-sm text-zinc-400">You&apos;re all set!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {medications.slice(0, 3).map((med) => (
              <div
                key={med.id}
                className={cn(
                  "flex flex-col gap-3 rounded-xl border border-white/8 bg-black/30 p-4 sm:flex-row sm:items-center",
                  med.isTakenToday && "opacity-70",
                )}
              >
                <div className="flex flex-1 items-center gap-3">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                    <Pill className="size-5" />
                  </span>
                  <div>
                    <h3 className="font-semibold">{med.name}</h3>
                    <p className="text-sm text-zinc-400">
                      {med.dosage} • {med.frequency}
                    </p>
                  </div>
                </div>
                {med.isTakenToday ? (
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <CheckCircle2 className="size-5" />
                    Taken
                  </div>
                ) : (
                  <Button onClick={() => onTakeMedication(med.id)} disabled={savingId === med.id} className="rounded-full">
                    {savingId === med.id ? "Saving..." : "Take Now"}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
