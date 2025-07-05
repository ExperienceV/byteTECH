"use client"

import { UniqueHeader } from "@//components/unique-header"
import { UniqueFooter } from "@//components/unique-footer"
import { CourseContentViewer } from "@//components/course-content-viewer"
import { Button } from "@//components/ui/button"
import { Badge } from "@//components/ui/badge"
import { Terminal, Play, Clock, Users, Star, BookOpen, CheckCircle, Lock, ShoppingCart, Code } from "lucide-react"
import { notFound } from "next/navigation"
import { getCurrentUser, isLoggedIn, hasPurchasedCourse, purchaseCourse, onAuthChange } from "@//lib/auth"
import Link from "next/link"
import { useState, useEffect } from "react"

// Course data - reduced list
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
    videoId: "dQw4w9WgXcQ",
    sections: [
      {
        title: "Introducción a React",
        lessons: [
          "Bienvenidos al curso de React",
          "¿Qué es React y por qué usarlo?",
          "Configuración del entorno de desarrollo",
          "Tu primera aplicación React",
        ],
      },
      {
        title: "Componentes y JSX",
        lessons: [
          "Entendiendo los componentes",
          "JSX: JavaScript XML",
          "Props y comunicación entre componentes",
          "Renderizado condicional",
        ],
      },
      {
        title: "Estado y Hooks",
        lessons: [
          "useState: Manejando el estado",
          "useEffect: Efectos secundarios",
          "Hooks personalizados",
          "Context API",
        ],
      },
    ],
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
    videoId: "dQw4w9WgXcQ",
    sections: [
      {
        title: "Fundamentos de Python",
        lessons: [
          "Bienvenidos al curso de Python",
          "Instalación y configuración",
          "Variables y tipos de datos",
          "Operadores básicos",
        ],
      },
      {
        title: "Estructuras de Control",
        lessons: ["Condicionales if/else", "Bucles for y while", "Funciones básicas", "Manejo de errores"],
      },
      {
        title: "Programación Orientada a Objetos",
        lessons: ["Clases y objetos", "Herencia y polimorfismo", "Métodos especiales", "Decoradores"],
      },
    ],
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
    videoId: "dQw4w9WgXcQ",
    sections: [
      {
        title: "Backend con Node.js",
        lessons: [
          "Introducción al desarrollo Full Stack",
          "Configuración del servidor Node.js",
          "Express.js y routing",
          "Middleware y autenticación",
        ],
      },
      {
        title: "Base de Datos",
        lessons: ["Introducción a MongoDB", "Mongoose ODM", "Diseño de esquemas", "Operaciones CRUD"],
      },
      {
        title: "Frontend Integration",
        lessons: [
          "Conectando React con la API",
          "Manejo de estado global",
          "Autenticación en el frontend",
          "Deployment y producción",
        ],
      },
    ],
  },
  {
    title: "Dominio de Vue.js",
    description: "Vue.js 3 avanzado con Composition API, Pinia y prácticas modernas de desarrollo",
    price: 279,
    duration: "11 semanas",
    students: 420,
    rating: 4.6,
    tags: ["Vue.js", "Frontend", "SPA"],
    instructor: "Roberto Silva",
    language: "JavaScript",
    difficulty: "Intermedio" as const,
    lessons: 38,
    hours: 28.5,
    videoId: "dQw4w9WgXcQ",
    sections: [
      {
        title: "Vue.js Fundamentals",
        lessons: [
          "Introducción a Vue.js 3",
          "Template syntax y directivas",
          "Componentes y props",
          "Eventos y métodos",
        ],
      },
      {
        title: "Composition API",
        lessons: ["Setup function", "Reactive y ref", "Computed y watch", "Lifecycle hooks"],
      },
      {
        title: "Ecosystem Vue",
        lessons: ["Vue Router", "Pinia state management", "Testing con Vitest", "Build y deployment"],
      },
    ],
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
    videoId: "dQw4w9WgXcQ",
    sections: [
      {
        title: "Django Basics",
        lessons: ["Introducción a Django", "Configuración del proyecto", "Models y ORM", "Views y Templates"],
      },
      {
        title: "Django REST Framework",
        lessons: ["APIs REST con Django", "Serializers", "Authentication y permissions", "Testing APIs"],
      },
      {
        title: "Deployment",
        lessons: ["Configuración de producción", "Docker y containerización", "Deploy en cloud", "Monitoring y logs"],
      },
    ],
  },
  {
    title: "Desarrollo con Flutter",
    description: "Crea aplicaciones móviles nativas para iOS y Android usando Flutter y Dart",
    price: 349,
    duration: "14 semanas",
    students: 560,
    rating: 4.5,
    tags: ["Flutter", "Dart", "Móvil"],
    instructor: "Diego Ruiz",
    language: "Dart",
    difficulty: "Avanzado" as const,
    lessons: 52,
    hours: 44.8,
    videoId: "dQw4w9WgXcQ",
    sections: [
      {
        title: "Flutter Fundamentals",
        lessons: ["Introducción a Flutter", "Dart programming language", "Widgets y layouts", "Navigation y routing"],
      },
      {
        title: "State Management",
        lessons: ["StatefulWidget vs StatelessWidget", "Provider pattern", "Bloc architecture", "Riverpod"],
      },
      {
        title: "Native Features",
        lessons: ["Platform channels", "Camera y multimedia", "Local storage", "Push notifications"],
      },
    ],
  },
]

function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "")
}

export default function CoursePage({ params }: { params: { slug: string } }) {
  const [user, setUser] = useState(getCurrentUser())
  const [userLoggedIn, setUserLoggedIn] = useState(isLoggedIn())
  const [userHasPurchased, setUserHasPurchased] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)

  // Find course by slug
  const course = courses.find((c) => createSlug(c.title) === params.slug)

  // Subscribe to auth changes
  useEffect(() => {
    const unsubscribe = onAuthChange(() => {
      setUser(getCurrentUser())
      setUserLoggedIn(isLoggedIn())
      if (course) {
        setUserHasPurchased(hasPurchasedCourse(params.slug))
      }
    })

    return unsubscribe
  }, [course, params.slug])

  useEffect(() => {
    if (course) {
      setUserHasPurchased(hasPurchasedCourse(params.slug))
    }
  }, [course, params.slug])

  const handlePurchase = async () => {
    if (!course || !user) return

    setIsPurchasing(true)

    // Simulate purchase process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const success = purchaseCourse(params.slug, course.price)

    if (success) {
      setUserHasPurchased(true)
      // The page will automatically update to show course content
    }

    setIsPurchasing(false)
  }

  if (!course) {
    notFound()
  }

  // If user is logged in and has purchased the course, show the course content
  if (userLoggedIn && userHasPurchased) {
    return (
      <div className="min-h-screen bg-dynamic-gradient">
        <UniqueHeader />
        <CourseContentViewer
          courseTitle={course.title}
          courseSlug={params.slug}
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
                {">"} <span className="text-green-400">{course.title.toUpperCase()}</span>
              </h1>

              {/* Authentication and Purchase Status */}
              <div className="flex justify-center mb-6">
                {!userLoggedIn ? (
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
                    <Button
                      onClick={handlePurchase}
                      disabled={isPurchasing}
                      className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-lg font-mono disabled:opacity-50"
                    >
                      {isPurchasing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                          PROCESANDO...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          COMPRAR CURSO - ${course.price}
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

              {userLoggedIn && user && (
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
      {(!userLoggedIn || !userHasPurchased) && (
        <section className="bg-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/3 via-transparent to-blue-900/3" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Video and Content Preview */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Video Section */}
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                    {/* Terminal Header */}
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

                  {/* Content Section Preview */}
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                    {/* Terminal Header */}
                    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                        <span className="text-xs font-mono text-slate-400">~/content/preview.js</span>
                      </div>
                      <Code className="w-4 h-4 text-green-400" />
                    </div>

                    <div className="p-6">
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
                                className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700 opacity-50"
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
                </div>

                {/* Right Column - Course Info */}
                <div className="space-y-6">
                  {/* About Section */}
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                    {/* Terminal Header */}
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
                          <span className="text-green-400 font-mono font-bold">${course.price}</span>
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
                  </div>

                  {/* Additional Info */}
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                    {/* Terminal Header */}
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
                        <Badge className={`${difficultyColors[course.difficulty]} font-mono`}>
                          {course.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                    {/* Terminal Header */}
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
                        {course.tags.map((tag, index) => (
                          <Badge key={index} className="bg-slate-800/50 text-cyan-400 border-cyan-400/30 font-mono">
                            #{tag.toLowerCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <UniqueFooter />
    </div>
  )
}
