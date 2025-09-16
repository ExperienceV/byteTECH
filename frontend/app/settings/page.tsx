"use client"

import { NormalHeader } from "@/components/normal-header"
import { NormalFooter } from "@/components/normal-footer"
import { Badge } from "@//components/ui/badge"
import { Terminal, User, Camera, Shield, BookOpen, Clock, Trophy, TrendingUp } from "lucide-react"
import { useAuth } from "@//lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ProfileForm } from "@/components/profile-form"
import { PasswordForm } from "@/components/password-form"
import { useProfile } from "@/hooks/use-profile"

export default function PerfilPage() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const { profile, stats, isLoading, error } = useProfile()

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("❌ Usuario no logueado, redirigiendo al login")
      router.push("/ingresar")
      return
    }
  }, [isLoggedIn, router])

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
      <NormalHeader />
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
                {/* Profile Form */}
                <ProfileForm />
                
                {/* Password Form */}
                <PasswordForm />
              </div>
              
              {/* Stats Section */}
              {stats && (
                <div className="p-6 border-t border-slate-800">
                  <h3 className="text-lg font-semibold text-cyan-400 mb-4 font-mono">
                    📊 ESTADÍSTICAS DEL USUARIO
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stats.total_courses || 0}</div>
                      <div className="text-sm text-slate-400">Cursos</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stats.total_hours || 0}</div>
                      <div className="text-sm text-slate-400">Horas</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stats.achievements?.length || 0}</div>
                      <div className="text-sm text-slate-400">Logros</div>
                    </div>
                    <div className="text-center p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                      <TrendingUp className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-white">{stats.rank || 'N/A'}</div>
                      <div className="text-sm text-slate-400">Rango</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <NormalFooter />
    </div>
  )
}
