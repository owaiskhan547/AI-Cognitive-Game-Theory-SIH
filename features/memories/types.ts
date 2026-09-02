import type { Database } from '@/types/database.types'

export type MemoryRow = Database['public']['Tables']['memories']['Row']
export type MemoryInsert = Database['public']['Tables']['memories']['Insert']
export type MemoryUpdate = Database['public']['Tables']['memories']['Update']
