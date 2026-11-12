import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ApiError, apiRequest } from '@/lib/api'

const AuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiRequest('/admin/auth/me')
      setUser(response?.user ?? response ?? null)
    } catch (requestError) {
      if (requestError instanceof ApiError && requestError.status === 401) {
        setUser(null)
      } else {
        setError(requestError)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = useCallback(async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const response = await apiRequest('/admin/auth/login', {
        method: 'POST',
        body: credentials,
      })
      const authenticatedUser = response?.user ?? response
      setUser(authenticatedUser)
      return authenticatedUser
    } catch (requestError) {
      setError(requestError)
      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await apiRequest('/admin/auth/logout', { method: 'POST', body: {} })
      setUser(null)
    } catch (requestError) {
      setError(requestError)
      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])

  const value = useMemo(
    () => ({ user, loading, error, isAuthenticated: Boolean(user), login, logout, refresh }),
    [user, loading, error, login, logout, refresh],
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AdminAuthProvider.')
  }
  return context
}