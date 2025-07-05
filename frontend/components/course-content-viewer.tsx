"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@//components/ui/badge"
import { Button } from "@//components/ui/button"
import { Input } from "@//components/ui/input"
import { Textarea } from "@//components/ui/textarea"
import {
  Play,
  FileText,
  CheckCircle,
  Lock,
  MessageCircle,
  Plus,
  Send,
  User,
  Terminal,
  Code,
  ArrowLeft,
  Hash,
} from "lucide-react"

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

interface ForumThread {
  id: string
  title: string
  author: string
  timestamp: string
  replies: number
  lastActivity: string
}

interface ThreadMessage {
  id: string
  author: string
  message: string
  timestamp: string
  avatar?: string
}

interface CourseContentViewerProps {
  courseTitle: string
  courseSlug: string
  sections: Section[]
}

export function CourseContentViewer({ courseTitle, courseSlug, sections }: CourseContentViewerProps) {
  const [activeSection, setActiveSection] = useState(0)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [forumView, setForumView] = useState<"threads" | "create" | "thread">("threads")
  const [selectedThread, setSelectedThread] = useState<ForumThread | null>(null)
  const [newThreadData, setNewThreadData] = useState({ title: "", description: "" })
  const [newMessage, setNewMessage] = useState("")

  // Mock forum threads
  const [threads, setThreads] = useState<ForumThread[]>([
    {
      id: "1",
      title: "Me manda error :'v",
      author: "Juanito",
      timestamp: "2024-01-20 10:30",
      replies: 3,
      lastActivity: "hace 2 horas",
    },
    {
      id: "2",
      title: "No compilo tu vaina",
      author: "Pepe",
      timestamp: "2024-01-20 11:15",
      replies: 1,
      lastActivity: "hace 1 hora",
    },
    {
      id: "3",
      title: "¿Cómo instalar las dependencias?",
      author: "María",
      timestamp: "2024-01-21 09:00",
      replies: 5,
      lastActivity: "hace 30 min",
    },
  ])

  // Mock thread messages
  const [threadMessages, setThreadMessages] = useState<ThreadMessage[]>([
    {
      id: "1",
      author: "Juanito",
      message:
        "Hola, tengo un error cuando ejecuto el código del video 3. Me sale 'Cannot read property of undefined'. ¿Alguien sabe qué puede ser?",
      timestamp: "2024-01-20 10:30",
    },
    {
      id: "2",
      author: "Ana",
      message:
        "Hola @Juanito, ese error suele pasar cuando intentas acceder a una propiedad de un objeto que no existe. ¿Podrías compartir tu código?",
      timestamp: "2024-01-20 11:45",
    },
    {
      id: "3",
      author: "Carlos",
      message:
        "Revisa que hayas inicializado bien las variables antes de usarlas. También verifica la consola del navegador para más detalles.",
      timestamp: "2024-01-20 12:15",
    },
  ])

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.locked) return
    setSelectedLesson(lesson)
  }

  const handleThreadClick = (thread: ForumThread) => {
    setSelectedThread(thread)
    setForumView("thread")
  }

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newThreadData.title.trim() || !newThreadData.description.trim()) return

    const newThread: ForumThread = {
      id: Date.now().toString(),
      title: newThreadData.title,
      author: "Tú",
      timestamp: new Date().toLocaleString(),
      replies: 0,
      lastActivity: "ahora",
    }

    setThreads([newThread, ...threads])
    setNewThreadData({ title: "", description: "" })
    setForumView("threads")
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: ThreadMessage = {
      id: Date.now().toString(),
      author: "Tú",
      message: newMessage,
      timestamp: new Date().toLocaleString(),
    }

    setThreadMessages([...threadMessages, message])
    setNewMessage("")
  }

  const renderForumThreads = () => (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-green-400 font-mono">HILOS</h2>
        <Button
          onClick={() => setForumView("create")}
          className="bg-green-500 hover:bg-green-600 text-black font-mono text-xs px-3 py-1 h-auto"
        >
          <Plus className="w-3 h-3 mr-1" />
          ABRIR HILO
        </Button>
      </div>

      <div className="space-y-3">
        {threads.map((thread) => (
          <div
            key={thread.id}
            onClick={() => handleThreadClick(thread)}
            className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 cursor-pointer hover:bg-slate-800/70 hover:border-green-400/30 transition-all"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-slate-300 font-mono text-sm font-semibold">{thread.title}</h3>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <MessageCircle className="w-3 h-3" />
                <span>{thread.replies}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span>por {thread.author}</span>
              <span>{thread.lastActivity}</span>
            </div>
          </div>
        ))}
      </div>
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
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          VOLVER
        </Button>
      </div>

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
          />
        </div>

        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-black font-mono text-sm px-6 py-2">
          CREAR
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
          >
            <ArrowLeft className="w-3 h-3 mr-1" />
            VOLVER
          </Button>
          <div>
            <h2 className="text-lg font-bold text-green-400 font-mono">{selectedThread?.title}</h2>
            <p className="text-xs text-slate-500 font-mono">
              por {selectedThread?.author} • {selectedThread?.timestamp}
            </p>
          </div>
        </div>
      </div>

      {/* Thread Messages */}
      <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
        {threadMessages.map((message) => (
          <div key={message.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-sm font-semibold text-cyan-400">{message.author}</span>
                  <span className="font-mono text-xs text-slate-500">{message.timestamp}</span>
                </div>
                <p className="font-mono text-sm text-slate-300 leading-relaxed">{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Form */}
      <div className="border-t border-slate-700 pt-4">
        <p className="text-slate-400 font-mono text-sm mb-3">
          Este es un chat en el cual cualquier usuario puede ingresar o responder sobre el tema del hilo
        </p>
        <form onSubmit={handleSendMessage} className="space-y-3">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu respuesta..."
            className="bg-slate-800/50 border-slate-700 text-slate-300 placeholder:text-slate-500 font-mono text-sm resize-none"
            rows={3}
          />
          <Button type="submit" className="bg-green-500 hover:bg-green-600 text-black font-mono text-xs px-4 py-2">
            <Send className="w-3 h-3 mr-1" />
            ENVIAR
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
                      className={`flex items-center gap-3 p-3 rounded-lg border border-slate-700 transition-colors ${
                        lesson.locked
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer hover:bg-slate-800/50 hover:border-green-400/30"
                      } ${selectedLesson?.id === lesson.id ? "bg-green-400/10 border-green-400/50" : ""}`}
                    >
                      <div className="flex-shrink-0">
                        {lesson.locked ? (
                          <Lock className="w-4 h-4 text-slate-500" />
                        ) : lesson.completed ? (
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
