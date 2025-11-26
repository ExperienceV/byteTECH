"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { NormalHeader } from "@/components/normal-header"
import { NormalFooter } from "@/components/normal-footer"
import { CourseContentViewer } from "@/components/course-content-viewer"
import { Button } from "@/components/ui/button"
import { coursesApi, type CourseData, type CourseContentResponse } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import "../../../styles/video-player.css"
import { Lock, AlertCircle } from "lucide-react"
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
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [courseData, setCourseData] = useState<CourseData | null>(null)
  const [isPaid, setIsPaid] = useState<boolean>(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [isAuthError, setIsAuthError] = useState(false)

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
          // Verificar si es un error 401 (no autorizado) o si no tiene acceso
          if (courseContentResp.status === 401) {
            setIsAuthError(true)
            setError("Debes iniciar sesión para acceder a este curso")
            // Redirigir después de 3 segundos
            setTimeout(() => {
              router.push("/auth/ingresar")
            }, 3000)
            return
          }
          // Si no es 401, redirigir a la página de prevista
          router.push(`/prevista/${slug}`)
          return
        }
        const payload = courseContentResp.data as CourseContentResponse
        if (!alive) return

        // Si no ha pagado el curso, redirigir a prevista
        if (!Boolean(payload.is_paid)) {
          router.push(`/prevista/${slug}`)
          return
        }

        setCourseData(payload.course_content as unknown as CourseData)
        setIsPaid(Boolean(payload.is_paid))
      } catch (err: any) {
        if (!alive) return
        console.error("Error fetching course:", err)
        // Verificar si el error incluye información de status 401
        if (err?.status === 401 || err?.message?.includes("401")) {
          setIsAuthError(true)
          setError("Debes iniciar sesión para acceder a este curso")
          // Redirigir después de 3 segundos
          setTimeout(() => {
            router.push("/auth/ingresar")
          }, 3000)
        } else {
          // Para otros errores, redirigir a prevista
          router.push(`/prevista/${slug}`)
        }
      } finally {
        if (alive) setLoading(false)
      }
    }

    if (slug) fetchCourseData()
    return () => {
      alive = false
    }
  }, [slug, router])

  const difficultyColors: Record<string, string> = {
    Beginner: "text-cyan-400 border-cyan-400/30 bg-cyan-400/10",
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
        <div
          className={`bg-slate-900/80 backdrop-blur-sm border ${isAuthError ? "border-yellow-800" : "border-red-800"} rounded-xl p-8 text-center max-w-md mx-auto`}
        >
          {isAuthError ? (
            <Lock className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
          ) : (
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          )}
          <p className={`${isAuthError ? "text-yellow-400" : "text-red-400"} font-mono mb-4`}>
            {error || "Curso no encontrado"}
          </p>
          {isAuthError && (
            <p className="text-slate-400 font-mono text-sm mb-4">Serás redirigido al login en unos segundos...</p>
          )}
          <div className="space-y-2">
            {isAuthError ? (
              <Link href="/auth/ingresar">
                <Button className="w-full px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-600 transition-colors">
                  Iniciar Sesión
                </Button>
              </Link>
            ) : (
              <Link href="/cursos">
                <Button className="w-full px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-600 transition-colors">
                  Volver a Cursos
                </Button>
              </Link>
            )}
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

  // Solo mostrar contenido si el usuario ha pagado el curso
  const contentSections = Object.values((courseData as any).content || {})

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
            mark_time: lesson.mark_time
              ? {
                  id: lesson.mark_time.id,
                  time: lesson.mark_time.time || lesson.mark_time.mark_time || 0,
                }
              : undefined,
          })),
        }))}
      />
      <NormalFooter />
    </div>
  )
}
