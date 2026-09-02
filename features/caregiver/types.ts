import type { Database } from '@/types/database.types'

export type CaregiverRow = Database['public']['Tables']['caregivers']['Row']
export type CaregiverPatientRow = Database['public']['Tables']['caregiver_patients']['Row']

export interface AssignedPatientSummary {
  patientId: string
  fullName: string
  dob: string | null
  avatarUrl: string | null
  relationship: string | null
  emergencyContact: string | null
  medicalNotes: string | null
}
