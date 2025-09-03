// ============================================================================
// 📚 EDITOR SYSTEM CONFIGURATION
// ============================================================================
// Configuración centralizada para el sistema de editor de cursos

// Tipos de archivos soportados
export const SUPPORTED_FILE_TYPES = {
  VIDEO: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
} as const;

// Configuración de validación de archivos
export const FILE_VALIDATION = {
  MAX_SIZE: {
    VIDEO: 500 * 1024 * 1024, // 500MB
    DOCUMENT: 50 * 1024 * 1024, // 50MB
    IMAGE: 10 * 1024 * 1024 // 10MB
  },
  MIN_SIZE: 1024, // 1KB
  ALLOWED_EXTENSIONS: ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.gif', '.webp']
} as const;

// Configuración de validación de formularios
export const FORM_VALIDATION = {
  COURSE: {
    NAME: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 100,
      PATTERN: /^[a-zA-Z0-9\s\-_.,!?()]+$/
    },
    DESCRIPTION: {
      MIN_LENGTH: 10,
      MAX_LENGTH: 1000
    },
    PRICE: {
      MIN: 0,
      MAX: 9999.99
    },
    HOURS: {
      MIN: 0.5,
      MAX: 1000
    }
  },
  SECTION: {
    TITLE: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 100
    }
  },
  LESSON: {
    TITLE: {
      MIN_LENGTH: 3,
      MAX_LENGTH: 200
    }
  }
} as const;

// Estados del editor
export const EDITOR_STATES = {
  LOADING: 'loading',
  READY: 'ready',
  EDITING: 'editing',
  SAVING: 'saving',
  ERROR: 'error',
  UPLOADING: 'uploading'
} as const;

// Tipos de contenido
export const CONTENT_TYPES = {
  VIDEO: 'video',
  DOCUMENT: 'document',
  IMAGE: 'image'
} as const;

// Configuración de caché
export const CACHE_CONFIG = {
  FILE_CACHE_DAYS: 7,
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  CLEANUP_INTERVAL: 24 * 60 * 60 * 1000 // 24 horas
} as const;

// Configuración de UI
export const UI_CONFIG = {
  ANIMATIONS: {
    DURATION: 300,
    EASING: 'ease-in-out'
  },
  MODALS: {
    BACKDROP_BLUR: 'backdrop-blur-sm',
    Z_INDEX: 50
  },
  COLORS: {
    PRIMARY: 'cyan',
    SUCCESS: 'green',
    WARNING: 'yellow',
    ERROR: 'red',
    INFO: 'blue'
  }
} as const;

// Mensajes de error
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'El archivo es demasiado grande',
  INVALID_FILE_TYPE: 'Tipo de archivo no soportado',
  UPLOAD_FAILED: 'Error al subir el archivo',
  NETWORK_ERROR: 'Error de conexión',
  PERMISSION_DENIED: 'No tienes permisos para realizar esta acción',
  COURSE_NOT_FOUND: 'Curso no encontrado',
  SECTION_NOT_FOUND: 'Sección no encontrada',
  LESSON_NOT_FOUND: 'Lección no encontrada',
  INVALID_FORM_DATA: 'Datos del formulario inválidos',
  SAVE_FAILED: 'Error al guardar los cambios',
  DELETE_FAILED: 'Error al eliminar el elemento'
} as const;

// Mensajes de éxito
export const SUCCESS_MESSAGES = {
  COURSE_SAVED: 'Curso guardado exitosamente',
  SECTION_CREATED: 'Sección creada exitosamente',
  SECTION_DELETED: 'Sección eliminada exitosamente',
  LESSON_CREATED: 'Lección creada exitosamente',
  LESSON_DELETED: 'Lección eliminada exitosamente',
  FILE_UPLOADED: 'Archivo subido exitosamente',
  COURSE_GIFTED: 'Curso regalado exitosamente'
} as const;

// Configuración de progreso
export const PROGRESS_CONFIG = {
  STEPS: {
    LOAD_COURSE: 'Cargando curso...',
    VALIDATE_DATA: 'Validando datos...',
    UPLOAD_FILE: 'Subiendo archivo...',
    SAVE_CHANGES: 'Guardando cambios...',
    DELETE_ITEM: 'Eliminando elemento...'
  }
} as const;

// Tipos TypeScript
export type SupportedFileType = typeof SUPPORTED_FILE_TYPES[keyof typeof SUPPORTED_FILE_TYPES][number];
export type EditorState = typeof EDITOR_STATES[keyof typeof EDITOR_STATES];
export type ContentType = typeof CONTENT_TYPES[keyof typeof CONTENT_TYPES];
export type ErrorMessage = typeof ERROR_MESSAGES[keyof typeof ERROR_MESSAGES];
export type SuccessMessage = typeof SUCCESS_MESSAGES[keyof typeof SUCCESS_MESSAGES];
