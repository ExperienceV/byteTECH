"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@//components/ui/button"
import { Input } from "@//components/ui/input"
import { Textarea } from "@//components/ui/textarea"
import { Badge } from "@//components/ui/badge"
import { Plus, Upload, Video, FileText, X, Save } from "lucide-react"

interface Lesson {
  id: string
  title: string
  type: "video" | "text"
  file?: File | null
}

interface Section {
  id: string
  title: string
  lessons: Lesson[]
}

interface CourseEditorProps {
  courseId?: string
  initialData?: any
}

export function CourseEditor({ courseId, initialData }: CourseEditorProps) {
  const [activeTab, setActiveTab] = useState<"content" | "metadata">("content")
  const [sections, setSections] = useState<Section[]>([
    {
      id: "1",
      title: "SECCION 1",
      lessons: [
        { id: "1-1", title: "Introduccion a...", type: "text" },
        { id: "1-2", title: "Algoritmos", type: "video" },
      ],
    },
    {
      id: "2",
      title: "SECCION 2",
      lessons: [],
    },
    {
      id: "3",
      title: "SECCION 3",
      lessons: [],
    },
  ])

  const [showLessonModal, setShowLessonModal] = useState(false)
  const [currentSection, setCurrentSection] = useState<string | null>(null)
  const [newLesson, setNewLesson] = useState({
    title: "",
    type: "video" as "video" | "text",
    file: null as File | null,
  })

  const [metadata, setMetadata] = useState({
    title: "",
    description: "",
    price: "",
    hours: "",
    tags: [] as string[],
    image: null as File | null,
  })

  const [newTag, setNewTag] = useState("")

  const addSection = () => {
    const newSection: Section = {
      id: (sections.length + 1).toString(),
      title: `SECCION ${sections.length + 1}`,
      lessons: [],
    }
    setSections([...sections, newSection])
  }

  const addLesson = (sectionId: string) => {
    setCurrentSection(sectionId)
    setShowLessonModal(true)
  }

  const createLesson = () => {
    if (!currentSection || !newLesson.title) return

    const lesson: Lesson = {
      id: `${currentSection}-${Date.now()}`,
      title: newLesson.title,
      type: newLesson.type,
      file: newLesson.file,
    }

    setSections(
      sections.map((section) =>
        section.id === currentSection ? { ...section, lessons: [...section.lessons, lesson] } : section,
      ),
    )

    setNewLesson({ title: "", type: "video", file: null })
    setShowLessonModal(false)
    setCurrentSection(null)
  }

  const addTag = () => {
    if (newTag.trim() && !metadata.tags.includes(newTag.trim())) {
      setMetadata({
        ...metadata,
        tags: [...metadata.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setMetadata({
      ...metadata,
      tags: metadata.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "lesson" | "image") => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === "lesson") {
        setNewLesson({ ...newLesson, file })
      } else {
        setMetadata({ ...metadata, image: file })
      }
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Tabs */}
      <div className="flex border-b border-slate-700 mb-8">
        <button
          onClick={() => setActiveTab("content")}
          className={`px-6 py-3 font-mono text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "content"
              ? "text-cyan-400 border-cyan-400"
              : "text-slate-400 border-transparent hover:text-slate-300"
          }`}
        >
          CONTENIDO
        </button>
        <button
          onClick={() => setActiveTab("metadata")}
          className={`px-6 py-3 font-mono text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "metadata"
              ? "text-cyan-400 border-cyan-400"
              : "text-slate-400 border-transparent hover:text-slate-300"
          }`}
        >
          METADATOS
        </button>
      </div>

      {/* Content Tab */}
      {activeTab === "content" && (
        <div className="space-y-6">
          {/* Sections */}
          <div className="flex flex-wrap gap-4 mb-8">
            {sections.map((section) => (
              <button
                key={section.id}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-mono text-sm rounded-lg border border-slate-700 transition-colors"
              >
                {section.title}
              </button>
            ))}
            <button
              onClick={addSection}
              className="px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 font-mono text-sm rounded-lg border border-green-500/30 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Section Content */}
          <div className="space-y-8">
            {sections.map((section) => (
              <div key={section.id} className="bg-slate-900/50 rounded-xl p-6 border border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-cyan-400 font-mono text-lg font-semibold">{section.title}</h3>
                  <Button
                    onClick={() => addLesson(section.id)}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 font-mono"
                    variant="outline"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Lección
                  </Button>
                </div>

                {/* Lessons */}
                <div className="space-y-3">
                  {section.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      {lesson.type === "video" ? (
                        <Video className="w-5 h-5 text-purple-400" />
                      ) : (
                        <FileText className="w-5 h-5 text-blue-400" />
                      )}
                      <span className="text-slate-300 font-mono text-sm flex-1">{lesson.title}</span>
                      <Badge className="bg-slate-700 text-slate-300 font-mono text-xs">
                        {lesson.type.toUpperCase()}
                      </Badge>
                    </div>
                  ))}

                  {section.lessons.length === 0 && (
                    <div className="text-center py-8 text-slate-500 font-mono text-sm">
                      No hay lecciones en esta sección
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metadata Tab */}
      {activeTab === "metadata" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-slate-300 font-mono text-sm font-semibold mb-3">IMAGEN DEL CURSO</label>
              <div className="w-full h-32 bg-slate-800/50 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center hover:border-slate-600 transition-colors cursor-pointer">
                {metadata.image ? (
                  <div className="text-center">
                    <span className="text-green-400 font-mono text-sm">{metadata.image.name}</span>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <span className="text-slate-500 font-mono text-sm">Subir imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, "image")}
                      className="hidden"
                      id="course-image"
                    />
                  </div>
                )}
              </div>
              <label htmlFor="course-image" className="cursor-pointer">
                <Button
                  className="w-full mt-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 font-mono"
                  variant="outline"
                >
                  SUBIR
                </Button>
              </label>
            </div>

            {/* Title */}
            <div>
              <label className="block text-slate-300 font-mono text-sm font-semibold mb-3">TITULO</label>
              <Input
                value={metadata.title}
                onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white font-mono"
                placeholder="Nombre del curso"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-slate-300 font-mono text-sm font-semibold mb-3">DESCRIPCION</label>
              <Textarea
                value={metadata.description}
                onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white font-mono min-h-[120px]"
                placeholder="Describe tu curso..."
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-slate-300 font-mono text-sm font-semibold mb-3">ETIQUETAS</label>
              <div className="flex gap-2 mb-3">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white font-mono flex-1"
                  placeholder="Agregar etiqueta..."
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button
                  onClick={addTag}
                  className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30"
                  variant="outline"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {metadata.tags.map((tag, index) => (
                  <Badge key={index} className="bg-slate-700 text-slate-300 font-mono flex items-center gap-1">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="text-red-400 hover:text-red-300">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Price */}
            <div>
              <label className="block text-slate-300 font-mono text-sm font-semibold mb-3">PRICE</label>
              <Input
                type="number"
                value={metadata.price}
                onChange={(e) => setMetadata({ ...metadata, price: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white font-mono"
                placeholder="299"
              />
            </div>

            {/* Hours */}
            <div>
              <label className="block text-slate-300 font-mono text-sm font-semibold mb-3">HORAS</label>
              <Input
                type="number"
                value={metadata.hours}
                onChange={(e) => setMetadata({ ...metadata, hours: e.target.value })}
                className="bg-slate-800/50 border-slate-700 text-white font-mono"
                placeholder="40"
              />
            </div>

            {/* Save Button */}
            <div className="pt-8">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-black font-mono py-3">
                <Save className="w-4 h-4 mr-2" />
                GUARDAR CURSO
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-green-400/20 backdrop-blur-sm border-2 border-green-400/50 rounded-2xl p-6 w-full max-w-md">
            <div className="space-y-4">
              {/* Lesson Type */}
              <div>
                <label className="block text-green-400 font-mono text-sm font-semibold mb-3 text-center">
                  TIPO DE LECCION: TXT/VIDEO
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setNewLesson({ ...newLesson, type: "video" })}
                    className={`flex-1 py-2 px-4 rounded-lg font-mono text-sm transition-colors ${
                      newLesson.type === "video"
                        ? "bg-green-500 text-black"
                        : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                    }`}
                  >
                    VIDEO
                  </button>
                  <button
                    onClick={() => setNewLesson({ ...newLesson, type: "text" })}
                    className={`flex-1 py-2 px-4 rounded-lg font-mono text-sm transition-colors ${
                      newLesson.type === "text"
                        ? "bg-green-500 text-black"
                        : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50"
                    }`}
                  >
                    TEXTO
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-green-400 font-mono text-sm font-semibold mb-3 text-center">TITULO</label>
                <Input
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  className="bg-slate-800/50 border-slate-700 text-white font-mono text-center"
                  placeholder="Nombre de la lección"
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-green-400 font-mono text-sm font-semibold mb-3 text-center">
                  SUBIR ARCHIVO
                </label>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center">
                  {newLesson.file ? (
                    <span className="text-green-400 font-mono text-sm">{newLesson.file.name}</span>
                  ) : (
                    <div>
                      <Upload className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                      <span className="text-slate-500 font-mono text-sm">Seleccionar archivo</span>
                    </div>
                  )}
                  <input
                    type="file"
                    onChange={(e) => handleFileUpload(e, "lesson")}
                    className="hidden"
                    id="lesson-file"
                    accept={newLesson.type === "video" ? "video/*" : ".txt,.md,.pdf"}
                  />
                </div>
                <label htmlFor="lesson-file" className="cursor-pointer">
                  <Button
                    className="w-full mt-2 bg-slate-700 hover:bg-slate-600 text-white font-mono"
                    variant="outline"
                  >
                    EXAMINAR
                  </Button>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button onClick={createLesson} className="flex-1 bg-green-500 hover:bg-green-600 text-black font-mono">
                  crear
                </Button>
                <Button
                  onClick={() => setShowLessonModal(false)}
                  variant="outline"
                  className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10 font-mono bg-transparent"
                >
                  cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
