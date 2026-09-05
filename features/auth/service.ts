import { signUp, signIn, signOut, getCurrentUser, getProfile } from '@/lib/supabase/auth'
import type { LoginCredentials, SignupCredentials, AuthUser } from './types'

export class AuthService {
  static async login({ email, password }: LoginCredentials): Promise<AuthUser> {
    const { user } = await signIn(email, password)
    if (!user) throw new Error('Login failed: User not found.')

    const profile = await getProfile(user.id)
    return {
      id: user.id,
      email: user.email || '',
      fullName: profile?.full_name || 'User',
      role: profile?.role || 'patient',
      phone: profile?.phone,
      avatarUrl: profile?.avatar_url,
    }
  }

  static async register({ email, password, fullName, role, phone, dob }: SignupCredentials): Promise<void> {
    await signUp({
      email,
      password,
      fullName,
      role,
      phone,
      dob,
    })
  }

  static async logout(): Promise<void> {
    await signOut()
  }

  static async getSessionUser(): Promise<AuthUser | null> {
    const user = await getCurrentUser()
    if (!user) return null

    const profile = await getProfile(user.id)
    if (!profile) return null

    return {
      id: user.id,
      email: user.email || '',
      fullName: profile.full_name,
      role: profile.role,
      phone: profile.phone,
      avatarUrl: profile.avatar_url,
    }
  }
}
