import { supabase } from '@/lib/supabase/client'
import type { MemoryRow, MemoryInsert, MemoryUpdate } from './types'

export class MemoryRepository {
  static async getMemoriesByPatientId(patientId: string): Promise<MemoryRow[]> {
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async createMemory(memory: MemoryInsert): Promise<MemoryRow> {
    const { data, error } = await supabase
      .from('memories')
      .insert(memory)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateMemory(id: string, updates: MemoryUpdate): Promise<void> {
    const { error } = await supabase
      .from('memories')
      .update(updates)
      .eq('id', id)

    if (error) throw error
  }

  static async deleteMemory(id: string): Promise<void> {
    const { error } = await supabase
      .from('memories')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
