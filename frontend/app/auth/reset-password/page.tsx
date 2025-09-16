"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyRound, Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { UniqueHeader } from "@/components/unique-header"
import { UniqueFooter } from "@/components/unique-footer"

const API_BASE = "http://127.0.0.1:8000/api"

export default function ResetPasswordPage() {
  const [token, setToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Auto-fill token from URL params if available
    const tokenParam = searchParams.get("token")
    if (tokenParam) {
      setToken(tokenParam)
    }
  }, [searchParams])


  const getPasswordStrength = () => {
    const passwordValue = newPassword
    if (passwordValue.length === 0) return { strength: 0, text: "" }
    if (passwordValue.length < 6) return { strength: 1, text: "Débil", color: "text-red-400" }
    if (passwordValue.length < 8) return { strength: 2, text: "Media", color: "text-yellow-400" }
    if (passwordValue.length >= 8 && /[A-Z]/.test(passwordValue) && /[0-9]/.test(passwordValue)) {
      return { strength: 3, text: "Fuerte", color: "text-green-400" }
    }
    return { strength: 2, text: "Media", color: "text-yellow-400" }
  }

  const passwordStrength = getPasswordStrength()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      return
    }
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("token", token)
      formData.append("new_password", newPassword)
      const response = await fetch(`${API_BASE}/auth/restore_password`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      if (response.ok) {
        setSuccess("Contraseña actualizada correctamente. Redirigiendo al login...")
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      } else {
        const errorText = await response.text()
        setError(errorText || "Error al actualizar contraseña")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <UniqueHeader />

      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">

              <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl md:text-4xl mb-4">
                <span className="text-purple-400">RESTABLECER</span>
              </h1>

              <p className="text-slate-400 font-mono text-sm">Configura tu nueva contraseña</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <KeyRound className="w-4 h-4 text-purple-400" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Token Field */}
                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">
                    <span className="text-cyan-400">Token de recuperación</span>
                  </label>
                  <Input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Token del email"
                    required
                    className={`bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 font-mono focus:border-cyan-400 ${
                      searchParams.get("token") ? "bg-slate-700/50" : ""
                    }`}
                    readOnly={!!searchParams.get("token")}
                    disabled={loading}
                  />
                  {searchParams.get("token") && (
                    <p className="text-xs font-mono text-slate-500 mt-1">
                      Token completado automáticamente desde el enlace
                    </p>
                  )}
                </div>

                {/* New Password Field */}
                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">
                    <span className="text-cyan-400">Nueva Contraseña</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 font-mono focus:border-cyan-400"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-slate-800 rounded-full h-1">
                          <div
                            className={`h-1 rounded-full transition-all duration-300 ${
                              passwordStrength.strength === 1
                                ? "w-1/3 bg-red-400"
                                : passwordStrength.strength === 2
                                  ? "w-2/3 bg-yellow-400"
                                  : passwordStrength.strength === 3
                                    ? "w-full bg-green-400"
                                    : "w-0"
                            }`}
                          />
                        </div>
                        <span className={`text-xs font-mono ${passwordStrength.color}`}>{passwordStrength.text}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">
                    <span className="text-cyan-400">Confirme su contraseña</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 font-mono focus:border-cyan-400"
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      disabled={loading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-red-400 text-xs font-mono mt-1">Las contraseñas no coinciden</p>
                  )}
                  {confirmPassword && newPassword === confirmPassword && (
                    <p className="text-green-400 text-xs font-mono mt-1">Las contraseñas coinciden</p>
                  )}
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-red-400 text-sm font-mono">Error: {error}</p>
                  </div>
                )}

                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <p className="text-green-400 text-sm font-mono">Success: {success}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-lg font-mono disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      ACTUALIZANDO...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      ACTUALIZAR
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs font-mono text-slate-500">
                ¿Recordaste tu contraseña?{" "}
                <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <UniqueFooter />
    </div>
  )
}
