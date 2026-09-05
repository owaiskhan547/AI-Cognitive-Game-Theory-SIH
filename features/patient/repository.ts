import { supabase } from '@/lib/supabase/client'
import type { PatientProfileDetails, PatientUpdate } from './types'

export class PatientRepository {
  /**
   * Fetch current patient's profile details.
   */
  static async getPatientByProfileId(profileId: string): Promise<PatientProfileDetails | null> {
    const { data: patient, error: patientError } = await supabase
      .from('patients')
      .select('*')
      .eq('profile_id', profileId)
      .single()

    if (patientError || !patient) return null

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .single()

    return {
      id: patient.id,
      profileId: patient.profile_id,
      fullName: profile?.full_name || 'Patient',
      phone: profile?.phone || null,
      dob: profile?.dob || null,
      avatarUrl: profile?.avatar_url || null,
      emergencyContact: patient.emergency_contact,
      bloodGroup: patient.blood_group,
      medicalNotes: patient.medical_notes,
      createdAt: patient.created_at,
    }
  }

  /**
   * Update patient medical information.
   */
  static async updatePatient(patientId: string, updates: PatientUpdate): Promise<void> {
    const { error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', patientId)

    if (error) throw error
  }
}
