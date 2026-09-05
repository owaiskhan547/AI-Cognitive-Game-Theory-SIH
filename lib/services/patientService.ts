/**
 * lib/services/patientService.ts
 * Patient service layer handling all Supabase interactions for the Patient module.
 * Never hardcodes patient IDs - always resolves against the authenticated session.
 */

import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import type { Database } from '@/types/database.types'

export type PatientRow = Database['public']['Tables']['patients']['Row']
export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type ScheduleRow = Database['public']['Tables']['schedules']['Row']
export type ScheduleCompletionRow = Database['public']['Tables']['schedule_completions']['Row']
export type MedicationRow = Database['public']['Tables']['medications']['Row']
export type MedicationLogRow = Database['public']['Tables']['medication_logs']['Row']
export type EmergencyContactRow = Database['public']['Tables']['emergency_contacts']['Row']
export type EmergencyEventRow = Database['public']['Tables']['emergency_events']['Row']

export interface PatientWithProfile extends PatientRow {
  profile: ProfileRow
}

export interface ScheduleItemWithStatus extends ScheduleRow {
  isCompleted: boolean
  completionStatus?: 'completed' | 'skipped' | null
  completedAt?: string | null
}

export interface MedicationWithLogStatus extends MedicationRow {
  isTakenToday: boolean
  lastTakenAt?: string | null
}

export interface PatientDashboardMetrics {
  patient: PatientWithProfile
  todaySchedule: ScheduleItemWithStatus[]
  medications: MedicationWithLogStatus[]
  emergencyContacts: EmergencyContactRow[]
  totalTasks: number
  completedTasks: number
  remainingTasks: number
  nextTask: ScheduleItemWithStatus | null
  medicationsTotal: number
  medicationsTaken: number
  medicationsPending: number
}

export interface LocationCoordinates {
  latitude: number
  longitude: number
  accuracy?: number
}

/**
 * Returns today's date formatted as YYYY-MM-DD in local time
 */
export function getLocalTodayDateString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const DEMO_PATIENT_ID = 'demo-patient-id'
const DEMO_STORE_KEY = 'smriti_demo_store_v1'

function createDemoSchedule(): any[] {
  const today = getLocalTodayDateString()
  return [
    {
      id: 'demo-schedule-1',
      patient_id: DEMO_PATIENT_ID,
      title: 'Morning Walk',
      description: 'Take a relaxed 20-minute walk outside.',
      date: today,
      time: '08:00',
      type: 'exercise',
      created_at: new Date().toISOString(),
      completionStatus: 'completed',
      completedAt: new Date().toISOString(),
    },
    {
      id: 'demo-schedule-2',
      patient_id: DEMO_PATIENT_ID,
      title: 'Medication Review',
      description: 'Check the medications for the day.',
      date: today,
      time: '10:00',
      type: 'reminder',
      created_at: new Date().toISOString(),
      completionStatus: null,
      completedAt: null,
    },
    {
      id: 'demo-schedule-3',
      patient_id: DEMO_PATIENT_ID,
      title: 'Family Call',
      description: 'Speak with family members for 15 minutes.',
      date: today,
      time: '18:30',
      type: 'call',
      created_at: new Date().toISOString(),
      completionStatus: null,
      completedAt: null,
    },
  ]
}

function createDemoMedications(): any[] {
  return [
    {
      id: 'demo-med-1',
      patient_id: DEMO_PATIENT_ID,
      name: 'Donepezil',
      dosage: '10 mg',
      frequency: 'Once daily',
      instructions: 'Take after breakfast.',
      is_active: true,
      created_at: new Date().toISOString(),
      isTakenToday: true,
      lastTakenAt: new Date().toISOString(),
    },
    {
      id: 'demo-med-2',
      patient_id: DEMO_PATIENT_ID,
      name: 'Vitamin D',
      dosage: '1000 IU',
      frequency: 'Once daily',
      instructions: 'Take with lunch.',
      is_active: true,
      created_at: new Date().toISOString(),
      isTakenToday: false,
      lastTakenAt: null,
    },
  ]
}

function createDemoMemories(): any[] {
  return [
    {
      id: 'demo-memory-1',
      patient_id: DEMO_PATIENT_ID,
      title: 'Family Picnic',
      description: 'A joyful afternoon at the park with the children and grandchildren.',
      media_url: null,
      created_at: new Date().toISOString(),
    },
    {
      id: 'demo-memory-2',
      patient_id: DEMO_PATIENT_ID,
      title: 'Birthday Celebration',
      description: 'A special birthday dinner filled with stories and laughter.',
      media_url: null,
      created_at: new Date().toISOString(),
    },
  ]
}

function createDefaultDemoStore() {
  return {
    schedules: createDemoSchedule(),
    medications: createDemoMedications(),
    memories: createDemoMemories(),
    emergencyContacts: [
      {
        id: 'demo-contact-1',
        patient_id: DEMO_PATIENT_ID,
        name: 'Priya Sharma',
        phone: '+91 98765 43210',
        relationship: 'Daughter',
      },
    ],
  }
}

function getDemoStore() {
  if (typeof window === 'undefined') {
    return createDefaultDemoStore()
  }

  try {
    const raw = window.localStorage.getItem(DEMO_STORE_KEY)
    if (!raw) {
      const store = createDefaultDemoStore()
      window.localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(store))
      return store
    }

    const parsed = JSON.parse(raw)
    return {
      schedules: parsed.schedules || createDemoSchedule(),
      medications: parsed.medications || createDemoMedications(),
      memories: parsed.memories || createDemoMemories(),
      emergencyContacts: parsed.emergencyContacts || [],
    }
  } catch {
    const store = createDefaultDemoStore()
    window.localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(store))
    return store
  }
}

function saveDemoStore(store: any) {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(DEMO_STORE_KEY, JSON.stringify(store))
  }
}

/**
 * 1. Resolves authenticated user and finds their associated patient record.
 * Never hardcodes patient ID.
 */
export async function getCurrentPatient(): Promise<PatientWithProfile | null> {
  if (!isSupabaseConfigured) {
    const demoProfile = {
      id: DEMO_PATIENT_ID,
      role: 'patient',
      full_name: 'Demo Patient',
      phone: null,
      dob: null,
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as ProfileRow

    return {
      id: DEMO_PATIENT_ID,
      profile_id: DEMO_PATIENT_ID,
      emergency_contact: null,
      blood_group: null,
      medical_notes: null,
      created_at: new Date().toISOString(),
      profile: demoProfile,
    } as PatientWithProfile
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return null
  }

  // Fetch patient record with profile
  const { data: patient, error: patientError } = await supabase
    .from('patients')
    .select('*, profiles(*)')
    .eq('profile_id', user.id)
    .maybeSingle()

  if (patientError) {
    console.error('Error fetching patient record:', patientError.message)
    throw new Error('Unable to load patient record.')
  }

  if (patient && (patient as any).profiles) {
    const p = patient as any
    return {
      ...p,
      profile: p.profiles as ProfileRow,
    }
  }

  // If patient row doesn't exist yet for this authenticated user, auto-provision it
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()

  const { data: newPatient, error: createError } = await supabase
    .from('patients')
    .insert({ profile_id: user.id })
    .select('*, profiles(*)')
    .single()

  if (createError || !newPatient) {
    console.error('Failed to provision patient record:', createError?.message)
    return null
  }

  return {
    ...(newPatient as any),
    profile: ((newPatient as any).profiles || profile) as ProfileRow,
  }
}

/**
 * 2. Retrieves today's schedule for a patient, joined with schedule completions.
 * Sorted chronologically.
 */
export async function getTodaySchedule(
  patientId: string,
  date: string = getLocalTodayDateString()
): Promise<ScheduleItemWithStatus[]> {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    return (store.schedules || [])
      .filter((item: any) => item.patient_id === patientId && item.date === date)
      .map((item: any) => ({
        ...item,
        isCompleted: item.completionStatus === 'completed',
        completionStatus: item.completionStatus || null,
        completedAt: item.completedAt || null,
      }))
      .sort((a: any, b: any) => a.time.localeCompare(b.time))
  }

  // Fetch schedules for patient and date
  const { data: schedules, error: schedError } = await supabase
    .from('schedules')
    .select('*')
    .eq('patient_id', patientId)
    .eq('date', date)
    .order('time', { ascending: true })

  if (schedError) {
    console.error('Error fetching schedules:', schedError.message)
    throw new Error('Unable to load daily schedule.')
  }

  if (!schedules || schedules.length === 0) {
    return []
  }

  // Fetch completions for these schedules
  const scheduleIds = schedules.map((s) => s.id)
  const { data: completions, error: compError } = await supabase
    .from('schedule_completions')
    .select('*')
    .eq('patient_id', patientId)
    .in('schedule_id', scheduleIds)

  if (compError) {
    console.warn('Error fetching schedule completions:', compError.message)
  }

  const completionMap = new Map<string, ScheduleCompletionRow>()
  if (completions) {
    for (const comp of completions) {
      completionMap.set(comp.schedule_id, comp)
    }
  }

  return schedules.map((s) => {
    const comp = completionMap.get(s.id)
    return {
      ...s,
      isCompleted: comp?.status === 'completed',
      completionStatus: comp?.status || null,
      completedAt: comp?.completed_at || null,
    }
  })
}

/**
 * 3. Retrieves active medications for a patient, joined with today's medication logs.
 */
export async function getPatientMemories(patientId: string): Promise<any[]> {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    return (store.memories || []).filter((memory: any) => memory.patient_id === patientId)
  }

  const { data, error } = await supabase
    .from('memories')
    .select('*')
    .eq('patient_id', patientId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching memories:', error.message)
    throw new Error('Unable to load memories.')
  }

  return data || []
}

export async function getActiveMedications(
  patientId: string,
  date: string = getLocalTodayDateString()
): Promise<MedicationWithLogStatus[]> {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    return (store.medications || [])
      .filter((med: any) => med.patient_id === patientId && med.is_active !== false)
      .map((med: any) => ({
        ...med,
        isTakenToday: !!med.isTakenToday,
        lastTakenAt: med.lastTakenAt || null,
      }))
  }

  const { data: meds, error: medsError } = await supabase
    .from('medications')
    .select('*')
    .eq('patient_id', patientId)
    .eq('is_active', true)
    .order('created_at', { ascending: true })

  if (medsError) {
    console.error('Error fetching medications:', medsError.message)
    throw new Error('Unable to load medications.')
  }

  if (!meds || meds.length === 0) {
    return []
  }

  // Fetch today's medication logs
  const startOfDay = `${date}T00:00:00.000Z`
  const endOfDay = `${date}T23:59:59.999Z`

  const { data: logs, error: logsError } = await supabase
    .from('medication_logs')
    .select('*')
    .eq('patient_id', patientId)
    .gte('scheduled_for', startOfDay)
    .lte('scheduled_for', endOfDay)

  if (logsError) {
    console.warn('Error fetching medication logs:', logsError.message)
  }

  const takenMeds = new Map<string, MedicationLogRow>()
  if (logs) {
    for (const log of logs) {
      if (log.status === 'taken') {
        takenMeds.set(log.medication_id, log)
      }
    }
  }

  return meds.map((med) => {
    const log = takenMeds.get(med.id)
    return {
      ...med,
      isTakenToday: !!log,
      lastTakenAt: log?.taken_at || null,
    }
  })
}

/**
 * 4. Retrieves medication logs for a patient on a specific date.
 */
export async function getMedicationLogs(
  patientId: string,
  date: string = getLocalTodayDateString()
): Promise<MedicationLogRow[]> {
  const startOfDay = `${date}T00:00:00.000Z`
  const endOfDay = `${date}T23:59:59.999Z`

  const { data, error } = await supabase
    .from('medication_logs')
    .select('*')
    .eq('patient_id', patientId)
    .gte('scheduled_for', startOfDay)
    .lte('scheduled_for', endOfDay)

  if (error) {
    console.error('Error fetching medication logs:', error.message)
    return []
  }

  return data || []
}

/**
 * 5. Retrieves saved emergency contacts for the patient.
 */
export async function getEmergencyContacts(patientId: string): Promise<EmergencyContactRow[]> {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    return (store.emergencyContacts || []).filter((contact: any) => contact.patient_id === patientId)
  }

  const { data, error } = await supabase
    .from('emergency_contacts')
    .select('*')
    .eq('patient_id', patientId)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching emergency contacts:', error.message)
    throw new Error('Unable to load emergency contacts.')
  }

  return data || []
}

/**
 * 6. Adds a new emergency contact for the patient.
 */
export async function addEmergencyContact(
  patientId: string,
  contact: { name: string; phone: string; relationship?: string }
): Promise<EmergencyContactRow> {
  const trimmedName = contact.name?.trim()
  const trimmedPhone = contact.phone?.trim()
  const trimmedRelationship = contact.relationship?.trim() || 'Emergency Contact'

  if (!trimmedName || !trimmedPhone) {
    throw new Error('Name and phone number are required.')
  }

  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    const newContact = {
      id: `demo-contact-${Date.now()}`,
      patient_id: patientId,
      name: trimmedName,
      phone: trimmedPhone,
      relationship: trimmedRelationship,
    }
    store.emergencyContacts = [newContact, ...(store.emergencyContacts || [])]
    saveDemoStore(store)
    return newContact as EmergencyContactRow
  }

  const { data, error } = await supabase
    .from('emergency_contacts')
    .insert({
      patient_id: patientId,
      name: trimmedName,
      phone: trimmedPhone,
      relationship: trimmedRelationship,
    })
    .select()
    .single()

  if (error || !data) {
    console.error('Error adding emergency contact:', error?.message)
    throw new Error('Failed to save emergency contact.')
  }

  return data
}

/**
 * 7. Updates an existing emergency contact.
 */
export async function updateEmergencyContact(
  patientId: string,
  contactId: string,
  updates: { name: string; phone: string; relationship?: string }
): Promise<EmergencyContactRow> {
  const trimmedName = updates.name?.trim()
  const trimmedPhone = updates.phone?.trim()

  if (!trimmedName || !trimmedPhone) {
    throw new Error('Name and phone number are required.')
  }

  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    const updated = (store.emergencyContacts || []).map((item: any) =>
      item.id === contactId && item.patient_id === patientId
        ? { ...item, name: trimmedName, phone: trimmedPhone, relationship: updates.relationship?.trim() || 'Emergency Contact' }
        : item
    )
    store.emergencyContacts = updated
    saveDemoStore(store)
    return updated.find((item: any) => item.id === contactId) as EmergencyContactRow
  }

  const { data, error } = await supabase
    .from('emergency_contacts')
    .update({
      name: trimmedName,
      phone: trimmedPhone,
      relationship: updates.relationship?.trim() || null,
    })
    .eq('id', contactId)
    .eq('patient_id', patientId)
    .select()
    .single()

  if (error || !data) {
    console.error('Error updating emergency contact:', error?.message)
    throw new Error('Failed to update emergency contact.')
  }

  return data
}

/**
 * 8. Deletes an emergency contact.
 */
export async function deleteEmergencyContact(patientId: string, contactId: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    store.emergencyContacts = (store.emergencyContacts || []).filter(
      (item: any) => !(item.id === contactId && item.patient_id === patientId)
    )
    saveDemoStore(store)
    return
  }

  const { error } = await supabase
    .from('emergency_contacts')
    .delete()
    .eq('id', contactId)
    .eq('patient_id', patientId)

  if (error) {
    console.error('Error deleting emergency contact:', error.message)
    throw new Error('Failed to delete emergency contact.')
  }
}

/**
 * 9. Marks a medication as taken, persisting to medication_logs table in Supabase.
 */
export async function addMedication(patientId: string, medication: { name: string; dosage: string; frequency: string; instructions?: string | null }) {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    const newMedication = {
      id: `demo-med-${Date.now()}`,
      patient_id: patientId,
      name: medication.name.trim(),
      dosage: medication.dosage.trim(),
      frequency: medication.frequency.trim(),
      instructions: medication.instructions?.trim() || null,
      is_active: true,
      created_at: new Date().toISOString(),
      isTakenToday: false,
      lastTakenAt: null,
    }

    store.medications = [newMedication, ...(store.medications || [])]
    saveDemoStore(store)
    return newMedication
  }

  const { data, error } = await supabase
    .from('medications')
    .insert({
      patient_id: patientId,
      name: medication.name.trim(),
      dosage: medication.dosage.trim(),
      frequency: medication.frequency.trim(),
      instructions: medication.instructions?.trim() || null,
      is_active: true,
    })
    .select()
    .single()

  if (error || !data) throw new Error('Failed to add medication.')
  return data
}

export async function updateMedication(
  patientId: string,
  medicationId: string,
  medication: { name: string; dosage: string; frequency: string; instructions?: string | null; is_active?: boolean }
) {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    const updated = (store.medications || []).map((item: any) => {
      if (item.id === medicationId && item.patient_id === patientId) {
        return {
          ...item,
          name: medication.name.trim(),
          dosage: medication.dosage.trim(),
          frequency: medication.frequency.trim(),
          instructions: medication.instructions?.trim() || null,
          is_active: medication.is_active ?? item.is_active,
        }
      }
      return item
    })

    store.medications = updated
    saveDemoStore(store)
    return updated.find((item: any) => item.id === medicationId)
  }

  const { data, error } = await supabase
    .from('medications')
    .update({
      name: medication.name.trim(),
      dosage: medication.dosage.trim(),
      frequency: medication.frequency.trim(),
      instructions: medication.instructions?.trim() || null,
      is_active: medication.is_active ?? true,
    })
    .eq('id', medicationId)
    .eq('patient_id', patientId)
    .select()
    .single()

  if (error || !data) throw new Error('Failed to update medication.')
  return data
}

export async function deleteMedication(patientId: string, medicationId: string) {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    store.medications = (store.medications || []).filter(
      (item: any) => !(item.id === medicationId && item.patient_id === patientId)
    )
    saveDemoStore(store)
    return
  }

  const { error } = await supabase
    .from('medications')
    .delete()
    .eq('id', medicationId)
    .eq('patient_id', patientId)

  if (error) throw new Error('Failed to delete medication.')
}

export async function addScheduleItem(patientId: string, schedule: { title: string; description?: string; date: string; time: string; type?: string }) {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    const newItem = {
      id: `demo-schedule-${Date.now()}`,
      patient_id: patientId,
      title: schedule.title.trim(),
      description: schedule.description?.trim() || null,
      date: schedule.date,
      time: schedule.time,
      type: schedule.type || 'routine',
      created_at: new Date().toISOString(),
      completionStatus: null,
      completedAt: null,
    }

    store.schedules = [...(store.schedules || []), newItem]
    saveDemoStore(store)
    return newItem
  }

  const { data, error } = await supabase
    .from('schedules')
    .insert({
      patient_id: patientId,
      title: schedule.title.trim(),
      description: schedule.description?.trim() || null,
      date: schedule.date,
      time: schedule.time,
      type: schedule.type || 'routine',
    })
    .select()
    .single()

  if (error || !data) throw new Error('Failed to add schedule item.')
  return data
}

export async function updateScheduleItem(
  patientId: string,
  scheduleId: string,
  schedule: { title: string; description?: string; date: string; time: string; type?: string }
) {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    const updated = (store.schedules || []).map((item: any) => {
      if (item.id === scheduleId && item.patient_id === patientId) {
        return {
          ...item,
          title: schedule.title.trim(),
          description: schedule.description?.trim() || null,
          date: schedule.date,
          time: schedule.time,
          type: schedule.type || item.type || 'routine',
        }
      }
      return item
    })

    store.schedules = updated
    saveDemoStore(store)
    return updated.find((item: any) => item.id === scheduleId)
  }

  const { data, error } = await supabase
    .from('schedules')
    .update({
      title: schedule.title.trim(),
      description: schedule.description?.trim() || null,
      date: schedule.date,
      time: schedule.time,
      type: schedule.type || 'routine',
    })
    .eq('id', scheduleId)
    .eq('patient_id', patientId)
    .select()
    .single()

  if (error || !data) throw new Error('Failed to update schedule item.')
  return data
}

export async function deleteScheduleItem(patientId: string, scheduleId: string) {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    store.schedules = (store.schedules || []).filter(
      (item: any) => !(item.id === scheduleId && item.patient_id === patientId)
    )
    saveDemoStore(store)
    return
  }

  const { error } = await supabase
    .from('schedules')
    .delete()
    .eq('id', scheduleId)
    .eq('patient_id', patientId)

  if (error) throw new Error('Failed to delete schedule item.')
}

export async function createMemory(patientId: string, memory: { title: string; description?: string; media_url?: string | null }) {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    const newMemory = {
      id: `demo-memory-${Date.now()}`,
      patient_id: patientId,
      title: memory.title.trim(),
      description: memory.description?.trim() || null,
      media_url: memory.media_url || null,
      created_at: new Date().toISOString(),
    }

    store.memories = [newMemory, ...(store.memories || [])]
    saveDemoStore(store)
    return newMemory
  }

  const { data, error } = await supabase
    .from('memories')
    .insert({
      patient_id: patientId,
      title: memory.title.trim(),
      description: memory.description?.trim() || null,
      media_url: memory.media_url || null,
    })
    .select()
    .single()

  if (error || !data) throw new Error('Failed to save memory.')
  return data
}

export async function updateMemory(patientId: string, memoryId: string, memory: { title: string; description?: string; media_url?: string | null }) {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    const updated = (store.memories || []).map((item: any) => {
      if (item.id === memoryId && item.patient_id === patientId) {
        return {
          ...item,
          title: memory.title.trim(),
          description: memory.description?.trim() || null,
          media_url: memory.media_url || item.media_url || null,
        }
      }
      return item
    })

    store.memories = updated
    saveDemoStore(store)
    return updated.find((item: any) => item.id === memoryId)
  }

  const { data, error } = await supabase
    .from('memories')
    .update({
      title: memory.title.trim(),
      description: memory.description?.trim() || null,
      media_url: memory.media_url || null,
    })
    .eq('id', memoryId)
    .eq('patient_id', patientId)
    .select()
    .single()

  if (error || !data) throw new Error('Failed to update memory.')
  return data
}

export async function deleteMemory(patientId: string, memoryId: string) {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    store.memories = (store.memories || []).filter(
      (item: any) => !(item.id === memoryId && item.patient_id === patientId)
    )
    saveDemoStore(store)
    return
  }

  const { error } = await supabase
    .from('memories')
    .delete()
    .eq('id', memoryId)
    .eq('patient_id', patientId)

  if (error) throw new Error('Failed to delete memory.')
}

export async function markMedicationTaken(
  patientId: string,
  medicationId: string,
  scheduledFor: string = new Date().toISOString()
): Promise<MedicationLogRow> {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    const updated = (store.medications || []).map((item: any) => {
      if (item.id === medicationId && item.patient_id === patientId) {
        return {
          ...item,
          isTakenToday: true,
          lastTakenAt: new Date().toISOString(),
        }
      }
      return item
    })

    store.medications = updated
    saveDemoStore(store)
    return {
      id: `demo-log-${Date.now()}`,
      medication_id: medicationId,
      patient_id: patientId,
      scheduled_for: scheduledFor,
      taken_at: new Date().toISOString(),
      status: 'taken',
      created_at: new Date().toISOString(),
    } as MedicationLogRow
  }

  // Use upsert or handle unique constraint
  const { data, error } = await supabase
    .from('medication_logs')
    .upsert(
      {
        patient_id: patientId,
        medication_id: medicationId,
        scheduled_for: scheduledFor,
        taken_at: new Date().toISOString(),
        status: 'taken',
      },
      { onConflict: 'medication_id,scheduled_for' }
    )
    .select()
    .single()

  if (error || !data) {
    console.error('Error logging medication:', error?.message)
    throw new Error('Failed to record medication status.')
  }

  return data
}

/**
 * 10. Marks a daily schedule task as completed or skipped, persisting to schedule_completions.
 */
export async function markScheduleCompleted(
  patientId: string,
  scheduleId: string,
  status: 'completed' | 'skipped' = 'completed'
): Promise<ScheduleCompletionRow> {
  if (!isSupabaseConfigured) {
    const store = getDemoStore()
    const updated = (store.schedules || []).map((item: any) => {
      if (item.id === scheduleId && item.patient_id === patientId) {
        return {
          ...item,
          completionStatus: status,
          completedAt: new Date().toISOString(),
        }
      }
      return item
    })

    store.schedules = updated
    saveDemoStore(store)
    return {
      id: `demo-completion-${Date.now()}`,
      schedule_id: scheduleId,
      patient_id: patientId,
      status,
      completed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    } as ScheduleCompletionRow
  }

  const { data, error } = await supabase
    .from('schedule_completions')
    .upsert(
      {
        patient_id: patientId,
        schedule_id: scheduleId,
        status,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'schedule_id,patient_id' }
    )
    .select()
    .single()

  if (error || !data) {
    console.error('Error saving schedule completion:', error?.message)
    throw new Error('Failed to update schedule status.')
  }

  return data
}

/**
 * 11. Records an emergency event in emergency_events table.
 */
export async function createEmergencyEvent(
  patientId: string,
  event: {
    event_type: string
    latitude?: number | null
    longitude?: number | null
    accuracy?: number | null
    location_url?: string | null
    contact_id?: string | null
    status?: string
  }
): Promise<EmergencyEventRow> {
  if (!isSupabaseConfigured) {
    const now = new Date().toISOString()
    return {
      id: `demo-emergency-${Date.now()}`,
      patient_id: patientId,
      event_type: event.event_type,
      latitude: event.latitude ?? null,
      longitude: event.longitude ?? null,
      accuracy: event.accuracy ?? null,
      location_captured_at: event.latitude ? now : null,
      location_url: event.location_url ?? null,
      contact_id: event.contact_id ?? null,
      status: event.status || 'triggered',
      created_at: now,
    } as EmergencyEventRow
  }

  const { data, error } = await supabase
    .from('emergency_events')
    .insert({
      patient_id: patientId,
      event_type: event.event_type,
      latitude: event.latitude || null,
      longitude: event.longitude || null,
      accuracy: event.accuracy || null,
      location_captured_at: event.latitude ? new Date().toISOString() : null,
      location_url: event.location_url || null,
      contact_id: event.contact_id || null,
      status: event.status || 'triggered',
    })
    .select()
    .single()

  if (error || !data) {
    console.error('Error recording emergency event:', error?.message)
    throw new Error('Failed to record emergency event.')
  }

  return data
}

/**
 * 12. Triggers SOS:
 * 1. Creates SOS event record with captured location
 * 2. Invokes secure backend Edge Function send-sos to send SMS
 * 3. Returns event details and alert status
 */
export async function triggerSOS(
  patientId: string,
  location?: LocationCoordinates | null
): Promise<{ event: EmergencyEventRow; smsResult: { success: boolean; message: string } }> {
  const mapUrl = location
    ? `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
    : null

  // 1. Record event
  const event = await createEmergencyEvent(patientId, {
    event_type: 'sos_triggered',
    latitude: location?.latitude ?? null,
    longitude: location?.longitude ?? null,
    accuracy: location?.accuracy ?? null,
    location_url: mapUrl,
    status: location ? 'location_captured' : 'triggered',
  })

  if (!isSupabaseConfigured) {
    return {
      event,
      smsResult: {
        success: true,
        message: location
          ? 'Demo emergency alert recorded with your location.'
          : 'Demo emergency alert recorded. Please call emergency services below.',
      },
    }
  }

  // 2. Invoke backend Edge Function
  try {
    const { data: edgeRes, error: edgeError } = await supabase.functions.invoke('send-sos', {
      body: {
        patientId,
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
        accuracy: location?.accuracy ?? null,
        emergencyEventId: event.id,
      },
    })

    if (edgeError) {
      console.warn('send-sos edge function invocation warning:', edgeError.message)
      return {
        event,
        smsResult: {
          success: false,
          message: 'Your emergency alert could not be sent.',
        },
      }
    }

    return {
      event,
      smsResult: {
        success: edgeRes?.success ?? true,
        message: edgeRes?.message ?? 'Emergency alert sent with your location.',
      },
    }
  } catch (err: any) {
    console.error('Error invoking send-sos function:', err)
    return {
      event,
      smsResult: {
        success: false,
        message: 'Your emergency alert could not be sent.',
      },
    }
  }
}

/**
 * 13. Aggregates all patient dashboard data and computes high-level summary metrics.
 */
export async function getPatientDashboardData(patientId: string): Promise<PatientDashboardMetrics> {
  const patient = await getCurrentPatient()
  if (!patient || patient.id !== patientId) {
    throw new Error('Patient not found.')
  }

  const [todaySchedule, medications, emergencyContacts] = await Promise.all([
    getTodaySchedule(patientId),
    getActiveMedications(patientId),
    getEmergencyContacts(patientId),
  ])

  const totalTasks = todaySchedule.length
  const completedTasks = todaySchedule.filter((s) => s.isCompleted).length
  const remainingTasks = totalTasks - completedTasks

  // Determine next pending activity
  const pendingTasks = todaySchedule.filter((s) => !s.isCompleted)
  const nextTask = pendingTasks.length > 0 ? pendingTasks[0] : null

  const medicationsTotal = medications.length
  const medicationsTaken = medications.filter((m) => m.isTakenToday).length
  const medicationsPending = medicationsTotal - medicationsTaken

  return {
    patient,
    todaySchedule,
    medications,
    emergencyContacts,
    totalTasks,
    completedTasks,
    remainingTasks,
    nextTask,
    medicationsTotal,
    medicationsTaken,
    medicationsPending,
  }
}
