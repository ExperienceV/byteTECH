"use client"

import { UniqueHeader } from "@/components/unique-header"
import { HomeFooter } from "@/components/home-footer"
import { TerminalCourseCard } from "@/components/terminal-course-card"
import { Button } from "@/components/ui/button"
import { Terminal, Code, Zap } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

const API_BASE = "https://api.bytetechedu.com"

// Interfaz para los datos del curso
interface Course {
  id: number
  sensei_id: number
  name: string  
  description: string
  hours: number
  miniature_id: string
  price: number
  sensei_name: string
}

// Interfaz para los datos transformados para el componente TerminalCourseCard
interface CourseCardData {
  id: number
  title: string
  description: string
  price: number
  duration: string
  //students?: number
  //rating?: number
  //tags?: string[]
  instructor: string
  language?: string
  //difficulty?: "Beginner" | "Intermediate" | "Advanced"
  imageUrl?: string
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Función para obtener la URL de la imagen
  const getImageUrl = (miniatureId: string) => {
    return `${API_BASE}/api/media/get_file?file_id=${miniatureId}`
  }

  // Función para transformar los datos del API al formato esperado por el componente
  const transformCourseData = (apiCourse: Course): CourseCardData => {
    return {
      id: apiCourse.id,
      title: apiCourse.name,
      description: apiCourse.description,
      price: apiCourse.price,
      duration: `${apiCourse.hours} horas`,
      //students: Math.floor(Math.random() * 1000) + 100, // Datos simulados por ahora
      //rating: Number((4.5 + Math.random() * 0.5).toFixed(1)), // Rating simulado entre 4.5-5.0
      //tags: ["Programación", "Backend"], // Tags por defecto, podrías expandir esto
      instructor: apiCourse.sensei_name,
      //language: "Python", // Por defecto, podrías inferir del nombre del curso
      //difficulty: "Intermediate" as const, // Por defecto
      imageUrl: getImageUrl(apiCourse.miniature_id),
    }
  }

  // Cargar cursos del API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("https://api.bytetechedu.com/api/courses/mtd_courses")
        const data = await response.json()
        setCourses(data.mtd_courses || [])
      } catch (err) {
        setError("Error al cargar cursos")
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  return (
    <div className="min-h-screen bg-dynamic-gradient">
      <UniqueHeader />

      {/* ── Hero ─────────────────────────── */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-8">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-mono">Estado del Sistema: online</span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          <h1 className="font-mono font-bold leading-tight text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl mb-6">
            {">"} byte<span className="text-cyan-400">TECH</span>
            <br />
            <span className="text-slate-400 text-xl sm:text-2xl md:text-4xl">init --learning</span>
          </h1>

          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 max-w-full sm:max-w-2xl mx-auto mb-8 border border-slate-800 text-left font-mono text-xs sm:text-sm space-y-2 overflow-x-auto">
            <p className="text-green-400">
              <span className="text-slate-500">$</span> npm install knowledge --save
            </p>
            <p className="text-slate-400 ml-2">✓ Instalando habilidades de programación…</p>
            <p className="text-slate-400 ml-2">✓ Configurando el entorno de desarrollo…</p>
            <p className="text-cyan-400 ml-2">¡Listo para programar! 🚀</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/cursos">
              <Button className="bg-cyan-500 hover:bg-cyan-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-black w-full sm:w-auto">
                <Code className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-sm sm:text-base">Empieza a programar</span>
              </Button>
            </Link>
            <Link href="/soporte">
              <Button
                variant="outline"
                className="border-slate-700 text-slate-300 font-mono hover:bg-slate-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-transparent w-full sm:w-auto"
              >
                <span className="text-sm sm:text-base">./dudas --support</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Transición suave */}
      <div className="section-transition-up"></div>

      {/* ── Courses ──────────────────────── */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/3 via-transparent to-blue-900/3" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <header className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8 sm:mb-12">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500">
              <Zap className="h-5 w-5 text-black" />
            </span>
            <h2 className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-white">./courses</h2>
          </header>

          <p className="mb-8 sm:mb-12 text-base sm:text-lg font-mono text-slate-400">
            // ¡Mira nuestros cursos más vistos!
          </p>

          {/* Estados de carga y error */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2"></div>
              <p className="text-cyan-400 font-mono">Cargando cursos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-400 font-mono">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {courses.map((course) => (
                <TerminalCourseCard
                  key={course.id}
                  id={course.id}
                  title={course.name}
                  description={course.description}
                  price={course.price}
                  duration={`${course.hours} horas`}
                  instructor={course.sensei_name}
                  imageUrl={`https://api.bytetechedu.com/api/media/get_file?file_id=${course.miniature_id}`}
                  //language="Python"
                  //difficulty="Intermediate"
                  //tags={["Programación", "Backend"]}
                  //students={Math.floor(Math.random() * 1000) + 100}
                  //rating={Number((4.5 + Math.random() * 0.5).toFixed(1))}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Transición suave */}
      <div className="section-transition-down"></div>

      {/* Call To Action */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-transparent to-purple-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 text-center">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6 sm:p-8">
            <p className="mb-4 sm:mb-6 font-mono text-sm sm:text-base text-slate-400">
              {">"} Listo para subir de nivel tus habilidades?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/login">
                <Button className="bg-cyan-500 hover:bg-cyan-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-black w-full sm:w-auto">
                  <span className="text-sm sm:text-base">Únete al Campus</span>
                </Button>
              </Link>
              <Link href="/cursos">
                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300 font-mono hover:bg-slate-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-transparent w-full sm:w-auto"
                >
                  <span className="text-sm sm:text-base">Explora nuestros cursos</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <HomeFooter />
    </div>
  )
}
