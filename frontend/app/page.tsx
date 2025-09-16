"use client"

import { UniqueHeader } from "@/components/unique-header"
import { HomeFooter } from "@/components/home-footer"
import { TerminalCourseCard } from "@/components/terminal-course-card"
import { Button } from "@/components/ui/button"
import { Terminal, Code, Zap } from 'lucide-react'
import Link from "next/link"
import { useEffect, useState } from "react"
import { API_BASE } from "@/lib/config"

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

export default function index() {
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
        const response = await fetch(`${API_BASE}/courses/mtd_courses`)
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
    <div className="min-h-screen bg-slate-950">
      <UniqueHeader />

      {/* ── Hero ─────────────────────────── */}
      <section className="relative overflow-hidden bg-dynamic-gradient">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Content Section */}
            <div className="text-left">
              <h1 className="font-sans font-bold leading-tight text-white text-4xl sm:text-5xl md:text-6xl mb-4">
                ¡Desbloquea
                <br />
                <span className="gradient-text-blue">tu potencial</span>
              </h1>
              <p className="text-slate-300 text-lg sm:text-xl mb-8 font-sans">
                Conviértete en el desarrollador
                <br />
                que el mundo necesita!
              </p>

              <Link href="/cursos">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-sans font-semibold px-8 py-4 rounded-lg text-lg shadow-lg pulse-glow">
                  Comenzar a Aprender!
                </Button>
              </Link>
            </div>

            {/* Terminal Section */}
            <div className="browser-window bg-section-dark backdrop-blur-sm">
              <div className="p-6 pt-12">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-2 ml-auto">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400 text-sm font-mono">ONLINE</span>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="font-mono text-white">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    {">"} byte<span className="text-cyan-400">TECH</span>
                  </h2>
                  <p className="text-slate-400 text-lg mb-4">init --learning</p>

                  <div className="text-sm space-y-1">
                    <p className="text-green-400">
                      <span className="text-slate-500">$</span> npm install knowledge --save
                    </p>
                    <p className="text-slate-400 ml-2">✓ Instalando habilidades de programación…</p>
                    <p className="text-slate-400 ml-2">✓ Configurando el entorno de desarrollo…</p>
                    <p className="text-cyan-400 ml-2">¡Listo para programar! 🚀</p>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <Link href="/cursos">
                      <Button className="bg-cyan-500 hover:bg-cyan-600 font-mono text-black px-4 py-2 text-sm">
                        <Code className="mr-2 h-4 w-4" />
                        Empieza a programar
                      </Button>
                    </Link>
                    <Link href="/soporte">
                      <Button
                        variant="outline"
                        className="border-slate-700 text-slate-300 font-mono hover:bg-slate-800 px-4 py-2 text-sm bg-transparent"
                      >
                        ./dudas --support
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transición suave */}
      <div className="section-transition-up"></div>

      {/* ── Courses ──────────────────────── */}
      <section className="bg-section-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/3 via-transparent to-blue-900/3" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <header className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8 sm:mb-12">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500">
              <Zap className="h-5 w-5 text-black" />
            </span>
            <h2 className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Cursos</h2>
          </header>

          <p className="mb-8 sm:mb-12 text-base sm:text-lg font-mono text-slate-400">
          ¡Mira nuestros cursos más vistos!
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
                  imageUrl={`${API_BASE}/media/get_file?file_id=${course.miniature_id}`}
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
      <section className="bg-section-darker relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-transparent to-purple-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 text-center">
          <div className="glass rounded-xl p-6 sm:p-8">
            <p className="mb-4 sm:mb-6 font-mono text-sm sm:text-base text-slate-400">
              {">"} Listo para subir de nivel tus habilidades?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth/ingresar">
                <Button className="bg-black hover:bg-gray-800 text-white font-sans font-semibold px-8 py-4 rounded-lg text-lg w-full sm:w-auto love-hover">
                  Únete al Campus
                </Button>
              </Link>
              <Link href="/cursos">
                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300 font-mono hover:bg-slate-800 px-8 py-4 rounded-lg bg-transparent w-full sm:w-auto"
                >
                  Explora nuestros cursos
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
