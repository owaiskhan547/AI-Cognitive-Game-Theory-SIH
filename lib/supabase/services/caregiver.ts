import { supabase } from '../client'
import type { Database } from '@/types/database.types'

export type EmergencyContact = Database['public']['Tables']['emergency_contacts']['Row']
export type EmergencyContactInsert = Database['public']['Tables']['emergency_contacts']['Insert']

/**
 * Caregiver & Emergency services layer.
 */
export const caregiverService = {
  /**
   * Get list of patients linked to a caregiver.
   */
  async getAssignedPatients(caregiverId: string) {
    const { data, error } = await supabase
      .from('caregiver_patients')
      .select(`
        id,
        relationship,
        patients (
          id,
          blood_group,
          emergency_contact,
          medical_notes,
          profiles (
            id,
            full_name,
            phone,
            avatar_url
          )
        )
      `)
      .eq('caregiver_id', caregiverId)

    if (error) throw error
    return data
  },

  /**
   * Get emergency contacts for a patient.
   */
  async getEmergencyContacts(patientId: string) {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('patient_id', patientId)

    if (error) throw error
    return data as EmergencyContact[]
  },

  /**
   * Add emergency contact for a patient.
   */
  async addEmergencyContact(contact: EmergencyContactInsert) {
    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert(contact)
      .select()
      .single()

    if (error) throw error
    return data as EmergencyContact
  }
}
