"use client"

import { useState } from "react"
import { BookOpen, ChevronDown, ChevronRight, PlayCircle, FileText, Clock, Lock } from "lucide-react"

interface CourseContentPreviewProps {
  courseData: any
}

export function CourseContentPreview({ courseData }: CourseContentPreviewProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set())

  const toggleSection = (sectionIndex: number) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionIndex)) {
      newExpanded.delete(sectionIndex)
    } else {
      newExpanded.add(sectionIndex)
    }
    setExpandedSections(newExpanded)
  }

  const sections = Object.values((courseData as any).content || {})
  const totalLessons = sections.reduce((acc: number, section: any) => acc + (section.lessons || []).length, 0)
  const totalDuration = courseData.hours || "Duración no especificada"

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
      {/* Terminal Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
        <BookOpen className="w-4 h-4 text-cyan-400" />
      </div>

      <div className="max-h-[600px] overflow-y-auto custom-scrollbar p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-cyan-400 font-mono">CONTENIDO DEL CURSO</h3>
          <div className="flex items-center gap-4 text-sm font-mono">
            <div className="flex items-center gap-1 text-slate-400">
              <BookOpen className="w-4 h-4" />
              <span>{sections.length} secciones</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <PlayCircle className="w-4 h-4" />
              <span>{totalLessons} lecciones</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{totalDuration} horas</span>
            </div>
          </div>
        </div>

        {sections.length === 0 ? (
          <div className="text-center py-8">
            <Lock className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 font-mono">Sin contenido disponible aún</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map((section: any, idx: number) => {
              const isExpanded = expandedSections.has(idx)
              const sectionLessons = section.lessons || []
              const sectionDuration = "" // IMPLEMENTAR CÁLCULO DE DURACIÓN DE SECCIÓN

              return (
                <div
                  key={section.id || idx}
                  className="border border-slate-700 rounded-lg overflow-hidden bg-slate-800/30"
                >
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(idx)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-cyan-500/20 border border-cyan-500/30 rounded-lg">
                        <span className="text-cyan-400 font-mono text-sm font-bold">{idx + 1}</span>
                      </div>
                      <div className="text-left">
                        <h4 className="text-slate-200 font-mono font-semibold">
                          {section.title || `Sección ${idx + 1}`}
                        </h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-slate-400 font-mono text-xs">{sectionLessons.length} lecciones</span>
                          <span className="text-slate-400 font-mono text-xs">{sectionDuration}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-slate-500" />
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Section Content */}
                  {isExpanded && (
                    <div className="border-t border-slate-700 bg-slate-900/50">
                      <div className="p-4">
                        <div className="space-y-2">
                          {sectionLessons.map((lesson: any, lidx: number) => {
                            const isVideo = lesson.mime_type?.startsWith("video/") || lesson.type === "video"
                            const duration = lesson.duration || ""

                            return (
                              <div
                                key={lesson.id || `${idx}-${lidx}`}
                                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/40 border border-slate-700/50 hover:border-slate-600/50 transition-colors"
                              >
                                <div className="flex items-center justify-center w-6 h-6 bg-slate-700/50 rounded">
                                  {isVideo ? (
                                    <PlayCircle className="w-4 h-4 text-cyan-400" />
                                  ) : (
                                    <FileText className="w-4 h-4 text-blue-400" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <span className="text-slate-300 font-mono text-sm truncate">
                                      {lesson.title || `Lección ${lidx + 1}`}
                                    </span>
                                    <div className="flex items-center gap-2 ml-2">
                                      <span className="text-slate-500 font-mono text-xs">{duration}</span>
                                      <Lock className="w-3 h-3 text-slate-500" />
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className="text-slate-500 font-mono text-xs">
                                      {isVideo ? "Video" : "Texto"}
                                    </span>
                                    {lesson.time_validator && (
                                      <>
                                        <span className="text-slate-600">•</span>
                                        <span className="text-slate-500 font-mono text-xs">
                                          {lesson.time_validator} min requeridos
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Course Stats Summary */}
        <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700 rounded-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-cyan-400 font-mono font-bold text-lg">{sections.length}</div>
              <div className="text-slate-400 font-mono text-xs">Secciones</div>
            </div>
            <div>
              <div className="text-cyan-400 font-mono font-bold text-lg">{totalLessons}</div>
              <div className="text-slate-400 font-mono text-xs">Lecciones</div>
            </div>
            <div>
              <div className="text-yellow-400 font-mono font-bold text-lg">{totalDuration}</div>
              <div className="text-slate-400 font-mono text-xs">Duración total</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
