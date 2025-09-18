"use client"

import React, { useState, useEffect } from 'react'
import { CheckCircle, Star, Trophy } from 'lucide-react'

interface LessonCompletionNotificationProps {
  show: boolean
  lessonTitle?: string
  onComplete?: () => void
}

export const LessonCompletionNotification: React.FC<LessonCompletionNotificationProps> = ({
  show,
  lessonTitle = "Lección",
  onComplete
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      setIsAnimating(true)
      
      // Auto-hide after 4 seconds
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(() => {
          setIsVisible(false)
          onComplete?.()
        }, 300) // Wait for exit animation
      }, 4000)

      return () => clearTimeout(timer)
    }
  }, [show, onComplete])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 pointer-events-none">
      <div
        className={`
          bg-gradient-to-r from-green-500 to-emerald-500 
          text-white rounded-xl shadow-2xl border border-green-400/30
          p-4 min-w-[320px] max-w-[400px]
          transform transition-all duration-300 ease-out
          ${isAnimating 
            ? 'translate-x-0 opacity-100 scale-100' 
            : 'translate-x-full opacity-0 scale-95'
          }
        `}
      >
        {/* Success Animation Container */}
        <div className="flex items-center gap-3">
          {/* Animated Check Icon */}
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <CheckCircle 
                className={`w-8 h-8 text-white transition-all duration-500 ${
                  isAnimating ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
                }`} 
              />
            </div>
            {/* Pulse animation */}
            <div className={`absolute inset-0 bg-white/30 rounded-full animate-ping ${isAnimating ? 'opacity-75' : 'opacity-0'}`} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-mono font-bold text-lg">¡Lección Completa!</h3>
              <Star className="w-4 h-4 text-yellow-300 animate-pulse" />
            </div>
            <p className="text-green-100 font-mono text-sm">
              {lessonTitle}
            </p>
            <p className="text-green-200/80 font-mono text-xs mt-1">
              ¡Sigue así! 🚀
            </p>
          </div>

          {/* Trophy Icon */}
          <div className="ml-2">
            <Trophy className={`w-6 h-6 text-yellow-300 transition-all duration-700 ${
              isAnimating ? 'scale-100 rotate-12' : 'scale-0 rotate-0'
            }`} />
          </div>
        </div>

        {/* Progress Bar Animation */}
        <div className="mt-3 h-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-white/60 rounded-full transition-all duration-4000 ease-out ${
              isAnimating ? 'w-full' : 'w-0'
            }`}
          />
        </div>

        {/* Floating Particles Effect */}
        {isAnimating && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full animate-bounce"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + (i % 2) * 20}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default LessonCompletionNotification
