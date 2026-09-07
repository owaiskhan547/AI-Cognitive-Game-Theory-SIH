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
    email: 'kabir@smriti.local',
    password: 'demo1234',
    role: 'patient' as UserRole,
    fullName: 'Kabir Rao',
  },
  {
    email: 'ananya@smriti.local',
    password: 'demo1234',
    role: 'caregiver' as UserRole,
    fullName: 'Ananya Rao',
  },
]
const DEMO_PASSWORDS = new Set(['demo1234', 'Smriti2026!'])

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
  signIn: (email: string, password: string, intendedRole?: UserRole) => Promise<any>
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

  const startDemoSession = (account: { email: string; fullName: string; role: UserRole }) => {
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

    return { user: demoUser, session: { access_token: 'demo-access-token' }, profile: demoProfile }
  }

  const buildMetadataProfile = (currentUser: User, roleOverride?: UserRole | null): Profile => {
    const pendingRole = (typeof window !== 'undefined' ? localStorage.getItem('smriti_pending_oauth_role') : null) as UserRole | null
    const resolvedRole: UserRole =
      roleOverride ||
      pendingRole ||
      (currentUser.user_metadata?.role as UserRole) ||
      'patient'
    const fullName =
      currentUser.user_metadata?.full_name ||
      currentUser.user_metadata?.name ||
      currentUser.email?.split('@')[0] ||
      'User'

    return {
      id: currentUser.id,
      role: resolvedRole,
      full_name: String(fullName),
      phone: null,
      dob: null,
      avatar_url: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Profile
  }

  const fetchProfile = async (currentUser: User): Promise<Profile> => {
    const pendingRole = (typeof window !== 'undefined' ? localStorage.getItem('smriti_pending_oauth_role') : null) as UserRole | null
    const metadataFallback = buildMetadataProfile(currentUser, pendingRole)

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle()

      if (error?.message?.toLowerCase().includes('schema cache')) {
        console.error('profiles table is missing in this Supabase project. Run supabase/setup.sql in the SQL Editor.')
        setProfile(metadataFallback)
        return metadataFallback
      }

      if (!error && data) {
        let resolvedData: Profile = data
        // If user explicitly selected a role (e.g. Caregiver) when clicking Google sign-in
        // ensure their profile reflects that role if it differs
        if (pendingRole && data.role !== pendingRole) {
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ role: pendingRole })
            .eq('id', currentUser.id)
            .select()
            .maybeSingle()

          if (!updateError && updatedProfile) {
            resolvedData = updatedProfile
          } else {
            resolvedData = { ...data, role: pendingRole }
          }

          if (pendingRole === 'caregiver') {
            await supabase.from('caregivers').upsert({ profile_id: currentUser.id }, { onConflict: 'profile_id' })
          } else if (pendingRole === 'patient') {
            await supabase.from('patients').upsert({ profile_id: currentUser.id }, { onConflict: 'profile_id' })
          }
        }

        setProfile(resolvedData)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('smriti_pending_oauth_role')
        }
        return resolvedData
      }

      const defaultRole: UserRole = pendingRole || (currentUser.user_metadata?.role as UserRole) || 'patient'
      const fallback = buildMetadataProfile(currentUser, defaultRole)
      const phoneOrEmergency = currentUser.user_metadata?.emergency_contact || currentUser.user_metadata?.phone || null
      const ageValue = currentUser.user_metadata?.age
      let dobValue: string | null = null
      if (ageValue && !isNaN(Number(ageValue))) {
        const birthYear = new Date().getFullYear() - Number(ageValue)
        dobValue = `${birthYear}-01-01`
      } else if (currentUser.user_metadata?.dob) {
        dobValue = currentUser.user_metadata.dob
      }

      const { data: createdProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: currentUser.id,
          role: defaultRole,
          full_name: fallback.full_name,
          avatar_url: fallback.avatar_url,
          phone: phoneOrEmergency,
          dob: dobValue,
        })
        .select()
        .maybeSingle()

      if (createError) {
        if (createError.message?.toLowerCase().includes('schema cache')) {
          setProfile(fallback)
          return fallback
        }

        const { data: existingAfterConflict } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .maybeSingle()

        const resolved = existingAfterConflict || fallback
        setProfile(resolved)
        return resolved
      }

      const resolved = createdProfile || fallback
      setProfile(resolved)

      if (defaultRole === 'patient') {
        await supabase.from('patients').upsert(
          {
            profile_id: currentUser.id,
            emergency_contact: phoneOrEmergency,
          },
          { onConflict: 'profile_id' }
        )

        // If emergency contact provided, also insert into emergency_contacts table if not present
        if (phoneOrEmergency) {
          try {
            const { data: patientRow } = await supabase
              .from('patients')
              .select('id')
              .eq('profile_id', currentUser.id)
              .maybeSingle()

            if (patientRow?.id) {
              await supabase.from('emergency_contacts').insert({
                patient_id: patientRow.id,
                name: currentUser.user_metadata?.caregiver_email ? 'Primary Caregiver' : 'Emergency Contact',
                phone: phoneOrEmergency,
                relationship: 'Emergency Contact',
              })
            }
          } catch (contactErr) {
            console.warn('Could not auto-add emergency contact row:', contactErr)
          }
        }
      } else if (defaultRole === 'caregiver') {
        await supabase.from('caregivers').upsert({ profile_id: currentUser.id }, { onConflict: 'profile_id' })
      }

      if (typeof window !== 'undefined' && resolved.role) {
        localStorage.removeItem('smriti_pending_oauth_role')
      }
      return resolved
    } catch (err) {
      console.error('Error fetching profile:', err)
      setProfile(metadataFallback)
      return metadataFallback
    }
  }

  useEffect(() => {
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
      setLoading(false)
      return
    }

    if (!isSupabaseConfigured) {
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

  const handleSignIn = async (email: string, password: string, intendedRole?: UserRole) => {
    const demoAccount = DEMO_ACCOUNTS.find(
      (item) => item.email.toLowerCase() === email.trim().toLowerCase() && DEMO_PASSWORDS.has(password)
    )
    if (demoAccount) return startDemoSession(demoAccount)

    if (!isSupabaseConfigured) {
      let account = DEMO_ACCOUNTS.find(
        (item) => item.email.toLowerCase() === email.trim().toLowerCase() && DEMO_PASSWORDS.has(password)
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
        throw new Error('Invalid demo credentials. Use kabir@smriti.local / demo1234 or ananya@smriti.local / demo1234.')
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

      return { user: demoUser, session: { access_token: 'demo-access-token' }, profile: demoProfile }
    }

    if (intendedRole && typeof window !== 'undefined') {
      localStorage.setItem('smriti_pending_oauth_role', intendedRole)
    }

    const data = await authSignIn(email, password)
    let profile: Profile | null = null
    if (data.user) {
      profile = await fetchProfile(data.user)
    }
    return { ...data, profile }
  }

  const handleSignUp = async (params: SignUpParams) => {
    if (!isSupabaseConfigured) {
      const demoUser = createDemoUser(params.email.trim(), params.fullName.trim(), params.role)
      demoUser.user_metadata = {
        ...demoUser.user_metadata,
        age: params.age,
        emergency_contact: params.emergencyContact,
        phone: params.phone || params.emergencyContact,
        caregiver_email: params.caregiverEmail,
      }

      const demoProf = createDemoProfile(demoUser)
      demoProf.phone = params.emergencyContact || params.phone || null
      if (params.age && !isNaN(Number(params.age))) {
        demoProf.dob = `${new Date().getFullYear() - Number(params.age)}-01-01`
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DEMO_REGISTERED_KEY, JSON.stringify({
          email: params.email.trim(),
          password: params.password,
          role: params.role,
          fullName: params.fullName.trim(),
          age: params.age,
          emergencyContact: params.emergencyContact,
          caregiverEmail: params.caregiverEmail,
        }))
      }

      persistDemoSession(demoUser, demoProf)
      setUser(demoUser)
      setProfile(demoProf)
      setSession({
        access_token: 'demo-access-token',
        refresh_token: 'demo-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: demoUser,
      } as Session)

      return {
        user: demoUser,
        session: { access_token: 'demo-access-token' },
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
    const isDemoUser = user?.id === 'demo-patient-id' || user?.id === 'demo-caregiver-id'
    clearDemoSession()
    if (!isSupabaseConfigured || isDemoUser) {
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

  const metadataRole = (user?.user_metadata?.role as UserRole) || null
  const role: UserRole | null =
    profile?.role === 'caregiver' || metadataRole === 'caregiver'
      ? 'caregiver'
      : profile?.role || metadataRole || null

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
