import { supabase } from '@/lib/supabase/client'
import type { Difficulty, GameType } from '@/src/components/games/gameTypes'

export interface SubmitGameScoreInput {
  profileId: string
  gameType: GameType
  difficulty: Difficulty
  score: number
  durationSeconds: number
}

export interface GameScore {
  id: string
  patient_id: string
  game_type: GameType
  difficulty: Difficulty
  score: number
  duration_seconds: number
  completed_at: string
}

type GameScoresClient = {
  from: (table: 'patients' | 'game_scores') => {
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        single: () => Promise<{ data: { id: string } | null; error: Error | null }>
      }
    }
    insert: (values: Omit<GameScore, 'id'>) => {
      select: () => {
        single: () => Promise<{ data: GameScore | null; error: Error | null }>
      }
    }
  }
}

const gamesClient = supabase as unknown as GameScoresClient

export async function submitGameScore(input: SubmitGameScoreInput): Promise<GameScore> {
  const { data: patient, error: patientError } = await gamesClient.from('patients').select('id').eq('profile_id', input.profileId).single()
  if (patientError || !patient) throw patientError ?? new Error('Unable to find the patient profile.')

  const { data, error } = await gamesClient.from('game_scores').insert({
    patient_id: patient.id,
    game_type: input.gameType,
    difficulty: input.difficulty,
    score: input.score,
    duration_seconds: input.durationSeconds,
    completed_at: new Date().toISOString(),
  }).select().single()

  if (error || !data) throw error ?? new Error('Unable to save the game score.')
  return data
}