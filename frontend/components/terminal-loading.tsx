"use client"

import { useEffect, useState } from "react"
import { Terminal, Code, Zap } from "lucide-react"

export function TerminalLoading() {
  const [currentStep, setCurrentStep] = useState(0)
  const [dots, setDots] = useState("")

  const loadingSteps = [
    "Inicializando byteTECH...",
    "Cargando módulos del sistema...",
    "Estableciendo conexión segura...",
    "Preparando interfaz de usuario...",
    "Optimizando experiencia...",
    "¡Casi listo!",
  ]

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length)
    }, 800)

    const dotsInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 300)

    return () => {
      clearInterval(stepInterval)
      clearInterval(dotsInterval)
    }
  }, [loadingSteps.length])

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-transparent to-cyan-900/10" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="grid-pattern h-full w-full" />
      </div>

      {/* Loading content */}
      <div className="relative z-10 max-w-sm sm:max-w-md w-full">
        {/* Terminal window */}
        <div className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          {/* Terminal header */}
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-800 bg-slate-800/50">
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full" />
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full" />
              </div>
              <span className="text-xs font-mono text-slate-400">~/loading</span>
            </div>
            <div className="flex items-center space-x-2">
              <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400" />
              <span className="text-xs font-mono text-cyan-400 hidden sm:inline">byteTECH v1.0.0</span>
            </div>
          </div>

          {/* Terminal content */}
          <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {/* Logo */}
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="relative">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Terminal className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-400 rounded-full animate-ping" />
              </div>
            </div>

            {/* Brand */}
            <div className="text-center mb-4 sm:mb-6">
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-white">
                byte<span className="text-cyan-400">TECH</span>
              </h1>
              <p className="text-xs text-slate-500 font-mono">Sistema de aprendizaje</p>
            </div>

            {/* Loading steps */}
            <div className="space-y-2 sm:space-y-3 font-mono text-xs sm:text-sm">
              {loadingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 transition-all duration-300 ${
                    index === currentStep ? "text-cyan-400" : index < currentStep ? "text-green-400" : "text-slate-600"
                  }`}
                >
                  <span className="text-slate-500">$</span>
                  <span className="truncate flex-1">{step}</span>
                  {index === currentStep && <span className="text-cyan-400">{dots}</span>}
                  {index < currentStep && <span className="text-green-400">✓</span>}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-4 sm:mt-6">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                <span>Progreso</span>
                <span>{Math.round(((currentStep + 1) / loadingSteps.length) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300 ease-out"
                  style={{
                    width: `${((currentStep + 1) / loadingSteps.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Loading animation */}
            <div className="flex items-center justify-center space-x-2 mt-4 sm:mt-6">
              <Code className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 animate-spin" />
              <div className="flex space-x-1">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-bounce"
                    style={{
                      animationDelay: `${i * 0.2}s`,
                    }}
                  />
                ))}
              </div>
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 animate-pulse" />
            </div>

            {/* Status */}
            <div className="text-center">
              <p className="text-xs font-mono text-slate-500">Cargando recursos del sistema...</p>
            </div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="text-center mt-4">
          <p className="text-xs font-mono text-slate-600">Powered by byteTECH Engine</p>
        </div>
      </div>
    </div>
  )
}
