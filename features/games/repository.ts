import { supabase } from '@/lib/supabase/client'
import type { GameSessionRow, GameSessionInsert } from './types'

export class GameRepository {
  static async getGameSessionsByPatientId(patientId: string): Promise<GameSessionRow[]> {
    const { data, error } = await supabase
      .from('game_sessions')
      .select('*')
      .eq('patient_id', patientId)
      .order('played_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async recordGameSession(session: GameSessionInsert): Promise<GameSessionRow> {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert(session)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
