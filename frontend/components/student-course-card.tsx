"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@//components/ui/card"
import { Badge } from "@//components/ui/badge"
import { Button } from "@//components/ui/button"
import { Progress } from "@//components/ui/progress"
import { BookOpen, Clock, CheckCircle, Play, Award } from "lucide-react"
import Link from "next/link"

interface StudentCourseCardProps {
  title: string
  description: string
  price: number
  duration: string
  students: number
  rating: number
  tags: string[]
  instructor: string
  language: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Avanzado" | "Intermedio"
  lessons: number
  hours: number
  progress: number
  lastAccessed: string
  slug: string
  status: "ongoing" | "completed"
  imageUrl?: string
}

export function StudentCourseCard({
  title,
  description,
  price,
  duration,
  students,
  rating,
  tags,
  instructor,
  language,
  difficulty,
  lessons,
  hours,
  progress,
  lastAccessed,
  slug,
  status,
  imageUrl,
}: StudentCourseCardProps) {
  const getDifficultyColor = (diff?: string) => {
    if (!diff) return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    switch (diff.toLowerCase()) {
      case "beginner":
      case "principiante":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      case "intermediate":
      case "intermedio":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "advanced":
      case "avanzado":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30"
    }
  }

  const getLanguageColor = (lang?: string) => {
    if (!lang) return "bg-purple-500/20 text-purple-400 border-purple-500/30"
    switch (lang.toLowerCase()) {
      case "javascript":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "python":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "java":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      case "dart":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
      default:
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return "bg-green-500"
    if (progress >= 75) return "bg-cyan-500"
    if (progress >= 50) return "bg-orange-500"
    return "bg-red-500"
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "--"
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    })
  }

  // Normalizaciones seguras
  const safeDifficulty = difficulty ?? "Desconocido"
  const safeLanguage = language ?? "General"
  const safeTags = Array.isArray(tags) ? tags : []
  const safeLessons = typeof lessons === "number" ? lessons : 0
  const safeHours = typeof hours === "number" ? hours : 0
  const safeProgress = typeof progress === "number" ? progress : Number((progress as any)?.progress_percentage ?? 0)
  const safeInstructor = instructor || "Instructor"
  const targetSlug = slug && slug.length > 0
    ? slug
    : (title ? title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") : "")

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800 hover:border-green-500/50 transition-all duration-300 group">
      {/* Cover Image */}
      {imageUrl && (
        <div className="w-full aspect-video overflow-hidden rounded-t-xl bg-slate-800/50 border-b border-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-mono font-bold text-white text-lg mb-2 group-hover:text-green-400 transition-colors">
              {title}
            </h3>
            <p className="text-slate-400 text-sm font-mono line-clamp-2">{description}</p>
            <p className="text-slate-500 text-xs font-mono mt-1">Instructor: <span className="text-slate-300">{safeInstructor}</span></p>
          </div>
          {status === "completed" && (
            <div className="ml-2">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className={getLanguageColor(safeLanguage)} variant="outline">
            {safeLanguage}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="py-3">
        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-400 font-mono text-sm">Progreso</span>
            <span className="text-white font-mono font-bold">{safeProgress}%</span>
          </div>
          <Progress value={safeProgress} className="h-2 bg-slate-700/60" indicatorClassName="bg-cyan-500" />
          <div className="flex items-center justify-end mt-2 text-xs font-mono text-slate-500">
            <span>
              {safeLessons} lecciones • {safeHours}h
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <BookOpen className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
            <div className="text-white font-mono text-sm">{lessons}</div>
            <div className="text-slate-400 font-mono text-xs">Lecciones</div>
          </div>
          <div className="bg-slate-800/50 rounded-lg p-2 text-center">
            <Clock className="w-4 h-4 text-orange-400 mx-auto mb-1" />
            <div className="text-white font-mono text-sm">{hours}h</div>
            <div className="text-slate-400 font-mono text-xs">Duración</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {safeTags.slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              className="bg-slate-700/50 text-slate-300 border-slate-600 text-xs font-mono"
              variant="outline"
            >
              {tag}
            </Badge>
          ))}
          {safeTags.length > 3 && (
            <Badge className="bg-slate-700/50 text-slate-400 border-slate-600 text-xs font-mono" variant="outline">
              +{safeTags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          {status === "completed" ? (
            <>
              <Button
                asChild
                size="sm"
                className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-mono"
                variant="outline"
              >
                <Link href={`/cursos/${targetSlug}`}>
                  <Award className="w-4 h-4 mr-1" />
                  Certificado
                </Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="flex-1 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 font-mono"
                variant="outline"
              >
                <Link href={`/cursos/${targetSlug}`}>
                  <BookOpen className="w-4 h-4 mr-1" />
                  Revisar
                </Link>
              </Button>
            </>
          ) : (
            <Button asChild size="sm" className="w-full bg-green-500 hover:bg-green-600 text-black font-mono">
              <Link href={`/cursos/${targetSlug}`}>
                <Play className="w-4 h-4 mr-1" />
                Continuar Curso
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
