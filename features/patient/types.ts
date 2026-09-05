import type { Database } from '@/types/database.types'

export type PatientRow = Database['public']['Tables']['patients']['Row']
export type PatientInsert = Database['public']['Tables']['patients']['Insert']
export type PatientUpdate = Database['public']['Tables']['patients']['Update']

export interface PatientProfileDetails {
  id: string
  profileId: string
  fullName: string
  phone: string | null
  dob: string | null
  avatarUrl: string | null
  emergencyContact: string | null
  bloodGroup: string | null
  medicalNotes: string | null
  createdAt: string
}
