"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@//components/ui/button"
import { Textarea } from "@//components/ui/textarea"
import { MessageCircle, Plus, Send, User } from "lucide-react"

interface ForumMessage {
  id: string
  author: string
  message: string
  timestamp: string
  avatar?: string
}

interface CourseForumProps {
  courseSlug: string
}

export function CourseForum({ courseSlug }: CourseForumProps) {
  const [messages, setMessages] = useState<ForumMessage[]>([
    {
      id: "1",
      author: "Juanito",
      message: "Me manda error :'v",
      timestamp: "2024-01-20 10:30",
    },
    {
      id: "2",
      author: "Pepe",
      message: "No compilo tu vaina",
      timestamp: "2024-01-20 11:15",
    },
  ])

  const [showNewThread, setShowNewThread] = useState(false)
  const [newMessage, setNewMessage] = useState("")

  const handleSubmitMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const message: ForumMessage = {
      id: Date.now().toString(),
      author: "Tú",
      message: newMessage,
      timestamp: new Date().toLocaleString(),
    }

    setMessages([...messages, message])
    setNewMessage("")
    setShowNewThread(false)
  }

  return (
    <div className="bg-red-200/20 backdrop-blur-sm border border-red-300/30 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-red-400" />
          <span className="font-mono text-sm text-slate-800 font-semibold">HILOS</span>
        </div>
        <Button
          onClick={() => setShowNewThread(!showNewThread)}
          className="bg-red-400 hover:bg-red-500 text-white font-mono text-xs px-3 py-1 h-auto"
        >
          <Plus className="w-3 h-3 mr-1" />
          ABRIR HILO
        </Button>
      </div>

      {/* Messages */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="bg-blue-200/50 border border-blue-300/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-3 h-3 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-semibold text-blue-700">{message.author}:</span>
                  <span className="font-mono text-xs text-slate-600">{message.timestamp}</span>
                </div>
                <p className="font-mono text-sm text-slate-800">{message.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Thread Form */}
      {showNewThread && (
        <form onSubmit={handleSubmitMessage} className="space-y-3 pt-3 border-t border-red-300/30">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="bg-white/80 border-red-300/50 text-slate-800 placeholder:text-slate-500 font-mono text-sm resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-mono text-xs px-3 py-1 h-auto"
            >
              <Send className="w-3 h-3 mr-1" />
              ENVIAR
            </Button>
            <Button
              type="button"
              onClick={() => setShowNewThread(false)}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50 font-mono text-xs px-3 py-1 h-auto"
            >
              CANCELAR
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}
