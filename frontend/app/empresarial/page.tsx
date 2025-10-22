import { NormalHeader } from "@/components/normal-header"
import { NormalFooter } from "@/components/normal-footer"
import { Code, Users, Zap, Heart, Rocket } from "lucide-react"

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <NormalHeader />

      <section className="bg-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="font-mono font-bold leading-tight text-white text-4xl sm:text-5xl md:text-6xl mb-4">
              Conoce a byte<span className="text-cyan-400">TECH</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-green-500 rounded-md flex items-center justify-center">
                  <Users className="w-6 h-6 text-slate-950" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white font-mono">¿Quiénes somos?</h2>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                <div className="space-y-6 text-slate-300 leading-relaxed text-lg">
                  <p>
                    Somos un equipo de <span className="text-cyan-400 font-mono">desarrolladores</span> y{" "}
                    <span className="text-green-400 font-mono">educadores</span> apasionados por democratizar el acceso
                    a la educación tecnológica de calidad.
                  </p>
                  <p>
                    Creemos que el conocimiento debe ser accesible para todos, sin importar tu ubicación geográfica o
                    situación económica. Por eso creamos byteTECH: una plataforma donde puedes aprender las tecnologías
                    más demandadas del mercado.
                  </p>
                  <p>
                    Nuestro enfoque combina la <span className="text-purple-400 font-mono">teoría sólida</span> con{" "}
                    <span className="text-orange-400 font-mono">proyectos prácticos</span>, preparándote para los
                    desafíos reales del desarrollo de software.
                  </p>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-700 flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-md">
                    <Heart className="w-4 h-4 text-red-400" />
                    <span className="text-sm font-mono text-slate-300">Pasión por enseñar</span>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-4 py-2 rounded-md">
                    <Code className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-mono text-slate-300">Experiencia real</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-cyan-500 rounded-md flex items-center justify-center">
                  <Rocket className="w-6 h-6 text-slate-950" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white font-mono">Nuestra misión</h2>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8">
                <p className="text-slate-300 leading-relaxed text-lg mb-8">
                  Impulsar el crecimiento profesional de cada estudiante mediante formación tecnológica accesible,
                  práctica y actualizada, conectándolos con oportunidades reales en la industria.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-white font-mono font-semibold">Aprendizaje práctico</span>
                    </div>
                    <p className="text-slate-400">
                      Cursos orientados a proyectos reales para construir un portafolio sólido.
                    </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                      <span className="text-white font-mono font-semibold">Acompañamiento humano</span>
                    </div>
                    <p className="text-slate-400">
                      Comunidad y mentores que guían cada paso del proceso de aprendizaje.
                    </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                      <span className="text-white font-mono font-semibold">Contenido actualizado</span>
                    </div>
                    <p className="text-slate-400">
                      Planes de estudio alineados con las tecnologías y prácticas del mercado.
                    </p>
                  </div>
                  <div className="bg-slate-900 border border-slate-700 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                      <span className="text-white font-mono font-semibold">Enfoque en empleabilidad</span>
                    </div>
                    <p className="text-slate-400">Habilidades demandadas y preparación para procesos de selección.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-cyan-500 rounded-md flex items-center justify-center">
                <Rocket className="w-6 h-6 text-slate-950" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-mono">Lo que hacemos</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-cyan-400/50 transition-colors">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-md flex items-center justify-center mb-6">
                  <Code className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-mono">Cursos Especializados</h3>
                <p className="text-slate-400 leading-relaxed">
                  Desarrollamos contenido actualizado en las tecnologías más demandadas: React, Python, Node.js, y más.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-green-400/50 transition-colors">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-md flex items-center justify-center mb-6">
                  <Zap className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-mono">Proyectos Reales</h3>
                <p className="text-slate-400 leading-relaxed">
                  Cada curso incluye proyectos que simulas situaciones reales de desarrollo, preparándote para el
                  mercado laboral.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-purple-400/50 transition-colors">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center mb-6">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 font-mono">Comunidad Activa</h3>
                <p className="text-slate-400 leading-relaxed">
                  Únete a nuestra comunidad de desarrolladores donde puedes hacer preguntas, compartir proyectos y
                  crecer juntos.
                </p>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 sm:p-12">
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center border-r border-slate-700 last:border-r-0">
                  <div className="text-4xl sm:text-5xl font-bold text-cyan-400 font-mono mb-2">100+</div>
                  <div className="text-slate-400 font-mono uppercase text-sm tracking-wider">Estudiantes</div>
                </div>
                <div className="text-center border-r border-slate-700 last:border-r-0">
                  <div className="text-4xl sm:text-5xl font-bold text-purple-400 font-mono mb-2">98%</div>
                  <div className="text-slate-400 font-mono uppercase text-sm tracking-wider">Satisfacción</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl sm:text-5xl font-bold text-orange-400 font-mono mb-2">24/7</div>
                  <div className="text-slate-400 font-mono uppercase text-sm tracking-wider">Soporte</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NormalFooter />
    </div>
  )
}
