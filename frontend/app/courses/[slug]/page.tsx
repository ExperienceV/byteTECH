"use client"

import { UniqueHeader } from "@/components/unique-header"
import { UniqueFooter } from "@/components/unique-footer"
import { CourseContentViewer } from "@/components/course-content-viewer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Terminal, Play, Users, Star, BookOpen, CheckCircle, Lock, ShoppingCart, Code, AlertCircle } from "lucide-react"
import { coursesApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import Link from "next/link"
import { useState, useEffect, use } from "react"

interface CourseData {
  id: number
  name: string
  description: string
  price: number
  duration?: string
  students?: number
  rating?: number
  tags?: string[]
  instructor?: string
  sensei_name?: string
  language?: string
  difficulty?: string
  lessons?: number
  hours?: number
  content?: any[]
}

interface CourseContentResponse {
  is_paid: boolean
  course_content: CourseData
}

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  // Unwrap params using React.use()
  const { slug } = use(params)
  const { user, isLoggedIn } = useAuth()
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [isPaid, setIsPaid] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isPurchasing, setIsPurchasing] = useState(false)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true)
        setError("")

        // Petición directa al endpoint
        const res = await fetch(`/api/courses/course_content?course_id=${slug}`)
        if (!res.ok) throw new Error("No se pudo obtener el curso")
        const data = await res.json()

        setCourseData(data.course_content)
        setIsPaid(data.is_paid)
        setLoading(false)
      } catch (err: any) {
        setError(err.message || "Error al cargar el curso")
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [slug])

  const handlePurchase = async () => {
    if (!courseData) return

    // Verificar si el usuario está logueado
    if (!isLoggedIn || !user) {
      setError("Debes iniciar sesión para comprar este curso")
      return
    }

    setIsPurchasing(true)
    setError("")

    try {
      const purchaseResponse = await coursesApi.buyCourse(courseData.id)

      // Redirigir a Stripe checkout
      if (purchaseResponse.checkout_url) {
        window.location.href = purchaseResponse.checkout_url
      } else {
        throw new Error("No se recibió URL de checkout")
      }
    } catch (err: any) {
      console.error("Error purchasing course:", err)

      // Manejar diferentes tipos de errores
      if (err.message?.includes("422")) {
        // Error 422 - Unprocessable Entity
        setError("Error en los datos de la compra. Verifica que todos los campos estén correctos.")
      } else if (err.message?.includes("409")) {
        setError("Ya posees este curso")
      } else if (err.message?.includes("404")) {
        setError("Curso no encontrado")
      } else if (err.message?.includes("401")) {
        setError("Debes iniciar sesión para comprar este curso")
      } else if (err.message?.includes("400")) {
        setError("Datos de compra inválidos. Inténtalo de nuevo.")
      } else {
        setError(err.message || "Error al procesar la compra. Inténtalo de nuevo.")
      }
      setIsPurchasing(false)
    }
  }

  function createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
  }

  // Obtener el primer archivo de la primera lección de la primera sección
  const firstSection = courseData && courseData.content && Object.values(courseData.content)[0]
  const firstLesson = firstSection?.lessons?.[0]
  const firstFileId = firstLesson?.file_id
  const firstFileName = firstLesson?.file_name || "" // Si tienes el nombre del archivo
  const API_BASE = "http://localhost:8000"
  const fileUrl = firstFileId ? `${API_BASE}/api/media/get_file?file_id=${firstFileId}` : null

  // Detección simple por extensión
  function getFileType(fileName: string) {
    if (fileName.endsWith('.mp4') || fileName.endsWith('.webm')) return 'video'
    if (fileName.endsWith('.pdf')) return 'pdf'
    if (fileName.match(/\.(jpg|jpeg|png|gif)$/)) return 'image'
    return 'other'
  }

  const fileType = getFileType(firstFileName)

  // LOGS PARA DEPURACIÓN
  console.log('fileId:', firstFileId, 'fileUrl:', fileUrl, 'fileName:', firstFileName, 'fileType:', fileType)

  // Obtener todos los hilos de foros de todas las lecciones
  const allThreads = courseData && courseData.content ? Object.values(courseData.content)
    .flatMap((section: any) =>
      (section.lessons || []).flatMap((lesson: any) =>
        lesson.threads ? lesson.threads.map((thread: any) => ({
          ...thread,
          lessonTitle: lesson.title
        })) : []
      )
    ) : []

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

  // If user has purchased the course, show the course content
  if (isPaid && courseData.content) {
    return (
      <div className="min-h-screen bg-dynamic-gradient">
        <UniqueHeader />
        <CourseContentViewer
          courseTitle={courseData.name}
          courseSlug={slug}
          sections={Object.values(courseData.content).map((section: any, index: number) => ({
            id: section.id?.toString() || (index + 1).toString(),
            title: section.title || `SECCION ${index + 1}`,
            lessons:
              section.lessons?.map((lesson: any, lessonIndex: number) => ({
                id: lesson.id?.toString() || `${index + 1}-${lessonIndex + 1}`,
                title: lesson.title || lesson.name,
                type: lesson.type || "video",
                duration: lesson.duration,
                completed: lesson.completed || false,
                locked: false, // Desbloquear todas las lecciones para usuarios que compraron el curso
              })) || [],
          }))}
        />
        <UniqueFooter />
      </div>
    )
  }

  const difficultyColors = {
    Beginner: "text-green-400 border-green-400/30 bg-green-400/10",
    Intermediate: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    Advanced: "text-red-400 border-red-400/30 bg-red-400/10",
    Intermedio: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    Avanzado: "text-red-400 border-red-400/30 bg-red-400/10",
  }

  return (
    <div className="min-h-screen bg-dynamic-gradient">
      <UniqueHeader />

      {/* Hero Section */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-6">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 text-sm font-mono">./course --details</span>
              </div>

              <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl md:text-5xl mb-4">
                {">"} <span className="text-green-400">{courseData.name.toUpperCase()}</span>
              </h1>

              {/* Mostrar el primer archivo de la primera lección de la primera sección */}
              {fileUrl && (
                <div className="mb-8 flex justify-center">
                  {fileType === 'video' ? (
                    <video controls className="w-full max-w-2xl rounded-lg">
                      <source src={fileUrl} />
                      Tu navegador no soporta la reproducción de video.
                    </video>
                  ) : fileType === 'pdf' ? (
                    <iframe src={fileUrl} className="w-full max-w-2xl h-[600px] rounded-lg" />
                  ) : fileType === 'image' ? (
                    <img src={fileUrl} alt="Archivo de la lección" className="w-full max-w-2xl rounded-lg" />
                  ) : (
                    <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">
                      Descargar archivo
                    </a>
                  )}
                </div>
              )}

              {/* Purchase Status */}
              <div className="flex justify-center mb-6">
                {!isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      <span className="text-yellow-400 font-mono text-sm">
                        Debes iniciar sesión para comprar este curso
                      </span>
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
                            {courseData.sensei_name || courseData.instructor || "Por definir"}
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
                        {courseData.students && (
                          <div className="flex items-center gap-3">
                            <Users className="w-4 h-4 text-cyan-400" />
                            <span className="text-slate-300 text-sm">
                              {courseData.students.toLocaleString()} estudiantes
                            </span>
                          </div>
                        )}

                        {courseData.rating && (
                          <div className="flex items-center gap-3">
                            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                            <span className="text-slate-300 text-sm">{courseData.rating} de calificación</span>
                          </div>
                        )}

                        {courseData.language && (
                          <div className="flex items-center gap-3">
                            <Terminal className="w-4 h-4 text-purple-400" />
                            <span className="text-slate-300 text-sm">Lenguaje: {courseData.language}</span>
                          </div>
                        )}
                      </div>

                      {courseData.difficulty && (
                        <div className="mt-4">
                          <Badge
                            className={`${difficultyColors[courseData.difficulty as keyof typeof difficultyColors] || difficultyColors.Intermedio} font-mono`}
                          >
                            {courseData.difficulty}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  {courseData.tags && courseData.tags.length > 0 && (
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
                          {courseData.tags.map((tag, index) => (
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

      {/* Mostrar todos los hilos de foros */}
      {allThreads.length > 0 && (
        <section className="bg-slate-900 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
            <h3 className="text-lg font-bold text-white font-mono mb-4">Hilos del Foro</h3>
            <div className="space-y-4">
              {allThreads.map((thread, idx) => (
                <div key={thread.id || idx} className="bg-slate-800/60 rounded-lg p-4">
                  <div className="font-mono text-cyan-400 text-sm mb-1">
                    Lección: {thread.lessonTitle}
                  </div>
                  <div className="font-mono text-white text-base">
                    <b>{thread.topic}</b> — <span className="text-slate-400">@{thread.username}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <UniqueFooter />
    </div>
  )
}
