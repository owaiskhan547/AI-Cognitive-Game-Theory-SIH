import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'
import {
  signIn as authSignIn,
  signUp as authSignUp,
  signInWithGoogle as authSignInWithGoogle,
  signOut as authSignOut,
  type SignUpParams,
} from '@/lib/supabase/auth'
import type { Database, UserRole } from '@/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  role: UserRole | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<any>
  signUp: (params: SignUpParams) => Promise<any>
  signInWithGoogle: (role?: UserRole) => Promise<any>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  const fetchProfile = async (currentUser: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (!error && data) {
        setProfile(data)
      } else {
        // If profile row doesn't exist yet for new OAuth user, create it
        const pendingRole = (typeof window !== 'undefined' ? localStorage.getItem('smriti_pending_oauth_role') : null) as UserRole | null
        const defaultRole: UserRole = pendingRole || (currentUser.user_metadata?.role as UserRole) || 'patient'
        const fullName = currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0] || 'User'
        const avatarUrl = currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || null

        const { data: createdProfile } = await supabase
          .from('profiles')
          .upsert({
            id: currentUser.id,
            role: defaultRole,
            full_name: fullName,
            avatar_url: avatarUrl,
          })
          .select()
          .single()

        if (createdProfile) {
          setProfile(createdProfile)
        }

        if (defaultRole === 'patient') {
          await supabase.from('patients').upsert({ profile_id: currentUser.id })
        } else if (defaultRole === 'caregiver') {
          await supabase.from('caregivers').upsert({ profile_id: currentUser.id })
        }

        if (typeof window !== 'undefined') {
          localStorage.removeItem('smriti_pending_oauth_role')
        }
      }
    } catch (err) {
      console.error('Error fetching profile:', err)
      setProfile(null)
    }
  }

  useEffect(() => {
    // 1. Initial session check
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession)
      setUser(currentSession?.user ?? null)
      if (currentSession?.user) {
        fetchProfile(currentSession.user).finally(() => setLoading(false))
      } else {
        setLoading(false)
      }
    })

    // 2. Listen to real-time auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)

      if (newSession?.user) {
        await fetchProfile(newSession.user)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleSignIn = async (email: string, password: string) => {
    const data = await authSignIn(email, password)
    if (data.user) {
      await fetchProfile(data.user)
    }
    return data
  }

  const handleSignUp = async (params: SignUpParams) => {
    const data = await authSignUp(params)
    if (data.user) {
      await fetchProfile(data.user)
    }
    return data
  }

  const handleSignInWithGoogle = async (selectedRole?: UserRole) => {
    return await authSignInWithGoogle(selectedRole)
  }

  const handleSignOut = async () => {
    await authSignOut()
    setUser(null)
    setSession(null)
    setProfile(null)
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user)
    }
  }

  const role = profile?.role ?? (user?.user_metadata?.role as UserRole) ?? null

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        signInWithGoogle: handleSignInWithGoogle,
        signOut: handleSignOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
