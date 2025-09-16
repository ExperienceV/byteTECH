"use client"

import { Suspense } from "react"
import { UniqueHeader } from "@/components/unique-header"
import { UniqueFooter } from "@/components/unique-footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, Terminal, Play, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")
  const courseId = searchParams.get("course_id")
  const courseName = searchParams.get("course_name")

  return (
    <div className="min-h-screen bg-dynamic-gradient">
      <UniqueHeader />

      {/* Success Section */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/10 via-transparent to-cyan-900/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Terminal Header */}
            <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-8">
              <Terminal className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-mono">./payment --success</span>
            </div>

            {/* Success Icon */}
            <div className="w-24 h-24 mx-auto bg-green-500/20 rounded-full flex items-center justify-center mb-8 border border-green-500/30">
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>

            {/* Success Message */}
            <h1 className="font-mono font-bold leading-tight text-white text-3xl sm:text-4xl md:text-5xl mb-6">
              {">"} <span className="text-green-400">COMPRA EXITOSA</span>
            </h1>

            <p className="text-slate-300 text-lg sm:text-xl font-mono mb-8 max-w-2xl mx-auto">
              ¡Felicidades! Tu compra se ha procesado correctamente.
              {courseName && (
                <>
                  <br />
                  Ahora tienes acceso completo a <span className="text-green-400">{courseName}</span>
                </>
              )}
            </p>

            {/* Course Details */}
            {(sessionId || courseId) && (
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6 mb-8 max-w-md mx-auto">
                <h3 className="text-green-400 font-mono text-lg font-bold mb-4">DETALLES DE LA COMPRA</h3>
                <div className="space-y-3 text-left">
                  {sessionId && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-800">
                      <span className="text-slate-400 font-mono text-sm">SESSION ID:</span>
                      <span className="text-green-400 font-mono text-xs">{sessionId.slice(0, 20)}...</span>
                    </div>
                  )}
                  {courseId && (
                    <div className="flex justify-between items-center py-2 border-b border-slate-800">
                      <span className="text-slate-400 font-mono text-sm">COURSE ID:</span>
                      <span className="text-green-400 font-mono font-bold">#{courseId}</span>
                    </div>
                  )}
                  {courseName && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-slate-400 font-mono text-sm">CURSO:</span>
                      <span className="text-green-400 font-mono font-bold text-right max-w-[200px] truncate">
                        {courseName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {courseName && (
                <Link
                  href={`/courses/${courseName
                    .toLowerCase()
                    .replace(/\s+/g, "-")
                    .replace(/[^\w-]/g, "")}`}
                >
                  <Button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-8 py-3 rounded-lg font-mono text-lg">
                    <Play className="mr-2 h-5 w-5" />
                    COMENZAR CURSO
                  </Button>
                </Link>
              )}

              <Link href="/cursos">
                <Button
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800/50 font-mono px-8 py-3 text-lg bg-transparent"
                >
                  VER TODOS LOS CURSOS
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-12 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              <h3 className="text-cyan-400 font-mono text-lg font-bold mb-4">¿QUÉ SIGUE?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="space-y-2">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-cyan-400 font-mono font-bold">1</span>
                  </div>
                  <h4 className="text-white font-mono font-semibold">ACCEDE AL CURSO</h4>
                  <p className="text-slate-400 font-mono text-sm">
                    Haz clic en "COMENZAR CURSO" para acceder a todo el contenido
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-green-400 font-mono font-bold">2</span>
                  </div>
                  <h4 className="text-white font-mono font-semibold">APRENDE A TU RITMO</h4>
                  <p className="text-slate-400 font-mono text-sm">Acceso de por vida a videos, ejercicios y recursos</p>
                </div>

                <div className="space-y-2">
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-purple-400 font-mono font-bold">3</span>
                  </div>
                  <h4 className="text-white font-mono font-semibold">ÚNETE AL FORO</h4>
                  <p className="text-slate-400 font-mono text-sm">
                    Participa en discusiones y resuelve dudas con la comunidad
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UniqueFooter />
    </div>
  )
}

export default function SuccessPage() {
    return (
      <Suspense
        fallback={
          <div className="min-h-screen bg-dynamic-gradient flex items-center justify-center">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6 md:p-8">
              <div className="inline-flex items-center gap-2 bg-slate-900/60 border border-slate-800 rounded-full px-3 py-1 mb-4">
                <Terminal className="w-4 h-4 text-green-400" />
                <span className="text-green-400 text-xs font-mono">./payment --loading</span>
              </div>
              <div className="w-16 h-16 mx-auto bg-slate-800/60 rounded-full flex items-center justify-center mb-4 border border-slate-700 animate-pulse">
                <CheckCircle className="w-8 h-8 text-slate-400" />
              </div>
              <p className="text-slate-300 text-sm font-mono text-center">
                Confirmando tu compra...
              </p>
            </div>
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    )
  }