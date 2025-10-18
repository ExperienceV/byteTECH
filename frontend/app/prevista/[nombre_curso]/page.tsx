"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { NormalHeader } from "@/components/normal-header"
import { NormalFooter } from "@/components/normal-footer"
import { CourseContentPreview } from "@/components/course-content-preview"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { coursesApi, type CourseData, type CourseContentResponse, getApiBase } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import "../../../styles/video-player.css"
import { formatTextForHTML } from "@/lib/text-formatter"
import {
  Terminal,
  Play,
  Clock,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  Lock,
  ShoppingCart,
  Code,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

function normalizeSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export default function PrevistaPage() {
  const params = useParams<{ nombre_curso: string }>()
  const slug = (params?.nombre_curso || "").toString()
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [isPaid, setIsPaid] = useState<boolean>(false)
  const [isPurchasing, setIsPurchasing] = useState(false)

  useEffect(() => {
    let alive = true

    async function fetchCourseData() {
      try {
        setLoading(true)
        setError("")

        // 1) Obtener todos los cursos y encontrar por slug
        const allCoursesResponse = await coursesApi.getMtdCourses()
        const allCourses = allCoursesResponse.data?.mtd_courses || []

        const course = allCourses.find((c) => normalizeSlug(c.name) === normalizeSlug(slug))
        if (!course) {
          throw new Error("Curso no encontrado")
        }

        // 2) Obtener contenido detallado del curso (por id)
        const courseContentResp = await coursesApi.getCourseContent(course.id)
        if (!courseContentResp.ok) {
          // Para la página de prevista, no redirigimos por errores 401
          // Solo mostramos la información básica del curso
          if (courseContentResp.status === 401) {
            // Usar solo la información básica del curso
            setCourseData(course as unknown as CourseData)
            setIsPaid(false)
            return
          }
          throw new Error(courseContentResp.message || "Error al cargar el curso")
        }
        const payload = courseContentResp.data as CourseContentResponse
        if (!alive) return
        setCourseData(payload.course_content as unknown as CourseData)
        setIsPaid(Boolean(payload.is_paid))
      } catch (err: any) {
        if (!alive) return
        console.error("Error fetching course:", err)
        setError(err?.message || "Error al cargar el curso")
      } finally {
        if (alive) setLoading(false)
      }
    }

    if (slug) fetchCourseData()
    return () => {
      alive = false
    }
  }, [slug])

  const handlePurchase = async () => {
    if (!courseData) return

    if (!isLoggedIn || !user) {
      // Redirigir directamente a la página de registro
      router.push("/auth/registro")
      return
    }

    setIsPurchasing(true)
    setError("")

    try {
      const purchaseResponse = await coursesApi.buyCourse(courseData.id)
      const checkoutUrl = (purchaseResponse.data as any)?.checkout_url
      if (purchaseResponse.ok && checkoutUrl) {
        window.location.href = checkoutUrl
      } else if (purchaseResponse.status === 409) {
        setError("Ya posees este curso")
      } else if (purchaseResponse.status === 404) {
        setError("Curso no encontrado")
      } else if (purchaseResponse.status === 401) {
        setError("Debes iniciar sesión para comprar este curso")
      } else {
        setError(purchaseResponse.message || "Error al procesar la compra. Inténtalo de nuevo.")
      }
    } catch (err: any) {
      console.error("Error purchasing course:", err)
      setError(err.message || "Error al procesar la compra. Inténtalo de nuevo.")
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleContinueToCourse = () => {
    router.push(`/cursos/${slug}`)
  }

  const difficultyColors: Record<string, string> = {
    Beginner: "text-green-400 border-green-400/30 bg-green-400/10",
    Intermediate: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    Advanced: "text-red-400 border-red-400/30 bg-red-400/10",
    Intermedio: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    Avanzado: "text-red-400 border-red-400/30 bg-red-400/10",
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dynamic-gradient flex items-center justify-center">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">Cargando curso...</p>
        </div>
      </div>
    )
  }

  if (error || !courseData) {
    return (
      <div className="min-h-screen bg-dynamic-gradient flex items-center justify-center">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-red-800 rounded-xl p-8 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 font-mono mb-4">
            {error || "Curso no encontrado"}
          </p>
          <div className="space-y-2">
            <Link href="/cursos">
              <Button className="w-full px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-600 transition-colors">
                Volver a Cursos
              </Button>
            </Link>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full border-slate-600 text-slate-400 hover:bg-slate-800"
            >
              Reintentar
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Totales para vista de detalles
  const contentMap = (courseData as any).content || {}
  const totalSections = Object.keys(contentMap).length
  const totalLessons =
    (courseData as any).progress?.total_lessons ??
    Object.values(contentMap).reduce((sum: number, section: any) => sum + ((section?.lessons || []).length), 0)

  return (
    <div className="min-h-screen bg-dynamic-gradient">
      <NormalHeader />

      {/* Compact Hero Section */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-cyan-900/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="max-w-7xl mx-auto">
            {/* Navigation */}
            <div className="mb-6">
              <Link href="/cursos" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono">
                <ArrowLeft className="w-4 h-4" /> Volver a cursos
              </Link>
            </div>

            {/* Hero Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Left: Course Title & Info */}
              <div className="lg:col-span-2">
                <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-4">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 text-sm font-mono">./course --preview</span>
                </div>

                <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl lg:text-4xl mb-4">
                  {">"} <span className="text-green-400">{courseData.name.toUpperCase()}</span>
                </h1>

                <p className="text-slate-300 text-lg leading-relaxed mb-6 max-w-2xl">
                  {(courseData as any).preludio || courseData.description}
                </p>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span className="text-slate-300 font-mono text-sm">{courseData.hours || "TBD"}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2">
                    <BookOpen className="w-4 h-4 text-green-400" />
                    <span className="text-slate-300 font-mono text-sm">{totalLessons} lecciones</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-slate-300 font-mono text-sm">{totalSections} secciones</span>
                  </div>
                  {(courseData as any).difficulty && (
                    <Badge className={`${difficultyColors[(courseData as any).difficulty as keyof typeof difficultyColors] || difficultyColors.Intermedio} font-mono`}>
                      {(courseData as any).difficulty}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Right: Purchase Card */}
              <div className="lg:col-span-1">
                <div className={`backdrop-blur-sm rounded-xl p-6 ${isPaid ? 'bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/40' : 'bg-gradient-to-br from-green-900/30 to-cyan-900/30 border border-green-500/40'}`}>
                  <div className="text-center mb-4">
                    {isPaid ? (
                      <>
                        <div className="text-4xl font-bold text-blue-400 font-mono mb-2">ACCESO</div>
                        <div className="text-slate-300 font-mono text-sm">Curso adquirido</div>
                      </>
                    ) : (
                      <>
                        <div className="text-4xl font-bold text-green-400 font-mono mb-2">${courseData.price}</div>
                        <div className="text-slate-300 font-mono text-sm">Acceso completo</div>
                      </>
                    )}
                  </div>
                  
                  {!isLoggedIn ? (
                    <div className="space-y-3">
                      <div className="text-center text-yellow-400 font-mono text-sm mb-3">
                        Regístrate para comprar este curso
                      </div>
                      <Button
                        onClick={handlePurchase}
                        className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3"
                      >
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        REGISTRARSE Y COMPRAR
                      </Button>
                      <Link href="/auth/ingresar" className="block">
                        <Button 
                          variant="outline" 
                          className="w-full border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black font-mono"
                        >
                          YA TENGO CUENTA
                        </Button>
                      </Link>
                    </div>
                  ) : isPaid ? (
                    <div className="space-y-3">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-lg px-4 py-3 mb-3">
                          <CheckCircle className="w-5 h-5 text-blue-400" />
                          <span className="text-blue-400 font-mono font-bold">YA TIENES ACCESO</span>
                        </div>
                      </div>
                      <Button
                        onClick={handleContinueToCourse}
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-mono font-bold py-3 text-lg"
                      >
                        <ArrowRight className="mr-2 h-5 w-5" />
                        REANUDAR CURSO
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {error && (
                        <div className="text-center text-red-400 font-mono text-xs mb-2">{error}</div>
                      )}
                      <Button
                        onClick={handlePurchase}
                        disabled={isPurchasing}
                        className="w-full bg-green-500 hover:bg-green-600 text-black font-mono font-bold py-3 text-lg"
                      >
                        {isPurchasing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                            PROCESANDO...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            COMPRAR AHORA
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                  
                  <div className="mt-4 space-y-1 text-center">
                    <div className="text-slate-400 font-mono text-xs">✓ Acceso de por vida</div>
                    <div className="text-slate-400 font-mono text-xs">✓ Material didáctico</div>
                    <div className="text-slate-400 font-mono text-xs">✓ Soporte del instructor</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Preview Content */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="max-w-7xl mx-auto">

            <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
              {/* Left Column - Video and Content Preview */}
              <div className="xl:col-span-3 space-y-8">
                {/* Video Section */}
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-xs font-mono text-slate-400">~/preview/video.js</span>
                    </div>
                    <Lock className="w-4 h-4 text-slate-500" />
                  </div>

                  <div className="p-6">
                    {Boolean((courseData as any).preview?.file_id) ? (
                      <div className="custom-video-player w-full aspect-video">
                        <video
                          className="w-full h-full"
                          controls
                          preload="metadata"
                          src={`${getApiBase()}/media/get_file?file_id=${encodeURIComponent((courseData as any).preview.file_id)}`}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-slate-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-700 relative">
                        <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                          <Lock className="w-16 h-16 text-slate-500" />
                        </div>
                        <div className="text-center relative z-10">
                          <Play className="w-16 h-16 text-green-400 mx-auto mb-4 opacity-50" />
                          <p className="text-green-400 font-mono text-lg">VISTA PREVIA</p>
                          <p className="text-slate-400 font-mono text-sm mt-2">Sin video de previsualización disponible</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Content metadata (sections and lessons names) */}
                <CourseContentPreview courseData={courseData} />

              </div>

              {/* Right Column - Course Info */}
              <div className="xl:col-span-2 space-y-6">
                {/* Instructor Card */}
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-xs font-mono text-slate-400">~/instructor/profile.js</span>
                    </div>
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-green-400 font-mono mb-4">INSTRUCTOR</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-cyan-400 rounded-full flex items-center justify-center">
                        <span className="text-black font-mono font-bold text-xl">
                          {((courseData as any).sensei_name || "TBD").charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-slate-200 font-mono font-semibold text-lg">
                          {(courseData as any).sensei_name || "Por definir"}
                        </div>
                        <div className="text-slate-400 font-mono text-sm">Instructor Principal</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Description */}
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                  <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                      </div>
                      <span className="text-xs font-mono text-slate-400">~/course/description.md</span>
                    </div>
                    <BookOpen className="w-4 h-4 text-green-400" />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-green-400 font-mono mb-4">DESCRIPCIÓN</h3>
                    <div className="prose prose-slate max-w-none">
                      {formatTextForHTML(courseData.description).map((element) => {
                        if (element.type === 'list') {
                          return (
                            <div key={element.key} className="ml-4 text-slate-300 leading-relaxed text-base">
                              {element.content}
                            </div>
                          );
                        } else if (element.type === 'normal') {
                          return (
                            <p key={element.key} className="text-slate-300 leading-relaxed text-base mb-2">
                              {element.content}
                            </p>
                          );
                        } else {
                          return <div key={element.key} className="h-2" />;
                        }
                      })}
                    </div>
                    
                    {/* Course metadata integrated */}
                    <div className="mt-6 pt-6 border-t border-slate-700">
                      <div className="grid grid-cols-1 gap-4">
                        {(courseData as any).difficulty && (
                          <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg">
                            <span className="text-slate-400 font-mono text-sm">Nivel:</span>
                            <Badge className={`${difficultyColors[(courseData as any).difficulty as keyof typeof difficultyColors] || difficultyColors.Intermedio} font-mono`}>
                              {(courseData as any).difficulty}
                            </Badge>
                          </div>
                        )}
                        
                        {(courseData as any).language && (
                          <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg">
                            <span className="text-slate-400 font-mono text-sm">Idioma:</span>
                            <span className="text-slate-300 font-mono text-sm">{(courseData as any).language}</span>
                          </div>
                        )}
                        
                        {(courseData as any).students && (
                          <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg">
                            <span className="text-slate-400 font-mono text-sm">Estudiantes:</span>
                            <span className="text-cyan-400 font-mono text-sm font-bold">{(courseData as any).students.toLocaleString()}</span>
                          </div>
                        )}
                        
                        {(courseData as any).rating && (
                          <div className="flex items-center justify-between p-3 bg-slate-800/40 rounded-lg">
                            <span className="text-slate-400 font-mono text-sm">Rating:</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-yellow-400 font-mono text-sm font-bold">{(courseData as any).rating}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Requirements Section */}
                {(courseData as any).requirements && (
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                        <span className="text-xs font-mono text-slate-400">~/course/requirements.md</span>
                      </div>
                      <CheckCircle className="w-4 h-4 text-orange-400" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-orange-400 font-mono mb-4">REQUISITOS</h3>
                      <div className="prose prose-slate max-w-none">
                        {formatTextForHTML((courseData as any).requirements).map((element) => {
                          if (element.type === 'list') {
                            return (
                              <div key={element.key} className="ml-4 text-slate-300 leading-relaxed text-base">
                                {element.content}
                              </div>
                            );
                          } else if (element.type === 'normal') {
                            return (
                              <p key={element.key} className="text-slate-300 leading-relaxed text-base mb-2">
                                {element.content}
                              </p>
                            );
                          } else {
                            return <div key={element.key} className="h-2" />;
                          }
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tags */}
                {Array.isArray((courseData as any).tags) && (courseData as any).tags.length > 0 && (
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                        <span className="text-xs font-mono text-slate-400">~/course/tags.js</span>
                      </div>
                      <Code className="w-4 h-4 text-purple-400" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white font-mono mb-4">TECNOLOGÍAS</h3>
                      <div className="flex flex-wrap gap-2">
                        {(courseData as any).tags.map((tag: string, index: number) => (
                          <Badge key={index} className="bg-slate-800/50 text-cyan-400 border-cyan-400/30 font-mono">
                            #{tag.toLowerCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <NormalFooter />
    </div>
  )
}
