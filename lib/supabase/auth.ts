import { supabase } from './client'
import type { UserRole } from '@/types/database.types'

export interface SignUpParams {
  email: string
  password: string
  fullName: string
  role: UserRole
  phone?: string
  dob?: string
  avatarUrl?: string
}

/**
 * Sign up a new user with email and password and store metadata for profile creation.
 */
export async function signUp({
  email,
  password,
  fullName,
  role,
  phone,
  dob,
  avatarUrl,
}: SignUpParams) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role,
        phone,
        dob,
        avatar_url: avatarUrl,
      },
    },
  })

  if (error) throw error
  return data
}

/**
 * Sign in an existing user with email and password.
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

/**
 * Sign in or sign up with Google OAuth.
 */
export async function signInWithGoogle(role?: UserRole) {
  if (role && typeof window !== 'undefined') {
    localStorage.setItem('smriti_pending_oauth_role', role)
  }

  const redirectTo = window.location.origin

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'select_account',
      },
    },
  })

  if (error) throw error
  return data
}

/**
 * Sign out the current user session.
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

/**
 * Get the currently authenticated user session.
 */
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) return null
  return user
}

/**
 * Get the profile of the current user or specified user ID.
 */
export async function getProfile(userId?: string) {
  let targetId = userId

  if (!targetId) {
    const user = await getCurrentUser()
    if (!user) return null
    targetId = user.id
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', targetId)
    .single()

  if (error) {
    console.error('Failed to fetch profile:', error.message)
    return null
  }

  return data
}

/**
 * Ensures user is authenticated, throws error or redirects if not.
 */
export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized: Authentication required.')
  }
  return user
}

/**
 * Ensures user has a specific role ('patient' or 'caregiver').
 */
export async function requireRole(expectedRole: UserRole) {
  const user = await requireAuth()
  const profile = await getProfile(user.id)

  if (!profile || profile.role !== expectedRole) {
    throw new Error(`Forbidden: Required role is ${expectedRole}`)
  }

  return { user, profile }
}
