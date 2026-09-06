import React, { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from '@/lib/supabase/client'
import {
  signIn as authSignIn,
  signUp as authSignUp,
  signInWithGoogle as authSignInWithGoogle,
  signOut as authSignOut,
  type SignUpParams,
} from '@/lib/supabase/auth'
import type { Database, UserRole } from '@/types/database.types'

const DEMO_STORAGE_KEY = 'smriti_demo_session'
const DEMO_REGISTERED_KEY = 'smriti_demo_registered_account'
const DEMO_ACCOUNTS = [
  {
    email: 'patient@demo.local',
    password: 'demo1234',
    role: 'patient' as UserRole,
    fullName: 'Demo Patient',
  },
  {
    email: 'caregiver@demo.local',
    password: 'demo1234',
    role: 'caregiver' as UserRole,
    fullName: 'Demo Caregiver',
  },
]

const createDemoUser = (email: string, fullName: string, role: UserRole) => {
  const user = {
    id: role === 'patient' ? 'demo-patient-id' : 'demo-caregiver-id',
    email,
    app_metadata: { provider: 'demo' },
    user_metadata: { full_name: fullName, role },
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as User

  return user
}

const createDemoProfile = (user: User): Profile => ({
  id: user.id,
  role: (user.user_metadata?.role as UserRole) || 'patient',
  full_name: (user.user_metadata?.full_name as string) || 'Demo User',
  phone: null,
  dob: null,
  avatar_url: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}) as Profile

const readDemoSession = () => {
  if (typeof window === 'undefined') return null

  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const persistDemoSession = (user: User, profile: Profile) => {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(
    DEMO_STORAGE_KEY,
    JSON.stringify({
      user,
      profile,
    })
  )
}

const clearDemoSession = () => {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(DEMO_STORAGE_KEY)
}

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
    if (!isSupabaseConfigured) {
      const storedDemo = readDemoSession()

      if (storedDemo?.user) {
        const demoUser = storedDemo.user as User
        const demoProfile = (storedDemo.profile as Profile) || createDemoProfile(demoUser)
        setUser(demoUser)
        setSession({
          access_token: 'demo-access-token',
          refresh_token: 'demo-refresh-token',
          expires_in: 3600,
          expires_at: Math.floor(Date.now() / 1000) + 3600,
          token_type: 'bearer',
          user: demoUser,
        } as Session)
        setProfile(demoProfile)
      }

      setLoading(false)
      return
    }

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
    if (!isSupabaseConfigured) {
      let account = DEMO_ACCOUNTS.find(
        (item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password
      )

      if (!account && typeof window !== 'undefined') {
        try {
          const registered = JSON.parse(window.localStorage.getItem(DEMO_REGISTERED_KEY) || 'null')
          if (registered?.email?.toLowerCase() === email.trim().toLowerCase() && registered.password === password) {
            account = registered
          }
        } catch {
          account = undefined
        }
      }

      if (!account) {
        throw new Error('Invalid demo credentials. Use patient@demo.local / demo1234 or caregiver@demo.local / demo1234.')
      }

      const demoUser = createDemoUser(account.email, account.fullName, account.role)
      const demoProfile = createDemoProfile(demoUser)

      persistDemoSession(demoUser, demoProfile)
      setUser(demoUser)
      setProfile(demoProfile)
      setSession({
        access_token: 'demo-access-token',
        refresh_token: 'demo-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: demoUser,
      } as Session)

      return { user: demoUser, session: { access_token: 'demo-access-token' } }
    }

    const data = await authSignIn(email, password)
    if (data.user) {
      await fetchProfile(data.user)
    }
    return data
  }

  const handleSignUp = async (params: SignUpParams) => {
    if (!isSupabaseConfigured) {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DEMO_REGISTERED_KEY, JSON.stringify({
          email: params.email.trim(),
          password: params.password,
          role: params.role,
          fullName: params.fullName.trim(),
        }))
      }

      return {
        user: createDemoUser(params.email.trim(), params.fullName.trim(), params.role),
        session: null,
      }
    }

    const data = await authSignUp(params)
    if (data.user) {
      await fetchProfile(data.user)
    }
    return data
  }

  const handleSignInWithGoogle = async (selectedRole?: UserRole) => {
    if (!isSupabaseConfigured) {
      const role = selectedRole || 'patient'
      const account = DEMO_ACCOUNTS.find((item) => item.role === role)
      if (!account) {
        throw new Error('No demo account is available for that role.')
      }

      const demoUser = createDemoUser(account.email, account.fullName, account.role)
      const demoProfile = createDemoProfile(demoUser)

      persistDemoSession(demoUser, demoProfile)
      setUser(demoUser)
      setProfile(demoProfile)
      setSession({
        access_token: 'demo-google-access-token',
        refresh_token: 'demo-google-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: demoUser,
      } as Session)

      return { user: demoUser }
    }

    return await authSignInWithGoogle(selectedRole)
  }

  const handleSignOut = async () => {
    if (!isSupabaseConfigured) {
      clearDemoSession()
      setUser(null)
      setSession(null)
      setProfile(null)
      return
    }

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
