import type { Database } from '@/types/database.types'

export type AssistantConversationRow = Database['public']['Tables']['assistant_conversations']['Row']
export type AssistantConversationInsert = Database['public']['Tables']['assistant_conversations']['Insert']

export type AssistantMessageRow = Database['public']['Tables']['assistant_messages']['Row']
export type AssistantMessageInsert = Database['public']['Tables']['assistant_messages']['Insert']
