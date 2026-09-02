import { supabase } from '@/lib/supabase/client'
import type {
  AssistantConversationRow,
  AssistantConversationInsert,
  AssistantMessageRow,
  AssistantMessageInsert,
} from './types'

export class AssistantRepository {
  static async getConversationsByPatientId(patientId: string): Promise<AssistantConversationRow[]> {
    const { data, error } = await supabase
      .from('assistant_conversations')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  static async createConversation(conversation: AssistantConversationInsert): Promise<AssistantConversationRow> {
    const { data, error } = await supabase
      .from('assistant_conversations')
      .insert(conversation)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async getMessagesByConversationId(conversationId: string): Promise<AssistantMessageRow[]> {
    const { data, error } = await supabase
      .from('assistant_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  }

  static async addMessage(message: AssistantMessageInsert): Promise<AssistantMessageRow> {
    const { data, error } = await supabase
      .from('assistant_messages')
      .insert(message)
      .select()
      .single()

    if (error) throw error
    return data
  }
}
