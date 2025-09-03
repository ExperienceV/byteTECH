import Link from "next/link"

export function HomeFooter() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">{">"}</span>
              </div>
              <span className="font-mono text-white font-bold">
                byte<span className="text-cyan-400">TECH</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm font-mono">Desarrollo de Software & Formación en Programación</p>
          </div>

          <div>
            <h3 className="font-mono text-white font-semibold mb-4">Cursos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cursos" className="text-slate-400 hover:text-cyan-400 font-mono">
                  Ver todos
                </Link>
              </li>
              <li>
                <Link href="/cursos/python" className="text-slate-400 hover:text-cyan-400 font-mono">
                  Python
                </Link>
              </li>
              <li>
                <Link href="/cursos/javascript" className="text-slate-400 hover:text-cyan-400 font-mono">
                  JavaScript
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-white font-semibold mb-4">Soporte</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/soporte" className="text-slate-400 hover:text-cyan-400 font-mono">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-slate-400 hover:text-cyan-400 font-mono">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacidad" className="text-slate-400 hover:text-cyan-400 font-mono">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-slate-400 hover:text-cyan-400 font-mono">
                  Términos
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-8 text-center">
          <p className="text-slate-400 text-sm font-mono">© 2024 byteTECH. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
