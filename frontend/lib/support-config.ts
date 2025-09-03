// ============================================================================
// 🆘 CONFIGURACIÓN DEL SISTEMA DE SOPORTE - ByteTechEdu
// ============================================================================

// Tipos de problemas de soporte disponibles
export const SUPPORT_ISSUES = {
  TECHNICAL: "Problema Técnico",
  ACCOUNT: "Problema de Cuenta",
  COURSE: "Problema con Curso",
  PAYMENT: "Problema de Pago",
  FEATURE: "Solicitud de Función",
  BUG: "Reporte de Bug",
  OTHER: "Otro"
} as const;

export type SupportIssueType = typeof SUPPORT_ISSUES[keyof typeof SUPPORT_ISSUES];

// Prioridades de soporte
export const SUPPORT_PRIORITIES = {
  LOW: "Baja",
  MEDIUM: "Media", 
  HIGH: "Alta",
  URGENT: "Urgente"
} as const;

export type SupportPriorityType = typeof SUPPORT_PRIORITIES[keyof typeof SUPPORT_PRIORITIES];

// Categorías de soporte
export const SUPPORT_CATEGORIES = {
  GENERAL: "General",
  TECHNICAL: "Técnico",
  BILLING: "Facturación",
  FEATURE_REQUEST: "Solicitud de Función",
  BUG_REPORT: "Reporte de Bug"
} as const;

export type SupportCategoryType = typeof SUPPORT_CATEGORIES[keyof typeof SUPPORT_CATEGORIES];

// Configuración de respuesta automática
export const AUTO_RESPONSE_CONFIG = {
  ENABLED: true,
  RESPONSE_TIME: "24 horas",
  BUSINESS_HOURS: {
    START: "9:00 AM",
    END: "6:00 PM",
    TIMEZONE: "UTC-5"
  }
} as const;

// Mensajes predefinidos para respuestas rápidas
export const QUICK_RESPONSES = {
  ACCOUNT_ISSUE: "Hemos recibido tu consulta sobre tu cuenta. Nuestro equipo te responderá en las próximas 24 horas.",
  TECHNICAL_ISSUE: "Hemos registrado tu problema técnico. Nuestros ingenieros lo revisarán y te contactaremos pronto.",
  PAYMENT_ISSUE: "Hemos recibido tu consulta sobre pagos. El equipo de facturación te responderá en las próximas 24 horas.",
  FEATURE_REQUEST: "Gracias por tu sugerencia. La hemos registrado y la evaluaremos para futuras actualizaciones.",
  BUG_REPORT: "Hemos registrado el bug que reportaste. Nuestros desarrolladores lo investigarán.",
  GENERAL: "Hemos recibido tu mensaje. Te responderemos lo antes posible."
} as const;

// Configuración de validación de formularios
export const FORM_VALIDATION = {
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_MESSAGE_LENGTH: 10,
  MAX_MESSAGE_LENGTH: 1000,
  MIN_ISSUE_LENGTH: 5,
  MAX_ISSUE_LENGTH: 200
} as const;

// Estados del ticket de soporte
export const TICKET_STATUS = {
  OPEN: "Abierto",
  IN_PROGRESS: "En Progreso",
  WAITING_CUSTOMER: "Esperando Cliente",
  RESOLVED: "Resuelto",
  CLOSED: "Cerrado"
} as const;

export type TicketStatusType = typeof TICKET_STATUS[keyof typeof TICKET_STATUS];

// Configuración de notificaciones
export const NOTIFICATION_CONFIG = {
  EMAIL: true,
  IN_APP: true,
  PUSH: false,
  SMS: false
} as const;

// Configuración de archivos adjuntos
export const ATTACHMENT_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  MAX_FILES: 5
} as const;

// Configuración de SLA (Service Level Agreement)
export const SLA_CONFIG = {
  RESPONSE_TIME: {
    URGENT: "2 horas",
    HIGH: "4 horas", 
    MEDIUM: "24 horas",
    LOW: "48 horas"
  },
  RESOLUTION_TIME: {
    URGENT: "24 horas",
    HIGH: "72 horas",
    MEDIUM: "1 semana",
    LOW: "2 semanas"
  }
} as const;

// Configuración de idiomas soportados
export const SUPPORTED_LANGUAGES = {
  ES: "Español",
  EN: "English",
  PT: "Português"
} as const;

export type SupportedLanguageType = typeof SUPPORTED_LANGUAGES[keyof typeof SUPPORTED_LANGUAGES];

// Configuración por defecto
export const DEFAULT_CONFIG = {
  LANGUAGE: "ES" as SupportedLanguageType,
  PRIORITY: "MEDIUM" as SupportPriorityType,
  CATEGORY: "GENERAL" as SupportCategoryType,
  AUTO_ASSIGN: true,
  NOTIFICATIONS: true
} as const;

export default {
  SUPPORT_ISSUES,
  SUPPORT_PRIORITIES,
  SUPPORT_CATEGORIES,
  AUTO_RESPONSE_CONFIG,
  QUICK_RESPONSES,
  FORM_VALIDATION,
  TICKET_STATUS,
  NOTIFICATION_CONFIG,
  ATTACHMENT_CONFIG,
  SLA_CONFIG,
  SUPPORTED_LANGUAGES,
  DEFAULT_CONFIG
};
