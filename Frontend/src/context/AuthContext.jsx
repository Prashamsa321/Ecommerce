// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    console.log('AuthProvider - Current user:', currentUser)
    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password })
      console.log('Login response:', data)
      
      if (data.user) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        toast.success(data.message)
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error.response?.data?.message || 'Login failed')
      return false
    }
  }

  const register = async (name, email, password) => {
    try {
      const data = await authService.register({ name, email, password })
      console.log('Register response:', data)
      
      if (data.user) {
        setUser(data.user)
        localStorage.setItem('user', JSON.stringify(data.user))
        toast.success(data.message)
        return true
      }
      return false
    } catch (error) {
      console.error('Register error:', error)
      toast.error(error.response?.data?.message || 'Registration failed')
      return false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      localStorage.removeItem('user')
      toast.success('Logged out successfully')
      return true
    } catch (error) {
      console.error('Logout error:', error)
      setUser(null)
      localStorage.removeItem('user')
      toast.error('Logout failed')
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}