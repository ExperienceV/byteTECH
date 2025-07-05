"use client"

// Mock authentication and purchase system
// In a real app, this would connect to your backend/database

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "student" | "teacher" | "admin"
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

// Mock user data - TEST ACCOUNTS
const mockUsers: User[] = [
  // STUDENT ACCOUNT
  {
    id: "student_001",
    name: "María Estudiante",
    email: "estudiante@test.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "student",
    createdAt: "2024-01-10",
  },
  // TEACHER ACCOUNT
  {
    id: "teacher_001",
    name: "Prof. Carlos Instructor",
    email: "profesor@test.com",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "teacher",
    createdAt: "2023-06-15",
  },
  // ADMIN ACCOUNT (bonus)
  {
    id: "admin_001",
    name: "Admin ByteTech",
    email: "admin@bytetech.dev",
    avatar: "/placeholder.svg?height=40&width=40",
    role: "admin",
    createdAt: "2023-01-01",
  },
]

// Mock purchases data - stored in localStorage
let mockPurchases: Purchase[] = [
  // Student purchases
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
  // Teacher has access to all courses they teach
  {
    userId: "teacher_001",
    courseSlug: "python-essentials",
    purchaseDate: "2023-06-15",
    price: 0, // Teachers get free access
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

// Teacher-Course relationships
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

// TEST CREDENTIALS - Use these to login
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
  ADMIN: {
    email: "admin@bytetech.dev",
    password: "admin123",
    description: "Administrador con acceso completo",
  },
}

// Client-side auth state management
let currentUser: User | null = null
let authListeners: (() => void)[] = []

// Load purchases from localStorage
function loadPurchases(): Purchase[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("bytetech_purchases")
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.error("Error loading purchases:", e)
      }
    }
  }
  return mockPurchases
}

// Save purchases to localStorage
function savePurchases(purchases: Purchase[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("bytetech_purchases", JSON.stringify(purchases))
  }
  mockPurchases = purchases
}

// Initialize purchases from localStorage
if (typeof window !== "undefined") {
  mockPurchases = loadPurchases()
}

// Subscribe to auth changes
export function onAuthChange(callback: () => void) {
  authListeners.push(callback)
  return () => {
    authListeners = authListeners.filter((cb) => cb !== callback)
  }
}

// Notify all listeners of auth changes
function notifyAuthChange() {
  authListeners.forEach((callback) => callback())
}

export function getCurrentUser(): User | null {
  // Try to get from localStorage first
  if (typeof window !== "undefined" && !currentUser) {
    const stored = localStorage.getItem("bytetech_user")
    if (stored) {
      try {
        currentUser = JSON.parse(stored)
      } catch (e) {
        localStorage.removeItem("bytetech_user")
      }
    }
  }
  return currentUser
}

export function setCurrentUser(user: User | null) {
  currentUser = user
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("bytetech_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("bytetech_user")
    }
  }
  notifyAuthChange()
}

export function isLoggedIn(): boolean {
  return getCurrentUser() !== null
}

export function hasPurchasedCourse(courseSlug: string): boolean {
  const user = getCurrentUser()
  if (!user) return false

  // Load current purchases
  const currentPurchases = loadPurchases()

  // Teachers have access to courses they teach
  if (user.role === "teacher") {
    const teacherCourse = teacherCourses.find((tc) => tc.teacherId === user.id && tc.courseSlug === courseSlug)
    if (teacherCourse) return true
  }

  // Admins have access to all courses
  if (user.role === "admin") return true

  // Check regular purchases
  return currentPurchases.some(
    (purchase) => purchase.userId === user.id && purchase.courseSlug === courseSlug && purchase.status === "active",
  )
}

// Add purchase function
export function purchaseCourse(courseSlug: string, price: number): boolean {
  const user = getCurrentUser()
  if (!user) return false

  const currentPurchases = loadPurchases()

  // Check if already purchased
  const alreadyPurchased = currentPurchases.some(
    (purchase) => purchase.userId === user.id && purchase.courseSlug === courseSlug && purchase.status === "active",
  )

  if (alreadyPurchased) return false

  // Add new purchase
  const newPurchase: Purchase = {
    userId: user.id,
    courseSlug,
    purchaseDate: new Date().toISOString().split("T")[0],
    price,
    status: "active",
  }

  const updatedPurchases = [...currentPurchases, newPurchase]
  savePurchases(updatedPurchases)

  console.log(`✅ Curso comprado: ${courseSlug} por $${price}`)
  notifyAuthChange() // Notify components to update

  return true
}

export function isTeacher(): boolean {
  const user = getCurrentUser()
  return user?.role === "teacher"
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === "admin"
}

export function isTeacherOfCourse(courseSlug: string): boolean {
  const user = getCurrentUser()
  if (!user || user.role !== "teacher") return false

  return teacherCourses.some((tc) => tc.teacherId === user.id && tc.courseSlug === courseSlug)
}

export function getUserPurchases(): Purchase[] {
  const user = getCurrentUser()
  if (!user) return []

  const currentPurchases = loadPurchases()
  return currentPurchases.filter((purchase) => purchase.userId === user.id)
}

export function getTeacherCourses(): string[] {
  const user = getCurrentUser()
  if (!user || user.role !== "teacher") return []

  return teacherCourses.filter((tc) => tc.teacherId === user.id).map((tc) => tc.courseSlug)
}

export function loginUser(email: string, password: string): User | null {
  // Check test credentials
  const testAccount = Object.values(TEST_ACCOUNTS).find((account) => account.email === email)

  if (!testAccount) {
    console.log("❌ Email no encontrado")
    return null
  }

  if (testAccount.password !== password) {
    console.log("❌ Contraseña incorrecta")
    return null
  }

  // Find user by email
  const user = mockUsers.find((u) => u.email === email)
  if (user) {
    setCurrentUser(user)
    console.log(`✅ Login exitoso como ${user.role}: ${user.name}`)
    return user
  }

  return null
}

export function logoutUser() {
  const user = getCurrentUser()
  const userName = user?.name || "Usuario"
  setCurrentUser(null)
  console.log(`👋 ${userName} ha cerrado sesión`)
}

// Helper function to get user stats
export function getUserStats() {
  const user = getCurrentUser()
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

// Debug function to show current state
export function debugAuthState() {
  console.log("🔍 Estado de autenticación:")
  console.log("Usuario actual:", getCurrentUser())
  console.log("Está logueado:", isLoggedIn())
  const user = getCurrentUser()
  if (user) {
    console.log("Rol:", user.role)
    console.log("Compras:", getUserPurchases())
    if (user.role === "teacher") {
      console.log("Cursos que enseña:", getTeacherCourses())
    }
  }
}
