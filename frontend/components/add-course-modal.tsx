"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@//components/ui/dialog"
import { Button } from "@//components/ui/button"
import { Input } from "@//components/ui/input"
import { Textarea } from "@//components/ui/textarea"
import { Upload, X, Plus } from "lucide-react"

interface AddCourseModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (courseData: any) => void
}

export function AddCourseModal({ isOpen, onClose, onSubmit }: AddCourseModalProps) {
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    duration: "",
    difficulty: "Beginner",
    language: "JavaScript",
    tags: [] as string[],
    image: null as File | null,
  })

  const [newTag, setNewTag] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCourseData({ ...courseData, image: file })
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !courseData.tags.includes(newTag.trim())) {
      setCourseData({
        ...courseData,
        tags: [...courseData.tags, newTag.trim()],
      })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setCourseData({
      ...courseData,
      tags: courseData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(courseData)
    // Reset form
    setCourseData({
      title: "",
      description: "",
      price: "",
      duration: "",
      difficulty: "Beginner",
      language: "JavaScript",
      tags: [],
      image: null,
    })
    setImagePreview(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-mono text-xl text-green-400">{">"} Crear Nuevo Curso</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-slate-300">Imagen del Curso</label>
            <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center hover:border-slate-600 transition-colors">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null)
                      setCourseData({ ...courseData, image: null })
                    }}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                  <p className="text-slate-500 font-mono text-sm mb-2">Subir imagen</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="bg-green-500 hover:bg-green-600 text-black font-mono px-4 py-2 rounded-lg cursor-pointer inline-block"
                  >
                    SUBIR
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-slate-300">Título del Curso</label>
            <Input
              value={courseData.title}
              onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
              placeholder="Ej: React Fundamentals"
              className="bg-slate-800 border-slate-700 text-white font-mono"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-slate-300">Descripción</label>
            <Textarea
              value={courseData.description}
              onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
              placeholder="Describe tu curso..."
              className="bg-slate-800 border-slate-700 text-white font-mono min-h-[100px]"
              required
            />
          </div>

          {/* Price and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-mono text-slate-300">Precio ($)</label>
              <Input
                type="number"
                value={courseData.price}
                onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                placeholder="299"
                className="bg-slate-800 border-slate-700 text-white font-mono"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-mono text-slate-300">Duración</label>
              <Input
                value={courseData.duration}
                onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                placeholder="12 weeks"
                className="bg-slate-800 border-slate-700 text-white font-mono"
                required
              />
            </div>
          </div>

          {/* Difficulty and Language */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-mono text-slate-300">Dificultad</label>
              <select
                value={courseData.difficulty}
                onChange={(e) => setCourseData({ ...courseData, difficulty: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white font-mono px-3 py-2 rounded-md"
              >
                <option value="Beginner">Principiante</option>
                <option value="Intermediate">Intermedio</option>
                <option value="Advanced">Avanzado</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-mono text-slate-300">Lenguaje</label>
              <select
                value={courseData.language}
                onChange={(e) => setCourseData({ ...courseData, language: e.target.value })}
                className="w-full bg-slate-800 border border-slate-700 text-white font-mono px-3 py-2 rounded-md"
              >
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="Go">Go</option>
                <option value="Rust">Rust</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-slate-300">Tags</label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Agregar tag..."
                className="bg-slate-800 border-slate-700 text-white font-mono flex-1"
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <Button type="button" onClick={addTag} className="bg-cyan-500 hover:bg-cyan-600 text-black">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {courseData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {courseData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-slate-700 text-cyan-400 px-2 py-1 rounded-md text-sm font-mono flex items-center gap-1"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="text-red-400 hover:text-red-300">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-black font-mono px-6 py-2">
              crear
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
