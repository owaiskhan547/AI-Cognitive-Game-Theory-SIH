import { supabase } from '../client'
import type { Database } from '@/types/database.types'

export type ScheduleItem = Database['public']['Tables']['schedules']['Row']
export type ScheduleInsert = Database['public']['Tables']['schedules']['Insert']

export type MedicationItem = Database['public']['Tables']['medications']['Row']
export type MedicationInsert = Database['public']['Tables']['medications']['Insert']

/**
 * Service to manage daily schedules, routines, and medication reminders.
 */
export const scheduleService = {
  /**
   * Fetch daily schedule items for a patient on a given date (YYYY-MM-DD).
   */
  async getPatientSchedule(patientId: string, dateStr?: string) {
    let query = supabase
      .from('schedules')
      .select('*')
      .eq('patient_id', patientId)

    if (dateStr) {
      query = query.eq('date', dateStr)
    }

    const { data, error } = await query.order('time', { ascending: true })
    if (error) throw error
    return data as ScheduleItem[]
  },

  /**
   * Add a schedule item (created by Caregiver or Patient).
   */
  async addScheduleItem(item: ScheduleInsert) {
    const { data, error } = await supabase
      .from('schedules')
      .insert(item)
      .select()
      .single()

    if (error) throw error
    return data as ScheduleItem
  },

  /**
   * Fetch active medications for a patient.
   */
  async getPatientMedications(patientId: string) {
    const { data, error } = await supabase
      .from('medications')
      .select('*')
      .eq('patient_id', patientId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as MedicationItem[]
  },

  /**
   * Add new medication (caregiver portal).
   */
  async addMedication(med: MedicationInsert) {
    const { data, error } = await supabase
      .from('medications')
      .insert(med)
      .select()
      .single()

    if (error) throw error
    return data as MedicationItem
  }
}
