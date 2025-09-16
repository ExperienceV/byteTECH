"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, AlertCircle } from "lucide-react"
import { UniqueHeader } from "@/components/unique-header"
import { UniqueFooter } from "@/components/unique-footer"
import { useAuth } from "@/lib/auth-context"

const EMAIL_DOMAINS = [
  { value: "@gmail.com", label: "@gmail.com" },
  { value: "@hotmail.com", label: "@hotmail.com" },
  { value: "@outlook.com", label: "@outlook.com" },
  { value: "@yahoo.com", label: "@yahoo.com" },
  { value: "@icloud.com", label: "@icloud.com" },
  { value: "custom", label: "Personalizado" },
]

export default function LoginPage() {
  const [emailUser, setEmailUser] = useState("")
  const [emailDomain, setEmailDomain] = useState("@gmail.com")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { login } = useAuth()

  const buildFullEmail = (username: string, domain: string) => {
    return domain === "custom" ? username : username + domain
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const fullEmail = buildFullEmail(emailUser, emailDomain)
      const ok = await login(fullEmail, password)
      if (ok) {
        router.push("/")
      } else {
        setError("Error en el login")
      }
    } catch (err) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Unique Header */}
      <UniqueHeader />

      {/* Hero Section */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">

              <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl md:text-4xl mb-4">
              <span className="text-cyan-400">INGRESAR</span>
              </h1>

              <p className="text-slate-400 font-mono text-sm">Accede a tu cuenta de ByteTechEdu</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* General Error */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-red-400 text-sm font-mono">Error: {error}</p>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">
                    <span className="text-cyan-400">Email</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <Input
                        id="email"
                        type={emailDomain === "custom" ? "email" : "text"}
                        placeholder={emailDomain === "custom" ? "usuario@ejemplo.com" : "usuario"}
                        value={emailUser}
                        onChange={(e) => setEmailUser(e.target.value)}
                        required
                        className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 font-mono focus:border-cyan-400"
                        disabled={loading}
                      />
                    </div>
                    <Select value={emailDomain} onValueChange={setEmailDomain} disabled={loading}>
                      <SelectTrigger className="w-32 bg-slate-800/50 border-slate-700 text-white font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        {EMAIL_DOMAINS.map((domain) => (
                          <SelectItem key={domain.value} value={domain.value} className="text-white font-mono">
                            {domain.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">
                    <span className="text-cyan-400">Contraseña</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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
                </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-3 rounded-lg font-mono disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                        CONECTANDO...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="mr-2 h-4 w-4" />
                        CONTINUAR
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Link
                      href="/auth/register"
                      className="text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors border-b border-slate-700 hover:border-cyan-400 pb-1"
                    >
                      CREAR CUENTA
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            {/* Additional Options */}
            <div className="mt-6 text-center">
              <p className="text-xs font-mono text-slate-500">
                ¿Olvidaste tu contraseña?{" "}
                <Link href="/auth/forgot-password" className="text-cyan-400 hover:text-cyan-300">
                  Recuperar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Unique Footer */}
      <UniqueFooter />
    </div>
  )
}
