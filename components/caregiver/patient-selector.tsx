import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCaregiverPatients } from "@/features/caregiver/context"

export function PatientSelector() {
  const { patients, selectedPatient, selectPatient } = useCaregiverPatients()
  return (
    <div className="w-full sm:w-64">
      <Label htmlFor="patient" className="text-zinc-400">
        Patient
      </Label>
      <Select value={selectedPatient?.patientId} onValueChange={selectPatient}>
        <SelectTrigger id="patient" className="mt-1 h-11 rounded-full border-white/10 bg-[#111827]">
          <SelectValue placeholder="Select a patient" />
        </SelectTrigger>
        <SelectContent>
          {patients.map((patient) => (
            <SelectItem key={patient.patientId} value={patient.patientId}>
              {patient.fullName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
