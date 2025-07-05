import { UniqueHeader } from "@//components/unique-header"
import { HomeFooter } from "@//components/home-footer"
import { TerminalCourseCard } from "@//components/terminal-course-card"
import { Button } from "@//components/ui/button"
import { Terminal, Code, Zap } from "lucide-react"
import Link from "next/link"

/* ─────────────────────────────────────────
   demo data
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
export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-dynamic-gradient">
      <UniqueHeader />

      {/* ── Hero ─────────────────────────── */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-8">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="text-cyan-400 text-sm font-mono">Estado del Sistema: online</span>
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          </div>

          <h1 className="font-mono font-bold leading-tight text-white text-3xl sm:text-4xl md:text-6xl lg:text-7xl mb-6">
            {">"} byte<span className="text-cyan-400">TECH</span>
            <br />
            <span className="text-slate-400 text-xl sm:text-2xl md:text-4xl">init --learning</span>
          </h1>

          <div className="bg-slate-900/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 max-w-full sm:max-w-2xl mx-auto mb-8 border border-slate-800 text-left font-mono text-xs sm:text-sm space-y-2 overflow-x-auto">
            <p className="text-green-400">
              <span className="text-slate-500">$</span> npm install knowledge --save
            </p>
            <p className="text-slate-400 ml-2">✓ Instalando habilidades de programación…</p>
            <p className="text-slate-400 ml-2">✓ Configurando el entorno de desarrollo…</p>
            <p className="text-cyan-400 ml-2">¡Listo para programar! 🚀</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/cursos">
              <Button className="bg-cyan-500 hover:bg-cyan-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-black w-full sm:w-auto">
              <Code className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">Empieza a programar</span>
              </Button>
            </Link>
            <Link href="/soporte">
              <Button
              variant="outline"
              className="border-slate-700 text-slate-300 font-mono hover:bg-slate-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-transparent w-full sm:w-auto"
              >
              <span className="text-sm sm:text-base">./dudas --support</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Transición suave */}
      <div className="section-transition-up"></div>

      {/* ── Courses ──────────────────────── */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/3 via-transparent to-blue-900/3" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <header className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8 sm:mb-12">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500">
              <Zap className="h-5 w-5 text-black" />
            </span>
            <h2 className="font-mono text-2xl sm:text-3xl lg:text-4xl font-bold text-white">./courses</h2>
          </header>

          <p className="mb-8 sm:mb-12 text-base sm:text-lg font-mono text-slate-400">
            // ¡Mira nuestros cursos más vistos!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {courses.map((c, i) => (
              <TerminalCourseCard key={i} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* Transición suave */}
      <div className="section-transition-down"></div>

      {/* Call To Action */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-transparent to-purple-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 text-center">
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6 sm:p-8">
            <p className="mb-4 sm:mb-6 font-mono text-sm sm:text-base text-slate-400">
              {">"} Listo para subir de nivel tus habilidades?
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/login">
                <Button className="bg-cyan-500 hover:bg-cyan-600 font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-black w-full sm:w-auto">
                  <span className="text-sm sm:text-base">Únete al Campus</span>
                </Button>
              </Link>
              <Link href="/cursos">
                <Button
                  variant="outline"
                  className="border-slate-700 text-slate-300 font-mono hover:bg-slate-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg bg-transparent w-full sm:w-auto"
                >
                  <span className="text-sm sm:text-base">Explora nuestros cursos</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <HomeFooter />
    </div>
  )
}
