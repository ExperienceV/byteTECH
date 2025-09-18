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
import { coursesApi, type CourseData } from "@/lib/api"

export function NormalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { user, isLoggedIn, logout } = useAuth()
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchBoxRef = useRef<HTMLDivElement>(null)
  const mobileSearchBoxRef = useRef<HTMLDivElement>(null)

  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [suggestions, setSuggestions] = useState<CourseData[]>([])
  const [allCourses, setAllCourses] = useState<CourseData[] | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [activeIndex, setActiveIndex] = useState<number>(-1)
  const [isTopSearchOpen, setIsTopSearchOpen] = useState(false)
  const hoverCloseTimer = useRef<number | null>(null)
  const [isClosing, setIsClosing] = useState(false)

  const cancelHoverClose = () => {
    if (hoverCloseTimer.current) {
      clearTimeout(hoverCloseTimer.current)
      hoverCloseTimer.current = null
    }
  }

  const scheduleHoverClose = () => {
    cancelHoverClose()
    hoverCloseTimer.current = window.setTimeout(() => {
      // Start closing animation
      setIsClosing(true)
      // After animation, unmount and reset
      window.setTimeout(() => {
        setIsTopSearchOpen(false)
        setShowSuggestions(false)
        setActiveIndex(-1)
        setIsClosing(false)
      }, 200)
    }, 500)
  }

  // Debug: Log auth state in header
  useEffect(() => {
    console.log("🎯 Header - Estado de auth:", {
      user: user?.name || "null",
      isLoggedIn,
      timestamp: new Date().toLocaleTimeString(),
    })
  }, [user, isLoggedIn])

  // Close dropdown when clicking outside (user menu)
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

  // Close search when clicking outside (always active)
  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      const target = event.target as Node
      if (searchBoxRef.current && !searchBoxRef.current.contains(target)) {
        setShowSuggestions(false)
        setActiveIndex(-1)
        setIsTopSearchOpen(false)
      }
    }
    document.addEventListener("mousedown", handleOutside)
    return () => document.removeEventListener("mousedown", handleOutside)
  }, [])

  // Fetch all courses once (lazy on first focus/type)
  const ensureCoursesLoaded = async () => {
    if (allCourses !== null) return
    try {
      setIsSearching(true)
      const res = await coursesApi.getMtdCourses()
      if (res.ok) {
        setAllCourses(res.data?.mtd_courses || [])
      }
    } finally {
      setIsSearching(false)
    }
  }

  const slugify = (value: string) =>
    (value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

  const updateSuggestions = (query: string) => {
    if (!allCourses) {
      setSuggestions([])
      return
    }
    const q = query.trim().toLowerCase()
    if (!q) {
      setSuggestions([])
      return
    }
    const filtered = allCourses.filter(c =>
      c.name.toLowerCase().includes(q) ||
      (c.sensei_name?.toLowerCase() || "").includes(q)
    ).slice(0, 8)
    setSuggestions(filtered)
  }

  const handleSearchChange = async (value: string) => {
    setSearchQuery(value)
    if (!value.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      setActiveIndex(-1)
      return
    }
    await ensureCoursesLoaded()
    updateSuggestions(value)
    setShowSuggestions(true)
  }

  const navigateToCourseByName = (name: string) => {
    const slug = slugify(name)
    router.push(`/cursos/${slug}`)
    setShowSuggestions(false)
    setActiveIndex(-1)
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (!showSuggestions || suggestions.length === 0) return
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex(prev => (prev + 1) % suggestions.length)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex(prev => (prev - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === "Enter") {
      e.preventDefault()
      const selected = activeIndex >= 0 ? suggestions[activeIndex] : suggestions[0]
      if (selected) {
        navigateToCourseByName(selected.name)
      } else if (searchQuery.trim()) {
        navigateToCourseByName(searchQuery.trim())
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
      setActiveIndex(-1)
    }
  }

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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <nav className="grid grid-cols-12 items-center gap-3">
          <Link href="/" className="flex items-center space-x-2 group col-span-4 sm:col-span-3 lg:col-span-2">
            <div className="relative">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center transform group-hover:rotate-3 transition-transform p-1">
                <Image
                  src="/act.ico"
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

          {/* Center: buttons remain clickable; search expands left over them on hover */}
          <div className="relative hidden lg:flex items-center justify-center gap-3 col-span-6 lg:col-span-8">
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
              {/* Hover search trigger area */}
              <div
                className="relative"
                onMouseEnter={() => { cancelHoverClose(); setIsTopSearchOpen(true); if (!allCourses) ensureCoursesLoaded(); }}
                onMouseLeave={scheduleHoverClose}
              >
                {!isTopSearchOpen ? (
                  <div className="px-2 py-2 text-slate-400/70 cursor-pointer"><Search className="w-4 h-4" /></div>
                ) : (
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 w-[28rem] max-w-[50vw] z-[80] ${isClosing ? 'animate-out fade-out slide-out-to-top-1 duration-200' : 'animate-in fade-in slide-in-from-top-1 duration-200'}`}
                       onMouseEnter={cancelHoverClose}
                       onMouseLeave={scheduleHoverClose}
                  >
                    <div className="relative w-full" ref={searchBoxRef}>
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4"/>
                      <Input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        onFocus={() => {
                          ensureCoursesLoaded()
                          if (searchQuery.trim()) setShowSuggestions(true)
                        }}
                        onKeyDown={(e) => {
                          handleKeyDown(e)
                          if (e.key === 'Escape') { setIsTopSearchOpen(false); setShowSuggestions(false) }
                        }}
                        placeholder="Buscar cursos..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border-slate-700 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400 font-raleway animate-in fade-in slide-in-from-top-1 duration-200"
                      />
                      {showSuggestions && (
                        <div className="absolute mt-1 w-full bg-slate-900/95 backdrop-blur-sm border border-slate-800 rounded-lg shadow-xl z-[70] overflow-hidden">
                          {isSearching && (
                            <div className="px-3 py-2 text-xs text-slate-400 font-raleway">Cargando cursos...</div>
                          )}
                          {!isSearching && suggestions.length === 0 && (
                            <div className="px-3 py-2 text-xs text-slate-400 font-raleway">No hay resultados</div>
                          )}
                          {!isSearching && suggestions.map((s, idx) => (
                            <button
                              key={s.id}
                              onMouseDown={(e) => { e.preventDefault(); navigateToCourseByName(s.name); }}
                              className={`w-full text-left px-3 py-2 font-raleway text-sm ${idx === activeIndex ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/70'}`}
                            >
                              <div className="flex flex-col">
                                <span className="text-white">{s.name}</span>
                                {s.sensei_name && (
                                  <span className="text-xs text-slate-400">por {s.sensei_name}</span>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: user actions */}
          <div className="hidden sm:flex items-center space-x-3 justify-end col-span-8 sm:col-span-6 lg:col-span-2">
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
                      <div className="text-slate-400 font-raleway text-xs">{user.is_sensei ? 'teacher' : 'student'}</div>
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
                          href="/credenciales"
                          onClick={() => setShowUserMenu(false)}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors font-raleway text-sm"
                        >
                          <UserIcon className="w-4 h-4" />
                          <span>Credenciales</span>
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
            className="sm:hidden justify-self-end p-2 text-slate-400 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-slate-800">
            <div className="mt-4 mb-4">
              <div className="relative" ref={mobileSearchBoxRef}>
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => {
                    ensureCoursesLoaded()
                    if (searchQuery.trim()) setShowSuggestions(true)
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar cursos..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-900/80 border-slate-700 text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-cyan-400 font-raleway"
                />
                {showSuggestions && (
                  <div className="absolute mt-1 w-full bg-slate-900/95 backdrop-blur-sm border border-slate-800 rounded-lg shadow-xl z-50 overflow-hidden">
                    {isSearching && (
                      <div className="px-3 py-2 text-xs text-slate-400 font-raleway">Cargando cursos...</div>
                    )}
                    {!isSearching && suggestions.length === 0 && (
                      <div className="px-3 py-2 text-xs text-slate-400 font-raleway">No hay resultados</div>
                    )}
                    {!isSearching && suggestions.map((s, idx) => (
                      <button
                        key={s.id}
                        onMouseDown={(e) => { e.preventDefault(); setIsMenuOpen(false); navigateToCourseByName(s.name) }}
                        className={`w-full text-left px-3 py-2 font-raleway text-sm ${idx === activeIndex ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-800/70'}`}
                      >
                        <div className="flex flex-col">
                          <span className="text-white">{s.name}</span>
                          {s.sensei_name && (
                            <span className="text-xs text-slate-400">por {s.sensei_name}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
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
                          {getRoleBadge(user.is_sensei ? 'teacher' : 'student')}
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
