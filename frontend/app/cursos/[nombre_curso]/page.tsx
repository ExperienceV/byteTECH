"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { NormalHeader } from "@/components/normal-header"
import { NormalFooter } from "@/components/normal-footer"
import { CourseContentViewer } from "@/components/course-content-viewer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { coursesApi, type CourseData, type CourseContentResponse } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import {
  Terminal,
  Play,
  Users,
  Star,
  BookOpen,
  CheckCircle,
  Lock,
  ShoppingCart,
  Code,
  AlertCircle,
  ArrowLeft,
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

export default function CursoDetallePage() {
  const params = useParams<{ nombre_curso: string }>()
  const slug = (params?.nombre_curso || "").toString()
  const { user, isLoggedIn } = useAuth()

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
      setError("Debes iniciar sesión para comprar este curso")
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
          <p className="text-red-400 font-mono mb-4">{error || "Curso no encontrado"}</p>
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

  // Si el usuario compró el curso, mostrar el contenido
  const contentSections = Object.values((courseData as any).content || {})
  if (isPaid && contentSections.length > 0) {
    return (
      <div className="min-h-screen bg-dynamic-gradient">
        <NormalHeader />
        <CourseContentViewer
          courseTitle={courseData.name}
          courseSlug={slug}
          progress={(courseData as any).progress}
          sections={contentSections.map((section: any, index: number) => ({
            id: section.id?.toString() || (index + 1).toString(),
            title: section.title || `SECCION ${index + 1}`,
            lessons: (section.lessons || []).map((lesson: any, lessonIndex: number) => ({
              id: lesson.id?.toString() || `${index + 1}-${lessonIndex + 1}`,
              title: lesson.title || lesson.name,
              type: lesson.mime_type?.startsWith("video/") ? "video" : "text",
              duration: lesson.duration,
              completed: Boolean(lesson.is_completed),
              locked: false,
              file_id: lesson.file_id,
              mime_type: lesson.mime_type,
              time_validator: lesson.time_validator,
            })),
          }))}
        />
        <NormalFooter />
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
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <Link href="/cursos" className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 font-mono">
                <ArrowLeft className="w-4 h-4" /> Volver a cursos
              </Link>
            </div>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-6">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-mono">./course --details</span>
              </div>

              <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl md:text-5xl mb-4">
                {">"} <span className="text-green-400">{courseData.name.toUpperCase()}</span>
              </h1>

              {/* Purchase Status */}
              <div className="flex justify-center mb-6">
                {!isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-mono text-sm">Debes iniciar sesión para comprar este curso</span>
                    </div>
                    <Link href="/login">
                      <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6 py-3 rounded-lg font-mono">
                        INICIAR SESIÓN
                      </Button>
                    </Link>
                  </div>
                ) : !isPaid ? (
                  <div className="space-y-4">
                    {error && (
                      <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2 max-w-md">
                        <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span className="text-red-400 font-mono text-sm">{error}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2">
                      <ShoppingCart className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-mono text-sm">Debes comprar este curso para acceder</span>
                    </div>
                    <Button
                      onClick={handlePurchase}
                      disabled={isPurchasing}
                      className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-lg font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isPurchasing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                          PROCESANDO...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          COMPRAR CURSO - ${courseData.price}
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-mono text-sm">¡Ya tienes acceso a este curso!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transición suave */}
      <div className="section-transition-up"></div>

      {/* Course Preview Content - Only show if not purchased */}
      {!isPaid && (
        <section className="bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/3 via-transparent to-blue-900/3" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Video and Content Preview */}
                <div className="lg:col-span-2 space-y-8">
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
                      <div className="aspect-video bg-slate-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-700 relative">
                        <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                          <Lock className="w-16 h-16 text-slate-500" />
                        </div>
                        <div className="text-center relative z-10">
                          <Play className="w-16 h-16 text-green-400 mx-auto mb-4 opacity-50" />
                          <p className="text-green-400 font-mono text-lg">VISTA PREVIA</p>
                          <p className="text-slate-400 font-mono text-sm mt-2">Compra el curso para acceder</p>
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
                      <p className="text-slate-300 leading-relaxed">{courseData.description}</p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Course Info */}
                <div className="space-y-6">
                  {/* About Section */}
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                        <span className="text-xs font-mono text-slate-400">~/course/info.js</span>
                      </div>
                      <Terminal className="w-4 h-4 text-cyan-400" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-green-400 font-mono mb-6">ACERCA DE</h3>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-slate-800">
                          <span className="text-slate-400 font-mono text-sm">PRICE:</span>
                          <span className="text-green-400 font-mono font-bold">${courseData.price}</span>
                        </div>

                        {courseData.duration && (
                          <div className="flex justify-between items-center py-2 border-b border-slate-800">
                            <span className="text-slate-400 font-mono text-sm">DURACIÓN:</span>
                            <span className="text-green-400 font-mono font-bold">{courseData.duration}</span>
                          </div>
                        )}

                        <div className="flex justify-between items-center py-2">
                          <span className="text-slate-400 font-mono text-sm">INSTRUCTOR:</span>
                          <span className="text-green-400 font-mono font-bold">
                            {(courseData as any).sensei_name || "Por definir"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                        <span className="text-xs font-mono text-slate-400">~/course/details.js</span>
                      </div>
                      <Star className="w-4 h-4 text-yellow-400" />
                    </div>

                    <div className="p-6">
                      <h3 className="text-lg font-bold text-white font-mono mb-4">DETALLES DEL CURSO</h3>

                      <div className="space-y-3">
                        {(courseData as any).students && (
                          <div className="flex items-center gap-3">
                            <Users className="w-4 h-4 text-cyan-400" />
                            <span className="text-slate-300 text-sm">{(courseData as any).students.toLocaleString()} estudiantes</span>
                          </div>
                        )}

                        {(courseData as any).rating && (
                          <div className="flex items-center gap-3">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-slate-300 text-sm">{(courseData as any).rating} de calificación</span>
                          </div>
                        )}

                        {(courseData as any).language && (
                          <div className="flex items-center gap-3">
                            <Terminal className="w-4 h-4 text-purple-400" />
                            <span className="text-slate-300 text-sm">Lenguaje: {(courseData as any).language}</span>
                          </div>
                        )}
                      </div>

                      {(courseData as any).difficulty && (
                        <div className="mt-4">
                          <Badge className={`${difficultyColors[(courseData as any).difficulty as keyof typeof difficultyColors] || difficultyColors.Intermedio} font-mono`}>
                            {(courseData as any).difficulty}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

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
      )}

      <NormalFooter />
    </div>
  )
}
