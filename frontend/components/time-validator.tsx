"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Timer, Play, Pause, RotateCcw, CheckCircle } from 'lucide-react'
import { markLessonComplete } from '@/lib/api'

interface TimeValidatorProps {
  lessonId: number
  timeRequired: number
  onProgressUpdate?: () => void
  className?: string
}

export function TimeValidator({ 
  lessonId, 
  timeRequired, 
  onProgressUpdate,
  className = "" 
}: TimeValidatorProps) {
  const [isRunning, setIsRunning] = useState(false)
  const [remainingTime, setRemainingTime] = useState(timeRequired)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [timer])

  // Calcular progreso
  useEffect(() => {
    const progressPercent = ((timeRequired - remainingTime) / timeRequired) * 100
    setProgress(Math.min(progressPercent, 100))
  }, [remainingTime, timeRequired])

  const startTimer = () => {
    if (isRunning) return

    setIsRunning(true)
    setStatus('running')
    setMessage(`Simulando ${formatTime(timeRequired)} para la lección ${lessonId}...`)

    const interval = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          // Timer completado
          clearInterval(interval)
          setIsRunning(false)
          setStatus('completed')
          setMessage('¡Tiempo completado! Marcando lección como completada...')
          
          // Marcar lección como completada
          markLessonAsComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    setTimer(interval)
  }

  const pauseTimer = () => {
    if (timer) {
      clearInterval(timer)
      setTimer(null)
      setIsRunning(false)
      setStatus('idle')
      setMessage('Timer pausado')
    }
  }

  const resetTimer = () => {
    if (timer) {
      clearInterval(timer)
      setTimer(null)
    }
    setIsRunning(false)
    setRemainingTime(timeRequired)
    setProgress(0)
    setStatus('idle')
    setMessage('')
  }

  const markLessonAsComplete = async () => {
    try {
      const result = await markLessonComplete(lessonId)
      
      if (result.ok) {
        setMessage('¡Lección marcada como completada exitosamente!')
        setStatus('completed')
        
        // Notificar al componente padre
        if (onProgressUpdate) {
          onProgressUpdate()
        }
      } else {
        setMessage(`Error al marcar lección: ${result.data}`)
        setStatus('error')
      }
    } catch (error) {
      setMessage(`Error de red: ${error}`)
      setStatus('error')
    }
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getStatusColor = () => {
    switch (status) {
      case 'running': return 'bg-blue-500'
      case 'completed': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'running': return <Timer className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'error': return <RotateCcw className="w-4 h-4" />
      default: return <Timer className="w-4 h-4" />
    }
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {getStatusIcon()}
          Time Validator - Lección {lessonId}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información del tiempo */}
        <div className="flex items-center justify-between">
          <Badge variant="outline">
            Tiempo requerido: {formatTime(timeRequired)}
          </Badge>
          <Badge variant="outline">
            Tiempo restante: {formatTime(remainingTime)}
          </Badge>
        </div>

        {/* Barra de progreso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progreso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Controles del timer */}
        <div className="flex gap-2">
          {!isRunning ? (
            <Button 
              onClick={startTimer} 
              disabled={status === 'completed'}
              className="flex-1"
            >
              <Play className="w-4 h-4 mr-2" />
              {status === 'completed' ? 'Completado' : 'Iniciar Timer'}
            </Button>
          ) : (
            <Button 
              onClick={pauseTimer} 
              variant="outline"
              className="flex-1"
            >
              <Pause className="w-4 h-4 mr-2" />
              Pausar
            </Button>
          )}
          
          <Button 
            onClick={resetTimer} 
            variant="outline"
            size="icon"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Mensajes de estado */}
        {message && (
          <Alert className={getStatusColor()}>
            <AlertDescription className="text-white">
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Estado visual */}
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
          <span className="capitalize">
            {status === 'idle' && 'Listo para iniciar'}
            {status === 'running' && 'Ejecutando...'}
            {status === 'completed' && 'Completado'}
            {status === 'error' && 'Error'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
