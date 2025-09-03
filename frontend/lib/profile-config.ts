// ============================================================================
// 👤 CONFIGURACIÓN DEL SISTEMA DE PERFIL - ByteTechEdu
// ============================================================================

// Configuración de validación de campos de perfil
export const PROFILE_VALIDATION = {
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 100,
    PATTERN: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SPECIAL_CHARS: true
  },
  BIO: {
    MAX_LENGTH: 500
  }
} as const;

// Tipos de usuario y roles
export const USER_ROLES = {
  STUDENT: "Estudiante",
  SENSEI: "Sensei",
  ADMIN: "Administrador"
} as const;

export type UserRoleType = typeof USER_ROLES[keyof typeof USER_ROLES];

// Estados de verificación
export const VERIFICATION_STATUS = {
  PENDING: "Pendiente",
  VERIFIED: "Verificado",
  REJECTED: "Rechazado"
} as const;

export type VerificationStatusType = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];

// Configuración de imagen de perfil
export const PROFILE_IMAGE_CONFIG = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ],
  DIMENSIONS: {
    MIN_WIDTH: 200,
    MIN_HEIGHT: 200,
    MAX_WIDTH: 2000,
    MAX_HEIGHT: 2000
  },
  ASPECT_RATIO: {
    MIN: 0.8, // 4:5
    MAX: 1.2  // 6:5
  }
} as const;

// Configuración de privacidad
export const PRIVACY_SETTINGS = {
  PROFILE_VISIBILITY: {
    PUBLIC: "Público",
    FRIENDS: "Amigos",
    PRIVATE: "Privado"
  },
  EMAIL_VISIBILITY: {
    PUBLIC: "Público",
    FRIENDS: "Amigos",
    PRIVATE: "Privado"
  },
  STATS_VISIBILITY: {
    PUBLIC: "Público",
    FRIENDS: "Amigos",
    PRIVATE: "Privado"
  }
} as const;

export type PrivacySettingType = typeof PRIVACY_SETTINGS[keyof typeof PRIVACY_SETTINGS];

// Configuración de notificaciones
export const NOTIFICATION_SETTINGS = {
  EMAIL: {
    COURSE_UPDATES: true,
    ACHIEVEMENTS: true,
    MESSAGES: true,
    NEWSLETTER: false
  },
  PUSH: {
    COURSE_UPDATES: true,
    ACHIEVEMENTS: true,
    MESSAGES: true,
    REMINDERS: true
  },
  IN_APP: {
    COURSE_UPDATES: true,
    ACHIEVEMENTS: true,
    MESSAGES: true,
    PROGRESS: true
  }
} as const;

// Rangos y logros del usuario
export const USER_RANKS = {
  BEGINNER: {
    name: "Principiante",
    min_points: 0,
    icon: "🌱",
    color: "text-green-500"
  },
  INTERMEDIATE: {
    name: "Intermedio",
    min_points: 100,
    icon: "🚀",
    color: "text-blue-500"
  },
  ADVANCED: {
    name: "Avanzado",
    min_points: 500,
    icon: "⭐",
    color: "text-purple-500"
  },
  EXPERT: {
    name: "Experto",
    min_points: 1000,
    icon: "👑",
    color: "text-yellow-500"
  },
  MASTER: {
    name: "Maestro",
    min_points: 2500,
    icon: "🏆",
    color: "text-red-500"
  }
} as const;

export type UserRankType = typeof USER_RANKS[keyof typeof USER_RANKS];

// Logros disponibles
export const ACHIEVEMENTS = {
  FIRST_COURSE: {
    id: "first_course",
    name: "Primer Curso",
    description: "Completaste tu primer curso",
    icon: "🎯",
    points: 10
  },
  COURSE_MASTER: {
    id: "course_master",
    name: "Maestro del Curso",
    description: "Completaste 5 cursos",
    icon: "📚",
    points: 50
  },
  PERFECT_SCORE: {
    id: "perfect_score",
    name: "Puntuación Perfecta",
    description: "Obtuviste 100% en un curso",
    icon: "💯",
    points: 25
  },
  STREAK_7: {
    id: "streak_7",
    name: "Racha de 7 Días",
    description: "Estudiaste 7 días seguidos",
    icon: "🔥",
    points: 15
  },
  STREAK_30: {
    id: "streak_30",
    name: "Racha de 30 Días",
    description: "Estudiaste 30 días seguidos",
    icon: "⚡",
    points: 100
  },
  HELPING_HAND: {
    id: "helping_hand",
    name: "Mano Ayudadora",
    description: "Ayudaste a 10 estudiantes",
    icon: "🤝",
    points: 30
  },
  EARLY_BIRD: {
    id: "early_bird",
    name: "Madrugador",
    description: "Estudiaste antes de las 8 AM",
    icon: "🌅",
    points: 5
  },
  NIGHT_OWL: {
    id: "night_owl",
    name: "Búho Nocturno",
    description: "Estudiaste después de las 10 PM",
    icon: "🦉",
    points: 5
  }
} as const;

export type AchievementType = typeof ACHIEVEMENTS[keyof typeof ACHIEVEMENTS];

// Configuración de seguridad
export const SECURITY_SETTINGS = {
  TWO_FACTOR_AUTH: {
    ENABLED: false,
    METHODS: ["SMS", "EMAIL", "AUTH_APP"]
  },
  SESSION_TIMEOUT: {
    DEFAULT: 24 * 60 * 60, // 24 horas en segundos
    EXTENDED: 7 * 24 * 60 * 60 // 7 días en segundos
  },
  PASSWORD_HISTORY: {
    MIN_CHANGES: 3,
    PREVENT_REUSE: true
  },
  LOGIN_ATTEMPTS: {
    MAX_ATTEMPTS: 5,
    LOCKOUT_DURATION: 15 * 60 // 15 minutos en segundos
  }
} as const;

// Configuración de exportación de datos
export const DATA_EXPORT_CONFIG = {
  FORMATS: ["JSON", "CSV", "PDF"],
  INCLUDE_DATA: {
    PROFILE: true,
    COURSES: true,
    PROGRESS: true,
    ACHIEVEMENTS: true,
    MESSAGES: false
  },
  MAX_SIZE: 50 * 1024 * 1024 // 50MB
} as const;

// Configuración por defecto
export const DEFAULT_PROFILE_CONFIG = {
  PRIVACY: {
    PROFILE_VISIBILITY: "PUBLIC" as keyof typeof PRIVACY_SETTINGS.PROFILE_VISIBILITY,
    EMAIL_VISIBILITY: "PRIVATE" as keyof typeof PRIVACY_SETTINGS.EMAIL_VISIBILITY,
    STATS_VISIBILITY: "PUBLIC" as keyof typeof PRIVACY_SETTINGS.STATS_VISIBILITY
  },
  NOTIFICATIONS: {
    EMAIL: true,
    PUSH: true,
    IN_APP: true
  },
  SECURITY: {
    TWO_FACTOR_AUTH: false,
    SESSION_TIMEOUT: "DEFAULT"
  }
} as const;

export default {
  PROFILE_VALIDATION,
  USER_ROLES,
  VERIFICATION_STATUS,
  PROFILE_IMAGE_CONFIG,
  PRIVACY_SETTINGS,
  NOTIFICATION_SETTINGS,
  USER_RANKS,
  ACHIEVEMENTS,
  SECURITY_SETTINGS,
  DATA_EXPORT_CONFIG,
  DEFAULT_PROFILE_CONFIG
};
