"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { API_BASE } from "./config"

export interface User {
  id: number
  name: string
  email: string
  is_sensei: boolean
  is_verify: boolean
  avatar?: string
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
      const formData = new URLSearchParams()
      formData.append("email", email)
      formData.append("password", password)

      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
        mode: "cors",
      })

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data = await response.json()
      const userObj: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        is_sensei: data.user.is_sensei,
        is_verify: data.user.is_verify,
        avatar: data.user.avatar || ""
      }

      setUser(userObj)
      localStorage.setItem("bytetech_user", JSON.stringify(userObj))
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  // REGISTER
  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const formData = new URLSearchParams()
      formData.append("name", name)
      formData.append("email", email)
      formData.append("password", password)

      const response = await fetch(`${API_BASE}/auth/init_register`, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Registration failed")
      }

      const data = await response.json()
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  // LOGOUT
  const logout = async (): Promise<void> => {
    try {
      const response = await fetch(`${API_BASE}/auth/logout`, {
        method: "POST",
        credentials: "include",
      })
      
      if (!response.ok) {
        throw new Error("Logout failed")
      }
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setUser(null)
      localStorage.removeItem("bytetech_user")
    }
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
