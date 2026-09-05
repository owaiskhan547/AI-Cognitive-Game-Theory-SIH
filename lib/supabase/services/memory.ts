import { supabase } from '../client'
import type { Database } from '@/types/database.types'

export type Memory = Database['public']['Tables']['memories']['Row']
export type MemoryInsert = Database['public']['Tables']['memories']['Insert']

/**
 * Service to manage patient memory album items & photo uploads.
 */
export const memoryService = {
  /**
   * Get all memories for a specific patient.
   */
  async getPatientMemories(patientId: string) {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('patient_id', patientId)
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
