"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Play,
  FileText,
  CheckCircle,
  MessageCircle,
  Plus,
  Send,
  User,
  Terminal,
  Code,
  ArrowLeft,
  Hash,
  Trash2,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { forumsApi, type Thread, type Message } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

interface Lesson {
  id: string
  title: string
  type: "video" | "text"
  duration?: string
  completed?: boolean
  locked?: boolean
}

interface Section {
  id: string
  title: string
  lessons: Lesson[]
}

interface CourseContentViewerProps {
  courseTitle: string
  courseSlug: string
  sections: Section[]
}

export function CourseContentViewer({ courseTitle, courseSlug, sections }: CourseContentViewerProps) {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState(0)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [forumView, setForumView] = useState<"threads" | "create" | "thread">("threads")
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [newThreadData, setNewThreadData] = useState({ title: "", description: "" })
  const [newMessage, setNewMessage] = useState("")
  const [threads, setThreads] = useState<Thread[]>([])
  const [threadMessages, setThreadMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Auto-select first lesson on mount
  useEffect(() => {
    if (sections.length > 0 && sections[0].lessons.length > 0 && !selectedLesson) {
      const firstLesson = sections[0].lessons[0]
      if (!firstLesson.locked) {
        setSelectedLesson(firstLesson)
      }
    }
  }, [sections, selectedLesson])

  // Cargar threads cuando se selecciona una lección
  useEffect(() => {
    if (selectedLesson) {
      loadThreadsForLesson(Number(selectedLesson.id))
    }
  }, [selectedLesson])

  const loadThreadsForLesson = async (lessonId: number) => {
    try {
      setLoading(true)
      setError("")
      const response = await forumsApi.getThreadsByLesson(lessonId)
      setThreads(response.threads || [])
    } catch (err: any) {
      console.error("Error loading threads:", err)
      if (err.message?.includes("404")) {
        // No threads found is not really an error, just empty state
        setThreads([])
      } else {
        setError("Error al cargar los hilos del foro")
      }
    } finally {
      setLoading(false)
    }
  }

  const loadMessagesForThread = async (threadId: number) => {
    try {
      setLoading(true)
      setError("")
      const response = await forumsApi.getMessagesByThread(threadId)
      setThreadMessages(response.messages || [])
    } catch (err: any) {
      console.error("Error loading messages:", err)
      if (err.message?.includes("404")) {
        // No messages found is not really an error, just empty state
        setThreadMessages([])
      } else {
        setError("Error al cargar los mensajes")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLessonClick = (lesson: Lesson) => {
    // Remover la verificación de locked para permitir acceso a todas las lecciones
    setSelectedLesson(lesson)
    setForumView("threads")
    setSelectedThread(null)
    setThreadMessages([])
  }

  const handleThreadClick = async (thread: Thread) => {
    setSelectedThread(thread)
    setForumView("thread")
    await loadMessagesForThread(thread.id)
  }

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newThreadData.title.trim() || !newThreadData.description.trim() || !selectedLesson) return

    try {
      setLoading(true)
      setError("")

      // Crear el topic combinando título y descripción
      const topic = `${newThreadData.title}: ${newThreadData.description}`

      await forumsApi.createThread({
        lesson_id: Number(selectedLesson.id),
        topic: topic,
      })

      // Recargar threads
      await loadThreadsForLesson(Number(selectedLesson.id))

      setNewThreadData({ title: "", description: "" })
      setForumView("threads")
    } catch (err: any) {
      console.error("Error creating thread:", err)
      setError("Error al crear el hilo: " + (err.message || "Error desconocido"))
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedThread) return

    try {
      setLoading(true)
      setError("")

      await forumsApi.sendMessage({
        thread_id: selectedThread.id,
        message: newMessage,
      })

      // Recargar mensajes
      await loadMessagesForThread(selectedThread.id)

      setNewMessage("")
    } catch (err: any) {
      console.error("Error sending message:", err)
      setError("Error al enviar el mensaje: " + (err.message || "Error desconocido"))
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteThread = async (threadId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este hilo?")) return

    try {
      setLoading(true)
      setError("")

      await forumsApi.deleteThread(threadId)

      // Recargar threads
      if (selectedLesson) {
        await loadThreadsForLesson(Number(selectedLesson.id))
      }

      // Si estamos viendo el hilo eliminado, volver a la lista
      if (selectedThread?.id === threadId) {
        setForumView("threads")
        setSelectedThread(null)
      }
    } catch (err: any) {
      console.error("Error deleting thread:", err)
      setError("Error al eliminar el hilo: " + (err.message || "Error desconocido"))
    } finally {
      setLoading(false)
    }
  }

  const renderForumThreads = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-green-400 font-mono">
          HILOS {selectedLesson ? `- ${selectedLesson.title}` : ""}
        </h2>
        <Button
          onClick={() => setForumView("create")}
          className="bg-green-500 hover:bg-green-600 text-black font-mono text-xs px-3 py-1 h-auto"
          disabled={!selectedLesson || loading}
        >
          <Plus className="w-3 h-3 mr-1" />
          ABRIR HILO
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2 mb-4">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-400 font-mono text-sm">{error}</span>
          <Button
            onClick={() => setError("")}
            variant="ghost"
            size="sm"
            className="ml-auto text-red-400 hover:text-red-300 p-1 h-auto"
          >
            ×
          </Button>
        </div>
      )}

      {!selectedLesson ? (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 font-mono">Selecciona una lección para ver los hilos del foro</p>
        </div>
      ) : loading ? (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 text-green-400 mx-auto mb-4 animate-spin" />
          <p className="text-green-400 font-mono">Cargando hilos...</p>
        </div>
      ) : threads.length === 0 ? (
        <div className="text-center py-8">
          <MessageCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <p className="text-slate-400 font-mono mb-4">No hay hilos para esta lección</p>
          <Button
            onClick={() => setForumView("create")}
            className="bg-green-500 hover:bg-green-600 text-black font-mono text-sm px-4 py-2"
          >
            <Plus className="w-4 h-4 mr-2" />
            CREAR PRIMER HILO
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/70 hover:border-green-400/30 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => handleThreadClick(thread)}>
                  <h3 className="text-slate-300 font-mono text-sm font-semibold mb-2">
                    {thread.title || thread.topic || `Hilo #${thread.id}`}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <MessageCircle className="w-3 h-3" />
                    <span>Hilo #{thread.id}</span>
                    {thread.lesson_id && <span>• Lección {thread.lesson_id}</span>}
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteThread(thread.id)
                  }}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 h-auto"
                  disabled={loading}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const renderCreateThread = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-green-400 font-mono">ABRIR HILO</h2>
        <Button
          onClick={() => setForumView("threads")}
          variant="outline"
          className="border-slate-700 text-slate-400 hover:bg-slate-800/50 font-mono text-xs px-3 py-1 h-auto"
          disabled={loading}
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          VOLVER
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2 mb-4">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-400 font-mono text-sm">{error}</span>
          <Button
            onClick={() => setError("")}
            variant="ghost"
            size="sm"
            className="ml-auto text-red-400 hover:text-red-300 p-1 h-auto"
          >
            ×
          </Button>
        </div>
      )}

      <form onSubmit={handleCreateThread} className="space-y-4">
        <div>
          <label className="block text-sm font-mono text-slate-300 mb-2">
            <span className="text-cyan-400">const</span> tema =<span className="text-yellow-400">"</span>
            <span className="text-red-400">TEMA</span>
            <span className="text-yellow-400">"</span>
          </label>
          <Input
            placeholder="Título del hilo..."
            value={newThreadData.title}
            onChange={(e) => setNewThreadData((prev) => ({ ...prev, title: e.target.value }))}
            className="bg-slate-800/50 border-slate-700 text-slate-300 placeholder:text-slate-500 font-mono text-sm"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-mono text-slate-300 mb-2">
            <span className="text-cyan-400">const</span> argumento =<span className="text-yellow-400">"</span>
            <span className="text-red-400">ARGUMENTO</span>
            <span className="text-yellow-400">"</span>
          </label>
          <Textarea
            placeholder="Describe tu pregunta o tema de discusión..."
            value={newThreadData.description}
            onChange={(e) => setNewThreadData((prev) => ({ ...prev, description: e.target.value }))}
            className="bg-slate-800/50 border-slate-700 text-slate-300 placeholder:text-slate-500 font-mono text-sm resize-none"
            rows={4}
            disabled={loading}
            required
          />
        </div>

        <Button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-black font-mono text-sm px-6 py-2"
          disabled={loading || !newThreadData.title.trim() || !newThreadData.description.trim()}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              CREANDO...
            </>
          ) : (
            "CREAR"
          )}
        </Button>
      </form>
    </div>
  )

  const renderThreadView = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setForumView("threads")}
            variant="outline"
            className="border-slate-700 text-slate-400 hover:bg-slate-800/50 font-mono text-xs px-3 py-1 h-auto"
            disabled={loading}
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            VOLVER
          </Button>
          <div>
            <h2 className="text-lg font-bold text-green-400 font-mono">
              {selectedThread?.title || selectedThread?.topic || `Hilo #${selectedThread?.id}`}
            </h2>
            <p className="text-xs text-slate-500 font-mono">
              Hilo #{selectedThread?.id}
              {selectedThread?.lesson_id && ` • Lección ${selectedThread.lesson_id}`}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-4 py-2 mb-4">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span className="text-red-400 font-mono text-sm">{error}</span>
          <Button
            onClick={() => setError("")}
            variant="ghost"
            size="sm"
            className="ml-auto text-red-400 hover:text-red-300 p-1 h-auto"
          >
            ×
          </Button>
        </div>
      )}

      {/* Thread Messages */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-green-400 mx-auto mb-4 animate-spin" />
            <p className="text-green-400 font-mono">Cargando mensajes...</p>
          </div>
        ) : threadMessages.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 font-mono">No hay mensajes en este hilo</p>
            <p className="text-slate-500 font-mono text-sm mt-2">¡Sé el primero en participar!</p>
          </div>
        ) : (
          threadMessages.map((message) => (
            <div key={message.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold text-cyan-400">
                      {message.name || `Usuario #${message.user_id}`}
                    </span>
                    <span className="font-mono text-xs text-slate-500">#{message.id}</span>
                  </div>
                  <p className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reply Form */}
      <div className="border-t border-slate-700 pt-4">
        <p className="text-slate-400 font-mono text-sm mb-3">Participa en la discusión sobre este tema</p>
        <form onSubmit={handleSendMessage} className="space-y-3">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu respuesta..."
            className="bg-slate-800/50 border-slate-700 text-slate-300 placeholder:text-slate-500 font-mono text-sm resize-none"
            rows={3}
            disabled={loading}
            required
          />
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-black font-mono text-xs px-4 py-2"
            disabled={loading || !newMessage.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                ENVIANDO...
              </>
            ) : (
              <>
                <Send className="w-3 h-3 mr-1" />
                ENVIAR
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Course Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-6">
            <Terminal className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-mono">./course --active</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-green-400 font-mono">{courseTitle.toUpperCase()}</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Content and Forum */}
          <div className="lg:col-span-1 space-y-6">
            {/* Content Section */}
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">~/content/index.js</span>
                </div>
                <Code className="w-4 h-4 text-green-400" />
              </div>

              <div className="p-6">
                <h2 className="text-xl font-bold text-green-400 font-mono mb-6">CONTENIDO</h2>

                {/* Section Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {sections.map((section, index) => (
                    <Badge
                      key={section.id}
                      onClick={() => setActiveSection(index)}
                      className={`cursor-pointer font-mono transition-colors ${
                        activeSection === index
                          ? "bg-green-500 text-black hover:bg-green-600"
                          : "bg-slate-800/50 text-green-400 border-green-400/30 hover:bg-green-400/10"
                      }`}
                    >
                      {section.title}
                    </Badge>
                  ))}
                </div>

                {/* Lessons List */}
                <div className="space-y-2">
                  {sections[activeSection]?.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson)}
                      className={`flex items-center gap-3 p-3 rounded-lg border border-slate-700 transition-colors cursor-pointer hover:bg-slate-800/50 hover:border-green-400/30 ${
                        selectedLesson?.id === lesson.id ? "bg-green-400/10 border-green-400/50" : ""
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {lesson.completed ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : lesson.type === "video" ? (
                          <Play className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <FileText className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-mono text-slate-300 block truncate">{lesson.title}</span>
                        {lesson.duration && <span className="text-xs text-slate-500 font-mono">{lesson.duration}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Forum Section */}
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
              {/* Terminal Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">~/forum/threads.js</span>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-orange-400" />
                  <MessageCircle className="w-4 h-4 text-orange-400" />
                </div>
              </div>

              {forumView === "threads" && renderForumThreads()}
              {forumView === "create" && renderCreateThread()}
              {forumView === "thread" && renderThreadView()}
            </div>
          </div>

          {/* Right Column - Video/Content Viewer */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden h-full min-h-[500px]">
              {/* Terminal Header */}
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">~/player/main.js</span>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedLesson?.type === "video" ? (
                    <Play className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <FileText className="w-4 h-4 text-blue-400" />
                  )}
                </div>
              </div>

              <div className="p-6 h-full flex items-center justify-center">
                {selectedLesson ? (
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700">
                      {selectedLesson.type === "video" ? (
                        <Play className="w-8 h-8 text-cyan-400" />
                      ) : (
                        <FileText className="w-8 h-8 text-blue-400" />
                      )}
                    </div>
                    <h3 className="text-xl font-mono text-slate-300">{selectedLesson.title}</h3>
                    <p className="text-green-400 font-mono text-lg">
                      {selectedLesson.type === "video" ? "VIDEO" : "TEXTO"}
                    </p>
                    {selectedLesson.duration && (
                      <p className="text-slate-500 font-mono text-sm">Duración: {selectedLesson.duration}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-4 border border-slate-700">
                      <Play className="w-12 h-12 text-green-400" />
                    </div>
                    <p className="text-green-400 font-mono text-2xl">VIDEO/TEXTO</p>
                    <p className="text-slate-500 font-mono text-sm mt-2">Selecciona una lección para comenzar</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
