import { UniqueHeader } from "@//components/unique-header"
import { UniqueFooter } from "@//components/unique-footer"
import { TerminalCourseCard } from "@//components/terminal-course-card"
import { Terminal, BookOpen } from "lucide-react"

/* ─────────────────────────────────────────
   courses data - catálogo reducido
   ───────────────────────────────────────── */
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
  },
]

/* ─────────────────────────────────────────
   page component
   ───────────────────────────────────────── */
export default function CursosPage() {
  return (
    <div className="min-h-screen bg-dynamic-gradient">
      <UniqueHeader />

      {/* Hero Section */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-8">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-400 text-sm font-mono">./courses --list-all</span>
            </div>

            <h1 className="font-mono font-bold leading-tight text-white text-3xl sm:text-4xl md:text-6xl mb-6">
              {">"} NUESTROS <span className="text-green-400">CURSOS</span>
              <br />
              <span className="text-slate-400 text-xl sm:text-2xl md:text-4xl">DISPONIBLES</span>
            </h1>

            <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 max-w-2xl mx-auto border border-slate-800 text-left font-mono text-xs sm:text-sm space-y-2">
              <p className="text-green-400">
                <span className="text-slate-500">$</span> find ./courses -type course -status available
              </p>
              <p className="text-slate-400 ml-2">✓ Encontrados {courses.length} cursos activos</p>
              <p className="text-slate-400 ml-2">✓ Todos los niveles disponibles</p>
              <p className="text-cyan-400 ml-2">¡Elige tu próximo desafío! 🚀</p>
            </div>
          </div>
        </div>
      </section>

      {/* Transición suave */}
      <div className="section-transition-up"></div>

      {/* Courses Catalog */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/3 via-transparent to-blue-900/3" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8 sm:mb-12">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
              <BookOpen className="h-5 w-5 text-black" />
            </span>
            <div className="flex-1">
              <h2 className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-white">./catalog</h2>
              <p className="text-slate-400 font-mono text-sm sm:text-base mt-1">
                // Explora nuestros cursos especializados
              </p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg px-3 py-2">
              <span className="text-cyan-400 font-mono text-sm">{courses.length} cursos</span>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 sm:mb-12">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-cyan-400 font-mono">{courses.length}</div>
              <div className="text-slate-400 text-sm font-mono">Cursos</div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-400 font-mono">4K+</div>
              <div className="text-slate-400 text-sm font-mono">Estudiantes</div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-purple-400 font-mono">8</div>
              <div className="text-slate-400 text-sm font-mono">Tecnologías</div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-orange-400 font-mono">4.7</div>
              <div className="text-slate-400 text-sm font-mono">Rating</div>
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {courses.map((course, index) => (
              <TerminalCourseCard key={index} {...course} />
            ))}
          </div>
        </div>
      </section>

      <UniqueFooter />
    </div>
  )
}
