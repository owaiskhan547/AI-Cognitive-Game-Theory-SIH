import { supabase } from '@/lib/supabase/client'
import {
  getActiveMedications,
  getCurrentPatient,
  getEmergencyContacts,
  getPatientMemories,
  getTodaySchedule,
} from '@/lib/services/patientService'
import type { PatientRow, ProfileRow } from '@/lib/services/patientService'
import type { FamilyMember, PatientContext, StoredMemory } from './types'

/** Fetches only the authenticated patient's relevant assistant context. */
export class PatientContextService {
  async getCurrentPatient(): Promise<PatientContext | null> {
    let patient = await getCurrentPatient()

    if (!patient) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: caregiver } = await supabase
          .from('caregivers')
          .select('id')
          .eq('profile_id', user.id)
          .maybeSingle()
        const { data: link } = caregiver
          ? await supabase.from('caregiver_patients').select('patient_id').eq('caregiver_id', caregiver.id).limit(1).maybeSingle()
          : { data: null }
        const { data: patientRow } = link?.patient_id
          ? await supabase.from('patients').select('*').eq('id', link.patient_id).maybeSingle()
          : { data: null }
        const { data: patientProfile } = patientRow?.profile_id
          ? await supabase.from('profiles').select('*').eq('id', patientRow.profile_id).maybeSingle()
          : { data: null }
        if (patientRow && patientProfile) {
          patient = { ...(patientRow as PatientRow), profile: patientProfile as ProfileRow }
        }
      }
    }

    if (!patient) return null

    const [schedule, medications, memories, contacts] = await Promise.all([
      getTodaySchedule(patient.id),
      getActiveMedications(patient.id),
      getPatientMemories(patient.id),
      getEmergencyContacts(patient.id),
    ])

    const { data: links } = await supabase
      .from('caregiver_patients')
      .select('caregiver_id, relationship')
      .eq('patient_id', patient.id)

    const caregiverIds = (links ?? []).map((link) => link.caregiver_id)
    const { data: caregivers } = caregiverIds.length
      ? await supabase.from('caregivers').select('id, profile_id').in('id', caregiverIds)
      : { data: [] }
    const profileIds = (caregivers ?? []).map((caregiver) => caregiver.profile_id)
    const { data: caregiverProfiles } = profileIds.length
      ? await supabase.from('profiles').select('id, full_name, phone').in('id', profileIds)
      : { data: [] }

    const familyMembers: FamilyMember[] = (caregivers ?? []).map((caregiver) => {
      const profile = (caregiverProfiles ?? []).find((item) => item.id === caregiver.profile_id)
      const link = (links ?? []).find((item) => item.caregiver_id === caregiver.id)
      return {
        id: caregiver.id,
        name: profile?.full_name ?? 'Caregiver',
        relationship: link?.relationship ?? 'Caregiver',
        phone: profile?.phone ?? null,
      }
    })

    if (!familyMembers.length && contacts.length) {
      familyMembers.push(...contacts.slice(0, 3).map((contact) => ({
        id: contact.id,
        name: contact.name,
        relationship: contact.relationship ?? 'Emergency contact',
        phone: contact.phone,
      })))
    }

    const storedMemories: StoredMemory[] = memories.map((memory: any) => ({
      id: memory.id,
      title: memory.title,
      description: memory.description ?? null,
      createdAt: memory.created_at,
    }))

    return {
      patientId: patient.id,
      name: patient.profile.full_name,
      dateOfBirth: patient.profile.dob,
      preferredLanguage: 'English',
      medicalNotes: patient.medical_notes,
      caregiverName: familyMembers[0]?.name,
      caregiverPhone: familyMembers[0]?.phone ?? undefined,
      medications: medications.map((medication) => ({
        id: medication.id,
        name: medication.name,
        dosage: medication.dosage,
        frequency: medication.frequency,
        instructions: medication.instructions,
        isActive: medication.is_active,
        isTakenToday: medication.isTakenToday,
        lastTakenAt: medication.lastTakenAt,
      })),
      schedule: schedule.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.date,
        time: item.time,
        type: ['medication', 'appointment', 'game', 'memory'].includes(item.type)
          ? item.type as 'medication' | 'appointment' | 'game' | 'memory'
          : 'other',
        isCompleted: item.isCompleted,
        completionStatus: item.completionStatus,
      })),
      familyMembers,
      memories: storedMemories,
      currentTime: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
    }
  }
}

export const patientContextService = new PatientContextService()
