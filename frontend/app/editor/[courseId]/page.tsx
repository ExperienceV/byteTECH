"use client"

import { UniqueHeader } from "@//components/unique-header"
import { UniqueFooter } from "@//components/unique-footer"
import { CourseEditor } from "@//components/course-editor"
import { Terminal } from "lucide-react"
import { useAuth } from "@//lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CourseEditorPage({ params }: { params: { courseId: string } }) {
  const { user, isLoggedIn, isTeacher } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!isLoggedIn) {
        console.log("❌ Usuario no logueado, redirigiendo al login")
        router.push("/login")
        return
      }

      if (!isTeacher()) {
        console.log("❌ Usuario no es profesor, redirigiendo al home")
        router.push("/home")
        return
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isLoggedIn, router, isTeacher])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">Cargando editor...</p>
        </div>
      </div>
    )
  }

  // If not logged in or not teacher after loading, don't render anything
  if (!isLoggedIn || !user || !isTeacher()) {
    return null
  }

  return (
    <div className="min-h-screen bg-dynamic-gradient">
      <UniqueHeader />

      {/* Hero Section */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-6">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 text-sm font-mono">./editor --course-{params.courseId}</span>
            </div>

            <h1 className="font-mono font-bold leading-tight text-white text-2xl sm:text-3xl md:text-4xl mb-4">
              {">"} <span className="text-purple-400">EDITOR DE CURSO</span>
            </h1>

            <p className="text-slate-400 font-mono text-sm">// Crea y edita el contenido de tu curso</p>
          </div>

          {/* Course Editor */}
          <CourseEditor courseId={params.courseId} />
        </div>
      </section>

      <UniqueFooter />
    </div>
  )
}
