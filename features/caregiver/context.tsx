import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { CaregiverRepository } from './repository'
import type { AssignedPatientSummary } from './types'

type CaregiverPatientsContextValue = { patients: AssignedPatientSummary[]; selectedPatient: AssignedPatientSummary | null; selectPatient: (patientId: string) => void; loading: boolean; error: string | null; reload: () => Promise<void> }
const CaregiverPatientsContext = createContext<CaregiverPatientsContextValue | undefined>(undefined)
export function CaregiverPatientsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth(); const [patients, setPatients] = useState<AssignedPatientSummary[]>([]); const [selectedId, setSelectedId] = useState<string | null>(null); const [loading, setLoading] = useState(true); const [error, setError] = useState<string | null>(null)
  const reload = async () => { if (!user) { setPatients([]); setLoading(false); return }; setLoading(true); setError(null); try { const result = await CaregiverRepository.getAssignedPatients(user.id); setPatients(result); const stored = localStorage.getItem(`caregiver-patient:${user.id}`); setSelectedId(result.some((p) => p.patientId === stored) ? stored : result[0]?.patientId ?? null) } catch (err) { console.error('Unable to load caregiver patients', err); setError('Unable to load assigned patients. Please try again.') } finally { setLoading(false) } }
  useEffect(() => { void reload() }, [user?.id])
  const selectPatient = (patientId: string) => { setSelectedId(patientId); if (user) localStorage.setItem(`caregiver-patient:${user.id}`, patientId) }
  return <CaregiverPatientsContext.Provider value={{ patients, selectedPatient: patients.find((patient) => patient.patientId === selectedId) ?? null, selectPatient, loading, error, reload }}>{children}</CaregiverPatientsContext.Provider>
}
export function useCaregiverPatients() { const context = useContext(CaregiverPatientsContext); if (!context) throw new Error('useCaregiverPatients must be used within CaregiverPatientsProvider'); return context }
