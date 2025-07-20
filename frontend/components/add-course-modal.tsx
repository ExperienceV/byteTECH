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
  isLoading?: boolean
}

export function AddCourseModal({ isOpen, onClose, onSubmit, isLoading = false }: AddCourseModalProps) {
  const [courseData, setCourseData] = useState({
    name: "",
    description: "",
    price: "",
    hours: "",
    miniature: null as File | null,
  })

  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCourseData({ ...courseData, miniature: file })
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!courseData.miniature) {
      alert("Debes seleccionar una imagen para el curso")
      return
    }
    onSubmit(courseData)
    // Reset form
    setCourseData({
      name: "",
      description: "",
      price: "",
      hours: "",
      miniature: null,
    })
    setImagePreview(null)
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
                      setCourseData({ ...courseData, miniature: null })
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
                    required
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

          {/* Name */}
          <div className="space-y-2">
            <label className="text-sm font-mono text-slate-300">Nombre del Curso</label>
            <Input
              value={courseData.name}
              onChange={(e) => setCourseData({ ...courseData, name: e.target.value })}
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

          {/* Price and Hours */}
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
              <label className="text-sm font-mono text-slate-300">Horas</label>
              <Input
                type="number"
                value={courseData.hours}
                onChange={(e) => setCourseData({ ...courseData, hours: e.target.value })}
                placeholder="12"
                className="bg-slate-800 border-slate-700 text-white font-mono"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isLoading || !courseData.miniature}
              className="flex-1 bg-green-500 hover:bg-green-600 text-black font-mono"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  Creando...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Curso
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
      </DialogContent>
    </Dialog>
  )
}
