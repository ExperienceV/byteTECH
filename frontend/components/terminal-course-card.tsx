import { Badge } from "@//components/ui/badge"
import { Clock, Users, Star, Play, Code } from "lucide-react"
import Link from "next/link"

interface TerminalCourseCardProps {
  title: string
  description: string
  price: number
  duration: string
  students: number
  rating: number
  tags: string[]
  instructor: string
  language: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Intermedio" | "Avanzado"
}

export function TerminalCourseCard({
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
}: TerminalCourseCardProps) {
  const difficultyColors = {
    Beginner: "text-green-400 border-green-400/30 bg-green-400/10",
    Intermediate: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    Advanced: "text-red-400 border-red-400/30 bg-red-400/10",
    Intermedio: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
    Avanzado: "text-red-400 border-red-400/30 bg-red-400/10",
  }

  return (
    <Link
      href={`/courses/${title
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "")}`}
      className="block h-full"
    >
      <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300 group flex flex-col h-full">
        {/* Terminal header */}
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-800 bg-slate-800/50 flex-shrink-0">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-xs font-mono text-slate-500 truncate">~/courses/{language.toLowerCase()}</span>
          </div>
          <Badge className={`text-xs font-mono ${difficultyColors[difficulty]} whitespace-nowrap ml-2 flex-shrink-0`}>
            {difficulty}
          </Badge>
        </div>

        {/* Course content */}
        <div className="p-4 sm:p-6 space-y-3 sm:space-y-4 flex-1 flex flex-col">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-tight">
              {title}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-3 mb-3">{description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="text-xs font-mono bg-slate-800/80 text-slate-300 px-2 py-1 rounded border border-slate-700 flex-shrink-0"
              >
                #{tag.toLowerCase()}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs font-mono bg-slate-800/80 text-slate-500 px-2 py-1 rounded border border-slate-700 flex-shrink-0">
                +{tags.length - 3}
              </span>
            )}
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-2 text-xs sm:text-sm text-slate-400 font-mono">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{duration}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 flex-shrink-0" />
                  <span>{students}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                  <span>{rating}</span>
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
    </Link>
  )
}
