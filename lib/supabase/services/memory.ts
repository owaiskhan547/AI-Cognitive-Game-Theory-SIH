import { supabase } from '../client'
import type { Database } from '@/types/database.types'

export type Memory = Database['public']['Tables']['memories']['Row']
export type MemoryInsert = Database['public']['Tables']['memories']['Insert']

/**
 * Service to manage patient memory album items & photo uploads.
 */
export const memoryService = {
  /**
   * Get or auto-create patient record for a given user profile ID.
   */
  async getOrCreatePatientRecord(userId: string) {
    const { data: existing } = await supabase
      .from('patients')
      .select('id')
      .or(`id.eq.${userId},profile_id.eq.${userId}`)
      .maybeSingle()

    if (existing) return existing

    const { data: newPatient, error } = await supabase
      .from('patients')
      .upsert({ profile_id: userId }, { onConflict: 'profile_id' })
      .select('id')
      .single()

    if (error) throw error
    return newPatient
  },

  /**
   * Get all memories for a specific patient.
   */
  async getPatientMemories(userId: string) {
    const patientRecord = await this.getOrCreatePatientRecord(userId)
    const targetId = patientRecord?.id || userId

    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('patient_id', targetId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Memory[]
  },

  /**
   * Create a new memory entry.
   */
  async createMemory(memory: MemoryInsert) {
    const { data, error } = await supabase
      .from('memories')
      .insert(memory)
      .select()
      .single()

    if (error) throw error
    return data as Memory
  },

  /**
   * Delete a memory entry.
   */
  async deleteMemory(memoryId: string) {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', memoryId)

    if (error) throw error
  },

  /**
   * Upload memory image to Supabase Storage bucket ('memories').
   */
  async uploadMemoryImage(file: File, patientId: string) {
    const fileExt = file.name.split('.').pop()
    const fileName = `${patientId}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('memories')
      .upload(fileName, file, { upsert: true })

    if (uploadError) throw uploadError

    const { data } = supabase.storage
      .from('memories')
      .getPublicUrl(fileName)

    return data.publicUrl
  }
}
