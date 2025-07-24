"use client"

import { UniqueHeader } from "@//components/unique-header"
import { UniqueFooter } from "@//components/unique-footer"
import { Button } from "@//components/ui/button"
import { Input } from "@//components/ui/input"
import { Badge } from "@//components/ui/badge"
import { Terminal, User, Edit, Save, X, Camera, Shield } from "lucide-react"
import { useAuth } from "@//lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { usersApi, modifyCredentials } from "@/lib/api"

export default function PerfilPage() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [userStats, setUserStats] = useState<any>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!isLoggedIn) {
        console.log("❌ Usuario no logueado, redirigiendo al login")
        router.push("/login")
        return
      }

      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
        })
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isLoggedIn, router, user])

  useEffect(() => {
    if (!user) return
    usersApi.getAllUsers().then(users => {
      const current = users.find((u: any) => u.email === user.email)
      setUserStats(current)
    })
  }, [user])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  // If not logged in after loading, don't render anything
  if (!isLoggedIn || !user) {
    return null
  }

  // Elimina el ejemplo simple de userStats
  // const userStats = { ... }

  const handleSave = async () => {
    try {
      const res = await modifyCredentials(formData.name, formData.email)
      // Actualizar localStorage en la clave correcta 'bytetech_user'
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("bytetech_user")
        if (stored) {
          const userObj = JSON.parse(stored)
          userObj.name = res.name
          userObj.email = res.email
          localStorage.setItem("bytetech_user", JSON.stringify(userObj))
        }
      }
      setIsEditing(false)
    } catch (err: any) {
      alert(err.message || "Error al guardar cambios")
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
    })
    setIsEditing(false)
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "student":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-mono">
            <User className="w-3 h-3 mr-1" />
            ESTUDIANTE
          </Badge>
        )
      case "teacher":
        return (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-mono">
            <Shield className="w-3 h-3 mr-1" />
            PROFESOR
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-dynamic-gradient">
      <UniqueHeader />
      {/* Hero Section */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-6">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-mono">./user --profile</span>
              </div>
              <h1 className="font-mono font-bold leading-tight text-cyan-400 text-2xl sm:text-3xl md:text-4xl mb-4">
                {">"} PERFIL
              </h1>
              <p className="text-slate-400 font-mono text-sm">// Gestiona tu información personal</p>
            </div>
            {/* Profile Card */}
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              {/* Profile Picture Section */}
              <div className="p-8 text-center border-b border-slate-800">
                <div className="relative inline-block mb-6">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-cyan-400/30 rounded-xl flex items-center justify-center mx-auto">
                    {user.avatar ? (
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    )}
                  </div>
                  {/* Camera button for editing */}
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-cyan-500 hover:bg-cyan-600 text-black rounded-full flex items-center justify-center transition-colors">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                {/* Role Badge */}
                <div className="flex justify-center mb-4">{getRoleBadge(user.role)}</div>
              </div>
              {/* Form Section */}
              <div className="p-6 space-y-6">
                {/* Username Field */}
                <div>
                  <label className="block text-cyan-400 font-mono text-sm font-semibold mb-3 uppercase tracking-wide">
                    USERNAME
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                      disabled={!isEditing}
                      className={`bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 font-mono rounded-lg px-4 py-3 ${
                        isEditing ? "focus:border-cyan-400" : "cursor-default"
                      }`}
                      placeholder="Tu nombre de usuario"
                    />
                  </div>
                </div>
                {/* Email Field */}
                <div>
                  <label className="block text-cyan-400 font-mono text-sm font-semibold mb-3 uppercase tracking-wide">
                    EMAIL
                  </label>
                  <div className="relative">
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                      disabled={!isEditing}
                      className={`bg-slate-800/50 border border-slate-700 text-white placeholder:text-slate-500 font-mono rounded-lg px-4 py-3 ${
                        isEditing ? "focus:border-cyan-400" : "cursor-default"
                      }`}
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="pt-4">
                  {isEditing ? (
                    <div className="flex gap-3">
                      <Button
                        onClick={handleSave}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-black font-mono py-3 rounded-lg"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        GUARDAR
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1 border border-red-500/50 text-red-400 hover:bg-red-500/10 font-mono py-3 rounded-lg bg-transparent"
                      >
                        <X className="w-4 h-4 mr-2" />
                        CANCELAR
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-mono py-3 rounded-lg"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      EDITAR PERFIL
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <UniqueFooter />
    </div>
  )
}
