import { supabase } from '../client'
import type { Database } from '@/types/database.types'

export type GameSession = Database['public']['Tables']['game_sessions']['Row']
export type GameSessionInsert = Database['public']['Tables']['game_sessions']['Insert']

/**
 * Service to record and fetch cognitive game scores & analytics.
 */
export const gameService = {
  /**
   * Save completed game session score.
   */
  async saveScore(session: GameSessionInsert) {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert(session)
      .select()
      .single()

    if (error) throw error
    return data as GameSession
  },

  /**
   * Get game session history for a patient.
   */
  async getPatientGameHistory(patientId: string, limit = 20) {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('patient_id', patientId)
      .order('played_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as GameSession[]
  }
}
