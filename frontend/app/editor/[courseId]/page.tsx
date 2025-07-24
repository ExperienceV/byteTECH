"use client"

// IndexedDB cache for file blobs
import { set, get, del, keys } from "idb-keyval"

const FILE_CACHE_DAYS = 7

// Función para limpiar el caché de archivos descargados
async function clearFileCache() {
  const allKeys = await keys()
  for (const key of allKeys) {
    // Opcional: solo borra los que parecen file_id (puedes ajustar el filtro)
    if (typeof key === "string" && key.length > 10) {
      await del(key)
    }
  }
  alert("¡Cache de archivos limpiado!")
}

async function getFileById(file_id: string): Promise<Blob> {
  // Check cache
  const cached = await get(file_id)
  if (cached) {
    if (cached.blob && cached.expiry > Date.now()) {
      console.log(`[CACHE] Archivo ${file_id} encontrado en cache y válido.`)
      return cached.blob
    } else if (cached.blob) {
      console.warn(`[CACHE] Archivo ${file_id} encontrado pero expirado.`)
    } else {
      console.warn(`[CACHE] Archivo ${file_id} corrupto o mal guardado.`)
    }
  } else {
    console.log(`[CACHE] Archivo ${file_id} no está en cache.`)
  }
  // Fetch from API
  const res = await fetch(`/api/media/get_file?file_id=${file_id}`, {
    credentials: "include"
  })
  if (!res.ok) {
    throw new Error("API_ERROR")
  }
  const blob = await res.blob()
  // Cache for FILE_CACHE_DAYS
  await set(file_id, {
    blob,
    expiry: Date.now() + FILE_CACHE_DAYS * 24 * 60 * 60 * 1000
  })
  return blob
}

// ...existing code...

import { UniqueHeader } from "@//components/unique-header"
import { UniqueFooter } from "@//components/unique-footer"
import { Button } from "@//components/ui/button"
import { Input } from "@//components/ui/input"
import { Textarea } from "@//components/ui/textarea"
import { Badge } from "@//components/ui/badge"
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
import { coursesApi, workbrenchApi } from "@/lib/api"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useEffect, useState } from "react"

interface Section {
  id: number
  title: string
  lessons: Lesson[]
}

interface Lesson {
  id: number
  title: string
  type: "video" | "document"
  file_id?: string
  duration?: string
}

interface CourseData {
  id: number
  name: string
  description: string
  price: number
  hours: number
  students?: number
  rating?: number
  content?: Section[]
}

import { useParams } from "next/navigation"

export default function EditorPage() {
  // Use useParams hook for Next.js 14+ compatibility
  const params = useParams<{ courseId: string }>()
  const courseId = params.courseId
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
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    hours: ""
  })
  const [fileModal, setFileModal] = useState<{ url: string; type: string } | null>(null)

  // Mover handleViewFile aquí para que tenga acceso a setFileModal
  async function handleViewFile(file_id: string, type?: string) {
    try {
      const blob = await getFileById(file_id)
      const url = URL.createObjectURL(blob)
      setFileModal({ url, type: type || "document" })
    } catch (err: any) {
      // Detecta si el error fue por API o por corrupción de cache
      if (err?.message === "API_ERROR") {
        // ¿Estaba en cache?
        const cached = await get(file_id)
        if (cached && cached.blob) {
          alert("El archivo estaba en cache pero expiró y no se pudo obtener del servidor. Intenta subirlo de nuevo o contacta soporte.")
        } else {
          alert("No se pudo obtener el archivo del servidor ni está en cache.")
        }
      } else {
        alert("El archivo está en cache pero está corrupto o mal guardado. Intenta limpiar el cache y vuelve a intentarlo.")
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      if (!isLoggedIn) {
        console.log("❌ Usuario no logueado, redirigiendo al login")
        router.push("/login")
        return
      }
      if (user?.role !== "teacher") {
        console.log("❌ Usuario no es profesor, redirigiendo al home")
        router.push("/home")
        return
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isLoggedIn, router, user])

  useEffect(() => {
    if (!isLoggedIn || !user || user.role !== "teacher") return

    const fetchCourse = async () => {
      try {
        const courseContent = await coursesApi.getCourseContent(parseInt(courseId))
        // Transformar content de objeto a array y asignar títulos
        const contentObj = courseContent.course_content.content
        const contentArr = Object.values(contentObj || {}).map((section: any, idx) => ({
          id: section.id,
          title: `Sección ${idx + 1}`,
          lessons: section.lessons || []
        }))
        setCourse({
          ...courseContent.course_content,
          content: contentArr,
          hours: courseContent.course_content.hours ?? 0
        })

        // Set edit form con los valores actuales
        setEditForm({
          name: courseContent.course_content.name,
          description: courseContent.course_content.description,
          price: courseContent.course_content.price.toString(),
          hours: courseContent.course_content.hours?.toString() || "0"
        })
      } catch (err: any) {
        console.error("Error fetching course:", err)
        setError(err.message || "Error al cargar el curso")
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

  const handleAddSection = async () => {
    if (!course) return

    setIsAddingSection(true)
    setError("")

    try {
      const response = await workbrenchApi.createSection(course.id)
      
      // Add new section to local state
      const newSection: Section = {
        id: response.section_id,
        title: `Sección ${(course.content?.length || 0) + 1}`,
        lessons: []
      }

      setCourse(prev => prev ? {
        ...prev,
        content: [...(prev.content || []), newSection]
      } : null)

      setSelectedSection(newSection.id)
    } catch (err: any) {
      console.error("Error adding section:", err)
      setError(err.message || "Error al crear la sección")
    } finally {
      setIsAddingSection(false)
    }
  }

  const handleAddLesson = async (sectionId: number, lessonData: { title: string; file: File }) => {
    if (!course) return

    setIsAddingLesson(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append('section_id', sectionId.toString())
      formData.append('course_id', course.id.toString())
      formData.append('title', lessonData.title)
      formData.append('file', lessonData.file)

      const response = await workbrenchApi.createLesson(formData)
      
      // Add new lesson to local state
      const newLesson: Lesson = {
        id: response.lesson_id || Date.now(), // Fallback ID
        title: lessonData.title,
        type: lessonData.file.type.includes('video') ? 'video' : 'document',
        file_id: response.file_id
      }

      setCourse(prev => prev ? {
        ...prev,
        content: prev.content?.map(section => 
          section.id === sectionId 
            ? { ...section, lessons: [...section.lessons, newLesson] }
            : section
        ) || []
      } : null)

      setSelectedSection(null)
    } catch (err: any) {
      console.error("Error adding lesson:", err)
      setError(err.message || "Error al crear la lección")
    } finally {
      setIsAddingLesson(false)
    }
  }

  const handleDeleteSection = async (sectionId: number) => {
    if (!course) return

    if (!confirm("¿Estás seguro de que quieres eliminar esta sección? Esta acción no se puede deshacer.")) {
      return
    }

    try {
      await workbrenchApi.deleteSection(sectionId)
      
      // Remove section from local state
      setCourse(prev => prev ? {
        ...prev,
        content: prev.content?.filter(section => section.id !== sectionId) || []
      } : null)
    } catch (err: any) {
      console.error("Error deleting section:", err)
      setError(err.message || "Error al eliminar la sección")
    }
  }

  const handleDeleteLesson = async (fileId: string, lessonId: number, sectionId: number) => {
    if (!course) return

    if (!confirm("¿Estás seguro de que quieres eliminar esta lección? Esta acción no se puede deshacer.")) {
      return
    }

    try {
      await workbrenchApi.deleteLesson(fileId, lessonId)
      
      // Remove lesson from local state
      setCourse(prev => prev ? {
        ...prev,
        content: prev.content?.map(section => 
          section.id === sectionId 
            ? { ...section, lessons: section.lessons.filter(lesson => lesson.id !== lessonId) }
            : section
        ) || []
      } : null)
    } catch (err: any) {
      console.error("Error deleting lesson:", err)
      setError(err.message || "Error al eliminar la lección")
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

  if (!isLoggedIn || !user || user.role !== "teacher") {
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
      <UniqueHeader />

      {/* Header Section */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link href="/home">
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver
                </Button>
              </Link>
              
              <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2">
                <Terminal className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm font-mono">./editor --course {courseId}</span>
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
                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Course Details */}
              <div>
                <h1 className="font-mono font-bold text-white text-2xl sm:text-3xl mb-4">
                  {">"} {course.name}
                </h1>
                
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

              {/* Course Stats */}
              <div className="bg-slate-800/50 rounded-lg p-4">
                <h3 className="font-mono text-cyan-400 font-semibold mb-4">ESTADÍSTICAS DEL CURSO</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono text-sm">Secciones:</span>
                    <span className="text-white font-mono">{course.content?.length || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono text-sm">Lecciones:</span>
                    <span className="text-white font-mono">
                      {course.content?.reduce((acc, section) => acc + section.lessons.length, 0) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono text-sm">Videos:</span>
                    <span className="text-white font-mono">
                      {course.content?.reduce((acc, section) => 
                        acc + section.lessons.filter(lesson => lesson.type === 'video').length, 0) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-mono text-sm">Documentos:</span>
                    <span className="text-white font-mono">
                      {course.content?.reduce((acc, section) => 
                        acc + section.lessons.filter(lesson => lesson.type === 'document').length, 0) || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transición suave */}
      <div className="section-transition-up"></div>

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

            {course.content && course.content.length > 0 ? (
              <div className="space-y-6">
                {course.content.map((section, sectionIndex) => (
                  <div key={section.id + '-' + sectionIndex} className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                      <div className="flex items-center gap-3">
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 bg-red-500 rounded-full" />
                          <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                          <div className="w-3 h-3 bg-green-500 rounded-full" />
                        </div>
                        <span className="text-xs font-mono text-slate-400">~/section/{section.id}.js</span>
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
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id + '-' + lessonIndex} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
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
                              {lesson.file_id && (
                                <Button
                                  onClick={() => handleViewFile(lesson.file_id!, lesson.type)}
                                  size="sm"
                                  variant="outline"
                                  className="ml-2 border-cyan-500 text-cyan-400 hover:bg-cyan-900"
                                >
                                  Ver archivo
                                </Button>
                              )}
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
                ))}
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

      {/* Modal para visualizar archivo */}
      {fileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-900/95 border border-slate-800 rounded-xl p-6 w-full max-w-2xl relative">
            <button
              onClick={() => setFileModal(null)}
              className="absolute top-4 right-4 text-cyan-400 hover:text-white text-2xl font-bold"
              title="Cerrar"
            >
              ×
            </button>
            <h3 className="font-mono text-lg font-bold text-white mb-4">Vista de archivo</h3>
            {/* Render según tipo */}
            {fileModal.type === "video" ? (
              <video src={fileModal.url} controls className="w-full h-96 bg-black rounded-lg" />
            ) : fileModal.type === "document" || fileModal.url.endsWith(".pdf") ? (
              <iframe src={fileModal.url} className="w-full h-96 bg-white rounded-lg" />
            ) : (
              <div className="text-center text-slate-400">No se puede mostrar este tipo de archivo</div>
            )}
          </div>
        </div>
      )}

      <UniqueFooter />
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
  onSubmit: (data: { title: string; file: File }) => void
  isLoading: boolean
}) {
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !file) return
    
    onSubmit({ title, file })
    setTitle("")
    setFile(null)
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
              disabled={isLoading || !title || !file}
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
