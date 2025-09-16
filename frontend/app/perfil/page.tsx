"use client"

import { UniqueHeader } from "@//components/unique-header"
import { UniqueFooter } from "@//components/unique-footer"
import { StudentCourseCard } from "@//components/student-course-card"
import { TeacherCourseCard } from "@//components/teacher-course-card"
import { AddCourseModal } from "@//components/add-course-modal"
import { Terminal, BookOpen, CheckCircle, Clock, TrendingUp, Users, BarChart3, Award, Eye, Plus, Edit, Trash2 } from "lucide-react"
import { Button } from "@//components/ui/button"
import { useAuth } from "@//lib/auth-context"
import { coursesApi, workbrenchApi, getApiBase } from "@/lib/api"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useStats } from "@/hooks/use-stats"

export default function PerfilPage() {
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const { stats, isLoading: isLoadingStats, error: statsError } = useStats()
  const [isLoading, setIsLoading] = useState(true)
  const [showAddCourseModal, setShowAddCourseModal] = useState(false)
  const [courses, setCourses] = useState<any[]>([])
  const [isLoadingCourses, setIsLoadingCourses] = useState(true)
  const [error, setError] = useState("")
  const [isCreatingCourse, setIsCreatingCourse] = useState(false)

  useEffect(() => {
    // Give some time for the auth context to load
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!isLoggedIn) {
        console.log("❌ Usuario no logueado, redirigiendo al login")
        router.push("/auth/ingresar")
        return
      }
      console.log("✅ Usuario logueado:", user?.name, "Es profesor:", user?.is_sensei)
    }, 100)

    return () => clearTimeout(timer)
  }, [isLoggedIn, router, user])

  // Función auxiliar para obtener los cursos del profesor (usa /courses/my_courses)
  const fetchTeacherCourses = async () => {
    const response = await coursesApi.getMyCourses()
    if (!response.ok) {
      throw new Error(response.message || "Error al obtener tus cursos")
    }
    const data: any = response.data
    return Array.isArray(data?.courses) ? data.courses : []
  }

  useEffect(() => {
    if (!isLoggedIn || !user) return

    const fetchCourses = async () => {
      setIsLoadingCourses(true)
      setError("")
      
      try {
        if (user.is_sensei) {
          const teacherCourses = await fetchTeacherCourses()
          setCourses(teacherCourses)
        } else {
          const response = await coursesApi.getMyCourses()
          if (!response.ok) {
            throw new Error(response.message || "Error al obtener tus cursos")
          }
          // El endpoint /courses/my_courses retorna { is_sensei: bool, courses: [] }
          // Aseguramos guardar solo el arreglo de cursos para la vista de estudiante
          setCourses((response.data as any)?.courses || [])
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al cargar cursos"
        setError(message)
        console.error("❌ Error cargando cursos:", err)
      } finally {
        setIsLoadingCourses(false)
      }
    }

    fetchCourses()
  }, [isLoggedIn, user])

  interface CourseFormData {
    name: string
    description: string
    price: number
    hours: number
    miniature: File
  }

  const checkTeacherPermission = () => {
    if (!user) {
      throw new Error("No hay usuario logueado")
    }
    if (!user.is_sensei) {
      throw new Error("No tienes permisos de profesor")
    }
  }

  const handleAddCourse = async (courseData: CourseFormData) => {
    try {
      checkTeacherPermission()

      setIsCreatingCourse(true)
      setError("")

      const formData = new FormData()
      formData.append('name', courseData.name)
      formData.append('description', courseData.description)
      formData.append('price', courseData.price.toString())
      formData.append('hours', courseData.hours.toString())
      formData.append('file', courseData.miniature)

      const response = await workbrenchApi.createCourse(formData)
      if (!response.ok) {
        throw new Error(response.message || "Error al crear el curso")
      }
      
      console.log("✅ Curso creado exitosamente:", response.data)
      
      // Recargar cursos
      if (user) {
        const updatedCourses = await fetchTeacherCourses()
        setCourses(updatedCourses)
      }
      
      setShowAddCourseModal(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear el curso"
      console.error("❌ Error creando curso:", err)
      setError(message)
    } finally {
      setIsCreatingCourse(false)
    }
  }

  const handleDeleteCourse = async (courseId: number) => {
    try {
      checkTeacherPermission()

      if (!confirm("¿Estás seguro de que quieres eliminar este curso? Esta acción no se puede deshacer.")) {
        return
      }

      const response = await workbrenchApi.deleteCourse(courseId)
      if (!response.ok) {
        throw new Error(response.message || "Error al eliminar el curso")
      }
      
      // Recargar cursos
      if (user) {
        const updatedCourses = await fetchTeacherCourses(user.name)
        setCourses(updatedCourses)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al eliminar el curso"
      console.error("❌ Error eliminando curso:", err)
      setError(message)
    }
  }

  const handleEditCourse = (courseId: number) => {
    router.push(`/editor/${courseId}`)
  }

  // Mapper para props del TeacherCourseCard
  const mapToTeacherCardProps = (c: any) => {
    const base = getApiBase()
    const imageUrl = c?.miniature_id
      ? `${base}/media/get_file?file_id=${encodeURIComponent(c.miniature_id)}`
      : undefined
    return {
      id: c?.id,
      title: c?.name || "Curso",
      description: c?.description || "",
      price: Number(c?.price) || 0,
      duration: c?.hours ? `${c.hours}h` : "",
      students: Number(c?.students) || 0,
      tags: Array.isArray(c?.tags) ? c.tags : [],
      instructor: c?.sensei_name || "",
      language: c?.language || "",
      difficulty: (c?.difficulty as any) || "Intermedio",
      slug: String(c?.id ?? ""),
      miniature_id: c?.miniature_id,
      imageUrl,
    }
  }

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">Cargando perfil...</p>
        </div>
      </div>
    )
  }

  // If not logged in after loading, don't render anything (redirect will happen)
  if (!isLoggedIn || !user) {
    return null
  }

  // TEACHER VIEW
  if (user.is_sensei) {
    const teacherCourses = courses

    // Calculate teacher stats
    const totalStudents = teacherCourses.reduce((acc: number, course: any) => acc + (course.students || 0), 0)
    const averageRating = teacherCourses.reduce((acc: number, course: any) => acc + (course.rating || 0), 0) / teacherCourses.length || 0
    const totalRevenue = teacherCourses.reduce((acc: number, course: any) => acc + (course.price || 0) * (course.students || 0), 0)

    return (
      <div className="min-h-screen bg-dynamic-gradient">
        <UniqueHeader />

        {/* Hero Section */}
        <section className="bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-6">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-mono">./perfil --teacher</span>
              </div>

              <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl md:text-5xl mb-4">
                {">"} Bienvenido, <span className="text-purple-400">Prof. {user.name}</span>
              </h1>

              <p className="text-slate-400 font-mono text-sm sm:text-base">// Panel de control del instructor</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-8 text-center">
                <p className="text-red-400 font-mono text-sm">{error}</p>
              </div>
            )}

            {/* Stats Error Message */}
            {statsError && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-8 text-center">
                <p className="text-yellow-400 font-mono text-sm">
                  ⚠️ No se pudieron cargar las estadísticas: {statsError}
                </p>
              </div>
            )}

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 font-mono">
                  {isLoadingStats ? "..." : teacherCourses.length}
                </div>
                <div className="text-slate-400 text-sm font-mono">Cursos</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400 font-mono">
                  {isLoadingStats ? "..." : stats?.total_users?.toLocaleString() || "0"}
                </div>
                <div className="text-slate-400 text-sm font-mono">Usuarios Totales</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400 font-mono">
                  {isLoadingStats ? "..." : averageRating.toFixed(1)}
                </div>
                <div className="text-slate-400 text-sm font-mono">Rating</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-400 font-mono">
                  {isLoadingStats ? "..." : `$${stats?.total_profits?.toLocaleString() || "0"}`}
                </div>
                <div className="text-slate-400 text-sm font-mono">Ganancias Totales</div>
              </div>
            </div>
          </div>
        </section>

        {/* Transición suave */}
        <div className="section-transition-up"></div>

        {/* Teacher Content */}
        <section className="bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/3 via-transparent to-blue-900/3" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
            {/* Courses Section */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h2 className="font-mono text-2xl sm:text-3xl font-bold text-green-400">CURSOS SUBIDOS:</h2>
                    <p className="text-slate-400 font-mono text-sm">// Tus cursos publicados</p>
                  </div>
                </div>

                {/* Add Course Button */}
                <Button
                  onClick={() => setShowAddCourseModal(true)}
                  disabled={isCreatingCourse}
                  className="bg-green-500 hover:bg-green-600 text-black font-mono px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {isCreatingCourse ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      Añadir Curso
                    </>
                  )}
                </Button>
              </div>

              {isLoadingCourses ? (
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                  <p className="text-cyan-400 font-mono">Cargando cursos...</p>
                </div>
              ) : teacherCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teacherCourses.map((course, index) => (
                    <div key={index} className="relative group">
                      <TeacherCourseCard {...mapToTeacherCardProps(course)} />
                      
                      {/* Action Buttons */}
                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleEditCourse(course.id)}
                            size="sm"
                            className="bg-cyan-500 hover:bg-cyan-600 text-black font-mono"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            onClick={() => handleDeleteCourse(course.id)}
                            size="sm"
                            variant="destructive"
                            className="bg-red-500 hover:bg-red-600 text-white font-mono"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-8 text-center">
                  <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                  <p className="text-slate-400 font-mono">No tienes cursos publicados</p>
                  <p className="text-slate-500 font-mono text-sm mt-2">// Crea tu primer curso para comenzar</p>
                  <Button
                    onClick={() => setShowAddCourseModal(true)}
                    className="bg-green-500 hover:bg-green-600 text-black font-mono px-4 py-2 rounded-lg mt-4 flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    Crear Primer Curso
                  </Button>
                </div>
              )}
            </div>

            {/* Statistics Section */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h2 className="font-mono text-2xl sm:text-3xl font-bold text-cyan-400">ESTADÍSTICAS:</h2>
                  <p className="text-slate-400 font-mono text-sm">// Analytics de tus cursos</p>
                </div>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Student Engagement */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Users className="w-5 h-5 text-blue-400" />
                      <h3 className="font-mono text-blue-400 font-semibold">Engagement</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-mono">Estudiantes activos:</span>
                        <span className="text-white font-mono">{Math.floor(totalStudents * 0.75)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-mono">Tasa de finalización:</span>
                        <span className="text-green-400 font-mono">68%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-mono">Tiempo promedio:</span>
                        <span className="text-cyan-400 font-mono">2.5h/semana</span>
                      </div>
                    </div>
                  </div>

                  {/* Revenue Stats */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Award className="w-5 h-5 text-green-400" />
                      <h3 className="font-mono text-green-400 font-semibold">Ganancias</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-mono">Total plataforma:</span>
                        <span className="text-white font-mono">
                          {isLoadingStats ? "..." : `$${stats?.total_profits?.toLocaleString() || "0"}`}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-mono">Mis ingresos:</span>
                        <span className="text-green-400 font-mono">${totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-mono">Cursos con ganancias:</span>
                        <span className="text-cyan-400 font-mono">
                          {isLoadingStats ? "..." : Object.keys(stats?.profits_by_course || {}).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="bg-slate-800/50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Eye className="w-5 h-5 text-purple-400" />
                      <h3 className="font-mono text-purple-400 font-semibold">Rendimiento</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-mono">Rating promedio:</span>
                        <span className="text-white font-mono">{averageRating.toFixed(1)}/5.0</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-mono">Reviews totales:</span>
                        <span className="text-green-400 font-mono">{Math.floor(totalStudents * 0.3)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-mono">Curso más popular:</span>
                        <span className="text-cyan-400 font-mono text-xs">
                          {teacherCourses[0]?.name?.split(" ")[0] || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ganancias por Curso */}
              {stats?.profits_by_course && Object.keys(stats.profits_by_course).length > 0 && (
                <div className="mt-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h3 className="font-mono text-xl font-bold text-orange-400">GANANCIAS POR CURSO:</h3>
                      <p className="text-slate-400 font-mono text-sm">// Desglose de ingresos por curso</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(stats.profits_by_course).map(([courseId, profit]) => {
                        const course = teacherCourses.find(c => c.id === parseInt(courseId));
                        return (
                          <div key={courseId} className="bg-slate-800/50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-mono text-orange-400 font-semibold text-sm">
                                {course?.name || `Curso #${courseId}`}
                              </h4>
                              <span className="text-green-400 font-mono font-bold">
                                ${profit.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 font-mono">
                              ID: {courseId} • {course?.students || 0} estudiantes
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Add Course Modal */}
        <AddCourseModal
          isOpen={showAddCourseModal}
          onClose={() => setShowAddCourseModal(false)}
          onSubmit={handleAddCourse}
          isLoading={isCreatingCourse}
        />

        <UniqueFooter />
      </div>
    )
  }

  // STUDENT VIEW - Normalizar por seguridad (si courses no es arreglo)
  const userCourses = Array.isArray(courses) ? courses : (courses as any)?.courses || []

  // Mapear datos del backend a props esperadas por StudentCourseCard
  const toSlug = (value: string) =>
    (value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const mapToStudentCardProps = (c: any) => {
    const base = getApiBase()
    const imageUrl = c?.miniature_id ? `${base}/media/get_file?file_id=${encodeURIComponent(c.miniature_id)}` : undefined
    return {
      title: c?.name || "Curso",
      description: c?.description || "",
      price: Number(c?.price) || 0,
      duration: c?.hours ? `${c.hours}h` : "",
      students: Number(c?.students) || 0,
      rating: Number(c?.rating) || 0,
      tags: Array.isArray(c?.tags) ? c.tags : [],
      instructor: c?.sensei_name || "",
      language: c?.language || "",
      difficulty: (c?.difficulty as any) || "Intermedio",
      lessons: Number(c?.lessons_count) || 0,
      hours: Number(c?.hours) || 0,
      progress: typeof c?.progress === "number" ? c.progress : Number(c?.progress?.progress_percentage || 0),
      lastAccessed: c?.last_accessed || "",
      slug: toSlug(c?.name || ""),
      status: (typeof c?.progress === "number" ? c.progress : Number(c?.progress?.progress_percentage || 0)) === 100 ? "completed" : "ongoing",
      imageUrl,
    }
  }
  const ongoingCourses = userCourses.filter((course: any) => (course.progress ?? 0) < 100)
  const completedCourses = userCourses.filter((course: any) => (course.progress ?? 0) === 100)

  return (
    <div className="min-h-screen bg-dynamic-gradient">
      <UniqueHeader />

      {/* Hero Section */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-6">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-mono">./perfil --student</span>
            </div>

            <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl md:text-5xl mb-4">
              {">"} Bienvenido, <span className="text-green-400">{user.name}</span>
            </h1>

            <p className="text-slate-400 font-mono text-sm sm:text-base">// Tu progreso de aprendizaje en byteTECH</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400 font-mono">{userCourses.length}</div>
              <div className="text-slate-400 text-sm font-mono">Mis Cursos</div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 font-mono">{completedCourses.length}</div>
              <div className="text-slate-400 text-sm font-mono">Completados</div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-400 font-mono">
                {Math.round(userCourses.reduce((acc, course) => acc + (course.progress || 0), 0) / userCourses.length) || 0}%
              </div>
              <div className="text-slate-400 text-sm font-mono">Progreso</div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 font-mono">
                {isLoadingStats ? "..." : stats?.total_users?.toLocaleString() || "0"}
              </div>
              <div className="text-slate-400 text-sm font-mono">Usuarios</div>
            </div>
          </div>
        </div>
      </section>

      {/* Transición suave */}
      <div className="section-transition-up"></div>

      {/* Courses Sections */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/3 via-transparent to-blue-900/3" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          {/* Ongoing Courses */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="font-mono text-2xl sm:text-3xl font-bold text-green-400">CURSOS OBTENIDOS:</h2>
                <p className="text-slate-400 font-mono text-sm">// Continúa tu aprendizaje</p>
              </div>
            </div>

            {ongoingCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ongoingCourses.map((course, index) => {
                  const props = mapToStudentCardProps(course)
                  return <StudentCourseCard key={index} {...props} />
                })}
              </div>
            ) : (
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-8 text-center">
                <Clock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 font-mono">No tienes cursos en progreso</p>
                <p className="text-slate-500 font-mono text-sm mt-2">// Explora nuestro catálogo para comenzar</p>
              </div>
            )}
          </div>

          {/* Completed Courses */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-black" />
              </div>
              <div>
                <h2 className="font-mono text-2xl sm:text-3xl font-bold text-cyan-400">CURSOS FINALIZADOS:</h2>
                <p className="text-slate-400 font-mono text-sm">// Tus logros completados</p>
              </div>
            </div>

            {completedCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((course, index) => {
                  const props = mapToStudentCardProps(course)
                  return <StudentCourseCard key={index} {...props} />
                })}
              </div>
            ) : (
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-8 text-center">
                <TrendingUp className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 font-mono">Aún no has completado ningún curso</p>
                <p className="text-slate-500 font-mono text-sm mt-2">
                  // ¡Sigue estudiando para obtener tu primer certificado!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <UniqueFooter />
    </div>
  )
}
