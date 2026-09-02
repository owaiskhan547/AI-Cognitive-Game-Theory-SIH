import type { Database } from '@/types/database.types'

export type MedicationRow = Database['public']['Tables']['medications']['Row']
export type MedicationInsert = Database['public']['Tables']['medications']['Insert']
export type MedicationUpdate = Database['public']['Tables']['medications']['Update']
