import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('pv_token') || null)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('pv_user')) || null
    } catch {
      return null
    }
  })

  const login = (token, userData) => {
    setToken(token)
    setUser(userData)
    localStorage.setItem('pv_token', token)
    localStorage.setItem('pv_user', JSON.stringify(userData))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('pv_token')
    localStorage.removeItem('pv_user')
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
