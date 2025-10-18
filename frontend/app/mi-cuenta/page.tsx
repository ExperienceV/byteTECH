"use client"

import { NormalHeader } from "@/components/normal-header"
import { NormalFooter } from "@/components/normal-footer"
import { Badge } from "@//components/ui/badge"
import { Terminal, User, Camera, Shield } from "lucide-react"
import { useAuth } from "@//lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PROFILE_VALIDATION } from "@/lib/profile-config"
import { updateUserName } from "@/lib/api"

export default function PerfilPage() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()

  // Local user from localStorage to avoid extra fetches
  const [localUser, setLocalUser] = useState<{ id: number; name: string; email: string; is_sensei: boolean; is_verify?: boolean; avatar?: string } | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string>("")

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/auth/ingresar")
      return
    }
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem('bytetech_user') : null
      if (raw) {
        const parsed = JSON.parse(raw)
        setLocalUser(parsed)
        setName(parsed.name || "")
        setEmail(parsed.email || "")
      } else if (user) {
        // fallback to auth context
        setLocalUser({ id: user.id, name: user.name, email: user.email, is_sensei: user.is_sensei, is_verify: (user as any).is_verify, avatar: (user as any).avatar })
        setName(user.name || "")
        setEmail(user.email || "")
      }
    } catch (e) {
      // fallback silently
      if (user) {
        setLocalUser({ id: user.id, name: user.name, email: user.email, is_sensei: user.is_sensei, is_verify: (user as any).is_verify, avatar: (user as any).avatar })
        setName(user.name || "")
        setEmail(user.email || "")
      }
    }
  }, [isLoggedIn, router, user])

  // No extra loading state; render once localUser is available

  // If not logged in after loading, don't render anything
  if (!isLoggedIn || !localUser) {
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
                <span className="text-cyan-400 text-sm font-mono">./credenciales</span>
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
                    {localUser.avatar ? (
                      <img
                        src={localUser.avatar || "/placeholder.svg"}
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
                <div className="flex justify-center mb-4">{getRoleBadge(localUser.is_sensei ? 'teacher' : 'student')}</div>
              </div>
              {/* Form Section */}
              <div className="p-6 space-y-6">
                {/* Simple credentials form (name, email) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nombre completo
                    </label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre completo"
                      disabled={!editMode}
                      maxLength={PROFILE_VALIDATION.NAME.MAX_LENGTH}
                      className={editMode ? '' : 'bg-gray-50'}
                    />
                    <div className="text-xs text-gray-500 text-right">
                      {name.length}/{PROFILE_VALIDATION.NAME.MAX_LENGTH}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Email
                    </label>
                    <Input
                      type="email"
                      value={email}
                      readOnly
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <p className="text-red-400 font-mono text-sm">{error}</p>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2">
                  {!editMode ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-2"
                    >
                      Editar
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditMode(false)
                          setError("")
                          setName(localUser.name || "")
                        }}
                        disabled={isSaving}
                        className="flex items-center gap-2"
                      >
                        Cancelar
                      </Button>
                      <Button
                        size="sm"
                        onClick={async () => {
                          setError("")
                          if (!name.trim()) { setError('El nombre es requerido'); return }
                          try {
                            setIsSaving(true)
                            const resp = await updateUserName(name)
                            if (resp.ok) {
                              const updated = { ...localUser, name }
                              setLocalUser(updated)
                              if (typeof window !== 'undefined') {
                                window.localStorage.setItem('bytetech_user', JSON.stringify(updated))
                              }
                              setEditMode(false)
                            } else {
                              setError(resp.message || 'No se pudo actualizar las credenciales')
                            }
                          } catch (e: any) {
                            setError(e?.message || 'Error inesperado')
                          } finally {
                            setIsSaving(false)
                          }
                        }}
                        disabled={isSaving}
                        className="flex items-center gap-2"
                      >
                        {isSaving ? 'Guardando...' : 'Guardar'}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <NormalFooter />
    </div>
  )
}
