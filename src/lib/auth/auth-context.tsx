'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useUser } from '@auth0/nextjs-auth0/client'

interface AuthContextType {
  user: any | null
  loading: boolean
  authProvider: 'supabase' | 'auth0' | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authProvider: null,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [authProvider, setAuthProvider] = useState<'supabase' | 'auth0' | null>(null)

  // Check Auth0 session
  const { user: auth0User, isLoading: auth0Loading } = useUser()

  useEffect(() => {
    async function checkAuth() {
      // Check Auth0 first
      if (auth0User) {
        setUser(auth0User)
        setAuthProvider('auth0')
        setLoading(false)
        return
      }

      // Check Supabase
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
        setAuthProvider('supabase')
      }

      setLoading(false)
    }

    if (!auth0Loading) {
      checkAuth()
    }
  }, [auth0User, auth0Loading])

  const signOut = async () => {
    if (authProvider === 'auth0') {
      window.location.href = '/api/auth/logout'
    } else if (authProvider === 'supabase') {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = '/'
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, authProvider, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
