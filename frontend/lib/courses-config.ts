// ============================================================================
// 📚 COURSES CONFIGURATION - ByteTechEdu
// ============================================================================
// Configuraciones y mensajes para el sistema de cursos

export const MESSAGES = {
  // Títulos y descripciones de página
  PAGE_TITLE: "📚 Catálogo de Cursos",
  PAGE_DESCRIPTION: "Descubre una amplia variedad de cursos de programación, diseño, marketing y más. Aprende de expertos y desarrolla nuevas habilidades.",
  
  // Mensajes de estado
  LOADING_COURSES: "Cargando cursos...",
  NO_COURSES_FOUND: "No se encontraron cursos",
  ERROR_LOADING_COURSES: "Error al cargar los cursos",
  SUCCESS_COURSE_LOADED: "Curso cargado exitosamente",
  
  // Mensajes de progreso
  PROGRESS_UPDATED: "Progreso actualizado",
  LESSON_COMPLETED: "Lección marcada como completada",
  LESSON_UNCOMPLETED: "Lección desmarcada como completada",
  
  // Mensajes de time validator
  TIMER_STARTED: "Timer iniciado",
  TIMER_PAUSED: "Timer pausado",
  TIMER_COMPLETED: "¡Tiempo completado! Lección marcada como completada automáticamente",
  TIMER_ERROR: "Error en el timer",
  
  // Mensajes de filtros
  FILTERS_APPLIED: "Filtros aplicados",
  FILTERS_CLEARED: "Filtros limpiados",
  SEARCH_UPDATED: "Búsqueda actualizada",
  
  // Mensajes de paginación
  PAGE_CHANGED: "Página cambiada",
  PAGE_SIZE_CHANGED: "Tamaño de página cambiado",
  
  // Mensajes de navegación
  NAVIGATING_TO_COURSE: "Navegando al curso...",
  NAVIGATING_TO_EDITOR: "Navegando al editor...",
  NAVIGATING_TO_PURCHASE: "Navegando a la compra...",
  
  // Mensajes de error
  NETWORK_ERROR: "Error de conexión. Verifica tu internet e intenta de nuevo.",
  AUTH_ERROR: "Error de autenticación. Inicia sesión nuevamente.",
  SERVER_ERROR: "Error del servidor. Intenta más tarde.",
  VALIDATION_ERROR: "Error de validación. Verifica los datos ingresados.",
  
  // Mensajes de éxito
  COURSE_PURCHASED: "¡Curso comprado exitosamente!",
  COURSE_SAVED: "Curso guardado exitosamente",
  PROGRESS_SAVED: "Progreso guardado exitosamente",
  
  // Mensajes informativos
  NO_MORE_COURSES: "No hay más cursos para mostrar",
  LOADING_MORE_COURSES: "Cargando más cursos...",
  REFRESHING_COURSES: "Actualizando cursos...",
  
  // Mensajes de confirmación
  CONFIRM_DELETE_COURSE: "¿Estás seguro de que quieres eliminar este curso?",
  CONFIRM_RESET_PROGRESS: "¿Estás seguro de que quieres reiniciar el progreso?",
  CONFIRM_LEAVE_EDITOR: "¿Estás seguro de que quieres salir? Los cambios no guardados se perderán.",
};

export const UI_CONFIG = {
  // Configuraciones de paginación
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [6, 12, 24, 48],
  MAX_PAGE_SIZE: 100,
  
  // Configuraciones de filtros
  DEFAULT_SORT: "newest",
  SORT_OPTIONS: [
    { value: "newest", label: "Más recientes" },
    { value: "oldest", label: "Más antiguos" },
    { value: "name_asc", label: "Nombre A-Z" },
    { value: "name_desc", label: "Nombre Z-A" },
    { value: "price_low", label: "Precio: Menor a Mayor" },
    { value: "price_high", label: "Precio: Mayor a Menor" },
    { value: "rating", label: "Mejor calificados" },
    { value: "popularity", label: "Más populares" },
  ],
  
  // Configuraciones de categorías
  CATEGORIES: [
    { value: "programming", label: "Programación", icon: "💻" },
    { value: "design", label: "Diseño", icon: "🎨" },
    { value: "marketing", label: "Marketing", icon: "📈" },
    { value: "business", label: "Negocios", icon: "💼" },
    { value: "languages", label: "Idiomas", icon: "🌍" },
    { value: "music", label: "Música", icon: "🎵" },
    { value: "photography", label: "Fotografía", icon: "📷" },
    { value: "cooking", label: "Cocina", icon: "👨‍🍳" },
    { value: "fitness", label: "Fitness", icon: "💪" },
    { value: "other", label: "Otros", icon: "📚" },
  ],
  
  // Configuraciones de niveles
  LEVELS: [
    { value: "beginner", label: "Principiante", icon: "🌱" },
    { value: "intermediate", label: "Intermedio", icon: "🌿" },
    { value: "advanced", label: "Avanzado", icon: "🌳" },
    { value: "expert", label: "Experto", icon: "🏆" },
  ],
  
  // Configuraciones de precios
  PRICE_RANGES: [
    { value: "free", label: "Gratis", icon: "🆓" },
    { value: "low", label: "Económico (< $20)", icon: "💰" },
    { value: "medium", label: "Medio ($20 - $50)", icon: "💵" },
    { value: "high", label: "Alto (> $50)", icon: "💎" },
  ],
  
  // Configuraciones de duración
  DURATION_RANGES: [
    { value: "short", label: "Corto (< 2h)", icon: "⏱️" },
    { value: "medium", label: "Medio (2-10h)", icon: "⏰" },
    { value: "long", label: "Largo (> 10h)", icon: "📅" },
  ],
  
  // Configuraciones de time validator
  TIME_VALIDATOR: {
    MIN_TIME: 5, // segundos mínimos
    MAX_TIME: 3600, // segundos máximos (1 hora)
    DEFAULT_TIME: 300, // segundos por defecto (5 minutos)
    UPDATE_INTERVAL: 1000, // milisegundos entre actualizaciones
  },
  
  // Configuraciones de progreso
  PROGRESS: {
    UPDATE_DELAY: 1000, // milisegundos antes de actualizar la UI
    ANIMATION_DURATION: 300, // milisegundos para animaciones
    SUCCESS_DELAY: 2000, // milisegundos para mostrar mensaje de éxito
  },
  
  // Configuraciones de responsive
  BREAKPOINTS: {
    mobile: 640,
    tablet: 768,
    desktop: 1024,
    wide: 1280,
  },
  
  // Configuraciones de animaciones
  ANIMATIONS: {
    fadeIn: "fade-in 0.3s ease-in-out",
    slideUp: "slide-up 0.3s ease-out",
    scaleIn: "scale-in 0.2s ease-out",
    bounce: "bounce 0.6s ease-in-out",
  },
  
  // Configuraciones de colores
  COLORS: {
    primary: "#3B82F6",
    secondary: "#64748B",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#06B6D4",
  },
  
  // Configuraciones de iconos
  ICONS: {
    course: "📚",
    lesson: "📖",
    section: "📑",
    progress: "📊",
    timer: "⏱️",
    complete: "✅",
    pending: "⏳",
    error: "❌",
    success: "🎉",
    info: "ℹ️",
    warning: "⚠️",
  },
};

export const API_ENDPOINTS = {
  // Endpoints de cursos
  COURSES: {
    LIST: "/courses/mtd_courses",
    MY_COURSES: "/courses/my_courses",
    PURCHASED_COURSES: "/courses/purchased_courses",
    COURSE_CONTENT: "/courses/course_content",
    MARK_PROGRESS: "/courses/mark_progress",
    UNMARK_PROGRESS: "/courses/unmark_progress",
    COURSE_PROGRESS: "/courses/course_progress",
    PURCHASE_COURSE: "/courses/purchase_course",
  },
  
  // Endpoints de foros
  FORUMS: {
    CREATE_THREAD: "/forums/create_thread",
    DELETE_THREAD: "/forums/delete_thread",
    GET_THREADS: "/forums/mtd_threads",
    CREATE_MESSAGE: "/forums/create_message",
    GET_MESSAGES: "/forums/mtd_messages",
  },
  
  // Endpoints de estadísticas
  STATS: {
    COURSE_LESSONS: "/stats/lessons_course",
    SYSTEM_STATS: "/stats/stats",
  },
  
  // Endpoints de workbench
  WORKBENCH: {
    NEW_COURSE: "/workbrench/new_course",
    DELETE_COURSE: "/workbrench/delete_course",
    UPDATE_COURSE: "/workbrench/update_course",
    NEW_SECTION: "/workbrench/new_section",
    DELETE_SECTION: "/workbrench/delete_section",
    ADD_LESSON: "/workbrench/add_lesson",
    DELETE_LESSON: "/workbrench/delete_lesson",
    EDIT_METADATA: "/workbrench/edit_metadata",
    GIVE_COURSE: "/workbrench/give_course",
  },
  
  // Endpoints de media
  MEDIA: {
    GET_FILE: "/media/get_file",
  },
};

export const VALIDATION_RULES = {
  // Reglas de validación para formularios
  COURSE: {
    name: {
      minLength: 3,
      maxLength: 100,
      required: true,
    },
    description: {
      minLength: 10,
      maxLength: 1000,
      required: true,
    },
    price: {
      min: 0,
      max: 10000,
      required: true,
    },
    hours: {
      min: 0.1,
      max: 1000,
      required: true,
    },
  },
  
  LESSON: {
    title: {
      minLength: 3,
      maxLength: 200,
      required: true,
    },
    time_validator: {
      min: 5,
      max: 3600,
      required: false,
    },
  },
  
  SECTION: {
    title: {
      minLength: 3,
      maxLength: 200,
      required: true,
    },
  },
};

export default {
  MESSAGES,
  UI_CONFIG,
  API_ENDPOINTS,
  VALIDATION_RULES,
};
