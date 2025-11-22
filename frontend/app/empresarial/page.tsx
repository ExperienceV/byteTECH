import { NormalHeader } from "@/components/normal-header"
import { NormalFooter } from "@/components/normal-footer"
import { Code, Users, Zap, Heart, Rocket, Target, Lightbulb, Cog } from "lucide-react"

export default function EmpresarialPage() {
  return (
    <div className="min-h-screen bg-slate-950">
      <NormalHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="font-mono font-bold leading-tight text-white text-5xl sm:text-6xl md:text-7xl mb-4">
              Desarrollo de Software
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent">
                Para Empresas
              </span>
            </h1>
            <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto mt-6 font-sans">
              Soluciones personalizadas, escalables y seguras que transforman tu visión en realidad
            </p>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-mono">Quiénes Somos</h2>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 sm:p-12">
              <p className="text-slate-300 text-lg leading-relaxed mb-6 font-sans">
                byteTECH es una empresa especializada en{" "}
                <span className="font-semibold text-blue-400">desarrollo de software personalizado para empresas</span>.
                Nuestro equipo de expertos crea soluciones escalables, seguras y de alto rendimiento que transforman
                negocios de todas los tamaños.
              </p>
              <p className="text-slate-300 text-lg leading-relaxed font-sans">
                Además del desarrollo empresarial, también ofrecemos{" "}
                <span className="font-semibold text-pink-400">cursos especializados para desarrolladores</span> y
                equipos técnicos. Compartimos nuestro conocimiento para ayudar a profesionales a dominar las últimas
                tecnologías y mejores prácticas del industria.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="bg-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500 rounded-md flex items-center justify-center">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white font-mono">Qué Ofrecemos</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-blue-400/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-md flex items-center justify-center mb-4">
                    <Code className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-mono">Desarrollo Web Personalizado</h3>
                  <p className="text-slate-400">
                    Aplicaciones web modernas, escalables y de alto rendimiento adaptadas a tu modelo de negocio.
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-purple-400/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-md flex items-center justify-center mb-4">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-mono">Aplicaciones Móviles</h3>
                  <p className="text-slate-400">
                    Apps nativas y multiplataforma que llegan a tus usuarios donde quiera que estén.
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-green-400/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-md flex items-center justify-center mb-4">
                    <Cog className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-mono">Sistemas Empresariales</h3>
                  <p className="text-slate-400">
                    Soluciones personalizadas para automatizar procesos y optimizar tu operación diaria.
                  </p>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-orange-400/50 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-md flex items-center justify-center mb-4">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 font-mono">Consultoría Tech</h3>
                  <p className="text-slate-400">
                    Estrategia digital, arquitectura de sistemas y optimización de infraestructura.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose byteTECH */}
      <section className="bg-slate-950 border-b border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-green-500 rounded-md flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-mono">¿Por qué byteTECH?</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-mono font-semibold">Enfoque Personalizado</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Cada proyecto es único. Nos adaptamos a tus necesidades específicas y objetivos de negocio.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-mono font-semibold">Equipo Experto</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Desarrolladores senior con años de experiencia en proyectos de cualquier escala.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-green-400" />
                  <span className="text-white font-mono font-semibold">Entrega Rápida</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Metodologías ágiles que garantizan entregas frecuentes y feedback continuo.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Code className="w-5 h-5 text-cyan-400" />
                  <span className="text-white font-mono font-semibold">Tecnología Moderna</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Stack tech actualizado: React, Node.js, Python, Cloud, y las mejores herramientas.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span className="text-white font-mono font-semibold">Soporte Continuo</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Mantenimiento, actualizaciones y soporte técnico después del lanzamiento.
                </p>
              </div>

              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Rocket className="w-5 h-5 text-orange-400" />
                  <span className="text-white font-mono font-semibold">Escalabilidad</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Sistemas diseñados para crecer contigo, sin limitaciones de rendimiento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NormalFooter />
    </div>
  )
}
