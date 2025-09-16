"use client"

import { Card, CardContent, CardFooter, CardHeader } from "@//components/ui/card"
import { Badge } from "@//components/ui/badge"
import { Button } from "@//components/ui/button"
import { Star, DollarSign, Eye, Edit, BarChart3 } from "lucide-react"
import Link from "next/link"

interface TeacherCourseCardProps {
  id: number | string
  title: string
  description: string
  price: number
  duration: string
  students: number
  //rating: number
  tags: string[]
  instructor: string
  language: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Avanzado" | "Intermedio"
  slug: string
  miniature_id?: string
  imageUrl?: string // NUEVO
}

export function TeacherCourseCard({
  id,
  title,
  description,
  price,
  duration,
  students,
  //rating,
  tags,
  language,
  difficulty,
  slug,
  miniature_id,
  imageUrl, // NUEVO
}: TeacherCourseCardProps) {
  const getDifficultyColor = (diff: string | undefined | null) => {
    if (!diff) return "bg-slate-500/20 text-slate-400 border-slate-500/30";
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

  const getLanguageColor = (lang: string | undefined | null) => {
    if (!lang) return "bg-purple-500/20 text-purple-400 border-purple-500/30";
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


  return (
    <Card className="relative overflow-hidden bg-slate-900/80 backdrop-blur-sm border-slate-800 hover:border-purple-500/50 transition-all duration-300 group">
      {/* Background Image */}
      {imageUrl && (
        <div className="absolute inset-0 z-0">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black/60 group-hover:bg-black/50 transition-all duration-300" />
        </div>
      )}
      
      <CardHeader className="relative z-10 pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-mono font-bold text-white text-lg mb-2 group-hover:text-purple-400 transition-colors drop-shadow-lg">
              {title}
            </h3>
            <p className="text-slate-200 text-sm font-mono line-clamp-2 drop-shadow-md">{description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className={`${getDifficultyColor(difficulty)} backdrop-blur-sm`} variant="outline">
            {difficulty}
          </Badge>
          <Badge className={`${getLanguageColor(language)} backdrop-blur-sm`} variant="outline">
            {language}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 py-3">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10">
            <div className="flex items-center justify-center gap-1 mb-1">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-green-400 font-mono text-sm">Precio</span>
            </div>
            <div className="text-white font-mono font-bold drop-shadow-md">${Number(price || 0).toLocaleString()}</div>
          </div>
          <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10">
            <div className="flex items-center justify-center gap-1 mb-1">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <span className="text-purple-400 font-mono text-sm">Horas</span>
            </div>
            <div className="text-white font-mono font-bold drop-shadow-md">{duration || "0h"}</div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {(Array.isArray(tags) ? tags : []).slice(0, 3).map((tag, index) => (
            <Badge
              key={index}
              className="bg-black/40 backdrop-blur-sm text-slate-200 border-white/20 text-xs font-mono"
              variant="outline"
            >
              {tag}
            </Badge>
          ))}
          {Array.isArray(tags) && tags.length > 3 && (
            <Badge className="bg-black/40 backdrop-blur-sm text-slate-300 border-white/20 text-xs font-mono" variant="outline">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="relative z-10 pt-3">
        <div className="flex gap-2 w-full">
          <Button
            asChild
            size="sm"
            className="flex-1 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-cyan-400 border border-cyan-400/50 font-mono transition-all duration-300"
            variant="outline"
          >
            <Link href={`/curso/${id}`}>
              <Eye className="w-4 h-4 mr-1" />
              Ver
            </Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="flex-1 bg-black/40 backdrop-blur-sm hover:bg-black/60 text-purple-400 border border-purple-400/50 font-mono transition-all duration-300"
            variant="outline"
          >
            <Link href={`/editor/${id}`}>
              <Edit className="w-4 h-4 mr-1" />
              Editar
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
