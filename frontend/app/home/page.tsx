"use client"

import { UniqueHeader } from "@//components/unique-header"
import { UniqueFooter } from "@//components/unique-footer"
import { StudentCourseCard } from "@//components/student-course-card"
import { TeacherCourseCard } from "@//components/teacher-course-card"
import { AddCourseModal } from "@//components/add-course-modal"
import { Terminal, BookOpen, CheckCircle, Clock, TrendingUp, Users, BarChart3, Award, Eye, Plus } from "lucide-react"
import { Button } from "@//components/ui/button"
import { useAuth } from "@//lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

// Course data - same as in other files
const courses = [
  {
    title: "React Fundamentals",
    description: "Master React from the ground up with hooks, state-management and best practices.",
    price: 299,
    duration: "12 weeks",
    students: 1_250,
    rating: 4.8,
    tags: ["React", "JavaScript", "Frontend"],
    instructor: "Carlos Mendoza",
    language: "JavaScript",
    difficulty: "Intermediate" as const,
    lessons: 45,
    hours: 38.5,
    progress: 75, // Student's progress
    lastAccessed: "2024-01-22",
    slug: "react-fundamentals",
  },
  {
    title: "Python Essentials",
    description: "Learn Python for web-dev, data-science and automation, starting from scratch.",
    price: 249,
    duration: "10 weeks",
    students: 890,
    rating: 4.9,
    tags: ["Python", "Backend", "Data"],
    instructor: "Ana García",
    language: "Python",
    difficulty: "Beginner" as const,
    lessons: 40,
    hours: 30.2,
    progress: 100, // Completed
    lastAccessed: "2024-01-20",
    slug: "python-essentials",
  },
  {
    title: "Desarrollo Full Stack",
    description: "Construye aplicaciones web completas con Node.js, Express, MongoDB y React",
    price: 399,
    duration: "16 semanas",
    students: 650,
    rating: 4.7,
    tags: ["Node.js", "MongoDB", "Full Stack"],
    instructor: "María López",
    language: "JavaScript",
    difficulty: "Avanzado" as const,
    lessons: 65,
    hours: 52.8,
    progress: 45, // In progress
    lastAccessed: "2024-01-21",
    slug: "desarrollo-full-stack",
  },
  {
    title: "Framework Django",
    description: "Crea aplicaciones web robustas con Django, APIs REST e integración de bases de datos",
    price: 329,
    duration: "13 semanas",
    students: 780,
    rating: 4.8,
    tags: ["Django", "Python", "Backend"],
    instructor: "Laura Martín",
    language: "Python",
    difficulty: "Intermedio" as const,
    lessons: 48,
    hours: 41.2,
    progress: 0, // Teacher course
    lastAccessed: "2024-01-23",
    slug: "framework-django",
  },
]

export default function HomePage() {
  const { user, isLoggedIn, getUserPurchases, getTeacherCourses } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [showAddCourseModal, setShowAddCourseModal] = useState(false)

  useEffect(() => {
    // Give some time for the auth context to load
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!isLoggedIn) {
        console.log("❌ Usuario no logueado, redirigiendo al login")
        router.push("/login")
        return
      }
      console.log("✅ Usuario logueado:", user?.name, "Rol:", user?.role)
    }, 100)

    return () => clearTimeout(timer)
  }, [isLoggedIn, router, user])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // If not logged in after loading, don't render anything (redirect will happen)
  if (!isLoggedIn || !user) {
    return null
  }

  const handleAddCourse = (courseData: any) => {
    console.log("Nuevo curso creado:", courseData)
    // Here you would typically send the data to your backend
    // For now, we'll just log it
  }

  // TEACHER VIEW
  if (user.role === "teacher") {
    const teacherCourseSlugs = getTeacherCourses()
    const teacherCourses = courses.filter((course) => teacherCourseSlugs.includes(course.slug))

    // Calculate teacher stats
    const totalStudents = teacherCourses.reduce((acc, course) => acc + course.students, 0)
    const averageRating = teacherCourses.reduce((acc, course) => acc + course.rating, 0) / teacherCourses.length || 0
    const totalRevenue = teacherCourses.reduce((acc, course) => acc + course.price * course.students, 0)

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
                <span className="text-purple-400 text-sm font-mono">./dashboard --teacher</span>
              </div>

              <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl md:text-5xl mb-4">
                {">"} Bienvenido, <span className="text-purple-400">Prof. {user.name}</span>
              </h1>

              <p className="text-slate-400 font-mono text-sm sm:text-base">// Panel de control del instructor</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-400 font-mono">{teacherCourses.length}</div>
                <div className="text-slate-400 text-sm font-mono">Cursos</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-cyan-400 font-mono">{totalStudents.toLocaleString()}</div>
                <div className="text-slate-400 text-sm font-mono">Estudiantes</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-400 font-mono">{averageRating.toFixed(1)}</div>
                <div className="text-slate-400 text-sm font-mono">Rating</div>
              </div>
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-400 font-mono">${totalRevenue.toLocaleString()}</div>
                <div className="text-slate-400 text-sm font-mono">Ingresos</div>
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
                  className="bg-green-500 hover:bg-green-600 text-black font-mono px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Añadir Curso
                </Button>
              </div>

              {teacherCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teacherCourses.map((course, index) => (
                    <TeacherCourseCard key={index} {...course} />
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
                      <h3 className="font-mono text-green-400 font-semibold">Ingresos</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-mono">Este mes:</span>
                        <span className="text-white font-mono">${Math.floor(totalRevenue * 0.1).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-mono">Total:</span>
                        <span className="text-green-400 font-mono">${totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400 font-mono">Promedio/curso:</span>
                        <span className="text-cyan-400 font-mono">
                          ${Math.floor(totalRevenue / teacherCourses.length).toLocaleString()}
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
                          {teacherCourses[0]?.title.split(" ")[0] || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Add Course Modal */}
        <AddCourseModal
          isOpen={showAddCourseModal}
          onClose={() => setShowAddCourseModal(false)}
          onSubmit={handleAddCourse}
        />

        <UniqueFooter />
      </div>
    )
  }

  // STUDENT VIEW (existing code)
  const userPurchases = getUserPurchases()
  const purchasedCourseSlugs = userPurchases.map((p) => p.courseSlug)
  const userCourses = courses.filter((course) => purchasedCourseSlugs.includes(course.slug))
  const ongoingCourses = userCourses.filter((course) => course.progress < 100)
  const completedCourses = userCourses.filter((course) => course.progress === 100)

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
              <span className="text-green-400 text-sm font-mono">./dashboard --student</span>
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
              <div className="text-slate-400 text-sm font-mono">Cursos</div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 font-mono">{completedCourses.length}</div>
              <div className="text-slate-400 text-sm font-mono">Completados</div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-400 font-mono">
                {Math.round(userCourses.reduce((acc, course) => acc + course.progress, 0) / userCourses.length) || 0}%
              </div>
              <div className="text-slate-400 text-sm font-mono">Progreso</div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 font-mono">
                {userCourses.reduce((acc, course) => acc + course.hours, 0).toFixed(1)}h
              </div>
              <div className="text-slate-400 text-sm font-mono">Horas</div>
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
                {ongoingCourses.map((course, index) => (
                  <StudentCourseCard key={index} {...course} status="ongoing" />
                ))}
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
                {completedCourses.map((course, index) => (
                  <StudentCourseCard key={index} {...course} status="completed" />
                ))}
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
