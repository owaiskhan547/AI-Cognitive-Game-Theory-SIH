import type { Database } from '@/types/database.types'

export type GameSessionRow = Database['public']['Tables']['game_sessions']['Row']
export type GameSessionInsert = Database['public']['Tables']['game_sessions']['Insert']
export type GameSessionUpdate = Database['public']['Tables']['game_sessions']['Update']
