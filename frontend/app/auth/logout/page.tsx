"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { NormalHeader } from "@/components/normal-header"
import { NormalFooter } from "@/components/normal-footer"

const API_BASE = "http://127.0.0.1:8000/api"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      try {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          credentials: "include",
        })
      } catch (err) {
        console.error("Logout error:", err)
      } finally {
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      }
    }
    performLogout()
  }, [router])

  return (
    <div className="min-h-screen bg-slate-950">
      <NormalHeader />

      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">

              <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl md:text-4xl mb-4">
                <span className="text-red-400">CERRANDO SESIÓN</span>
              </h1>

              <p className="text-slate-400 font-mono text-sm">Desconectando de forma segura...</p>
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

                <div className="p-3 bg-slate-800/50 rounded-lg flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-red-400 font-mono text-sm">Cerrando sesión...</span>
                </div>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs font-mono text-slate-500">Gracias por usar ByteTechEdu</p>
            </div>
          </div>
        </div>
      </section>

      <NormalFooter />
    </div>
  )
}
