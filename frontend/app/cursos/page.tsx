"use client"

import { UniqueHeader } from "@//components/unique-header"
import { UniqueFooter } from "@//components/unique-footer"
import { TerminalCourseCard } from "@//components/terminal-course-card"
import { Terminal, BookOpen } from "lucide-react"
import { useEffect, useState } from "react"
import { coursesApi } from "@/lib/api"

export default function CursosPage() {
  const [cursos, setCursos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    coursesApi
      .getMtdCourses()
      .then((data) => {
        setCursos(data.mtd_courses)
        setLoading(false)
      })
      .catch((err) => {
        setError("No se pudieron cargar los cursos")
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-dynamic-gradient flex items-center justify-center">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">Cargando cursos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dynamic-gradient flex items-center justify-center">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-red-800 rounded-xl p-8 text-center">
          <p className="text-red-400 font-mono">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dynamic-gradient">
      <UniqueHeader />

      {/* Hero Section */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-8">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-mono">./courses --list-all</span>
            </div>

            <h1 className="font-mono font-bold leading-tight text-white text-3xl sm:text-4xl md:text-6xl mb-6">
              {">"} NUESTROS <span className="text-green-400">CURSOS</span>
              <br />
              <span className="text-slate-400 text-xl sm:text-2xl md:text-4xl">DISPONIBLES</span>
            </h1>

            <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 max-w-2xl mx-auto border border-slate-800 text-left font-mono text-xs sm:text-sm space-y-2">
              <p className="text-green-400">
                <span className="text-slate-500">$</span> find ./courses -type course -status available
              </p>
              <p className="text-slate-400 ml-2">✓ Encontrados {cursos.length} cursos activos</p>
              <p className="text-slate-400 ml-2">✓ Todos los niveles disponibles</p>
              <p className="text-cyan-400 ml-2">¡Elige tu próximo desafío! 🚀</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transición suave */}
      <div className="section-transition-up"></div>

      {/* Courses Catalog */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/3 via-transparent to-blue-900/3" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8 sm:mb-12">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
              <BookOpen className="h-5 w-5 text-black" />
            </span>
            <div className="flex-1">
              <h2 className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-white">./catalog</h2>
              <p className="text-slate-400 font-mono text-sm sm:text-base mt-1">
                // Explora nuestros cursos especializados
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2">
              <span className="text-cyan-400 font-mono text-sm">{cursos.length} cursos</span>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 sm:mb-12">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 font-mono">{cursos.length}</div>
              <div className="text-slate-400 text-sm font-mono">Cursos</div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400 font-mono">
                {cursos.reduce((total, curso) => total + (curso.students || 0), 0)}
              </div>
              <div className="text-slate-400 text-sm font-mono">Estudiantes</div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 font-mono">
                {new Set(cursos.map((curso) => curso.language || curso.tags?.[0])).size}
              </div>
              <div className="text-slate-400 text-sm font-mono">Tecnologías</div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-400 font-mono">
                {cursos.length > 0
                  ? (cursos.reduce((sum, curso) => sum + (curso.rating || 0), 0) / cursos.length).toFixed(1)
                  : "0.0"}
              </div>
              <div className="text-slate-400 text-sm font-mono">Rating</div>
            </div>
          </div>

          {/* Courses Grid */}
          {cursos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 font-mono text-lg">No hay cursos disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {cursos.map((curso, index) => (
                <TerminalCourseCard
                  key={index}
                  title={curso.name || curso.title}
                  description={curso.description || `Curso impartido por ${curso.sensei_name}`}
                  instructor={curso.sensei_name || curso.instructor}
                  price={curso.price || 0}
                  duration={curso.duration || "Por definir"}
                  students={curso.students || 0}
                  rating={curso.rating || 0}
                  tags={curso.tags || []}
                  language={curso.language || ""}
                  difficulty={curso.difficulty || "Intermedio"}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <UniqueFooter />
    </div>
  )
}
