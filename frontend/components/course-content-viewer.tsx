"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
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
import { forumsApi, type Thread, type Message, getApiBase, coursesApi } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"

interface Lesson {
  id: string
  title: string
  type: "video" | "text"
  duration?: string
  completed?: boolean
  locked?: boolean
  file_id?: string
  mime_type?: string
  time_validator?: number
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
  progress?: {
    total_lessons: number
    completed_lessons: number
    progress_percentage: number
  }
}

export function CourseContentViewer({ courseTitle, courseSlug, sections, progress }: CourseContentViewerProps) {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState(0)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [forumView, setForumView] = useState<"threads" | "create" | "thread">("threads")
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [newThreadData, setNewThreadData] = useState({ title: "", description: "" })
  const [newMessage, setNewMessage] = useState("")
  const [threads, setThreads] = useState<Thread[]>([])
  const [threadMessages, setThreadMessages] = useState<(Message & { pending?: boolean })[]>([])
  const [loadingThreads, setLoadingThreads] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [error, setError] = useState("")
  // Estado para previsualización de archivos de texto
  const [textPreview, setTextPreview] = useState<string>("")
  const [textLoading, setTextLoading] = useState<boolean>(false)
  const [textError, setTextError] = useState<string>("")
  // Estado local para marcar lecciones completadas en UI
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [marking, setMarking] = useState<boolean>(false)
  const timerRef = useRef<number | undefined>(undefined)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  // Progreso local para la barra
  const [localProgress, setLocalProgress] = useState(progress)

  // Inicializar progreso local desde props o calculado por las lecciones
  useEffect(() => {
    const total = sections.reduce((acc, s) => acc + s.lessons.length, 0)
    const initialCompleted = sections.reduce((acc, s) => acc + s.lessons.filter(l => Boolean(l.completed)).length, 0)
    const pct = total > 0 ? (initialCompleted / total) * 100 : 0
    setLocalProgress(prev => prev ?? { total_lessons: total, completed_lessons: initialCompleted, progress_percentage: pct })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sections])

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

  // Auto-scroll al último mensaje cuando se entra a la vista de hilo o cambian los mensajes
  useEffect(() => {
    if (forumView === "thread") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [forumView, selectedThread?.id, threadMessages.length])

  // Iniciar temporizador de progreso basado en time_validator
  useEffect(() => {
    // Limpiar temporizador previo si existe
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = undefined
    }

    if (!selectedLesson) return
    const alreadyCompleted = Boolean(selectedLesson.completed) || completedLessons.has(String(selectedLesson.id))
    const toSeconds = (val?: number): number => {
      if (!val && val !== 0) return 0
      // Interpretar formato M.S donde la parte decimal representa segundos
      const asStr = String(val)
      const [mStr, sStr] = asStr.split(".")
      const minutes = parseInt(mStr || "0", 10)
      const secondsPart = parseInt((sStr || "0").slice(0, 2), 10) || 0 // máx 2 dígitos
      return minutes * 60 + secondsPart
    }
    const seconds = toSeconds(selectedLesson.time_validator)
    if (alreadyCompleted || !seconds || seconds <= 0) return

    // Programar marcado automático
    timerRef.current = window.setTimeout(async () => {
      try {
        setMarking(true)
        await coursesApi.markProgress(Number(selectedLesson.id))
        // Actualizar estado local de completado
        setCompletedLessons((prev) => new Set(prev).add(String(selectedLesson.id)))
        setSelectedLesson((prev) => (prev ? { ...prev, completed: true } : prev))
        // Actualizar progreso local
        setLocalProgress((prev) => {
          const total = prev?.total_lessons ?? sections.reduce((acc, s) => acc + s.lessons.length, 0)
          const currentCompletedSet = new Set(completedLessons)
          currentCompletedSet.add(String(selectedLesson.id))
          // Calcular completados reales combinando props y estado local
          const completedCountFromProps = sections.reduce((acc, s) => acc + s.lessons.filter(l => Boolean(l.completed)).length, 0)
          const additional = currentCompletedSet.size - completedLessons.size // normalmente 1
          const completed = Math.min(total, (prev?.completed_lessons ?? completedCountFromProps) + additional)
          const pct = total > 0 ? (completed / total) * 100 : 0
          return { total_lessons: total, completed_lessons: completed, progress_percentage: pct }
        })
      } catch (e) {
        console.error('Error marking progress:', e)
      } finally {
        setMarking(false)
      }
    }, seconds * 1000)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = undefined
      }
    }
  }, [selectedLesson?.id, selectedLesson?.time_validator])

  // Cargar contenido de texto cuando la lección es de tipo text/*
  useEffect(() => {
    const mime = selectedLesson?.mime_type || ""
    const fileId = selectedLesson?.file_id
    setTextPreview("")
    setTextError("")
    if (!fileId || !mime.startsWith("text/")) return

    const controller = new AbortController()
    const fetchText = async () => {
      try {
        setTextLoading(true)
        const src = `${getApiBase()}/media/get_file?file_id=${encodeURIComponent(fileId)}`
        const resp = await fetch(src, { method: "GET", credentials: "include", signal: controller.signal })
        const contentType = resp.headers.get("Content-Type") || ""
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
        // Asegurar que sea texto
        if (!contentType.startsWith("text/")) {
          const asText = await resp.text().catch(() => "")
          setTextPreview(asText)
          return
        }
        const text = await resp.text()
        setTextPreview(text)
      } catch (e: any) {
        if (e?.name === "AbortError") return
        setTextError(e?.message || "No se pudo cargar el archivo de texto")
      } finally {
        setTextLoading(false)
      }
    }
    fetchText()
    return () => controller.abort()
  }, [selectedLesson?.file_id, selectedLesson?.mime_type])

  const loadThreadsForLesson = async (lessonId: number) => {
    try {
      setLoadingThreads(true)
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
      setLoadingThreads(false)
    }
  }

  const loadMessagesForThread = async (threadId: number) => {
    try {
      setLoadingMessages(true)
      setError("")
      const response = await forumsApi.getMessagesByThread(threadId)
      setThreadMessages((response.messages as (Message & { pending?: boolean })[]) || [])
    } catch (err: any) {
      console.error("Error loading messages:", err)
      if (err.message?.includes("404")) {
        // No messages found is not really an error, just empty state
        setThreadMessages([])
      } else {
        setError("Error al cargar los mensajes")
      }
    } finally {
      setLoadingMessages(false)
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
      setLoadingThreads(true)
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
      setLoadingThreads(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedThread) return

    try {
      setSendingMessage(true)
      setError("")

      // Optimistic UI: agregar mensaje temporal en estado "Enviando"
      const tempId = -Date.now()
      const tempMessage: Message & { pending?: boolean } = {
        id: tempId,
        thread_id: selectedThread.id,
        user_id: user?.id || 0,
        username: user?.name || "Tú",
        message: newMessage,
        content: newMessage,
        pending: true,
      }
      setThreadMessages((prev) => [...prev, tempMessage])
      // Despejar input y hacer scroll al final
      setNewMessage("")
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

      const apiResp = await forumsApi.sendMessage({
        thread_id: selectedThread.id,
        message: tempMessage.message || "",
      })

      // Actualizar el mensaje temporal a confirmado (sin recargar)
      setThreadMessages((prev) =>
        prev.map((m) => (
          m.id === tempId
            ? { ...m, pending: false, id: (apiResp as any)?.message_id ?? m.id }
            : m
        ))
      )
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    } catch (err: any) {
      console.error("Error sending message:", err)
      // Si falla, eliminar el mensaje temporal y mostrar error
      setThreadMessages((prev) => prev.filter((m) => m.pending !== true))
      setError("Error al enviar el mensaje: " + (err.message || "Error desconocido"))
    } finally {
      setSendingMessage(false)
    }
  }

  const handleDeleteThread = async (threadId: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este hilo?")) return

    try {
      setLoadingThreads(true)
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
      setLoadingThreads(false)
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
          disabled={!selectedLesson || loadingThreads}
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
      ) : loadingThreads ? (
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
                {user?.is_sensei && (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteThread(thread.id)
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 h-auto"
                    disabled={loadingThreads}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
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
          disabled={loadingThreads}
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
            disabled={loadingThreads}
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
            disabled={loadingThreads}
            required
          />
        </div>

        <Button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-black font-mono text-sm px-6 py-2"
          disabled={loadingThreads || !newThreadData.title.trim() || !newThreadData.description.trim()}
        >
          {loadingThreads ? (
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
            disabled={loadingMessages}
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
        {loadingMessages ? (
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
            <div
              key={message.id}
              className={`bg-slate-800/50 border border-slate-700 rounded-lg p-4 ${message.pending ? "opacity-60" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold text-cyan-400">
                      {message.username || `Usuario #${message.user_id}`}
                    </span>
                    {/* Eliminado: enumeración de mensajes */}
                    {message.pending && (
                      <span className="font-mono text-[11px] text-yellow-400">Enviando...</span>
                    )}
                  </div>
                  <p className="font-mono text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {message.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        {/* Sentinel to autoscroll */}
        <div ref={messagesEndRef} />
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
            disabled={sendingMessage}
            required
          />
          <Button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-black font-mono text-xs px-4 py-2"
            disabled={sendingMessage || !newMessage.trim()}
          >
            {sendingMessage ? (
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
          {/* Progress bar */}
          {localProgress && (
            <div className="mt-6 max-w-2xl mx-auto text-left">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-300 font-mono text-sm">Progreso del curso</span>
                <span className="text-green-400 font-mono text-sm">
                  {Math.round(localProgress.progress_percentage)}%
                </span>
              </div>
              <div className="w-full h-3 bg-slate-800 rounded-full border border-slate-700 overflow-hidden">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${Math.min(100, Math.max(0, localProgress.progress_percentage))}%` }}
                />
              </div>
              <div className="mt-2 text-slate-400 font-mono text-xs">
                {localProgress.completed_lessons} / {localProgress.total_lessons} lecciones completadas
              </div>
            </div>
          )}
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
                  {sections[activeSection]?.lessons.map((lesson) => {
                    const isCompleted = Boolean(lesson.completed) || completedLessons.has(String(lesson.id))
                    return (
                    <div
                      key={lesson.id}
                      onClick={() => handleLessonClick(lesson)}
                      className={`flex items-center gap-3 p-3 rounded-lg border border-slate-700 transition-colors cursor-pointer hover:bg-slate-800/50 hover:border-green-400/30 ${
                        selectedLesson?.id === lesson.id ? "bg-green-400/10 border-green-400/50" : ""
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {isCompleted ? (
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
                  )})}
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
                  <div className="w-full h-full flex flex-col items-center justify-start gap-4">
                    <h3 className="text-xl font-mono text-slate-300 text-center mt-2">{selectedLesson.title}</h3>
                    {selectedLesson.duration && (
                      <p className="text-slate-500 font-mono text-sm">Duración: {selectedLesson.duration}</p>
                    )}
                    {/* Renderizar contenido basado en file_id y mime_type */}
                    {(() => {
                      const baseUrl = getApiBase()
                      const fileId = selectedLesson.file_id
                      const mime = selectedLesson.mime_type || ""
                      if (!fileId) {
                        // Fallback visual cuando no hay archivo asociado
                        return (
                          <div className="text-center space-y-4">
                            <div className="w-16 h-16 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center border border-slate-700">
                              {selectedLesson.type === "video" ? (
                                <Play className="w-8 h-8 text-cyan-400" />
                              ) : (
                                <FileText className="w-8 h-8 text-blue-400" />
                              )}
                            </div>
                            <p className="text-slate-400 font-mono text-sm">Esta lección no tiene un archivo asociado.</p>
                          </div>
                        )
                      }
                      const src = `${baseUrl}/media/get_file?file_id=${encodeURIComponent(fileId)}`
                      if (mime.startsWith("image/")) {
                        return (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={src} alt={selectedLesson.title} className="max-h-[60vh] max-w-full rounded-lg border border-slate-700" />
                        )
                      }
                      if (mime.startsWith("video/")) {
                        return (
                          <video
                            key={src}
                            controls
                            className="w-full max-h-[70vh] rounded-lg border border-slate-700 bg-black"
                          >
                            <source src={src} type={mime} />
                            Tu navegador no soporta la reproducción de video.
                          </video>
                        )
                      }
                      if (mime === "application/pdf") {
                        return (
                          <iframe
                            key={src}
                            src={src}
                            className="w-full h-[75vh] rounded-lg border border-slate-700 bg-white"
                            title={selectedLesson.title}
                          />
                        )
                      }
                      if (mime.startsWith("text/")) {
                        return (
                          <div className="w-full">
                            {textLoading ? (
                              <div className="text-center py-8">
                                <Loader2 className="w-8 h-8 text-green-400 mx-auto mb-4 animate-spin" />
                                <p className="text-green-400 font-mono">Cargando archivo de texto...</p>
                              </div>
                            ) : textError ? (
                              <div className="text-center py-8">
                                <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                                <p className="text-red-400 font-mono text-sm">{textError}</p>
                              </div>
                            ) : (
                              <pre className="w-full h-[70vh] overflow-auto bg-slate-950 text-slate-200 border border-slate-700 rounded-md p-4 font-mono text-sm whitespace-pre-wrap break-words">
                                {textPreview || "(Archivo de texto vacío)"}
                              </pre>
                            )}
                          </div>
                        )
                      }
                      // Otros tipos de documentos: ofrecer descarga/visualización genérica
                      return (
                        <div className="text-center space-y-3">
                          <p className="text-slate-400 font-mono text-sm">Tipo de archivo no soportado para vista previa.</p>
                          <a
                            href={src}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-4 py-2 bg-green-500 hover:bg-green-600 text-black rounded-md font-mono text-sm"
                          >
                            ABRIR / DESCARGAR
                          </a>
                        </div>
                      )
                    })()}
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
