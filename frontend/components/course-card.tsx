import { Card, CardContent } from "@//components/ui/card"
import { Badge } from "@//components/ui/badge"
import { Clock, Users, Star } from "lucide-react"
import Image from "next/image"

interface CourseCardProps {
  title: string
  description: string
  price: number
  duration: string
  students: number
  rating: number
  image: string
  tags: string[]
  instructor: string
}

export function CourseCard({
  title,
  description,
  price,
  duration,
  students,
  rating,
  image,
  tags,
  instructor,
}: CourseCardProps) {
  return (
    <Card className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 sketch-border bg-white/90 backdrop-blur-sm">
      <div className="relative overflow-hidden rounded-t-lg">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          width={400}
          height={200}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">${price}</Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-600 hover:bg-blue-50">
              {tag}
            </Badge>
          ))}
        </div>

        <h3 className="font-bold text-lg mb-2 text-gray-800 group-hover:text-pink-600 transition-colors">{title}</h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{students}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
        </div>

        <div className="border-t pt-3">
          <p className="text-xs text-gray-500">
            Instructor: <span className="font-medium text-gray-700">{instructor}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
