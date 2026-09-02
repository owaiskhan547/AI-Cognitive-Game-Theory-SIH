import type { UserRole } from '@/types/database.types'

export interface AuthUser {
  id: string
  email: string
  fullName: string
  role: UserRole
  phone?: string | null
  avatarUrl?: string | null
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  email: string
  password: string
  fullName: string
  role: UserRole
  phone?: string
  dob?: string
}
