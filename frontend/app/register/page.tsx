"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { UniqueHeader } from "@//components/unique-header"
import { UniqueFooter } from "@//components/unique-footer"
import { Button } from "@//components/ui/button"
import { Input } from "@//components/ui/input"
import { Terminal, Mail, Lock, Eye, EyeOff, User, UserPlus, Check } from "lucide-react"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [terminalMessages, setTerminalMessages] = useState<string[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = { name: "", email: "", password: "" }

    if (!formData.name) {
      newErrors.name = "Nombre requerido"
    } else if (formData.name.length < 2) {
      newErrors.name = "Mínimo 2 caracteres"
    }

    if (!formData.email) {
      newErrors.email = "Email requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.password) {
      newErrors.password = "Password requerido"
    } else if (formData.password.length < 8) {
      newErrors.password = "Mínimo 8 caracteres"
    }

    setErrors(newErrors)
    return !newErrors.name && !newErrors.email && !newErrors.password
  }

  const addTerminalMessage = (message: string, delay: number) => {
    setTimeout(() => {
      setTerminalMessages((prev) => [...prev, message])
    }, delay)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsLoading(true)
    setTerminalMessages([])

    // Progressive terminal messages
    addTerminalMessage("$ npm run auth:register", 0)
    addTerminalMessage("→ Validando datos...", 500)
    addTerminalMessage("→ Creando usuario...", 1000)
    addTerminalMessage("→ Configurando perfil...", 1500)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2500))

    addTerminalMessage("✓ Cuenta creada exitosamente", 2500)

    // Reset form and show success
    setTimeout(() => {
      setFormData({ name: "", email: "", password: "" })
      setTerminalMessages([])
      setIsLoading(false)
      // Show success message or redirect to login
    }, 3000)
  }

  const getPasswordStrength = () => {
    const password = formData.password
    if (password.length === 0) return { strength: 0, text: "" }
    if (password.length < 6) return { strength: 1, text: "Débil", color: "text-red-400" }
    if (password.length < 8) return { strength: 2, text: "Media", color: "text-yellow-400" }
    if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, text: "Fuerte", color: "text-green-400" }
    }
    return { strength: 2, text: "Media", color: "text-yellow-400" }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="min-h-screen bg-dynamic-gradient">
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

              <p className="text-slate-400 font-mono text-sm">// Únete a la comunidad byteTECH</p>
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
                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">
                    <span className="text-cyan-400">const</span> name =<span className="text-yellow-400">"</span>
                    <span className="text-red-400">NAME</span>
                    <span className="text-yellow-400">"</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="text"
                      placeholder="Tu nombre completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className={`pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 font-mono ${
                        errors.name ? "border-red-500" : "focus:border-cyan-400"
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && <p className="text-red-400 text-xs font-mono mt-1">// Error: {errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">
                    <span className="text-cyan-400">const</span> email =<span className="text-yellow-400">"</span>
                    <span className="text-red-400">EMAIL</span>
                    <span className="text-yellow-400">"</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type="email"
                      placeholder="tu@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 font-mono ${
                        errors.email ? "border-red-500" : "focus:border-cyan-400"
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && <p className="text-red-400 text-xs font-mono mt-1">// Error: {errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-mono text-slate-300 mb-2">
                    <span className="text-cyan-400">const</span> password =<span className="text-yellow-400">"</span>
                    <span className="text-red-400">PASSWORD</span>
                    <span className="text-yellow-400">"</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className={`pl-10 pr-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 font-mono ${
                        errors.password ? "border-red-500" : "focus:border-cyan-400"
                      }`}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {formData.password && (
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

                  {errors.password && (
                    <p className="text-red-400 text-xs font-mono mt-1">// Error: {errors.password}</p>
                  )}
                </div>

                <div className="space-y-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-lg font-mono disabled:opacity-50"
                  >
                    {isLoading ? (
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
                      href="/login"
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
