export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'patient' | 'caregiver'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          full_name: string
          phone: string | null
          dob: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: UserRole
          full_name: string
          phone?: string | null
          dob?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: UserRole
          full_name?: string
          phone?: string | null
          dob?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          id: string
          profile_id: string
          emergency_contact: string | null
          blood_group: string | null
          medical_notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          emergency_contact?: string | null
          blood_group?: string | null
          medical_notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          emergency_contact?: string | null
          blood_group?: string | null
          medical_notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'patients_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      caregivers: {
        Row: {
          id: string
          profile_id: string
          organization: string | null
          created_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          organization?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          organization?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'caregivers_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      caregiver_patients: {
        Row: {
          id: string
          caregiver_id: string
          patient_id: string
          relationship: string | null
          created_at: string
        }
        Insert: {
          id?: string
          caregiver_id: string
          patient_id: string
          relationship?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          caregiver_id?: string
          patient_id?: string
          relationship?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'caregiver_patients_caregiver_id_fkey'
            columns: ['caregiver_id']
            isOneToOne: false
            referencedRelation: 'caregivers'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'caregiver_patients_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
        ]
      }
      medications: {
        Row: {
          id: string
          patient_id: string
          name: string
          dosage: string
          frequency: string
          instructions: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          name: string
          dosage: string
          frequency: string
          instructions?: string | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          name?: string
          dosage?: string
          frequency?: string
          instructions?: string | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'medications_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
        ]
      }
      schedules: {
        Row: {
          id: string
          patient_id: string
          title: string
          description: string | null
          date: string
          time: string
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          title: string
          description?: string | null
          date: string
          time: string
          type?: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          title?: string
          description?: string | null
          date?: string
          time?: string
          type?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'schedules_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
        ]
      }
      memories: {
        Row: {
          id: string
          patient_id: string
          title: string
          description: string | null
          media_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          title: string
          description?: string | null
          media_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          title?: string
          description?: string | null
          media_url?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'memories_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
        ]
      }
      game_sessions: {
        Row: {
          id: string
          patient_id: string
          game_name: string
          score: number
          duration: number
          played_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          game_name: string
          score?: number
          duration?: number
          played_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          game_name?: string
          score?: number
          duration?: number
          played_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'game_sessions_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
        ]
      }
<<<<<<< HEAD
      game_scores: {
        Row: { id: string; patient_id: string; game_type: 'memory_match' | 'sequence_recall' | 'pattern_recall' | 'word_recall'; difficulty: 'easy' | 'medium' | 'hard'; score: number; duration_seconds: number; completed_at: string }
        Insert: { id?: string; patient_id: string; game_type: 'memory_match' | 'sequence_recall' | 'pattern_recall' | 'word_recall'; difficulty: 'easy' | 'medium' | 'hard'; score: number; duration_seconds: number; completed_at?: string }
        Update: { id?: string; patient_id?: string; game_type?: 'memory_match' | 'sequence_recall' | 'pattern_recall' | 'word_recall'; difficulty?: 'easy' | 'medium' | 'hard'; score?: number; duration_seconds?: number; completed_at?: string }
        Relationships: [{ foreignKeyName: 'game_scores_patient_id_fkey'; columns: ['patient_id']; isOneToOne: false; referencedRelation: 'patients'; referencedColumns: ['id'] }]
      }
=======
>>>>>>> c803a0274886f346c6bb60935235b314baec755d
      assistant_conversations: {
        Row: {
          id: string
          patient_id: string
          title: string
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          title?: string
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          title?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'assistant_conversations_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
        ]
      }
      assistant_messages: {
        Row: {
          id: string
          conversation_id: string
          sender: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender?: string
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'assistant_messages_conversation_id_fkey'
            columns: ['conversation_id']
            isOneToOne: false
            referencedRelation: 'assistant_conversations'
            referencedColumns: ['id']
          },
        ]
      }
      emergency_contacts: {
        Row: {
          id: string
          patient_id: string
          name: string
          phone: string
          relationship: string | null
        }
        Insert: {
          id?: string
          patient_id: string
          name: string
          phone: string
          relationship?: string | null
        }
        Update: {
          id?: string
          patient_id?: string
          name?: string
          phone?: string
          relationship?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'emergency_contacts_patient_id_fkey'
            columns: ['patient_id']
            isOneToOne: false
            referencedRelation: 'patients'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: UserRole
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
