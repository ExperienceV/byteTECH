"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "student" | "teacher"
  createdAt: string
}

export interface Purchase {
  userId: string
  courseSlug: string
  purchaseDate: string
  price: number
  status: "active" | "expired" | "refunded"
}

export interface TeacherCourse {
  teacherId: string
  courseSlug: string
  role: "instructor" | "assistant"
}

// Mock data
const mockUsers: User[] = [
  {
    id: "student_001",
    name: "María Estudiante",
    email: "estudiante@test.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "student",
    createdAt: "2024-01-10",
  },
  {
    id: "teacher_001",
    name: "Prof. Carlos Instructor",
    email: "profesor@test.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "teacher",
    createdAt: "2023-06-15",
  },
]

const mockPurchases: Purchase[] = [
  {
    userId: "student_001",
    courseSlug: "python-essentials",
    purchaseDate: "2024-01-15",
    price: 249,
    status: "active",
  },
  {
    userId: "student_001",
    courseSlug: "react-fundamentals",
    purchaseDate: "2024-01-20",
    price: 299,
    status: "active",
  },
  {
    userId: "student_001",
    courseSlug: "desarrollo-full-stack",
    purchaseDate: "2024-02-01",
    price: 399,
    status: "active",
  },
  {
    userId: "teacher_001",
    courseSlug: "python-essentials",
    purchaseDate: "2023-06-15",
    price: 0,
    status: "active",
  },
  {
    userId: "teacher_001",
    courseSlug: "framework-django",
    purchaseDate: "2023-06-15",
    price: 0,
    status: "active",
  },
]

const teacherCourses: TeacherCourse[] = [
  {
    teacherId: "teacher_001",
    courseSlug: "python-essentials",
    role: "instructor",
  },
  {
    teacherId: "teacher_001",
    courseSlug: "framework-django",
    role: "instructor",
  },
]

export const TEST_ACCOUNTS = {
  STUDENT: {
    email: "estudiante@test.com",
    password: "student123",
    description: "Estudiante con 3 cursos comprados",
  },
  TEACHER: {
    email: "profesor@test.com",
    password: "teacher123",
    description: "Profesor que enseña Python y Django",
  },
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPurchasedCourse: (courseSlug: string) => boolean
  isTeacher: () => boolean
  isAdmin: () => boolean
  isTeacherOfCourse: (courseSlug: string) => boolean
  getUserPurchases: () => Purchase[]
  getTeacherCourses: () => string[]
  getUserStats: () => any
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    console.log("🚀 AuthProvider iniciando...")

    try {
      const storedUser = localStorage.getItem("bytetech_user")
      console.log("📦 Datos en localStorage:", storedUser)

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        console.log("✅ Usuario encontrado en localStorage:", parsedUser)
        setUser(parsedUser)
      } else {
        console.log("❌ No hay usuario en localStorage")
      }
    } catch (error) {
      console.error("💥 Error al cargar sesión:", error)
      localStorage.removeItem("bytetech_user")
    } finally {
      setIsLoading(false)
      console.log("✅ AuthProvider carga completa")
    }
  }, [])

  // Debug: Log state changes
  useEffect(() => {
    console.log("🔄 Estado del usuario cambió:", {
      user: user ? `${user.name} (${user.role})` : null,
      isLoggedIn: !!user,
      timestamp: new Date().toLocaleTimeString(),
    })
  }, [user])

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log("🔐 === INICIO DE LOGIN ===")
    console.log("📧 Email:", email)
    console.log("🔑 Password:", password ? "***" : "vacío")

    // Check test credentials
    const testAccount = Object.values(TEST_ACCOUNTS).find((account) => account.email === email)
    console.log("🔍 Cuenta de prueba encontrada:", testAccount ? "SÍ" : "NO")

    if (!testAccount) {
      console.log("❌ Email no encontrado en cuentas de prueba")
      return false
    }

    if (testAccount.password !== password) {
      console.log("❌ Contraseña incorrecta")
      console.log("🔑 Esperada:", testAccount.password)
      console.log("🔑 Recibida:", password)
      return false
    }

    console.log("✅ Credenciales válidas")

    // Find user by email
    const foundUser = mockUsers.find((u) => u.email === email)
    console.log("👤 Usuario en base de datos:", foundUser ? "ENCONTRADO" : "NO ENCONTRADO")

    if (foundUser) {
      console.log("💾 Guardando usuario en estado...")
      console.log("👤 Datos del usuario:", foundUser)

      // Update state FIRST
      setUser(foundUser)

      // Then save to localStorage
      localStorage.setItem("bytetech_user", JSON.stringify(foundUser))
      console.log("💾 Usuario guardado en localStorage")

      // Verify the state was updated
      console.log("🔍 Verificando estado después de setUser...")

      return true
    }

    console.log("❌ Usuario no encontrado en mockUsers")
    return false
  }

  const logout = () => {
    const userName = user?.name || "Usuario"
    console.log(`🚪 === LOGOUT INICIADO ===`)
    console.log(`👋 Cerrando sesión de: ${userName}`)

    setUser(null)
    localStorage.removeItem("bytetech_user")

    console.log(`✅ Logout completado`)
  }

  const hasPurchasedCourse = (courseSlug: string): boolean => {
    if (!user) return false

    // Teachers have access to courses they teach
    if (user.role === "teacher") {
      const teacherCourse = teacherCourses.find((tc) => tc.teacherId === user.id && tc.courseSlug === courseSlug)
      if (teacherCourse) return true
    }

    // Check regular purchases
    return mockPurchases.some(
      (purchase) => purchase.userId === user.id && purchase.courseSlug === courseSlug && purchase.status === "active",
    )
  }

  const isTeacher = (): boolean => {
    return user?.role === "teacher"
  }

  const isAdmin = (): boolean => {
    return false
  }

  const isTeacherOfCourse = (courseSlug: string): boolean => {
    if (!user || user.role !== "teacher") return false
    return teacherCourses.some((tc) => tc.teacherId === user.id && tc.courseSlug === courseSlug)
  }

  const getUserPurchases = (): Purchase[] => {
    if (!user) return []
    return mockPurchases.filter((purchase) => purchase.userId === user.id)
  }

  const getTeacherCourses = (): string[] => {
    if (!user || user.role !== "teacher") return []
    return teacherCourses.filter((tc) => tc.teacherId === user.id).map((tc) => tc.courseSlug)
  }

  const getUserStats = () => {
    if (!user) return null

    const purchases = getUserPurchases()
    const activePurchases = purchases.filter((p) => p.status === "active")

    return {
      totalCourses: activePurchases.length,
      totalSpent: activePurchases.reduce((sum, p) => sum + p.price, 0),
      memberSince: user.createdAt,
      role: user.role,
    }
  }

  // Create the context value
  const contextValue: AuthContextType = {
    user,
    isLoggedIn: !!user,
    login,
    logout,
    hasPurchasedCourse,
    isTeacher,
    isAdmin,
    isTeacherOfCourse,
    getUserPurchases,
    getTeacherCourses,
    getUserStats,
  }

  // Debug: Log context value
  console.log("🎯 Context value actual:", {
    user: contextValue.user?.name || "null",
    isLoggedIn: contextValue.isLoggedIn,
  })

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

  // Debug: Log when useAuth is called
  console.log("🎣 useAuth llamado:", {
    user: context.user?.name || "null",
    isLoggedIn: context.isLoggedIn,
  })

  return context
}
