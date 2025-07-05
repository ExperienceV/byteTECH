"use client"

import { CourseContentViewer } from "@//components/course-content-viewer"
import { Button } from "@//components/ui/button"
import { Badge } from "@//components/ui/badge"
import { Terminal, Play, Clock, Users, Star, BookOpen, CheckCircle, Lock, ShoppingCart } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@//lib/auth-context"

interface Course {
  title: string
  description: string
  price: number
  duration: string
  students: number
  rating: number
  tags: string[]
  instructor: string
  language: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  lessons: number
  hours: number
  videoId: string
  sections: Array<{
    title: string
    lessons: string[]
  }>
}

interface CoursePageClientProps {
  course: Course
  slug: string
}

export function CoursePageClient({ course, slug }: CoursePageClientProps) {
  const { user, isLoggedIn, hasPurchasedCourse } = useAuth()

  const userHasPurchased = hasPurchasedCourse(slug)

  // If user is logged in and has purchased the course, show the course content
  if (isLoggedIn && userHasPurchased) {
    return (
      <CourseContentViewer
        courseTitle={course.title}
        courseSlug={slug}
        sections={course.sections.map((section, index) => ({
          id: (index + 1).toString(),
          title: `SECCION ${index + 1}`,
          lessons: section.lessons.map((lesson, lessonIndex) => ({
            id: `${index + 1}-${lessonIndex + 1}`,
            title: lesson,
            type: Math.random() > 0.5 ? "video" : "text",
            duration:
              Math.random() > 0.5
                ? `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60)
                    .toString()
                    .padStart(2, "0")}`
                : undefined,
            completed: Math.random() > 0.7,
            locked: Math.random() > 0.8,
          })),
        }))}
      />
    )
  }

  const difficultyColors = {
    Beginner: "text-green-400 border-green-400/30 bg-green-400/10",
    Intermediate: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    Advanced: "text-red-400 border-red-400/30 bg-red-400/10",
  }

  return (
    <>
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
                {">"} <span className="text-green-400">{course.title.toUpperCase()}</span>
              </h1>

              {/* Authentication and Purchase Status */}
              <div className="flex justify-center mb-6">
                {!isLoggedIn ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 bg-orange-500/20 border border-orange-500/30 rounded-lg px-4 py-2">
                      <Lock className="w-4 h-4 text-orange-400" />
                      <span className="text-orange-400 font-mono text-sm">Debes iniciar sesión para acceder</span>
                    </div>
                    <Link href="/login">
                      <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-6 py-3 rounded-lg font-mono">
                        INICIAR SESIÓN
                      </Button>
                    </Link>
                  </div>
                ) : !userHasPurchased ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2">
                      <ShoppingCart className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 font-mono text-sm">Debes comprar este curso para acceder</span>
                    </div>
                    <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-lg font-mono">
                      COMPRAR CURSO - ${course.price}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-4 py-2">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-mono text-sm">¡Ya tienes acceso a este curso!</span>
                  </div>
                )}
              </div>

              {isLoggedIn && user && (
                <p className="text-slate-400 font-mono text-sm">
                  Bienvenido, <span className="text-cyan-400">{user.name}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Transición suave */}
      <div className="section-transition-up"></div>

      {/* Course Preview Content - Only show if not purchased */}
      {(!isLoggedIn || !userHasPurchased) && (
        <section className="bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/3 via-transparent to-blue-900/3" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Video and Content Preview */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Video Section */}
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-green-500 rounded-xl p-6">
                    <div className="aspect-video bg-slate-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-green-500/30 relative">
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

                  {/* Content Section Preview */}
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 w-5 text-black" />
                      </div>
                      <h2 className="text-2xl font-bold text-green-400 font-mono">CONTENIDO</h2>
                    </div>

                    {/* Section Tabs */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {course.sections.map((section, index) => (
                        <Badge
                          key={index}
                          className="bg-slate-800/50 text-green-400 border-green-400/30 font-mono hover:bg-green-400/10"
                        >
                          SECCION {index + 1}
                        </Badge>
                      ))}
                    </div>

                    {/* Lessons List Preview */}
                    <div className="space-y-3">
                      {course.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                          {section.lessons.slice(0, 2).map((lesson, lessonIndex) => (
                            <div
                              key={`${sectionIndex}-${lessonIndex}`}
                              className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border-b border-green-500/20 opacity-50"
                            >
                              <Lock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                              <span className="text-slate-400 font-mono text-sm">
                                LECCIÓN{" "}
                                {sectionIndex * Math.ceil(course.lessons / course.sections.length) + lessonIndex + 1}:{" "}
                                {lesson}
                              </span>
                            </div>
                          ))}
                          {sectionIndex === 0 && (
                            <div className="text-center py-4">
                              <p className="text-slate-500 font-mono text-sm">
                                ... y {course.lessons - 4} lecciones más
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column - Course Info */}
                <div className="space-y-6">
                  {/* About Section */}
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-green-500 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-green-400 font-mono mb-6">Acerca de</h3>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b border-slate-800">
                        <span className="text-slate-400 font-mono text-sm">PRICE:</span>
                        <span className="text-green-400 font-mono font-bold">{course.price}$</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-slate-800">
                        <span className="text-slate-400 font-mono text-sm">LECCIONES:</span>
                        <span className="text-green-400 font-mono font-bold">{course.lessons}</span>
                      </div>

                      <div className="flex justify-between items-center py-2 border-b border-slate-800">
                        <span className="text-slate-400 font-mono text-sm">HORAS:</span>
                        <span className="text-green-400 font-mono font-bold">{course.hours}</span>
                      </div>

                      <div className="flex justify-between items-center py-2">
                        <span className="text-slate-400 font-mono text-sm">INSTRUCTOR:</span>
                        <span className="text-green-400 font-mono font-bold">{course.instructor}</span>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white font-mono mb-4">Detalles del Curso</h3>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Users className="w-4 h-4 text-cyan-400" />
                        <span className="text-slate-300 text-sm">{course.students.toLocaleString()} estudiantes</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-slate-300 text-sm">{course.rating} de calificación</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-green-400" />
                        <span className="text-slate-300 text-sm">{course.duration} de duración</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Terminal className="w-4 h-4 text-purple-400" />
                        <span className="text-slate-300 text-sm">Lenguaje: {course.language}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <Badge className={`${difficultyColors[course.difficulty]} font-mono`}>{course.difficulty}</Badge>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white font-mono mb-4">Tecnologías</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag, index) => (
                        <Badge key={index} className="bg-slate-800/50 text-cyan-400 border-cyan-400/30 font-mono">
                          #{tag.toLowerCase()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  { /*
