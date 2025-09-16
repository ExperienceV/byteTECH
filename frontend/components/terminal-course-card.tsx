import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, User, DollarSign } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface TerminalCourseCardProps {
  id: number
  title: string
  description: string
  price: number
  duration: string
  instructor: string
  imageUrl?: string
  language?: string
  difficulty?: "Beginner" | "Intermediate" | "Advanced"
  tags?: string[]
  students?: number
  rating?: number
  href?: string
}

export function TerminalCourseCard({
  id,
  title,
  description,
  price,
  duration,
  instructor,
  imageUrl,
  language = "Python",
  difficulty = "Intermediate",
  tags = ["Programación"],
  students = 0,
  rating = 0,
  href,
}: TerminalCourseCardProps) {
  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800 hover:border-cyan-500/50 transition-all duration-300 group">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          {imageUrl ? (
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-cyan-400 text-2xl font-mono">{"</>"}</span>
                </div>
                <p className="text-slate-400 font-mono text-sm">{language}</p>
              </div>
            </div>
          )}
          <div className="absolute top-2 right-2">
            <span className="bg-slate-900/80 backdrop-blur-sm text-cyan-400 px-2 py-1 rounded text-xs font-mono">
              {difficulty}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-mono text-white font-semibold text-lg line-clamp-2 group-hover:text-cyan-400 transition-colors">
            {title}
          </h3>
          <p className="text-slate-400 text-sm line-clamp-3 font-mono">{description}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span key={index} className="bg-slate-800 text-cyan-400 px-2 py-1 rounded text-xs font-mono">
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <User className="w-4 h-4" />
            <span className="font-mono">{instructor}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{duration}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="font-mono text-green-400 font-semibold">${price}</span>
        </div>

        <Link href={href ?? `/cursos/${id}`}>
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-black font-mono">
            Ver curso
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
