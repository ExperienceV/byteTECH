"use client"

import { NormalHeader } from "@/components/normal-header"
import { NormalFooter } from "@/components/normal-footer"
import { TerminalCourseCard } from "@/components/terminal-course-card"
import { TechnologyCarousel } from "@/components/technology-carousel"
import { Button } from "@/components/ui/button"
import { Terminal, Code, Zap, ArrowRight, Briefcase, Layers, Shield, Rocket } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { API_BASE } from "@/lib/config"

interface Course {
  id: number
  sensei_id: number
  name: string
  description: string
  hours: number
  miniature_id: string
  price: number
  sensei_name: string
  lessons_count: number
}

interface CourseCardData {
  id: number
  title: string
  description: string
  price: number
  duration: string
  instructor: string
  language?: string
  imageUrl?: string
}

export default function index() {
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const getImageUrl = (miniatureId: string) => {
    return `${API_BASE}/api/media/get_file?file_id=${miniatureId}`
  }

  const transformCourseData = (apiCourse: Course): CourseCardData => {
    return {
      id: apiCourse.id,
      title: apiCourse.name,
      description: apiCourse.description,
      price: apiCourse.price,
      duration: `${apiCourse.hours} horas`,
      instructor: apiCourse.sensei_name,
      imageUrl: getImageUrl(apiCourse.miniature_id),
    }
  }

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

  const softwareServices = [
    {
      icon: Code,
      title: "Desarrollo Web",
      description: "Aplicaciones web modernas, responsive y de alto rendimiento",
      color: "text-blue-400",
    },
    {
      icon: Layers,
      title: "Desarrollo de Apps",
      description: "Aplicaciones móviles nativas y multiplataforma",
      color: "text-purple-400",
    },
    {
      icon: Briefcase,
      title: "Soluciones Empresariales",
      description: "Sistemas personalizados para automatizar tu negocio",
      color: "text-green-400",
    },
    {
      icon: Shield,
      title: "Consultoría Tech",
      description: "Estrategia digital y optimización de tu infraestructura",
      color: "text-orange-400",
    },
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      <NormalHeader />

      {/* ── HERO: Software Development Focus ─────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Section */}
            <div className="text-left">
              <div className="inline-block mb-6">
                <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2">
                  <Rocket className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm font-mono font-semibold">Soluciones de Software</span>
                </div>
              </div>

              <h1 className="font-sans font-bold leading-tight text-white text-5xl sm:text-6xl md:text-7xl mb-6">
                Transforma
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  tu negocio
                </span>
              </h1>

              <p className="text-slate-300 text-lg sm:text-xl mb-8 font-sans max-w-lg">
                Software development personalizado para empresas que quieren crecer sin límites. Escalabilidad,
                seguridad y performance garantizados.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/soporte">
                  <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-sans font-semibold px-8 py-4 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all flex items-center gap-2 w-full sm:w-auto">
                    Por si necesitas más info
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>

              {/* Quick stats */}
              <div className="flex gap-8 mt-12 pt-8 border-t border-slate-800">
                <div>
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-sm text-slate-400 font-mono">Proyectos Completados</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">98%</div>
                  <div className="text-sm text-slate-400 font-mono">Satisfacción</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">15+</div>
                  <div className="text-sm text-slate-400 font-mono">Años Experiencia</div>
                </div>
              </div>
            </div>

            {/* Terminal Visualization */}
            <div className="browser-window bg-section-dark backdrop-blur-sm hidden lg:block">
              <div className="p-6 pt-12">
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-2 ml-auto">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-400 text-sm font-mono">PRODUCTION</span>
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="font-mono text-white">
                  <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                    {">"} byte<span className="text-cyan-400">TECH</span> deploy
                  </h2>
                  <p className="text-slate-400 text-lg mb-4">Iniciando deployment...</p>

                  <div className="text-sm space-y-2">
                    <p className="text-green-400">
                      <span className="text-slate-500">✓ Validación completada</span>
                    </p>
                    <p className="text-slate-400 ml-2">✓ Build optimizado</p>
                    <p className="text-slate-400 ml-2">✓ Tests pasados</p>
                    <p className="text-slate-400 ml-2">✓ Seguridad verificada</p>
                    <p className="text-cyan-400 ml-2">▶ Deployment en vivo 🚀</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smooth transition */}
      <div className="section-transition-up"></div>

      {/* ── Software Services ─────────────────────── */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-purple-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="text-center mb-16">
            <h2 className="font-sans text-4xl lg:text-5xl font-bold text-white mb-4">Nuestros Servicios</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-sans">
              Soluciones de software completas adaptadas a tu industria
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {softwareServices.map((service, index) => {
              const Icon = service.icon
              return (
                <div
                  key={index}
                  className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-slate-600 hover:bg-slate-800/60 transition-all duration-300"
                >
                  <div className={`${service.color} mb-6 transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-white font-sans font-bold text-xl mb-3">{service.title}</h3>

                  <p className="text-slate-400 font-sans text-base leading-relaxed mb-6">{service.description}</p>

                  <Link
                    href="/empresarial"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span className="text-sm font-semibold">Conocer más</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              )
            })}

            <div className="group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700 rounded-xl p-8 hover:border-slate-600 hover:bg-slate-800/60 transition-all duration-300">
              <div className="text-pink-400 mb-6 transition-transform duration-300 group-hover:scale-110">
                <Zap className="w-8 h-8" />
              </div>

              <h3 className="text-white font-sans font-bold text-xl mb-3">Formación Técnica</h3>

              <p className="text-slate-400 font-sans text-base leading-relaxed mb-6">
                Cursos especializados para desarrolladores y equipos técnicos que buscan actualizar sus habilidades
              </p>

              <Link
                href="/cursos"
                className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors"
              >
                <span className="text-sm font-semibold">Ver cursos</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="section-transition-down"></div>

      {/* ── Technology Carousel ──────────────────────── */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-sans text-3xl lg:text-4xl font-bold text-white mb-4">Tecnologías que Dominarás</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-sans">
              Esto es lo que aprenderás con nuestros cursos especializados
            </p>
          </div>
          <TechnologyCarousel />
        </div>
      </section>

      <div className="section-transition-up"></div>

      {/* ── Courses Section (Secondary Positioning) ──────────────────────── */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/3 via-transparent to-blue-900/3" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-sans text-3xl lg:text-4xl font-bold text-white">Potencia tu Equipo</h2>
                <p className="text-slate-400 font-sans text-base mt-2">
                  Formación especializada para mantener a tu equipo actualizado con las últimas tecnologías
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto mb-2"></div>
              <p className="text-cyan-400 font-mono">Cargando cursos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 font-mono">{error}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <TerminalCourseCard
                  key={course.id}
                  id={course.id}
                  title={course.name}
                  description={course.description}
                  price={course.price}
                  duration={`${course.hours} horas`}
                  instructor={`Instructor: ${course.sensei_name}`}
                  imageUrl={`${API_BASE}/media/get_file?file_id=${course.miniature_id}`}
                  lessons_count={course.lessons_count}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/cursos">
              <Button className="bg-slate-800 hover:bg-slate-700 text-white font-sans font-semibold px-8 py-4 rounded-lg text-lg border border-slate-700">
                Ver todos nuestros cursos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <div className="section-transition-down"></div>

      {/* ── CTA: Contact for Software Development ─────────────────────── */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-cyan-900/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-sans text-4xl lg:text-5xl font-bold text-white mb-6">
              ¿Necesitas una Solución de Software?
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              Nuestro equipo de expertos está listo para convertir tu visión en realidad. Obtén una consulta gratuita
              hoy.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/empresarial">
                <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-sans font-semibold px-8 py-4 rounded-lg text-lg w-full sm:w-auto">
                  Nuestra experiencia
                </Button>
              </Link>
              <Link href="/soporte">
                <Button
                  variant="outline"
                  className="border border-slate-600 text-slate-300 hover:bg-slate-800/50 px-8 py-4 rounded-lg font-sans font-semibold text-lg w-full sm:w-auto bg-transparent"
                >
                  Contactarnos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <NormalFooter />
    </div>
  )
}
