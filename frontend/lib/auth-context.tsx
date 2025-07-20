"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { authApi } from "@/lib/api"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "student" | "teacher"
  createdAt: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Cargar usuario desde localStorage al montar
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("bytetech_user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      localStorage.removeItem("bytetech_user")
    } finally {
      setIsLoading(false)
    }
  }, [])

  // LOGIN
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.login({ email, password })
      const backendUser = response.user
      const userObj: User = {
        id: String(backendUser.id),
        name: backendUser.name,
        email: backendUser.email,
        avatar: "",
        role: backendUser.is_sensei ? "teacher" : "student",
        createdAt: backendUser.created_at,
      }
      setUser(userObj)
      localStorage.setItem("bytetech_user", JSON.stringify(userObj))
      return true
    } catch (error) {
      setUser(null)
      localStorage.removeItem("bytetech_user")
      return false
    }
  }

  // REGISTER
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authApi.register({ name, email, password })
      const backendUser = response.user
      const userObj: User = {
        id: String(backendUser.id),
        name: backendUser.name,
        email: backendUser.email,
        avatar: "",
        role: backendUser.is_sensei ? "teacher" : "student",
        createdAt: backendUser.created_at,
      }
      setUser(userObj)
      localStorage.setItem("bytetech_user", JSON.stringify(userObj))
      return true
    } catch (error) {
      setUser(null)
      localStorage.removeItem("bytetech_user")
    return false
  }
  }

  // LOGOUT
  const logout = async (): Promise<void> => {
    try {
      await authApi.logout()
    } catch (error) {
      // Ignorar error de logout
    }
    setUser(null)
    localStorage.removeItem("bytetech_user")
  }

  const contextValue: AuthContextType = {
    user,
    isLoggedIn: !!user,
    login,
    register,
    logout,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">Cargando aplicación...</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}