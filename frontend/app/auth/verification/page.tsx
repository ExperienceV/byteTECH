"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, CheckCircle, AlertCircle, RotateCcw } from "lucide-react"
import { NormalHeader } from "@/components/normal-header"
import { NormalFooter } from "@/components/normal-footer"

const API_BASE = "http://127.0.0.1:8000/api"

export default function VerificationPage() {
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Auto-fill email from URL params if available
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam))
    }
  }, [searchParams])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("email", email)
      formData.append("code", code)
      const response = await fetch(`${API_BASE}/auth/verify_register`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      if (response.ok) {
        setSuccess("Usuario verificado correctamente.")
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      } else {
        const errorText = await response.text()
        setError(errorText || "Error en la verificación")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!email) {
      setError("Por favor ingresa tu email primero")
      return
    }

    setError(null)
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("email", email)

      const response = await fetch(`${API_BASE}/auth/resend_verification`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      if (response.ok) {
        setSuccess("Código de verificación reenviado a tu email.")
      } else {
        const errorText = await response.text()
        setError(errorText || "Error al reenviar código")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <NormalHeader />

      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">

              <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl md:text-4xl mb-4">
                <span className="text-blue-400">VERIFICAR</span>
              </h1>

              <p className="text-slate-400 font-mono text-sm">Confirma tu dirección de email</p>
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
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">
                    <span className="text-cyan-400">Email</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      className={`pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 font-mono focus:border-cyan-400 ${
                        searchParams.get("email") ? "bg-slate-700/50" : ""
                      }`}
                      readOnly={!!searchParams.get("email")}
                      disabled={loading}
                    />
                  </div>
                  {searchParams.get("email") && (
                    <p className="text-xs font-mono text-slate-500 mt-1">Email completado automáticamente</p>
                  )}
                </div>

                {/* Verification Code Field */}
                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">
                    <span className="text-cyan-400">Codigo de verificación</span>
                  </label>
                  <Input
                    id="code"
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    required
                    maxLength={6}
                    className="text-center text-lg tracking-widest bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 font-mono focus:border-cyan-400"
                    disabled={loading}
                  />
                  <p className="text-xs font-mono text-slate-500 mt-1">Revisa tu bandeja de entrada y spam</p>
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
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg font-mono disabled:opacity-50"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      VERIFICANDO...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      VERIFICAR
                    </>
                  )}
                </Button>
              </form>
            </div>

            <div className="mt-6 text-center space-y-2">
              <Button
                variant="ghost"
                onClick={handleResendCode}
                disabled={loading || !email}
                className="text-slate-400 hover:text-cyan-400 font-mono text-sm border border-slate-700 hover:border-cyan-400"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                REENVIAR CÓDIGO
              </Button>
              <p className="text-xs font-mono text-slate-500">
                ¿Ya tienes cuenta verificada?{" "}
                <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <NormalFooter />
    </div>
  )
}
