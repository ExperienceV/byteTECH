"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Terminal, Mail, Lock, Eye, EyeOff, User, UserPlus, Check, AlertCircle } from "lucide-react"
import { UniqueHeader } from "@/components/unique-header"
import { UniqueFooter } from "@/components/unique-footer"

const API_BASE = "http://127.0.0.1:8000/api"

const EMAIL_DOMAINS = [
  { value: "@gmail.com", label: "@gmail.com" },
  { value: "@hotmail.com", label: "@hotmail.com" },
  { value: "@outlook.com", label: "@outlook.com" },
  { value: "@yahoo.com", label: "@yahoo.com" },
  { value: "@icloud.com", label: "@icloud.com" },
  { value: "custom", label: "Personalizado" },
]

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [emailUser, setEmailUser] = useState("")
  const [emailDomain, setEmailDomain] = useState("@gmail.com")
  const [password, setPassword] = useState("")
  const [isSensei, setIsSensei] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [terminalMessages, setTerminalMessages] = useState<string[]>([])
  const router = useRouter()

  const buildFullEmail = (username: string, domain: string) => {
    return domain === "custom" ? username : username + domain
  }

  const addTerminalMessage = (message: string, delay: number) => {
    setTimeout(() => {
      setTerminalMessages((prev) => [...prev, message])
    }, delay)
  }

  const getPasswordStrength = () => {
    const passwordValue = password
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
    setLoading(true)
    setTerminalMessages([])

    // Progressive terminal messages
    addTerminalMessage("$ npm run auth:register", 0)
    addTerminalMessage("→ Validando datos...", 500)
    addTerminalMessage("→ Conectando con el servidor...", 1000)
    addTerminalMessage("→ Creando usuario...", 1500)

    try {
      const fullEmail = buildFullEmail(emailUser, emailDomain)
      const formData = new FormData()
      formData.append("name", name)
      formData.append("email", fullEmail)
      formData.append("password", password)
      formData.append("is_sensei", isSensei.toString())

      const response = await fetch(`${API_BASE}/auth/init_register`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })

      if (response.ok) {
        addTerminalMessage("✓ Cuenta creada exitosamente", 2000)
        addTerminalMessage("→ Redirigiendo a verificación...", 2500)
        setSuccess("Usuario registrado. Revisa tu email para el código de verificación.")
        // Redirect to verification page with email
        setTimeout(() => {
          router.push(`/auth/verification?email=${encodeURIComponent(fullEmail)}`)
        }, 3000)
      } else {
        const errorText = await response.text()
        setError(errorText || "Error en el registro")
        addTerminalMessage("✗ Error en el registro", 2000)
      }
    } catch (err) {
      setError("Error de conexión")
      addTerminalMessage("✗ Error en el registro", 2000)
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
              <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-6">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-mono">./auth --register</span>
              </div>

              <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl md:text-4xl mb-4">
                {">"} <span className="text-green-400">CREAR CUENTA</span>
              </h1>

              <p className="text-slate-400 font-mono text-sm">// Únete a la comunidad ByteTechEdu</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">~/auth/register.js</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserPlus className="w-4 h-4 text-green-400" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">
                    <span className="text-cyan-400">const</span> name =<span className="text-yellow-400">"</span>
                    <span className="text-red-400">NAME</span>
                    <span className="text-yellow-400">"</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Tu nombre completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 font-mono focus:border-cyan-400"
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">
                    <span className="text-cyan-400">const</span> email =<span className="text-yellow-400">"</span>
                    <span className="text-red-400">EMAIL</span>
                    <span className="text-yellow-400">"</span>
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
                    <span className="text-cyan-400">const</span> password =<span className="text-yellow-400">"</span>
                    <span className="text-red-400">PASSWORD</span>
                    <span className="text-yellow-400">"</span>
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

                  {/* Password Strength Indicator */}
                  {password && (
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

                {/* Sensei Checkbox */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sensei"
                    checked={isSensei}
                    onCheckedChange={(checked) => setIsSensei(checked as boolean)}
                    className="border-slate-600 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                    disabled={loading}
                  />
                  <label htmlFor="sensei" className="text-sm font-mono text-slate-300">
                    <span className="text-green-400">bool</span> isSensei ={" "}
                    <span className="text-yellow-400">{isSensei ? "true" : "false"}</span>
                  </label>
                </div>

                {/* Error Display */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    <p className="text-red-400 text-sm font-mono">// Error: {error}</p>
                  </div>
                )}

                {/* Success Display */}
                {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <Check className="w-4 h-4 text-green-400" />
                    <p className="text-green-400 text-sm font-mono">// Success: {success}</p>
                  </div>
                )}

                <div className="space-y-4 pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg font-mono disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                        CREANDO...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        CREAR
                      </>
                    )}
                  </Button>

                  <div className="text-center">
                    <Link
                      href="/auth/login"
                      className="text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors border-b border-slate-700 hover:border-cyan-400 pb-1"
                    >
                      INICIAR SESIÓN
                    </Link>
                  </div>
                </div>

                {/* Terminal Output - Progressive messages */}
                {terminalMessages.length > 0 && (
                  <div className="mt-6 p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs font-mono text-slate-500 space-y-1">
                      {terminalMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`${
                            message.startsWith("$")
                              ? "text-green-400"
                              : message.startsWith("✓")
                                ? "text-green-400"
                                : message.startsWith("→")
                                  ? "text-slate-400"
                                  : message.startsWith("✗")
                                    ? "text-red-400"
                                    : "text-cyan-400"
                          }`}
                        >
                          {message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </form>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs font-mono text-slate-500">
                // Al crear una cuenta, aceptas nuestros{" "}
                <Link href="/terms" className="text-cyan-400 hover:text-cyan-300">
                  términos
                </Link>{" "}
                y{" "}
                <Link href="/privacy" className="text-cyan-400 hover:text-cyan-300">
                  política de privacidad
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
