import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  getCurrentPatient,
  getTodaySchedule,
  getActiveMedications,
  getEmergencyContacts,
  getPatientDashboardData,
  markScheduleCompleted as serviceMarkScheduleCompleted,
  markMedicationTaken as serviceMarkMedicationTaken,
  addEmergencyContact as serviceAddEmergencyContact,
  updateEmergencyContact as serviceUpdateEmergencyContact,
  deleteEmergencyContact as serviceDeleteEmergencyContact,
  triggerSOS as serviceTriggerSOS,
  type PatientWithProfile,
  type ScheduleItemWithStatus,
  type MedicationWithLogStatus,
  type EmergencyContactRow,
  type PatientDashboardMetrics,
  type LocationCoordinates,
} from '@/lib/services/patientService'

export function useCurrentPatient() {
  const { user, role, loading: authLoading } = useAuth()
  const [patient, setPatient] = useState<PatientWithProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPatient = useCallback(async () => {
    if (authLoading) return
    if (!user || role === 'caregiver') {
      setPatient(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    try {
      setPatient(await getCurrentPatient())
    } catch (err: any) {
      console.error('useCurrentPatient error:', err)
      setError(err?.message || 'Failed to load patient information.')
    } finally {
      setLoading(false)
    }
  }, [authLoading, user, role])

  useEffect(() => {
    fetchPatient()
  }, [fetchPatient])

  return { patient, loading: authLoading || loading, error, refetch: fetchPatient }
}

export function useTodaySchedule(patientId?: string | null, date?: string) {
  const [schedules, setSchedules] = useState<ScheduleItemWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedule = useCallback(async () => {
    if (!patientId) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      setSchedules(await getTodaySchedule(patientId, date))
    } catch (err: any) {
      console.error('useTodaySchedule error:', err)
      setError(err?.message || 'Failed to load daily schedule.')
    } finally {
      setLoading(false)
    }
  }, [patientId, date])

  useEffect(() => {
    fetchSchedule()
  }, [fetchSchedule])

  const markCompleted = async (scheduleId: string, status: 'completed' | 'skipped' = 'completed') => {
    if (!patientId) return
    setSavingId(scheduleId)
    try {
      await serviceMarkScheduleCompleted(patientId, scheduleId, status)
      setSchedules((previous) => previous.map((item) => (
        item.id === scheduleId
          ? { ...item, isCompleted: status === 'completed', completionStatus: status }
          : item
      )))
    } catch (err: any) {
      console.error('markCompleted error:', err)
      setError(err?.message || 'Failed to update activity.')
      throw err
    } finally {
      setSavingId(null)
    }
  }

  return { schedules, loading, savingId, error, refetch: fetchSchedule, markCompleted }
}

export function usePatientMedications(patientId?: string | null, date?: string) {
  const [medications, setMedications] = useState<MedicationWithLogStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchMedications = useCallback(async () => {
    if (!patientId) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      setMedications(await getActiveMedications(patientId, date))
    } catch (err: any) {
      console.error('usePatientMedications error:', err)
      setError(err?.message || 'Failed to load medication reminders.')
    } finally {
      setLoading(false)
    }
  }, [patientId, date])

  useEffect(() => {
    fetchMedications()
  }, [fetchMedications])

  const markTaken = async (medicationId: string, scheduledFor?: string) => {
    if (!patientId) return
    setSavingId(medicationId)
    try {
      await serviceMarkMedicationTaken(patientId, medicationId, scheduledFor)
      setMedications((previous) => previous.map((medication) => (
        medication.id === medicationId
          ? { ...medication, isTakenToday: true, lastTakenAt: new Date().toISOString() }
          : medication
      )))
    } catch (err: any) {
      console.error('markTaken error:', err)
      setError(err?.message || 'Failed to record medication.')
      throw err
    } finally {
      setSavingId(null)
    }
  }

  return { medications, loading, savingId, error, refetch: fetchMedications, markTaken }
}

export function useEmergencyContacts(patientId?: string | null) {
  const [contacts, setContacts] = useState<EmergencyContactRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchContacts = useCallback(async () => {
    if (!patientId) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      setContacts(await getEmergencyContacts(patientId))
    } catch (err: any) {
      console.error('useEmergencyContacts error:', err)
      setError(err?.message || 'Failed to load emergency contacts.')
    } finally {
      setLoading(false)
    }
  }, [patientId])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  const addContact = async (data: { name: string; phone: string; relationship?: string }) => {
    if (!patientId) return
    const newContact = await serviceAddEmergencyContact(patientId, data)
    setContacts((previous) => [...previous, newContact])
    return newContact
  }

  const updateContact = async (contactId: string, data: { name: string; phone: string; relationship?: string }) => {
    if (!patientId) return
    const updated = await serviceUpdateEmergencyContact(patientId, contactId, data)
    setContacts((previous) => previous.map((contact) => contact.id === contactId ? updated : contact))
    return updated
  }

  const deleteContact = async (contactId: string) => {
    if (!patientId) return
    await serviceDeleteEmergencyContact(patientId, contactId)
    setContacts((previous) => previous.filter((contact) => contact.id !== contactId))
  }

  return { contacts, loading, error, refetch: fetchContacts, addContact, updateContact, deleteContact }
}

export function usePatientDashboard(patientId?: string | null) {
  const [dashboardData, setDashboardData] = useState<PatientDashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = useCallback(async () => {
    if (!patientId) {
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      setDashboardData(await getPatientDashboardData(patientId))
    } catch (err: any) {
      console.error('usePatientDashboard error:', err)
      setError(err?.message || 'Failed to load dashboard data.')
    } finally {
      setLoading(false)
    }
  }, [patientId])

  useEffect(() => {
    fetchDashboard()
  }, [fetchDashboard])

  return { dashboardData, loading, error, refetch: fetchDashboard }
}

export function useEmergencySOS(patientId?: string | null) {
  const [triggering, setTriggering] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)

  const trigger = async (location?: LocationCoordinates | null) => {
    if (!patientId) throw new Error('Patient record not found.')
    setTriggering(true)
    setStatusMessage('Sending emergency alert...')
    setIsSuccess(null)
    try {
      const result = await serviceTriggerSOS(patientId, location)
      setIsSuccess(result.smsResult.success)
      setStatusMessage(result.smsResult.message)
      return result
    } catch (err: any) {
      console.error('useEmergencySOS error:', err)
      setIsSuccess(false)
      setStatusMessage('Your emergency alert could not be sent.')
      throw err
    } finally {
      setTriggering(false)
    }
  }

  return {
    trigger,
    triggering,
    statusMessage,
    isSuccess,
    reset: () => {
      setStatusMessage(null)
      setIsSuccess(null)
    },
  }
}
