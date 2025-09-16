"use client"

import Link from "next/link"
import Image from "next/image"
import { User, Menu, X, LogOut, UserIcon, Home, ChevronDown, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export function NormalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isLoggedIn, logout } = useAuth()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Debug: Log auth state in header
  useEffect(() => {
    console.log("🎯 Header - Estado de auth:", {
      user: user?.name || "null",
      isLoggedIn,
      timestamp: new Date().toLocaleTimeString(),
    })
  }, [user, isLoggedIn])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showUserMenu])

  const handleLogout = () => {
    console.log("🚪 Logout iniciado desde header")
    logout()
    setShowUserMenu(false)
    router.push("/")
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "student":
        return (
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-raleway text-xs">ESTUDIANTE</Badge>
        )
      case "teacher":
        return (
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-raleway text-xs">PROFESOR</Badge>
        )
      default:
        return null
    }
  }

  return (
    <header className="bg-slate-950/90 backdrop-blur-sm border-b border-slate-800 sticky top-0 z-50">
      <div className="bg-slate-900/50 border-b border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="hidden lg:flex items-center justify-center space-x-1">
            <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-1 flex items-center space-x-1 border border-slate-800">
              {isLoggedIn && (
                <Link
                  href="/perfil"
                  className="px-3 xl:px-4 py-2 text-sm font-raleway text-slate-400 hover:text-green-400 rounded-md hover:bg-green-400/10 transition-all"
                >
                  PERFIL
                </Link>
              )}
              <Link
                href="/cursos"
                className="px-3 xl:px-4 py-2 text-sm font-raleway text-slate-400 hover:text-orange-400 rounded-md hover:bg-orange-400/10 transition-all"
              >
                CURSOS
              </Link>
              <Link
                href="/empresarial"
                className="px-3 xl:px-4 py-2 text-sm font-raleway text-slate-400 hover:text-orange-400 rounded-md hover:bg-orange-400/10 transition-all"
              >
                EMPRESARIAL
              </Link>
              <Link
                href="/soporte"
                className="px-3 xl:px-4 py-2 text-sm font-raleway text-slate-400 hover:text-orange-400 rounded-md hover:bg-orange-400/10 transition-all"
              >
                SOPORTE
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <nav className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:rotate-3 transition-transform p-1">
                <Image
                  src="/favicon.ico"
                  alt="byteTECH Logo"
                  width={24}
                  height={24}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-white tracking-tight font-raleway">
                byte<span className="text-cyan-400">TECH</span>
              </span>
            </div>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar cursos..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border-slate-700 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400 font-raleway"
              />
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-3">
            {isLoggedIn && user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-full px-3 py-1">
                  <span className="text-green-400 text-sm font-raleway font-semibold">ONLINE</span>
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                </div>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-lg px-3 py-2 hover:border-cyan-400/50 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-raleway text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left hidden md:block">
                      <div className="text-white font-raleway text-sm">{user.name}</div>
                      <div className="text-slate-400 font-raleway text-xs">{user.role}</div>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${showUserMenu ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* User Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900/95 backdrop-blur-sm border border-slate-800 rounded-xl shadow-2xl z-[60] animate-in slide-in-from-top-2 duration-200">
                      <div className="p-2">
                        <Link
                          href="/perfil"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors font-raleway text-sm"
                        >
                          <UserIcon className="w-4 h-4" />
                          <span>Perfil</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-raleway text-sm"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Cerrar Sesión</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Link href="/auth/ingresar">
                <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-3 sm:px-4 py-2 rounded-lg text-sm font-raleway">
                  <User className="h-4 w-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Acceder</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-800">
            <div className="mt-4 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar cursos..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border-slate-700 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400 font-raleway"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              {isLoggedIn && (
                <Link
                  href="/perfil"
                  className="px-4 py-3 text-sm font-raleway text-slate-400 hover:text-green-400 hover:bg-green-400/10 rounded-md transition-all flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  ./perfil
                </Link>
              )}
              <Link
                href="/cursos"
                className="px-4 py-3 text-sm font-raleway text-slate-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-md transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                ./cursos
              </Link>
              <Link
                href="/empresarial"
                className="px-4 py-3 text-sm font-raleway text-slate-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-md transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                ./empresarial
              </Link>
              <Link
                href="/soporte"
                className="px-4 py-3 text-sm font-raleway text-slate-400 hover:text-orange-400 hover:bg-orange-400/10 rounded-md transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                ./soporte
              </Link>

              <div className="pt-2 border-t border-slate-800 mt-2">
                {isLoggedIn && user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-raleway font-bold">{user.name.charAt(0).toUpperCase()}</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-raleway font-semibold text-sm">{user.name}</div>
                        <div className="flex items-center space-x-2">
                          {getRoleBadge(user.role)}
                          <div className="flex items-center gap-1">
                            <span className="text-green-400 text-xs font-raleway">ONLINE</span>
                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/perfil"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors font-raleway text-sm"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>Perfil</span>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full flex items-center space-x-2 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-raleway text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                ) : (
                  <Link href="/auth/ingresar" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-4 py-3 rounded-lg font-raleway">
                      <User className="h-4 w-4 mr-2" />
                      Acceder
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
