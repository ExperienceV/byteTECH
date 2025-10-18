"use client"

import { NormalHeader } from "@/components/normal-header"
import { NormalFooter } from "@/components/normal-footer"
import { TerminalCourseCard } from "@/components/terminal-course-card"
import { Terminal, BookOpen, Search } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import { coursesApi, CourseData, getApiBase } from "@/lib/api"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CursosPage() {
  const [cursos, setCursos] = useState<CourseData[]>([])
  const [filteredCursos, setFilteredCursos] = useState<CourseData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const router = useRouter()
  const searchBoxRef = useRef<HTMLDivElement>(null)

  const slugify = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const normalizeDifficulty = (
    d?: string
  ): "Beginner" | "Intermediate" | "Advanced" => {
    const val = (d || "").toLowerCase()
    if (["beginner", "basico", "básico"].includes(val)) return "Beginner"
    if (["intermediate", "intermedio", "medio"].includes(val)) return "Intermediate"
    if (["advanced", "avanzado"].includes(val)) return "Advanced"
    return "Intermediate"
  }

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await coursesApi.getMtdCourses()
        if (!res.ok) {
          throw new Error(res.message || "Error al cargar los cursos")
        }
        const courses = res.data?.mtd_courses || []
        setCursos(courses)
        setFilteredCursos(courses)
      } catch (e) {
        setError("No se pudieron cargar los cursos")
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  // Search functionality
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    if (!value.trim()) {
      setFilteredCursos(cursos)
      setShowSuggestions(false)
      setActiveIndex(-1)
      return
    }
    
    const q = value.trim().toLowerCase()
    const filtered = cursos.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.sensei_name?.toLowerCase() || "").includes(q) ||
      (c.description?.toLowerCase() || "").includes(q) ||
      (c.tags || []).some(tag => tag.toLowerCase().includes(q))
    )
    setFilteredCursos(filtered)
    setShowSuggestions(true)
  }

  const navigateToCourseByName = (name: string) => {
    const slug = slugify(name)
    router.push(`/prevista/${slug}`)
    setShowSuggestions(false)
    setActiveIndex(-1)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!showSuggestions || filteredCursos.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex(prev => (prev + 1) % filteredCursos.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex(prev => (prev - 1 + filteredCursos.length) % filteredCursos.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      const selected = activeIndex >= 0 ? filteredCursos[activeIndex] : filteredCursos[0]
      if (selected) {
        navigateToCourseByName(selected.name)
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setActiveIndex(-1)
    }
  }

  // Close search when clicking outside
  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      const target = event.target as Node
      if (searchBoxRef.current && !searchBoxRef.current.contains(target)) {
        setShowSuggestions(false)
        setActiveIndex(-1)
      }
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
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
      <NormalHeader />

      {/* Hero Section */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-8">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-mono">CURSOS</span>
            </div>

            <h1 className="font-mono font-bold leading-tight text-white text-3xl sm:text-4xl md:text-6xl mb-6">
              {">"} NUESTROS <span className="text-green-400">CURSOS</span>
              <br />
              <span className="text-slate-400 text-xl sm:text-2xl md:text-4xl">DISPONIBLES</span>
            </h1>

            <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 max-w-2xl mx-auto border border-slate-800 text-left font-mono text-xs sm:text-sm space-y-2">
              <p className="text-green-400">
                <span className="text-slate-500">$</span> Buscando cursos disponibles...
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
              <h2 className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-white"> CATÁLOGO</h2>
              <p className="text-slate-400 font-mono text-sm sm:text-base mt-1">
                 Explora nuestros cursos especializados
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2">
              <span className="text-cyan-400 font-mono text-sm">{filteredCursos.length} cursos</span>
            </div>
          </div>

          {/* Search Section */}
          <div className="mb-8 sm:mb-12">
            <div className="relative max-w-md mx-auto" ref={searchBoxRef}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim()) setShowSuggestions(true)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Buscar cursos por nombre, instructor o tecnología..."
                className="w-full pl-12 pr-4 py-3 bg-slate-900/80 border-slate-700 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400 font-mono text-sm rounded-xl"
              />
              {showSuggestions && searchQuery.trim() && (
                <div className="absolute mt-2 w-full bg-slate-900/95 backdrop-blur-sm border border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden">
                  {filteredCursos.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-slate-400 font-mono">No se encontraron cursos</div>
                  ) : (
                    filteredCursos.slice(0, 5).map((curso, idx) => (
                      <button
                        key={curso.id}
                        onMouseDown={(e) => { e.preventDefault(); navigateToCourseByName(curso.name); }}
                        className={`w-full text-left px-4 py-3 font-mono text-sm border-b border-slate-800 last:border-b-0 ${idx === activeIndex ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/70'}`}
                      >
                        <div className="flex flex-col">
                          <span className="text-white font-semibold">{curso.name}</span>
                          <span className="text-xs text-slate-400">
                            por {curso.sensei_name || 'Instructor'} • ${curso.price || 0}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 sm:mb-12">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 font-mono">{cursos.length}</div>
              <div className="text-slate-400 text-sm font-mono">Cursos</div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400 font-mono">
                +100 {/*cursos.reduce((total, curso) => total + (curso.students || 0), 0)}}*/}
              </div>
              <div className="text-slate-400 text-sm font-mono">Estudiantes</div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 font-mono">
                {new Set(cursos.map((curso) => curso.language || curso.tags?.[0])).size}
              </div>
              <div className="text-slate-400 text-sm font-mono">Tecnologías</div>
            </div>
            {/*<div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-400 font-mono">
                {cursos.length > 0
                  ? (cursos.reduce((sum, curso) => sum + (curso.rating || 0), 0) / cursos.length).toFixed(1)
                  : "0.0"}
              </div>
              <div className="text-slate-400 text-sm font-mono">Rating</div>
            </div>*/}
          </div>

          {/* Courses Grid */}
          {filteredCursos.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-400 font-mono text-lg">
                {searchQuery.trim() ? "No se encontraron cursos que coincidan con tu búsqueda." : "No hay cursos disponibles."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredCursos.map((curso, index) => {
                const base = getApiBase()
                const imageUrl = curso.miniature_id
                  ? `${base}/media/get_file?file_id=${encodeURIComponent(curso.miniature_id)}`
                  : undefined
                
                return (
                  <TerminalCourseCard
                    key={index}
                    id={curso.id}
                    title={curso.name}
                    description={
                      curso.preludio || `Curso impartido por ${curso.sensei_name ?? "Sensei"}`
                    }
                    instructor={`Instructor: ${curso.sensei_name || "Sensei"}`}
                    price={curso.price || 0}
                    duration={curso.hours ? `${curso.hours}h` : "Por definir"}
                    students={curso.students || 0}
                    rating={curso.rating || 0}
                    tags={curso.tags || []}
                    language={curso.language || ""}
                    difficulty={normalizeDifficulty(curso.difficulty)}
                    href={`/prevista/${slugify(curso.name)}`}
                    lessons_count={`Lecciones: ${curso.lessons_count || 0}`}
                    imageUrl={imageUrl}
                  />
                )
              })}
            </div>
          )}
        </div>
      </section>

      <NormalFooter />
    </div>
  )
}
