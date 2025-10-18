import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, DollarSign, BookOpen } from "lucide-react"
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
  lessons_count?: number
}

export function TerminalCourseCard({
  id,
  title,
  description,
  price,
  duration,
  instructor,
  imageUrl,
  lessons_count,
  language = "Python",
  difficulty = "Intermediate",
  tags = ["Programación"],
  students = 0,
  rating = 0,
  href,
}: TerminalCourseCardProps) {
  const slugify = (value: string) =>
    value
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-800 hover:border-cyan-500/50 transition-all duration-300 group">
      <CardHeader className="p-0">
        <div className="relative h-64 overflow-hidden rounded-t-lg">
          {imageUrl ? (
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              priority
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
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-2">
        <h3 className="font-mono text-white font-semibold text-lg line-clamp-2 group-hover:text-cyan-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-slate-400 text-sm line-clamp-2 font-mono">{description}</p>

        <div className="space-y-2 text-sm border-t border-slate-700/50 pt-2">
          <div className="flex items-center gap-2 text-slate-400">
            <User className="w-4 h-4" />
            <span className="font-mono">{instructor}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <BookOpen className="w-4 h-4" />
            <span className="font-mono">{lessons_count}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="font-mono text-green-400 font-semibold">${price}</span>
        </div>

        <Link href={href ?? `/prevista/${slugify(title)}`}>
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-black font-mono">
            Ver curso
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
