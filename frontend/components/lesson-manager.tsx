"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Play, 
  CheckCircle, 
  Clock, 
  FileText, 
  Video,
  Timer,
  Eye,
  Download
} from 'lucide-react'
import { TimeValidator } from './time-validator'
import { markLessonComplete, unmarkLessonComplete } from '@/lib/api'

interface Lesson {
  id: number
  section_id: number
  title: string
  file_id?: string
  mime_type?: string
  time_validator?: number
  is_completed?: boolean
  threads?: Array<{
    id: number
    lesson_id: number
    username?: string
    topic: string
  }>
}

interface LessonManagerProps {
  lesson: Lesson
  onProgressUpdate?: () => void
  showTimeValidator?: boolean
  className?: string
}

export function LessonManager({
  lesson,
  onProgressUpdate,
  showTimeValidator = true,
  className = ""
}: LessonManagerProps) {
  const [isMarking, setIsMarking] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  const getMimeTypeIcon = (mimeType?: string) => {
    if (!mimeType) return <FileText className="w-4 h-4" />
    
    if (mimeType.startsWith('video/')) return <Video className="w-4 h-4" />
    if (mimeType.startsWith('audio/')) return <Play className="w-4 h-4" />
    if (mimeType.includes('pdf')) return <FileText className="w-4 h-4" />
    
    return <FileText className="w-4 h-4" />
  }

  const getMimeTypeLabel = (mimeType?: string) => {
    if (!mimeType) return 'Archivo'
    
    if (mimeType.startsWith('video/')) return 'Video'
    if (mimeType.startsWith('audio/')) return 'Audio'
    if (mimeType.includes('pdf')) return 'PDF'
    if (mimeType.includes('image/')) return 'Imagen'
    
    return 'Documento'
  }

  const handleMarkComplete = async () => {
    if (lesson.is_completed) return
    
    setIsMarking(true)
    setMessage('')
    
    try {
      const result = await markLessonComplete(lesson.id)
      
      if (result.ok) {
        setMessage('Lección marcada como completada exitosamente')
        setMessageType('success')
        
        // Notificar al componente padre
        if (onProgressUpdate) {
          onProgressUpdate()
        }
        
        // Actualizar el estado local
        lesson.is_completed = true
      } else {
        setMessage(`Error: ${result.data}`)
        setMessageType('error')
      }
    } catch (error) {
      setMessage(`Error de red: ${error}`)
      setMessageType('error')
    } finally {
      setIsMarking(false)
    }
  }

  const handleUnmarkComplete = async () => {
    if (!lesson.is_completed) return
    
    setIsMarking(true)
    setMessage('')
    
    try {
      const result = await unmarkLessonComplete(lesson.id)
      
      if (result.ok) {
        setMessage('Lección desmarcada como completada')
        setMessageType('success')
        
        // Notificar al componente padre
        if (onProgressUpdate) {
          onProgressUpdate()
        }
        
        // Actualizar el estado local
        lesson.is_completed = false
      } else {
        setMessage(`Error: ${result.data}`)
        setMessageType('error')
      }
    } catch (error) {
      setMessage(`Error de red: ${error}`)
      setMessageType('error')
    } finally {
      setIsMarking(false)
    }
  }

  const handleViewFile = () => {
    if (lesson.file_id) {
      // Abrir archivo en nueva pestaña
      window.open(`/api/media/get_file?file_id=${lesson.file_id}`, '_blank')
    }
  }

  const handleDownloadFile = () => {
    if (lesson.file_id) {
      // Descargar archivo
      const link = document.createElement('a')
      link.href = `/api/media/get_file?file_id=${lesson.file_id}`
      link.download = `${lesson.title}.${lesson.mime_type?.split('/')[1] || 'file'}`
      link.click()
    }
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {lesson.is_completed ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Play className="w-5 h-5 text-blue-600" />
          )}
          {lesson.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Información de la lección */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {getMimeTypeIcon(lesson.mime_type)}
              <Badge variant="outline">
                {getMimeTypeLabel(lesson.mime_type)}
              </Badge>
            </div>
            
            {lesson.time_validator && (
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-orange-600" />
                <Badge variant="outline">
                  {formatTime(lesson.time_validator)}
                </Badge>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant={lesson.is_completed ? "default" : "secondary"}>
                {lesson.is_completed ? "Completada" : "Pendiente"}
              </Badge>
            </div>
            
            {lesson.threads && lesson.threads.length > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {lesson.threads.length} hilos de discusión
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* Mensajes de estado */}
        {message && (
          <Alert className={messageType === 'success' ? 'bg-green-50 border-green-200' : 
                          messageType === 'error' ? 'bg-red-50 border-red-200' : 
                          'bg-blue-50 border-blue-200'}>
            <AlertDescription className={messageType === 'success' ? 'text-green-800' : 
                                      messageType === 'error' ? 'text-red-800' : 
                                      'text-blue-800'}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Acciones de la lección */}
        <div className="flex gap-2">
          {lesson.file_id && (
            <>
              <Button 
                onClick={handleViewFile} 
                variant="outline" 
                size="sm"
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver
              </Button>
              
              <Button 
                onClick={handleDownloadFile} 
                variant="outline" 
                size="sm"
                className="flex-1"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
            </>
          )}
        </div>

        {/* Controles de progreso */}
        <div className="flex gap-2">
          {lesson.is_completed ? (
            <Button 
              onClick={handleUnmarkComplete} 
              variant="outline" 
              disabled={isMarking}
              className="flex-1"
            >
              <Clock className="w-4 h-4 mr-2" />
              {isMarking ? 'Procesando...' : 'Desmarcar Completada'}
            </Button>
          ) : (
            <Button 
              onClick={handleMarkComplete} 
              disabled={isMarking}
              className="flex-1"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              {isMarking ? 'Procesando...' : 'Marcar Completada'}
            </Button>
          )}
        </div>

        {/* Time Validator (si está habilitado y la lección tiene tiempo requerido) */}
        {showTimeValidator && lesson.time_validator && (
          <TimeValidator
            lessonId={lesson.id}
            timeRequired={lesson.time_validator}
            onProgressUpdate={onProgressUpdate}
            className="mt-4"
          />
        )}
      </CardContent>
    </Card>
  )
}
