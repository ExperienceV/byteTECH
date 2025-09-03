"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Terminal, LogOut } from "lucide-react"
import { UniqueHeader } from "@/components/unique-header"
import { UniqueFooter } from "@/components/unique-footer"

const API_BASE = "http://127.0.0.1:8000/api"

export default function LogoutPage() {
  const router = useRouter()
  const [terminalMessages, setTerminalMessages] = useState<string[]>([])

  const addTerminalMessage = (message: string, delay: number) => {
    setTimeout(() => {
      setTerminalMessages((prev) => [...prev, message])
    }, delay)
  }

  useEffect(() => {
    const performLogout = async () => {
      // Progressive terminal messages
      addTerminalMessage("$ npm run auth:logout", 0)
      addTerminalMessage("→ Cerrando sesión activa...", 500)
      addTerminalMessage("→ Limpiando tokens de autenticación...", 1000)
      addTerminalMessage("→ Desconectando del servidor...", 1500)

      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          credentials: "include",
        })
        addTerminalMessage("✓ Sesión cerrada exitosamente", 2000)
      } catch (err) {
        console.error("Logout error:", err)
        addTerminalMessage("✗ Error al cerrar sesión", 2000)
      } finally {
        addTerminalMessage("→ Redirigiendo al login...", 2500)
        // Always redirect to login regardless of API response
        setTimeout(() => {
          router.push("/auth/login")
        }, 3000)
      }
    }

    performLogout()
  }, [router])

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
                <span className="text-cyan-400 text-sm font-mono">./auth --logout</span>
              </div>

              <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl md:text-4xl mb-4">
                {">"} <span className="text-red-400">CERRANDO SESIÓN</span>
              </h1>

              <p className="text-slate-400 font-mono text-sm">// Desconectando de forma segura...</p>
            </div>

            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">~/auth/logout.js</span>
                </div>
                <div className="flex items-center space-x-2">
                  <LogOut className="w-4 h-4 text-red-400" />
                </div>
              </div>

              <div className="p-6 text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/10 rounded-full mb-4">
                    <LogOut className="w-8 h-8 text-red-400" />
                  </div>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400 mx-auto mb-4"></div>
                </div>

                {/* Terminal Output - Progressive messages */}
                <div className="p-3 bg-slate-800/50 rounded-lg">
                  <div className="text-xs font-mono text-slate-500 space-y-1 text-left">
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
                    {terminalMessages.length === 0 && (
                      <div className="text-slate-400">// Iniciando proceso de logout...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs font-mono text-slate-500">// Gracias por usar ByteTechEdu</p>
            </div>
          </div>
        </div>
      </section>

      <UniqueFooter />
    </div>
  )
}
