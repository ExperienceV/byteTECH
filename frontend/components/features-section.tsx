"use client"

import React from 'react'
import { 
  BookOpen, 
  Users, 
  Award, 
  Clock, 
  Target, 
  Zap,
  CheckCircle,
  Star
} from 'lucide-react'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  color: string
}

const features: Feature[] = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Cursos Especializados",
    description: "Contenido curado por expertos de la industria con proyectos reales",
    color: "text-blue-400"
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Aprende a tu Ritmo",
    description: "Acceso 24/7 para que estudies cuando mejor te convenga",
    color: "text-purple-400"
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Actualizaciones Constantes",
    description: "Contenido siempre actualizado con las últimas tecnologías",
    color: "text-orange-400"
  }
]

export const FeaturesSection: React.FC = () => {
  return (
    <section className="bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
              <Star className="h-5 w-5 text-black" />
            </span>
            <h2 className="font-mono text-3xl lg:text-4xl font-bold text-white">
              ¿Por qué elegir byteTECH?
            </h2>
          </div>
          <p className="text-slate-400 font-mono text-lg max-w-2xl mx-auto">
            {">"} Descubre las ventajas que nos hacen únicos en el mundo del aprendizaje tech
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 hover:transform hover:scale-105"
            >
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className={`${feature.color} mb-4 transition-transform duration-300 group-hover:scale-110`}>
                  {feature.icon}
                </div>
                
                <h3 className="text-white font-mono font-semibold text-lg mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-slate-400 font-mono text-sm leading-relaxed">
                  {feature.description}
                </p>

                {/* Check mark indicator */}
                <div className="flex items-center mt-4 text-green-400">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="font-mono text-xs">Incluido</span>
                </div>
              </div>

              {/* Hover effect particles */}
              <div className="absolute top-2 right-2 w-1 h-1 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
              <div className="absolute bottom-2 left-2 w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse delay-200" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-block bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <p className="text-slate-300 font-mono mb-4">
              {">"} ¿Listo para transformar tu carrera en tech?
            </p>
            <div className="flex items-center justify-center gap-2 text-green-400 font-mono text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>Más de 1000+ estudiantes ya confían en nosotros</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
