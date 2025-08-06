"use client"

import type React from "react"
import { Clock, Play, Code, Edit } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface TerminalCourseCardProps {
  id: number
  title: string
  description: string
  price: number
  duration: string
  instructor: string
  imageUrl?: string
  isTeacher?: boolean
}

export function TerminalCourseCard({
  id,
  title,
  description,
  price,
  duration,
  instructor,
  imageUrl,
  isTeacher = false,
}: TerminalCourseCardProps) {
  const router = useRouter()

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    router.push(`/editor/${id}`)
  }

  const CardContent = () => (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300 group flex flex-col h-full">
      {/* Botón editar solo para teacher */}
      {isTeacher && (
        <button
          onClick={handleEdit}
          className="absolute top-3 right-3 z-10 bg-cyan-500 hover:bg-cyan-600 text-black p-2 rounded-md transition-colors shadow-lg"
          title="Editar curso"
          aria-label="Editar curso"
        >
          <Edit className="w-4 h-4" />
        </button>
      )}

      {/* Imagen del curso */}
      {imageUrl && (
        <div className="relative h-40 sm:h-48 w-full overflow-hidden">
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = "none"
            }}
          />
          {/* Fallback visual si la imagen no carga */}
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800/60">
            <Code className="w-12 h-12 text-slate-600" />
          </div>
        </div>
      )}

      {/* Terminal header */}
      <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-800 bg-slate-800/50 flex-shrink-0">
        <div className="flex items-center space-x-2 min-w-0 flex-1">
          <div className="flex space-x-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Course content */}
      <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
            {title}
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-3">{description}</p>
        </div>

        {/* Stats */}
        <div className="flex flex-col gap-2 text-xs sm:text-sm text-slate-400 font-mono">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{duration}</span>
              </div>
            </div>
            <div className="text-cyan-400 font-bold text-sm sm:text-base flex-shrink-0">${price}</div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-slate-800 mt-auto">
          <div className="text-xs text-slate-500 font-mono truncate flex-1 mr-2">by {instructor}</div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Code className="h-4 w-4 text-slate-500" />
            <Play className="h-4 w-4 text-cyan-400 group-hover:text-cyan-300" />
          </div>
        </div>
      </div>
    </div>
  )

  if (isTeacher) {
    return (
      <div className="block h-full relative">
        <CardContent />
      </div>
    )
  }

  return (
    <Link href={`/curso/${id}`} className="block h-full">
      <CardContent />
    </Link>
  )
}
