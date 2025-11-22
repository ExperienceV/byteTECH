"use client"

import React from 'react'
import { 
  Code2, 
  Database, 
  Globe, 
  Smartphone, 
  Cloud, 
  GitBranch,
  Terminal,
  Cpu,
  Shield,
  Layers,
  Server,
  Zap,
  Monitor,
  Wifi,
  HardDrive,
  Lock,
  Settings,
  FileCode,
  Box,
  Braces,
  Binary,
  Workflow,
  Activity,
  Gauge
} from 'lucide-react'

interface TechIcon {
  name: string
  icon: React.ReactNode
  color: string
}

const technologies: TechIcon[] = [
  { name: 'JavaScript', icon: <Code2 className="w-12 h-12" />, color: 'text-yellow-400' },
  { name: 'Python', icon: <Terminal className="w-12 h-12" />, color: 'text-green-400' },
  { name: 'React', icon: <Globe className="w-12 h-12" />, color: 'text-cyan-400' },
  { name: 'Node.js', icon: <Cpu className="w-12 h-12" />, color: 'text-green-500' },
  { name: 'Database', icon: <Database className="w-12 h-12" />, color: 'text-blue-400' },
  { name: 'Mobile', icon: <Smartphone className="w-12 h-12" />, color: 'text-purple-400' },
  { name: 'Cloud', icon: <Cloud className="w-12 h-12" />, color: 'text-sky-400' },
  { name: 'Git', icon: <GitBranch className="w-12 h-12" />, color: 'text-orange-400' },
  { name: 'Security', icon: <Shield className="w-12 h-12" />, color: 'text-red-400' },
  { name: 'DevOps', icon: <Layers className="w-12 h-12" />, color: 'text-indigo-400' },
  { name: 'Docker', icon: <Box className="w-12 h-12" />, color: 'text-blue-500' },
  { name: 'API', icon: <Server className="w-12 h-12" />, color: 'text-gray-400' },
  { name: 'MongoDB', icon: <HardDrive className="w-12 h-12" />, color: 'text-green-600' },
  { name: 'TypeScript', icon: <FileCode className="w-12 h-12" />, color: 'text-blue-600' },
  { name: 'Vue.js', icon: <Zap className="w-12 h-12" />, color: 'text-green-500' },
  { name: 'Angular', icon: <Settings className="w-12 h-12" />, color: 'text-red-500' },
  { name: 'GraphQL', icon: <Braces className="w-12 h-12" />, color: 'text-pink-400' },
  { name: 'Kubernetes', icon: <Workflow className="w-12 h-12" />, color: 'text-blue-700' },
  { name: 'AWS', icon: <Wifi className="w-12 h-12" />, color: 'text-orange-500' },
  { name: 'Machine Learning', icon: <Binary className="w-12 h-12" />, color: 'text-purple-500' },
  { name: 'Monitoring', icon: <Activity className="w-12 h-12" />, color: 'text-yellow-500' },
  { name: 'Performance', icon: <Gauge className="w-12 h-12" />, color: 'text-cyan-500' },
  { name: 'Cybersecurity', icon: <Lock className="w-12 h-12" />, color: 'text-red-600' },
  { name: 'Frontend', icon: <Monitor className="w-12 h-12" />, color: 'text-teal-400' }
]

export const TechnologyCarousel: React.FC = () => {
  // Duplicamos las tecnologías para crear un loop infinito
  const duplicatedTechnologies = [...technologies, ...technologies]

  return (
    <div className="relative overflow-hidden bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-8">

      {/* Scrolling Banner Container */}
      <div className="relative overflow-hidden h-32">
        <div className="flex animate-scroll-left space-x-8 items-center h-full">
          {duplicatedTechnologies.map((tech, index) => (
            <div
              key={`${tech.name}-${index}`}
              className="flex flex-col items-center space-y-3 flex-shrink-0 min-w-[120px]"
            >
              <div className={`${tech.color} transition-colors duration-300 hover:scale-110`}>
                {tech.icon}
              </div>
              <span className="text-white font-mono text-xs font-semibold whitespace-nowrap">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-4 right-4 w-1 h-1 bg-cyan-400 rounded-full animate-pulse" />
        <div className="absolute bottom-6 left-6 w-1 h-1 bg-green-400 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-4 w-1 h-1 bg-purple-400 rounded-full animate-pulse delay-500" />
      </div>

      {/* Gradient overlays para smooth edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-900/50 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-900/50 to-transparent pointer-events-none z-10" />
    </div>
  )
}

export default TechnologyCarousel
