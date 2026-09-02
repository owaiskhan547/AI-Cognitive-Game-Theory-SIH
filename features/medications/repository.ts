import { supabase } from '@/lib/supabase/client'
import type { MedicationRow, MedicationInsert, MedicationUpdate } from './types'

export class MedicationRepository {
  static async getMedicationsByPatientId(patientId: string): Promise<MedicationRow[]> {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async createMedication(medication: MedicationInsert): Promise<MedicationRow> {
    const { data, error } = await supabase
      .from('medications')
      .insert(medication)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateMedication(id: string, updates: MedicationUpdate): Promise<void> {
    const { error } = await supabase
      .from('medications')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  }

  static async toggleMedicationActive(id: string, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('medications')
      .update({ is_active: isActive })
      .eq('id', id)

    if (error) throw error
  }
}
