"use client"

import { NormalHeader } from "@/components/normal-header"
import { NormalFooter } from "@/components/normal-footer"
import { Button } from "@//components/ui/button"
import { Input } from "@//components/ui/input"
import { Textarea } from "@//components/ui/textarea"
import { Badge } from "@//components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { 
  Terminal, 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  Upload, 
  Play, 
  FileText, 
  Settings,
  ArrowLeft,
  Eye,
  Users,
  DollarSign,
  Clock
} from "lucide-react"
import { useAuth } from "@//lib/auth-context"
import { coursesApi, workbrenchApi, getUsers, getApiBase } from "@/lib/api"
import { useRouter } from "next/navigation"
import Link from "next/link"
import React, { useEffect, useState } from "react"

interface Lesson {
  id: number
  title: string
  type: "video" | "document"
  file_id?: string
  duration?: string
}

interface Section {
  id: number
  title: string
  lessons: Lesson[]
}

interface CourseContent {
  content: Record<string, Section> | {}
  description: string
  hours: number
  id: number
  miniature_id: string
  name: string
  price: number
  progress: {
    total_lessons: number
    completed_lessons: number
    progress_percentage: number
  }
  sensei_id: number
  sensei_name: string
  video_id: string | null
  // Nuevo: archivo de previsualización
  preview?: {
    id: number
    course_id: number
    file_id: string
  } | null
}

interface CourseData extends CourseContent {
  students?: number
  rating?: number
}         

export default function EditorPage({ params }: { params: Promise<{ courseId: string }> }) {
  const resolvedParams = React.use(params)
  const { courseId } = resolvedParams
  const { user, isLoggedIn } = useAuth()
  const router = useRouter()
  const [course, setCourse] = useState<CourseData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isAddingSection, setIsAddingSection] = useState(false)
  const [isAddingLesson, setIsAddingLesson] = useState(false)
  const [selectedSection, setSelectedSection] = useState<number | null>(null)
  const [showSectionModal, setShowSectionModal] = useState(false)
  const [newSectionName, setNewSectionName] = useState("")
  // Subida de preview
  const [isUploadingPreview, setIsUploadingPreview] = useState(false)
  const [previewError, setPreviewError] = useState("")
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    hours: ""
  })

  // Horizontal tabs for sections
  const [selectedSectionTab, setSelectedSectionTab] = useState<number | null>(null)

  // Initialize the selected section tab to the first section when content is available
  useEffect(() => {
    if (!course || !course.content || selectedSectionTab !== null) return
    const entries = Object.entries(course.content as Record<string, Section>)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
    if (entries.length > 0) {
      const firstSection = entries[0][1]
      setSelectedSectionTab(firstSection.id)
    }
  }, [course, selectedSectionTab])

  // =============================
  // Regalar Curso - Buscar Emails
  // =============================
  const [users, setUsers] = useState<Array<{ id: number; name: string; email: string; is_sensei: boolean }>>([])
  const [isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [userSearch, setUserSearch] = useState("")
  const [userSuggestions, setUserSuggestions] = useState<typeof users>([])
  const [showUserSuggestions, setShowUserSuggestions] = useState(false)
  const [activeUserIndex, setActiveUserIndex] = useState(-1)
  const [selectedEmail, setSelectedEmail] = useState("")
  const userBoxRef = React.useRef<HTMLDivElement>(null)

  const ensureUsersLoaded = async () => {
    if (users.length > 0) return
    try {
      setIsLoadingUsers(true)
      const res = await getUsers()
      if (res.ok && Array.isArray(res.data)) {
        setUsers(res.data as any)
      }
    } finally {
      setIsLoadingUsers(false)
    }
  }

  const updateUserSuggestions = (q: string) => {
    const query = q.trim().toLowerCase()
    if (!query) {
      setUserSuggestions([])
      return
    }
    const filtered = users.filter(u =>
      u.email.toLowerCase().includes(query) ||
      u.name.toLowerCase().includes(query)
    ).slice(0, 8)
    setUserSuggestions(filtered)
  }

  const handleUserSearchChange = async (value: string) => {
    setUserSearch(value)
    setSelectedEmail("")
    if (!value.trim()) {
      setUserSuggestions([])
      setShowUserSuggestions(false)
      setActiveUserIndex(-1)
      return
    }
    await ensureUsersLoaded()
    updateUserSuggestions(value)
    setShowUserSuggestions(true)
  }

  const handleUserKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!showUserSuggestions || userSuggestions.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveUserIndex(prev => (prev + 1) % userSuggestions.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveUserIndex(prev => (prev - 1 + userSuggestions.length) % userSuggestions.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      const sel = activeUserIndex >= 0 ? userSuggestions[activeUserIndex] : userSuggestions[0]
      if (sel) {
        setSelectedEmail(sel.email)
        setUserSearch(`${sel.name} <${sel.email}>`)
        setShowUserSuggestions(false)
        setActiveUserIndex(-1)
      }
    } else if (e.key === "Escape") {
      setShowUserSuggestions(false)
      setActiveUserIndex(-1)
    }
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userBoxRef.current && !userBoxRef.current.contains(e.target as Node)) {
        setShowUserSuggestions(false)
        setActiveUserIndex(-1)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!isLoggedIn) {
        console.log("❌ Usuario no logueado, redirigiendo al login")
        router.push("/login")
        return
      }
      if (user?.is_sensei !== true) {
        console.log("❌ Usuario no es profesor, redirigiendo al home")
        router.push("/home")
        return
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isLoggedIn, router, user])

  useEffect(() => {
    if (!isLoggedIn || !user || !user.is_sensei) return

    const fetchCourse = async () => {
      try {
        const response = await coursesApi.getCourseContent(parseInt(courseId))
        if (!response.ok) {
          throw new Error(response.message || "Error al cargar el curso")
        }
        
        const courseContent = response.data.course_content
        console.log("✅ Contenido del curso cargado:", courseContent)

        // Convertir el contenido vacío en un array vacío si es necesario
        const initialCourse: CourseData = {
          ...courseContent,
          content: Object.keys(courseContent.content).length === 0 ? {} : courseContent.content,
          video_id: courseContent.video_id || null
        }
        
        setCourse(initialCourse)
        
        // Set edit form with current values
        setEditForm({
          name: courseContent.name,
          description: courseContent.description,
          price: courseContent.price.toString(),
          hours: courseContent.hours?.toString() || "0"
        })
      } catch (err) {
        const message = err instanceof Error ? err.message : "Error al cargar el curso"
        console.error("Error fetching course:", err)
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourse()
  }, [isLoggedIn, user, courseId])

  const handleSaveMetadata = async () => {
    if (!course) return

    setIsSaving(true)
    setError("")

    try {
      await workbrenchApi.editMetadata({
        course_id: course.id,
        name: editForm.name,
        description: editForm.description,
        price: editForm.price,
        hours: editForm.hours
      })

      // Update local state
      setCourse(prev => prev ? {
        ...prev,
        name: editForm.name,
        description: editForm.description,
        price: parseFloat(editForm.price),
        hours: parseFloat(editForm.hours)
      } : null)

      setIsEditing(false)
    } catch (err: any) {
      console.error("Error saving metadata:", err)
      setError(err.message || "Error al guardar los cambios")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddSection = () => {
    if (!course) return
    const sectionNumber = Object.keys(course.content as Record<string, Section>).length + 1
    setNewSectionName(`Sección ${sectionNumber}`)
    setShowSectionModal(true)
  }

  const handleConfirmAddSection = async () => {
    if (!course || !newSectionName.trim()) return

    setIsAddingSection(true)
    setError("")
    setShowSectionModal(false)

    try {
      const response = await workbrenchApi.createSection(course.id, newSectionName)
      if (!response.ok) {
        throw new Error(response.message || "Error al crear la sección")
      }

      // Get section data from response
      const newSectionId = response.data.mtd_section.section_id.toString()
      const currentContent = course.content as Record<string, Section>

      // Add new section to local state
      const newSection: Section = {
        id: parseInt(newSectionId),
        title: response.data.mtd_section.title,
        lessons: []
      }

      setCourse(prev => {
        if (!prev) return null
        return {
          ...prev,
          content: {
            ...currentContent,
            [newSectionId]: newSection
          }
        }
      })

      setSelectedSection(newSection.id)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear la sección"
      console.error("Error adding section:", err)
      setError(message)
    } finally {
      setIsAddingSection(false)
    }
  }

  const handleAddLesson = async (sectionId: number, lessonData: { title: string; file: File; time_validator: string }) => {
    if (!course) return

    setIsAddingLesson(true)
    setError("")

    try {
      // Convertir formato MM:SS a float (ej: "4:30" -> 4.5)
      const convertTimeToFloat = (timeStr: string): number => {
        const [minutes, seconds] = timeStr.split(':').map(Number);
        return minutes + (seconds / 60);
      };

      const formData = new FormData()
      formData.append('section_id', sectionId.toString())
      formData.append('course_id', course.id.toString())
      formData.append('title', lessonData.title)
      formData.append('file', lessonData.file)
      formData.append('time_validator', convertTimeToFloat(lessonData.time_validator).toString())

      const response = await workbrenchApi.createLesson(formData)
      if (!response.ok) {
        throw new Error(response.message || "Error al crear la lección")
      }
      
      // Add new lesson to local state
      const newLesson: Lesson = {
        id: Number(response.data.lesson_id),
        title: lessonData.title,
        type: lessonData.file.type.includes('video') ? 'video' : 'document',
        file_id: response.data.file_id
      }

      setCourse(prev => {
        if (!prev) return null
        const currentContent = prev.content as Record<string, Section>
        
        // ✅ Crear nuevo contenido buscando la sección correcta
        const updatedContent = Object.keys(currentContent).reduce((acc, key) => {
          const section = currentContent[key]
          
          if (section.id === sectionId) {
            // Esta es la sección que queremos actualizar
            acc[key] = {
              ...section,
              lessons: [...section.lessons, newLesson]
            }
          } else {
            acc[key] = section
          }
          
          return acc
        }, {} as Record<string, Section>)
        
        return {
          ...prev,
          content: updatedContent
        }
      })

      setSelectedSection(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al crear la lección"
      console.error("Error adding lesson:", err)
      setError(message)
    } finally {
      setIsAddingLesson(false)
    }
  }

  const handleDeleteSection = async (sectionId: number) => {
    if (!course) return;
  
    if (!confirm("¿Estás seguro de que quieres eliminar esta sección? Esta acción no se puede deshacer.")) {
      return;
    }
  
    try {
      const response = await workbrenchApi.deleteSection(sectionId)
      if (!response.ok) {
        throw new Error(response.message || "Error al eliminar la sección")
      }

      // Actualizar el estado local para eliminar la sección sin reindexar las claves existentes
      setCourse(prev => {
        if (!prev) return null
        const currentContent = prev.content as Record<string, Section>

        const updatedContent = Object.keys(currentContent).reduce((acc, key) => {
          const sec = currentContent[key]
          if (sec.id !== sectionId) {
            acc[key] = sec
          }
          return acc
        }, {} as Record<string, Section>)

        return {
          ...prev,
          content: updatedContent
        }
      })

    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al eliminar la sección";
      console.error("Error deleting section:", err);
      setError(message);
    }
  };

  const handleDeleteLesson = async (fileId: string, lessonId: number, sectionId: number) => {
    if (!course) return

    if (!confirm("¿Estás seguro de que quieres eliminar esta lección? Esta acción no se puede deshacer.")) {
      return
    }

    try {
      const response = await workbrenchApi.deleteLesson(fileId, lessonId)
      if (!response.ok) {
        throw new Error(response.message || "Error al eliminar la lección")
      }
      
      // Remove lesson from local state
      setCourse(prev => {
        if (!prev) return null
        const currentContent = prev.content as Record<string, Section>

        // Actualizar la sección correcta buscando por section.id (no por la clave del objeto)
        const updatedContent = Object.keys(currentContent).reduce((acc, key) => {
          const sec = currentContent[key]
          if (sec.id === sectionId) {
            acc[key] = {
              ...sec,
              lessons: sec.lessons.filter(lesson => lesson.id !== lessonId)
            }
          } else {
            acc[key] = sec
          }
          return acc
        }, {} as Record<string, Section>)

        return {
          ...prev,
          content: updatedContent
        }
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al eliminar la lección"
      console.error("Error deleting lesson:", err)
      setError(message)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-400 font-mono">Cargando editor...</p>
        </div>
      </div>
    )
  }

  // Funciones auxiliares para manejar el contenido
  const getContentLength = (content: Record<string, Section> | {}): number => {
    if (!content || Object.keys(content).length === 0) return 0
    return Object.keys(content).length
  }

  const getTotalLessons = (content: Record<string, Section> | {}): number => {
    if (!content || Object.keys(content).length === 0) return 0
    return Object.values(content as Record<string, Section>).reduce(
      (acc, section) => acc + section.lessons.length, 
      0
    )
  }

  const getVideoLessons = (content: Record<string, Section> | {}): number => {
    if (!content || Object.keys(content).length === 0) return 0
    return Object.values(content as Record<string, Section>).reduce(
      (acc, section) => acc + section.lessons.filter(lesson => lesson.type === 'video').length,
      0
    )
  }

  const getDocumentLessons = (content: Record<string, Section> | {}): number => {
    if (!content || Object.keys(content).length === 0) return 0
    return Object.values(content as Record<string, Section>).reduce(
      (acc, section) => acc + section.lessons.filter(lesson => lesson.type === 'document').length,
      0
    )
  }

  if (!isLoggedIn || !user || !user.is_sensei) {
    return null
  }

  if (error && !course) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-red-800 rounded-xl p-8 text-center">
          <p className="text-red-400 font-mono">{error}</p>
          <Link href="/home">
            <Button className="mt-4 px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-600 transition-colors">
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-8 text-center">
          <p className="text-slate-400 font-mono">Curso no encontrado</p>
          <Link href="/home">
            <Button className="mt-4 px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-600 transition-colors">
              Volver al Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dynamic-gradient">
      <NormalHeader />

      {/* Header Section */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/perfil">
              <Button
                variant="outline"
                className="border-blue-800 text-white bg-blue-900 hover:bg-blue-800 hover:text-blue-100 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver
              </Button>
              </Link>
              
              <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-mono">Editor del Curso {courseId}</span>
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSaveMetadata}
                    disabled={isSaving}
                    className="bg-green-500 hover:bg-green-600 text-black font-mono"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </>
                    )}
                  </Button>
                  <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-blue-800 text-white bg-blue-900 hover:bg-blue-800 hover:text-blue-100 transition-colors duration-200"
                >
                  Cancelar
                </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black font-mono"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-6 text-center">
              <p className="text-red-400 font-mono text-sm">{error}</p>
            </div>
          )}

          {/* Course Info */}
          <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Course Details - Left Column */}
              <div className="lg:col-span-2">
                <h1 className="font-mono font-bold text-white text-2xl sm:text-3xl mb-4">
                  {">"} {course.name}
                </h1>
                
                {/* Video Preview - Moved below title */}
                <div className="mb-6">
                  <h4 className="font-mono text-green-400 font-semibold mb-3">PREVISUALIZACIÓN PÚBLICA</h4>

                  {previewError && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-3 text-red-300 font-mono text-sm">
                      {previewError}
                    </div>
                  )}

                  <div className="space-y-3">
                    {course?.preview?.file_id ? (
                      <video
                        className="w-full max-w-lg aspect-video rounded-lg border border-slate-700"
                        controls
                        preload="metadata"
                        src={`${getApiBase()}/media/get_file?file_id=${encodeURIComponent(course.preview.file_id)}`}
                      />
                    ) : (
                      <div className="w-full max-w-lg aspect-video bg-slate-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-700">
                        <div className="text-center">
                          <Play className="w-6 h-6 text-green-400 mx-auto mb-2 opacity-60" />
                          <p className="text-slate-400 font-mono text-xs">Aún no hay video de previsualización</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-3">
                      <div className="text-slate-400 font-mono text-xs">
                        {course?.preview?.file_id ? (
                          <>Archivo actual: <span className="text-green-400">{course.preview.file_id}</span></>
                        ) : (
                          <>Sube un video .mp4/.webm para mostrar al público</>
                        )}
                      </div>
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="file"
                          accept="video/*"
                          disabled={isUploadingPreview}
                          className="hidden"
                          onChange={async (e) => {
                            if (!course) return
                            const inputEl = e.currentTarget as HTMLInputElement
                            const file = inputEl.files?.[0]
                            if (!file) return
                            if (!file.type.startsWith('video/')) {
                              setPreviewError('El archivo debe ser un video')
                              inputEl.value = ''
                              return
                            }
                            setPreviewError('')
                            setIsUploadingPreview(true)
                            try {
                              const resp = await workbrenchApi.uploadPreview(course.id, file)
                              if (!resp.ok) throw new Error(resp.message || 'Error subiendo preview')
                              const { id, course_id, file_id } = resp.data || {}
                              setCourse((prev) => prev ? ({
                                ...prev,
                                preview: file_id ? { id: id ?? prev.preview?.id ?? 0, course_id: course_id ?? prev.id, file_id } : prev.preview
                              }) : prev)
                            } catch (err: any) {
                              setPreviewError(err.message || 'Error al subir el preview')
                            } finally {
                              setIsUploadingPreview(false)
                              inputEl.value = ''
                            }
                          }}
                        />
                        <Button asChild disabled={isUploadingPreview} className="bg-cyan-500 hover:bg-cyan-600 text-black font-mono">
                          <span>{isUploadingPreview ? 'Subiendo...' : 'Subir / Actualizar Preview'}</span>
                        </Button>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Course Description and Details */}
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-cyan-400 font-mono text-sm mb-2">NOMBRE DEL CURSO</label>
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                        className="bg-slate-800/50 border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-cyan-400 font-mono text-sm mb-2">DESCRIPCIÓN</label>
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="bg-slate-800/50 border-slate-700 text-white font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-cyan-400 font-mono text-sm mb-2">PRECIO ($)</label>
                        <Input
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                          className="bg-slate-800/50 border-slate-700 text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-cyan-400 font-mono text-sm mb-2">HORAS</label>
                        <Input
                          type="number"
                          value={editForm.hours}
                          onChange={(e) => setEditForm(prev => ({ ...prev, hours: e.target.value }))}
                          className="bg-slate-800/50 border-slate-700 text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">{course.description}</p>
                    <div className="flex gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-mono">${course.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <span className="text-cyan-400 font-mono">{course.hours}h</span>
                      </div>
                      {course.students && (
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-400" />
                          <span className="text-purple-400 font-mono">{course.students} estudiantes</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Course Stats + Actions - Right Column */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="font-mono text-cyan-400 font-semibold mb-4">ESTADÍSTICAS DEL CURSO</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono text-sm">Secciones:</span>
                    <span className="text-white font-mono">{getContentLength(course.content)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono text-sm">Lecciones:</span>
                    <span className="text-white font-mono">
                      {getTotalLessons(course.content)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono text-sm">Videos:</span>
                    <span className="text-white font-mono">
                      {getVideoLessons(course.content)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono text-sm">Documentos:</span>
                    <span className="text-white font-mono">
                      {getDocumentLessons(course.content)}
                    </span>
                  </div>
                </div>

                {/* Regalar curso */}
                <div className="mt-6 pt-4 border-t border-slate-700">
                  <h4 className="font-mono text-green-400 font-semibold mb-2">REGALAR CURSO</h4>
                  <div className="text-slate-400 font-mono text-xs mb-3">Busca un usuario por nombre o email y transfiérele acceso a este curso.</div>
                  <div className="relative" ref={userBoxRef}>
                    <Input
                      value={userSearch}
                      onChange={(e) => handleUserSearchChange(e.target.value)}
                      onFocus={() => { ensureUsersLoaded(); if (userSearch.trim()) setShowUserSuggestions(true) }}
                      onKeyDown={handleUserKeyDown}
                      placeholder="Buscar por email o nombre..."
                      className="bg-slate-900/80 border-slate-700 text-white font-mono"
                    />
                    {showUserSuggestions && (
                      <div className="absolute mt-1 w-full bg-slate-900/95 border border-slate-800 rounded-lg shadow-xl z-20 overflow-hidden">
                        {isLoadingUsers && (
                          <div className="px-3 py-2 text-xs text-slate-400 font-mono">Cargando usuarios...</div>
                        )}
                        {!isLoadingUsers && userSuggestions.length === 0 && (
                          <div className="px-3 py-2 text-xs text-slate-400 font-mono">Sin resultados</div>
                        )}
                        {!isLoadingUsers && userSuggestions.map((u, idx) => (
                          <button
                            key={u.id}
                            onMouseDown={(e) => { e.preventDefault(); setSelectedEmail(u.email); setUserSearch(`${u.name} <${u.email}>`); setShowUserSuggestions(false); setActiveUserIndex(-1) }}
                            className={`w-full text-left px-3 py-2 font-raleway text-sm ${idx === activeUserIndex ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/70'}`}
                          >
                            <div className="flex flex-col">
                              <span className="text-white">{u.name}</span>
                              <span className="text-xs text-slate-400">{u.email}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Button
                      onClick={async () => {
                        if (!course || !selectedEmail) return
                        setError("")
                        try {
                          const res = await workbrenchApi.giveCourse(course.id, selectedEmail)
                          if (!res.ok) {
                            throw new Error(res.message || "No se pudo regalar el curso")
                          }
                          // feedback simple
                          alert(`Curso regalado a ${selectedEmail}`)
                          setUserSearch("")
                          setSelectedEmail("")
                        } catch (err: any) {
                          setError(err.message || "Error al regalar el curso")
                        }
                      }}
                      disabled={!selectedEmail}
                      className="bg-green-500 hover:bg-green-600 text-black font-mono disabled:opacity-50"
                    >
                      Regalar Curso
                    </Button>
                    {selectedEmail && (
                      <Badge className="bg-slate-700 text-slate-300 font-mono">{selectedEmail}</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Editor */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/3 via-transparent to-blue-900/3" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          {/* Sections */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h2 className="font-mono text-2xl sm:text-3xl font-bold text-green-400">SECCIONES:</h2>
                  <p className="text-slate-400 font-mono text-sm">// Organiza el contenido de tu curso</p>
                </div>
              </div>

              <Button
                onClick={handleAddSection}
                disabled={isAddingSection}
                className="bg-green-500 hover:bg-green-600 text-black font-mono"
              >
                {isAddingSection ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                    Creando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Sección
                  </>
                )}
              </Button>
            </div>

            {/* Sections horizontal tabs */}
            {course.content && Object.keys(course.content).length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-slate-400 font-mono text-sm">
                    Secciones totales: {Object.keys(course.content).length}
                  </div>
                </div>
                <div className="relative">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {Object.entries(course.content as Record<string, Section>)
                      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                      .map(([id, section]) => (
                        <button
                          key={section.id}
                          onClick={() => setSelectedSectionTab(section.id)}
                          className={`whitespace-nowrap px-3 py-2 rounded-lg border font-mono text-sm transition-colors ${
                            selectedSectionTab === section.id
                              ? 'bg-cyan-500 text-black border-cyan-400'
                              : 'bg-slate-900/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          {section.title || `Sección ${id}`}
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            )}

            <AlertDialog open={showSectionModal} onOpenChange={setShowSectionModal}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Nueva Sección</AlertDialogTitle>
                  <AlertDialogDescription>
                    Ingrese el nombre para la nueva sección del curso
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                  value={newSectionName}
                  onChange={(e) => setNewSectionName(e.target.value)}
                  placeholder="Nombre de la sección"
                  className="my-4"
                />
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleConfirmAddSection}
                    disabled={!newSectionName.trim()}
                  >
                    Crear Sección
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            {/* Sections List */}
            {course.content && Object.keys(course.content).length > 0 ? (
              <div className="space-y-6">
                {(() => {
                  const entries = Object.entries(course.content as Record<string, Section>)
                    .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                    .filter(([_, section]) => selectedSectionTab ? section.id === selectedSectionTab : true)
                  return entries.map(([id, section], sectionIndex) => (
                  <div key={section.id} className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                        <span className="text-xs font-mono text-slate-400">~Sección #{id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-slate-700 text-slate-300 font-mono">
                          {section.lessons.length} lecciones
                        </Badge>
                        <Button
                          onClick={() => handleDeleteSection(section.id)}
                          size="sm"
                          variant="destructive"
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    <div className="p-6">
                      <h3 className="font-mono text-lg font-bold text-white mb-4">
                        {section.title}
                      </h3>

                      {/* Lessons */}
                      <div className="space-y-3">
                        {section.lessons.map((lesson: Lesson, lessonIndex: number) => (
                          <div key={lesson.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                            <div className="flex items-center gap-3">
                              {lesson.type === 'video' ? (
                                <Play className="w-4 h-4 text-red-400" />
                              ) : (
                                <FileText className="w-4 h-4 text-blue-400" />
                              )}
                              <span className="text-white font-mono text-sm">{lesson.title}</span>
                              <Badge className="bg-slate-700 text-slate-300 font-mono text-xs">
                                {lesson.type}
                              </Badge>
                            </div>
                            <Button
                              onClick={() => lesson.file_id && handleDeleteLesson(lesson.file_id, lesson.id, section.id)}
                              size="sm"
                              variant="destructive"
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* Add Lesson Button */}
                      <Button
                        onClick={() => setSelectedSection(section.id)}
                        className="mt-4 bg-cyan-500 hover:bg-cyan-600 text-black font-mono"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar Lección
                      </Button>
                    </div>
                  </div>
                  ))
                })()}
              </div>
            ) : (
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-8 text-center">
                <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-400 font-mono">No hay secciones en este curso</p>
                <p className="text-slate-500 font-mono text-sm mt-2">// Crea tu primera sección para comenzar</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Add Lesson Modal */}
      {selectedSection && (
        <AddLessonModal
          isOpen={!!selectedSection}
          onClose={() => setSelectedSection(null)}
          onSubmit={(lessonData) => handleAddLesson(selectedSection, lessonData)}
          isLoading={isAddingLesson}
        />
      )}

      <NormalFooter />
    </div>
  )
}

// Add Lesson Modal Component
function AddLessonModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading 
}: { 
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: { title: string; file: File; time_validator: string }) => void
  isLoading: boolean
}) {
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [timeValidator, setTimeValidator] = useState("0:00")

  const handleTimeValidatorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Formatear automáticamente el input para MM:SS
    if (value.length === 1 && /^\d$/.test(value)) {
      value = `0:${value}`;
    } else if (value.length === 2 && /^\d{2}$/.test(value)) {
      value = `${value}:00`;
    } else if (value.length === 3 && /^\d{2}:\d$/.test(value)) {
      value = value;
    } else if (value.length === 4 && /^\d{2}:\d{2}$/.test(value)) {
      value = value;
    } else if (value.length === 5 && /^\d{3}:\d{2}$/.test(value)) {
      value = value;
    }
    
    setTimeValidator(value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !file || !timeValidator) return
    
    onSubmit({ title, file, time_validator: timeValidator })
    setTitle("")
    setFile(null)
    setTimeValidator("0:00")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-lg font-bold text-white">Agregar Lección</h3>
          <Button onClick={onClose} variant="ghost" size="sm">
            <span className="sr-only">Cerrar</span>
            ×
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-cyan-400 font-mono text-sm mb-2">TÍTULO DE LA LECCIÓN</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Introducción al curso..."
              className="bg-slate-800/50 border-slate-700 text-white font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-cyan-400 font-mono text-sm mb-2">ARCHIVO</label>
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center">
              <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <input
                type="file"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                accept="video/*,.pdf,.doc,.docx"
                className="hidden"
                id="lesson-file"
                required
              />
              <label htmlFor="lesson-file" className="cursor-pointer">
                <span className="text-cyan-400 font-mono text-sm">Haz clic para seleccionar archivo</span>
                <p className="text-slate-500 font-mono text-xs mt-1">
                  Videos, PDFs, documentos soportados
                </p>
              </label>
              {file && (
                <p className="text-green-400 font-mono text-sm mt-2">
                  ✓ {file.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={isLoading || !title || !file || !timeValidator}
              className="flex-1 bg-green-500 hover:bg-green-600 text-black font-mono"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Subiendo...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Lección
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
