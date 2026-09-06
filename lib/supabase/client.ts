import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'

// Retrieve credentials from Vite or fallback env
const supabaseUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_URL) ||
  ''

const supabaseAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY) ||
  ''

const placeholderValues = [
  'placeholder-project.supabase.co',
  'your-project-id.supabase.co',
  'placeholder-anon-key',
  'your-supabase-anon-key-here',
]

export const isSupabaseConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !placeholderValues.some((value) => supabaseUrl.includes(value) || supabaseAnonKey.includes(value))

export function assertSupabaseConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error(
      'Supabase is not configured. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values to a .env file before logging in.'
    )
  }
}

/**
 * Standard pure React client-side Supabase client with typed schema and persistent localStorage auth.
 */
export const supabase = createClient<Database>(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
  }
)
