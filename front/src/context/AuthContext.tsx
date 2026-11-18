import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { adminApi } from '../api/admin'
import { tokenStore, UNAUTHORIZED_EVENT } from '../api/client'
import { publicApi } from '../api/public'
import type { Admin } from '../types'

type AuthStatus = 'checking' | 'authenticated' | 'anonymous'

interface AuthContextValue {
  admin: Admin | null
  status: AuthStatus
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [status, setStatus] = useState<AuthStatus>(() => (tokenStore.get() ? 'checking' : 'anonymous'))

  const logout = useCallback(() => {
    tokenStore.set(null)
    setAdmin(null)
    setStatus('anonymous')
  }, [])

  // Validate a stored token once on load
  useEffect(() => {
    if (status !== 'checking') return
    adminApi.me().then(
      (me) => {
        setAdmin(me)
        setStatus('authenticated')
      },
      () => logout(),
    )
  }, [status, logout])

  // Any 401 from an admin call ends the session
  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, logout)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, logout)
  }, [logout])

  const login = useCallback(async (username: string, password: string) => {
    const { token, admin } = await publicApi.login(username, password)
    tokenStore.set(token)
    setAdmin(admin)
    setStatus('authenticated')
  }, [])

  const value = useMemo(() => ({ admin, status, login, logout }), [admin, status, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
