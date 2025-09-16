import { UniqueHeader } from "@//components/unique-header"
import { UniqueFooter } from "@//components/unique-footer"
import { Terminal, Code, Users, Zap, Heart, Coffee, Rocket } from "lucide-react"

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-dynamic-gradient">
      <UniqueHeader />

      {/* Hero Section */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 via-transparent to-cyan-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-4 py-2 mb-8">
              <span className="text-cyan-400 text-sm font-mono">Acerca del equipo</span>
            </div>

            <h1 className="font-mono font-bold leading-tight text-white text-3xl sm:text-4xl md:text-6xl mb-6">
            Conoce a byte<span className="text-cyan-400">TECH</span>
            </h1>

          </div>
        </div>
      </section>

      {/* Transición suave */}
      <div className="section-transition-up"></div>

      {/* ¿Quiénes Somos? Section */}
      <section className="bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/3 via-transparent to-blue-900/3" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Texto */}
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-mono">¿Quiénes somos?</h2>
              </div>

              <div className="space-y-4 text-slate-300 leading-relaxed">
                <p>
                  Somos un equipo de <span className="text-cyan-400 font-mono">desarrolladores</span> y{" "}
                  <span className="text-green-400 font-mono">educadores</span> apasionados por democratizar el acceso a
                  la educación tecnológica de calidad.
                </p>
                <p>
                  Creemos que el conocimiento debe ser accesible para todos, sin importar tu ubicación geográfica o
                  situación económica. Por eso creamos byteTECH: una plataforma donde puedes aprender las tecnologías
                  más demandadas del mercado.
                </p>
                <p>
                  Nuestro enfoque combina la <span className="text-purple-400 font-mono">teoría sólida</span> con{" "}
                  <span className="text-orange-400 font-mono">proyectos prácticos</span>, preparándote para los desafíos
                  reales del desarrollo de software.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm font-mono text-slate-300">Pasión por enseñar</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                  <Code className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm font-mono text-slate-300">Experiencia real</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-2 rounded-lg">
                  <Coffee className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-mono text-slate-300">Mucho café</span>
                </div>
              </div>
            </div>

            {/* Imagen/Terminal */}
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-800/50">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full" />
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                  </div>
                  <span className="text-xs font-mono text-slate-400">~/team/vision.js</span>
                </div>
              </div>

              <div className="p-6 font-mono text-sm space-y-3">
                <div className="text-purple-400">
                  <span className="text-slate-500">const</span> <span className="text-cyan-400">mision</span> ={" "}
                  <span className="text-green-400">{`{`}</span>
                </div>
                <div className="ml-4 text-slate-300">
                  objetivo: <span className="text-yellow-400">"Formar desarrolladores excepcionales"</span>,
                </div>
                <div className="ml-4 text-slate-300">
                  metodo: <span className="text-yellow-400">"Aprendizaje práctico y colaborativo"</span>,
                </div>
                <div className="ml-4 text-slate-300">
                  impacto: <span className="text-yellow-400">"Transformar vidas a través del código"</span>
                </div>
                <div className="text-green-400">{`}`}</div>
                <div className="text-slate-500 mt-4">// Ejecutando misión...</div>
                <div className="text-green-400">✓ Misión iniciada con éxito</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transición suave */}
      <div className="section-transition-down"></div>

      {/* Lo que hacemos Section */}
      <section className="bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/5 via-transparent to-purple-900/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                <Rocket className="w-5 h-5 text-black" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white font-mono text-center">Lo que hacemos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Cursos Especializados */}
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-cyan-400/50 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 font-mono">Cursos Especializados</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Desarrollamos contenido actualizado en las tecnologías más demandadas: React, Python, Node.js, y más.
                </p>
              </div>

              {/* Proyectos Reales */}
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-green-400/50 transition-all">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 font-mono">Proyectos Reales</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Cada curso incluye proyectos que simulas situaciones reales de desarrollo, preparándote para el
                  mercado laboral.
                </p>
              </div>

              {/* Comunidad Activa */}
              <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6 hover:border-purple-400/50 transition-all md:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3 font-mono">Comunidad Activa</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Únete a nuestra comunidad de desarrolladores donde puedes hacer preguntas, compartir proyectos y
                  crecer juntos.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-12 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-xl p-6 sm:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-cyan-400 font-mono">5K+</div>
                  <div className="text-slate-400 text-sm font-mono">Estudiantes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-green-400 font-mono">50+</div>
                  <div className="text-slate-400 text-sm font-mono">Cursos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400 font-mono">98%</div>
                  <div className="text-slate-400 text-sm font-mono">Satisfacción</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-400 font-mono">24/7</div>
                  <div className="text-slate-400 text-sm font-mono">Soporte</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <UniqueFooter />
    </div>
  )
}
