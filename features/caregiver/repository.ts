import { supabase } from '@/lib/supabase/client'
import type { AssignedPatientSummary } from './types'

export class CaregiverRepository {
  /**
   * Fetch all patients assigned to the caregiver.
   */
  static async getAssignedPatients(caregiverProfileId: string): Promise<AssignedPatientSummary[]> {
    // 1. Get caregiver record
    const { data: caregiver, error: cErr } = await supabase
      .from('caregivers')
      .select('id')
      .eq('profile_id', caregiverProfileId)
      .single()

    if (cErr || !caregiver) return []

    // 2. Get links with patients
    const { data: links, error: lErr } = await supabase
      .from('caregiver_patients')
      .select('patient_id, relationship')
      .eq('caregiver_id', caregiver.id)

    if (lErr || !links) return []

    const patientSummaries: AssignedPatientSummary[] = []

    for (const link of links) {
      const { data: patient } = await supabase
        .from('patients')
        .select('id, profile_id, emergency_contact, medical_notes')
        .eq('id', link.patient_id)
        .single()

      if (patient) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name, dob, avatar_url')
          .eq('id', patient.profile_id)
          .single()

        patientSummaries.push({
          patientId: patient.id,
          fullName: profile?.full_name || 'Patient',
          dob: profile?.dob || null,
          avatarUrl: profile?.avatar_url || null,
          relationship: link.relationship,
          emergencyContact: patient.emergency_contact,
          medicalNotes: patient.medical_notes,
        })
      }
    }

    return patientSummaries
  }
}
