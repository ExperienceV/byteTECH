"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  PlayCircle,
  TrendingUp,
  Award
} from 'lucide-react'

interface CourseProgressProps {
  courseId: number
  courseName: string
  totalLessons: number
  completedLessons: number
  totalHours: number
  completedHours: number
  progressPercentage: number
  isPaid: boolean
  onRefresh?: () => void
  className?: string
}

export function CourseProgress({
  courseId,
  courseName,
  totalLessons,
  completedLessons,
  totalHours,
  completedHours,
  progressPercentage,
  isPaid,
  onRefresh,
  className = ""
}: CourseProgressProps) {
  const remainingLessons = totalLessons - completedLessons
  const remainingHours = totalHours - completedHours

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-blue-500'
    if (percentage >= 40) return 'bg-yellow-500'
    if (percentage >= 20) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const getProgressLabel = (percentage: number) => {
    if (percentage === 100) return '¡Completado!'
    if (percentage >= 80) return 'Casi terminado'
    if (percentage >= 60) return 'Buen progreso'
    if (percentage >= 40) return 'Progreso medio'
    if (percentage >= 20) return 'Comenzando'
    return 'Recién empezado'
  }

  const getProgressIcon = (percentage: number) => {
    if (percentage === 100) return <Award className="w-5 h-5" />
    if (percentage >= 80) return <TrendingUp className="w-5 h-5" />
    if (percentage >= 60) return <CheckCircle className="w-5 h-5" />
    if (percentage >= 40) return <PlayCircle className="w-5 h-5" />
    if (percentage >= 20) return <BookOpen className="w-5 h-5" />
    return <BookOpen className="w-5 h-5" />
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getProgressIcon(progressPercentage)}
          Progreso del Curso
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información del curso */}
        <div className="space-y-2">
          <h3 className="font-semibold text-lg">{courseName}</h3>
          <div className="flex items-center gap-2">
            <Badge variant={isPaid ? "default" : "secondary"}>
              {isPaid ? "Curso Comprado" : "Curso Gratuito"}
            </Badge>
            <Badge variant="outline">
              ID: {courseId}
            </Badge>
          </div>
        </div>

        {/* Barra de progreso principal */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progreso General</span>
            <span className="text-sm text-muted-foreground">
              {progressPercentage}%
            </span>
          </div>
          <Progress 
            value={progressPercentage} 
            className="h-3"
          />
          <p className="text-sm text-muted-foreground text-center">
            {getProgressLabel(progressPercentage)}
          </p>
        </div>

        {/* Estadísticas detalladas */}
        <div className="grid grid-cols-2 gap-4">
          {/* Lecciones */}
          <Card className="border-2">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="font-semibold">Lecciones</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">
                {completedLessons}/{totalLessons}
              </div>
              <div className="text-xs text-muted-foreground">
                {remainingLessons} restantes
              </div>
            </CardContent>
          </Card>

          {/* Horas */}
          <Card className="border-2">
            <CardContent className="p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-green-600" />
                <span className="font-semibold">Horas</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {completedHours.toFixed(1)}/{totalHours}h
              </div>
              <div className="text-xs text-muted-foreground">
                {remainingHours.toFixed(1)}h restantes
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Métricas adicionales */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Velocidad de aprendizaje:</span>
            <span className="font-medium">
              {completedLessons > 0 
                ? `${(completedHours / completedLessons).toFixed(2)}h/lección`
                : 'N/A'
              }
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span>Tiempo estimado restante:</span>
            <span className="font-medium">
              {remainingLessons > 0 
                ? `${(remainingHours / remainingLessons * remainingLessons).toFixed(1)}h`
                : '¡Completado!'
              }
            </span>
          </div>
        </div>

        {/* Botón de actualizar */}
        {onRefresh && (
          <Button 
            onClick={onRefresh} 
            variant="outline" 
            className="w-full"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Actualizar Progreso
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
