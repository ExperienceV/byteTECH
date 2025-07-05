"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { UniqueHeader } from "@//components/unique-header"
import { UniqueFooter } from "@//components/unique-footer"
import { Button } from "@//components/ui/button"
import { Input } from "@//components/ui/input"
import { Terminal, Mail, ArrowLeft, Send, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setError("Email requerido")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email inválido")
      return
    }

    setError("")
    setIsSubmitted(true)

    // Aquí iría la lógica de envío de email
    console.log("Password reset requested for:", email)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-dynamic-gradient">
        <UniqueHeader />

        <section className="bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-6">
                  <Terminal className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 text-sm font-mono">./email --sent</span>
                </div>

                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>

                <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl mb-4">
                  {">"} Email <span className="text-green-400">Enviado</span>
                </h1>

                <p className="text-slate-400 font-mono text-sm mb-8">// Revisa tu bandeja de entrada</p>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <span className="text-xs font-mono text-slate-400">~/email/confirmation.js</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="text-center space-y-4">
                    <p className="text-slate-300 leading-relaxed">Hemos enviado un enlace de recuperación a:</p>
                    <div className="bg-slate-800/50 rounded-lg p-3">
                      <span className="text-cyan-400 font-mono">{email}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Si no recibes el email en unos minutos, revisa tu carpeta de spam o intenta nuevamente.
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Link href="/login">
                      <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold py-3 rounded-lg font-mono">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver al Login
                      </Button>
                    </Link>

                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="w-full text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors border-b border-slate-700 hover:border-cyan-400 pb-1"
                    >
                      Intentar con otro email
                    </button>
                  </div>

                  <div className="mt-6 p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs font-mono text-slate-500 space-y-1">
                      <div className="text-green-400">$ send-recovery-email --to {email}</div>
                      <div className="text-slate-400">→ Email enviado exitosamente</div>
                      <div className="text-slate-400">→ Válido por 1 hora</div>
                    </div>
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

  return (
    <div className="min-h-screen bg-dynamic-gradient">
      <UniqueHeader />

      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-6">
                <Terminal className="w-4 h-4 text-orange-400" />
                <span className="text-orange-400 text-sm font-mono">./auth --recover</span>
              </div>

              <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl md:text-4xl mb-4">
                {">"} ¿Olvidaste tu <span className="text-orange-400">contraseña</span>?
              </h1>

              <p className="text-slate-400 font-mono text-sm">// No te preocupes, te ayudamos a recuperarla</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">~/auth/recover.js</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-orange-400" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 font-mono ${
                        error ? "border-red-500" : "focus:border-cyan-400"
                      }`}
                    />
                  </div>
                  {error && <p className="text-red-400 text-xs font-mono mt-1">// Error: {error}</p>}
                </div>

                <div className="space-y-4 pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-black font-semibold py-3 rounded-lg font-mono"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    ENVIAR ENLACE
                  </Button>

                  <div className="text-center space-y-2">
                    <Link
                      href="/login"
                      className="text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors border-b border-slate-700 hover:border-cyan-400 pb-1"
                    >
                      <ArrowLeft className="inline w-3 h-3 mr-1" />
                      Volver al login
                    </Link>
                  </div>
                </div>

                <div className="mt-6 p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-xs font-mono text-slate-500 space-y-1">
                    <div className="text-orange-400">$ npm run auth:recover</div>
                    <div className="text-slate-400">→ Preparando enlace de recuperación...</div>
                    <div className="text-slate-400">→ Validando email...</div>
                  </div>
                </div>
              </form>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs font-mono text-slate-500">// El enlace será válido por 1 hora</p>
            </div>
          </div>
        </div>
      </section>

      <UniqueFooter />
    </div>
  )
}
