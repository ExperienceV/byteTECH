// ============================================================================
// 🌐 API CLIENT - ByteTechEdu
// ============================================================================
// Funciones para la comunicación cliente-servidor con el backend FastAPI
// Basado en el sistema de autenticación existente

// Configuración de la API
import { API_BASE } from "./config"

// Funciones auxiliares para peticiones API
import { makeGetRequestNoAuth } from "./api-helpers"
export { makeApiRequest, makeGetRequest } from "./api-helpers"

// Tipos TypeScript para las respuestas de la API
export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T;
  message?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_sensei: boolean;
  is_verify?: boolean;
}

export interface AuthResponse {
  message: string;
  user: User;
}

export interface VerificationResponse {
  message: string;
  user: {
    user_id: number;
    user_name: string;
    email: string;
    is_sensei: boolean;
    is_verify: boolean;
  };
}

export interface RestorePasswordResponse {
  message: string;
  token?: string;
}

export interface SupportForm {
  name: string;
  mail: string;
  issue: string;
  message: string;
}

export interface SupportResponse {
  message: string;
  status: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  is_sensei: boolean;
  is_verify: boolean;
  created_at?: string;
  last_login?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  current_password?: string;
  new_password?: string;
}

export interface UpdateProfileResponse {
  message: string;
  user: UserProfile;
}

export interface UserStats {
  total_courses: number;
  completed_courses: number;
  total_lessons: number;
  completed_lessons: number;
  total_hours: number;
  achievements: string[];
  rank: string;
}

// ============================================================================
// 📚 EDITOR SYSTEM INTERFACES
// ============================================================================

export interface Lesson {
  id: number | string;
  section_id: number;
  title: string;
  file_id?: string;
  mime_type?: string;
  time_validator?: number;
  is_completed?: boolean;
  threads?: Thread[];
}

export interface Thread {
  id: number;
  lesson_id: number;
  username?: string;
  topic?: string;   // Backend uses 'topic'
  title?: string;   // UI sometimes expects 'title'
}

export interface Section {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface CourseContent {
  id: number;
  sensei_id: number;
  name: string;
  description: string;
  hours: number;
  miniature_id: string;
  video_id?: string;
  price: number;
  sensei_name: string;
  progress: {
    total_lessons: number;
    completed_lessons: number;
    progress_percentage: number;
  };
  content: {
    [key: string]: {
      id: number;
      title: string;
      lessons: Lesson[];
    };
  };
}

export interface CourseContentResponse {
  is_paid: boolean | null;
  course_content: CourseContent;
}

export interface CreateSectionResponse {
  course_id: number;
  section_id: number;
}

export interface CreateLessonResponse {
  lesson_id: number | string;
  file_id: string;
}

export interface EditMetadataRequest {
  course_id: number;
  name?: string;
  description?: string;
  price?: string;
  hours?: string;
}

export interface EditMetadataResponse {
  detail: string;
  course: {
    id: number;
    name: string;
    description: string;
    price: number;
    duration: number;
  };
}

export interface GiveCourseRequest {
  course_id: number;
  user_email_to_give: string;
}

export interface GiveCourseResponse {
  message: string;
}

// ============================================================================
// 📚 COURSES SYSTEM INTERFACES
// ============================================================================

export interface Course {
  id: number;
  sensei_id: number;
  name: string;
  description: string;
  price: number;
  hours: number;
  miniature_id: string;
  sensei_name: string;
}

export interface CoursesResponse {
  mtd_courses: Course[];
}

export interface PurchaseRequest {
  course_id: number;
  user_email: string;
}

export interface PurchaseResponse {
  message: string;
  purchase_id?: number;
}

// ============================================================================
// 💬 FORUMS SYSTEM INTERFACES
// ============================================================================

export interface CreateThreadRequest {
  lesson_id: number;
  topic: string;
}

export interface ThreadResponse {
  id: number;
  title: string;
}

export interface CreateThreadResponse {
  message: string;
  thread: ThreadResponse;
}

export interface Message {
  id: number;
  thread_id: number;
  user_id: number;
  username: string;
  // Backend returns 'message'; some UI might look for 'content'. Keep both.
  message?: string;
  content?: string;
  created_at?: string;
}

export interface MessagesResponse {
  messages: Message[];
}

export interface CreateMessageRequest {
  thread_id: number;
  content: string;
}

export interface CreateMessageResponse {
  message: string;
  message_id: number;
}

// ============================================================================
// 📊 STATS SYSTEM INTERFACES
// ============================================================================

export interface CourseStats {
  total_lessons: number;
}

export interface UserStatsResponse {
  total_courses: number;
  completed_courses: number;
  total_lessons: number;
  completed_lessons: number;
  total_hours: number;
  achievements: string[];
  rank: string;
}

// ============================================================================
// 📈 PLATFORM STATS INTERFACE
// ============================================================================
export interface PlatformStats {
  total_users: number;
  total_profits: number;
  profits_by_course: Record<string, number>;
}

// ============================================================================
// 🎨 WORKBENCH SYSTEM INTERFACES
// ============================================================================

export interface CreateCourseRequest {
  name: string;
  description: string;
  price: string;
  hours: string;
  file: File;
}

export interface CreateCourseResponse {
  message: string;
  mtd_course: {
    course_id: number;
    sensei_id: number;
    name: string;
    description: string;
    price: string;
    hours: string;
    miniature_id: string;
  };
}

export interface DeleteCourseResponse {
  message: string;
}

// ============================================================================
// 🛠️ FUNCIONES UTILITARIAS
// ============================================================================

/**
 * Construye un email completo a partir de un nombre de usuario y un dominio
 */
export const buildFullEmail = (username: string, domain: string): string => {
  return domain === '' ? username : username + domain;
};

/**
 * Realiza una petición HTTP POST a un endpoint del backend
 */
const makeApiRequest = async <T>(
  url: string, 
  formData: FormData
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      credentials: "include", // Importante para enviar cookies de sesión
      body: formData
    });
    
    const responseText = await response.text();
    let parsedData: T;
    
    try {
      parsedData = JSON.parse(responseText);
    } catch (e) {
      parsedData = responseText as any;
    }
    
    return {
      ok: response.ok,
      status: response.status,
      data: parsedData
    };
    
  } catch (error) {
    console.error("API request failed:", error);
    return {
      ok: false,
      status: 0,
      data: null as any,
      message: error instanceof Error ? error.message : "Network error"
    };
  }
};

/**
 * Realiza una petición HTTP GET a un endpoint del backend
 */
const makeGetRequest = async <T>(url: string): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    
    const responseText = await response.text();
    let parsedData: T;
    
    try {
      parsedData = JSON.parse(responseText);
    } catch (e) {
      parsedData = responseText as any;
    }
    
    return {
      ok: response.ok,
      status: response.status,
      data: parsedData
    };
    
  } catch (error) {
    console.error("API GET request failed:", error);
    return {
      ok: false,
      status: 0,
      data: null as any,
      message: error instanceof Error ? error.message : "Network error"
    };
  }
};

// ============================================================================
// 🔐 FUNCIONES DE AUTENTICACIÓN
// ============================================================================

/**
 * Inicia el proceso de registro de un usuario
 */
export const initRegister = async (
  name: string,
  email: string,
  password: string,
  isSensei: boolean = false
): Promise<ApiResponse<AuthResponse>> => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("email", email);
  formData.append("password", password);
  formData.append("is_sensei", isSensei.toString());

  return makeApiRequest<AuthResponse>(`${API_BASE}/auth/init_register`, formData);
};

/**
 * Verifica el registro de un usuario con el código recibido
 */
export const verifyRegister = async (
  email: string,
  code: string
): Promise<ApiResponse<VerificationResponse>> => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("code", code);

  return makeApiRequest<VerificationResponse>(`${API_BASE}/auth/verify_register`, formData);
};

/**
 * Autentica un usuario (login)
 */
export const login = async (
  email: string,
  password: string
): Promise<ApiResponse<AuthResponse>> => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("password", password);

  return makeApiRequest<AuthResponse>(`${API_BASE}/auth/login`, formData);
};

/**
 * Cierra la sesión del usuario (logout)
 */
export const logout = async (): Promise<ApiResponse<{ message: string }>> => {
  const formData = new FormData();
  return makeApiRequest<{ message: string }>(`${API_BASE}/auth/logout`, formData);
};

/**
 * Inicia el proceso de restauración de contraseña
 */
export const initRestorePassword = async (
  email: string
): Promise<ApiResponse<RestorePasswordResponse>> => {
  const formData = new FormData();
  formData.append("email", email);

  return makeApiRequest<RestorePasswordResponse>(`${API_BASE}/auth/init_restore_password`, formData);
};

/**
 * Completa la restauración de contraseña con el token y nueva contraseña
 */
export const restorePassword = async (
  token: string,
  newPassword: string
): Promise<ApiResponse<{ message: string }>> => {
  const formData = new FormData();
  formData.append("token", token);
  formData.append("new_password", newPassword);

  return makeApiRequest<{ message: string }>(`${API_BASE}/auth/restore_password`, formData);
};

/**
 * Obtiene todos los usuarios registrados (solo para administradores)
 */
export const getUsers = async (): Promise<ApiResponse<User[]>> => {
  return makeGetRequest<User[]>(`${API_BASE}/auth/get_users`);
};

// ============================================================================
// 🔄 FUNCIONES DE REFRESH TOKEN
// ============================================================================

/**
 * Refresca el token de acceso usando el refresh token
 */
export const refreshAccessToken = async (): Promise<ApiResponse<{ access_token: string }>> => {
  const formData = new FormData();
  return makeApiRequest<{ access_token: string }>(`${API_BASE}/auth/refresh`, formData);
};

// ============================================================================
// 🎯 FUNCIONES DE VALIDACIÓN
// ============================================================================

/**
 * Verifica si el usuario está autenticado
 */
export const checkAuth = async (): Promise<ApiResponse<User>> => {
  return makeGetRequest<User>(`${API_BASE}/auth/me`);
};

/**
 * Valida si un email tiene un formato válido
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida si una contraseña cumple con los requisitos mínimos
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 8;
};

// ============================================================================
// 🚀 FUNCIONES DE INICIALIZACIÓN
// ============================================================================

/**
 * Configura la URL base de la API
 */
export const setApiBase = (baseUrl: string): void => {
  (globalThis as any).API_BASE = baseUrl;
};

/**
 * Obtiene la URL base de la API
 */
export const getApiBase = (): string => {
  return (globalThis as any).API_BASE || API_BASE;
};

// ============================================================================
// 📝 FUNCIONES DE MANEJO DE ERRORES
// ============================================================================

/**
 * Maneja errores de la API de forma consistente
 */
export const handleApiError = (error: any): string => {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error?.data?.message) {
    return error.data.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'Ha ocurrido un error inesperado';
};

/**
 * Determina si un error es de red
 */
export const isNetworkError = (error: any): boolean => {
  return error?.status === 0 || error?.ok === false;
};

/**
 * Determina si un error es de autenticación
 */
export const isAuthError = (error: any): boolean => {
  return error?.status === 401 || error?.status === 403;
};

// ============================================================================
// 🧪 FUNCIONES DE TESTING (solo en desarrollo)
// ============================================================================

// Declara la función fuera del condicional
export const testConnection = async (): Promise<boolean> => {
  // Solo ejecuta la lógica si estamos en desarrollo
  if (process.env.NODE_ENV === 'development') {
    try {
      const response = await fetch(`${API_BASE}/health`, { method: 'GET' });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  return false;
};
  
  // Función para limpiar cookies de sesión (útil para testing)
  export const clearSessionCookies = (): void => {
    document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  };


// ============================================================================
// 🆘 FUNCIONES DE SOPORTE
// ============================================================================

/**
 * Envía un formulario de soporte al backend
 */
export const sendSupportEmail = async (
  formData: SupportForm
): Promise<ApiResponse<SupportResponse>> => {
  const form = new FormData();
  form.append("name", formData.name);
  form.append("mail", formData.mail);
  form.append("issue", formData.issue);
  form.append("message", formData.message);

  return makeApiRequest<SupportResponse>(`${API_BASE}/support/send_email`, form);
};

// ============================================================================
// 👤 FUNCIONES DE PERFIL DE USUARIO
// ============================================================================

/**
 * Obtiene el perfil completo del usuario autenticado
 */
export const getUserProfile = async (): Promise<ApiResponse<UserProfile>> => {
  return makeGetRequest<UserProfile>(`${API_BASE}/user/profile`);
};

/**
 * Actualiza las credenciales del usuario (nombre y email)
 */
export const updateUserCredentials = async (
  name: string,
  email: string
): Promise<ApiResponse<UpdateProfileResponse>> => {
  const formData = new FormData();
  formData.append("username", name);
  formData.append("email", email);

  return makeApiRequest<UpdateProfileResponse>(`${API_BASE}/user/modify_credentials`, formData);
};

/**
 * Actualiza la contraseña del usuario
 */
export const updateUserPassword = async (
  currentPassword: string,
  newPassword: string
): Promise<ApiResponse<{ message: string }>> => {
  const formData = new FormData();
  formData.append("current_password", currentPassword);
  formData.append("new_password", newPassword);

  return makeApiRequest<{ message: string }>(`${API_BASE}/user/update_password`, formData);
};

/**
 * Obtiene las estadísticas del usuario
 */
export const getUserStats = async (): Promise<ApiResponse<UserStats>> => {
  return makeGetRequest<UserStats>(`${API_BASE}/user/stats`);
};

/**
 * Obtiene estadísticas globales de la plataforma (para senseis/admin)
 */
export const getPlatformStats = async (): Promise<ApiResponse<PlatformStats>> => {
  return makeGetRequestNoAuth<PlatformStats>(`${API_BASE}/stats`);
};

/**
 * Sube una imagen de perfil
 */
export const uploadProfileImage = async (
  imageFile: File
): Promise<ApiResponse<{ image_url: string }>> => {
  const formData = new FormData();
  formData.append("profile_image", imageFile);

  return makeApiRequest<{ image_url: string }>(`${API_BASE}/user/upload_image`, formData);
};

/**
 * Elimina la cuenta del usuario
 */
export const deleteUserAccount = async (
  password: string
): Promise<ApiResponse<{ message: string }>> => {
  const formData = new FormData();
  formData.append("password", password);

  return makeApiRequest<{ message: string }>(`${API_BASE}/user/delete_account`, formData);
};

// ============================================================================
// 📚 EDITOR SYSTEM FUNCTIONS
// ============================================================================
export interface WorkbrenchCourse {
  course_id: number
  sensei_id: number
  name: string
  description: string
  price: string
  hours: string
  miniature_id: string
}

export interface WorkbrenchCreateResponse {
  Message: string
  mtd_course: WorkbrenchCourse
}

export interface WorkbrenchSectionResponse {
  Message: string;
  mtd_section: {
    title: string;
    course_id: number;
    section_id: number;
  }
}

export interface WorkbrenchDeleteSectionResponse {
  Message: string;
  section_id: number;
}

export interface WorkbrenchLessonRequest {
  section_id: number
  course_id: number
  title: string
  file: File
}

export interface WorkbrenchMetadataRequest {
  course_id: number
  name?: string
  description?: string
  price?: string
  hours?: string
}

// WORKBRENCH API
export const workbrenchApi = {
  async createCourse(formData: FormData): Promise<ApiResponse<WorkbrenchCreateResponse>> {
    try {
      const response = await fetch(`${API_BASE}/workbrench/new_course`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  async markProgress(lessonId: number): Promise<ApiResponse<{ message: string }>> {
    try {
      const formData = new FormData();
      formData.append("lesson_id", String(lessonId));
      const response = await fetch(`${API_BASE}/courses/mark_progress`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message,
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async unmarkProgress(lessonId: number): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE}/courses/unmark_progress?lesson_id=${lessonId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Accept": "application/json" },
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message,
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  

  async getCourseContentByName(courseName: string): Promise<ApiResponse<CourseContentResponse>> {
    try {
      const response = await fetch(`${API_BASE}/courses/course_content?course_name=${encodeURIComponent(courseName)}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  async deleteCourse(courseId: number): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE}/workbrench/delete_course/${courseId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  async createSection(courseId: number, sectionName: string): Promise<ApiResponse<WorkbrenchSectionResponse>> {
    try {
      const formData = new FormData();
      formData.append("course_id", courseId.toString());
      formData.append("section_name", sectionName);
      const response = await fetch(`${API_BASE}/workbrench/new_section`, {
        method: "POST",
        credentials: "include",
        body: formData  // Enviar el FormData en el body
      });
      
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  async deleteSection(sectionId: number): Promise<ApiResponse<{ Message: string, section_id: number }>> {
    try {
      const response = await fetch(`${API_BASE}/workbrench/delete_section/${sectionId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.Message
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  async createLesson(formData: FormData): Promise<ApiResponse<{ lesson_id: number | string; file_id: string }>> {
    try {
      const response = await fetch(`${API_BASE}/workbrench/add_lesson`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const raw = await response.json();

      // Normalizar estructura: backend puede devolver { Message, lesson: { lesson_id, file_id } }
      const normalized = (() => {
        const lesson = raw?.lesson ?? raw;
        const lesson_id = lesson?.lesson_id ?? lesson?.id;
        const file_id = lesson?.file_id ?? raw?.file_id;
        return { lesson_id, file_id } as { lesson_id: number | string; file_id: string };
      })();

      return {
        ok: response.ok,
        status: response.status,
        data: normalized,
        message: raw?.Message || raw?.message
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  async deleteLesson(fileId: string, lessonId: number): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE}/workbrench/delete_lesson/${fileId}/${lessonId}`, {
        method: "POST",
        credentials: "include",
        headers: { "Accept": "application/json" }
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.Message || data.message
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  async editMetadata(courseData: WorkbrenchMetadataRequest): Promise<ApiResponse<EditMetadataResponse>> {
    try {
      // Crear objeto JSON en lugar de FormData
      const jsonBody = {
        course_id: courseData.course_id,
        ...(courseData.name && { name: courseData.name }),
        ...(courseData.description && { description: courseData.description }),
        ...(courseData.price && { price: courseData.price }),
        ...(courseData.hours && { hours: courseData.hours })
      };
  
      const response = await fetch(`${API_BASE}/workbrench/edit_metadata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Importante: especificar JSON
        },
        body: JSON.stringify(jsonBody), // Enviar como JSON
        credentials: "include",
      });
      
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  async giveCourse(courseId: number, userEmail: string): Promise<ApiResponse<GiveCourseResponse>> {
    try {
      const formData = new FormData();
      formData.append("course_id", String(courseId));
      formData.append("user_email_to_give", userEmail);

      const response = await fetch(`${API_BASE}/workbrench/give_course`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },
}


export interface CourseData {
  id: number
  name: string
  description: string
  price: number
  duration?: string
  students?: number
  rating?: number
  tags?: string[]
  sensei_name?: string
  language?: string
  difficulty?: string
  lessons?: number
  hours?: number
  content?: any[]
  miniature_id?: string
}

export interface WebhookResponse {
  received: boolean
}

// COURSES API
export const coursesApi = {
  async getMtdCourses(): Promise<ApiResponse<{ mtd_courses: CourseData[] }>> {
    try {
      const response = await fetch(`${API_BASE}/courses/mtd_courses`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  async getCourseContent(courseId: number): Promise<ApiResponse<CourseContentResponse>> {
    try {
      const response = await fetch(`${API_BASE}/courses/course_content?course_id=${courseId}`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  async buyCourse(courseId: number): Promise<ApiResponse<PurchaseResponse>> {
    try {
      const response = await fetch(`${API_BASE}/courses/buy_course?course_id=${courseId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  async getMyCourses(): Promise<ApiResponse<CourseData[]>> {
    try {
      const response = await fetch(`${API_BASE}/courses/my_courses`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json"
        }
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  },

  // Marca el progreso de una lección para el usuario autenticado
  async markProgress(lessonId: number): Promise<ApiResponse<{ message: string }>> {
    try {
      const formData = new FormData();
      formData.append("lesson_id", String(lessonId));
      const response = await fetch(`${API_BASE}/courses/mark_progress`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message,
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  // Elimina el progreso de una lección para el usuario autenticado
  async unmarkProgress(lessonId: number): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await fetch(`${API_BASE}/courses/unmark_progress?lesson_id=${lessonId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Accept": "application/json" },
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message,
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },

  async stripeWebhook(payload: any, signature: string): Promise<ApiResponse<WebhookResponse>> {
    try {
      const response = await fetch(`${API_BASE}/courses/webhook`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "stripe-signature": signature
        },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      return {
        ok: response.ok,
        status: response.status,
        data,
        message: data.message
      };
    } catch (error) {
      return {
        ok: false,
        status: 500,
        data: null as any,
        message: error instanceof Error ? error.message : "Unknown error"
      };
    }
  }
} 


// ============================================================================
// 💬 FORUMS API CLIENT
// ============================================================================
export const forumsApi = {
  async getThreadsByLesson(lessonId: number): Promise<{ threads: Thread[]; lesson_id?: number; user_id?: number }> {
    const response = await fetch(`${API_BASE}/forums/mtd_threads?lesson_id=${lessonId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Accept": "application/json" },
    })
    const data = await response.json().catch(() => ({}))
    // Normalizar forma de respuesta
    return {
      threads: (data?.threads as Thread[]) || [],
      lesson_id: data?.lesson_id,
      user_id: data?.user_id,
    }
  },

  async getMessagesByThread(threadId: number): Promise<{ messages: Message[]; thread_id?: number; user_id?: number }> {
    const response = await fetch(`${API_BASE}/forums/messages_thread?thread_id=${threadId}`, {
      method: "GET",
      credentials: "include",
      headers: { "Accept": "application/json" },
    })
    const data = await response.json().catch(() => ({}))
    return {
      messages: (data?.messages as Message[]) || [],
      thread_id: data?.thread_id,
      user_id: data?.user_id,
    }
  },

  async createThread(payload: { lesson_id: number; topic: string }): Promise<{ message?: string; thread?: { id: number; title: string } }> {
    const response = await fetch(`${API_BASE}/forums/create_thread`, {
      method: "POST",
      credentials: "include",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ lesson_id: payload.lesson_id, topic: payload.topic }),
    })
    const data = await response.json().catch(() => ({}))
    return data
  },

  async sendMessage(payload: { thread_id: number; message: string }): Promise<{ message?: string; thread_id?: number; user_id?: number }> {
    const response = await fetch(`${API_BASE}/forums/send_message`, {
      method: "POST",
      credentials: "include",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ thread_id: payload.thread_id, message: payload.message }),
    })
    const data = await response.json().catch(() => ({}))
    return data
  },

  async deleteThread(threadId: number): Promise<{ message?: string }> {
    const response = await fetch(`${API_BASE}/forums/delete_thread?thread_id=${threadId}`, {
      method: "DELETE",
      credentials: "include",
      headers: { "Accept": "application/json" },
    })
    const data = await response.json().catch(() => ({}))
    return data
  },
}


/**
 * Obtiene un archivo por su ID
 */
export const getFileById = async (
  fileId: string
): Promise<ApiResponse<Blob>> => {
  return makeGetRequest<Blob>(`${API_BASE}/media/get_file?file_id=${fileId}`);
};

/**
 * Marca una lección como completada
 */
export const markLessonComplete = async (
  lessonId: number
): Promise<ApiResponse<{ message: string }>> => {
  const formData = new FormData();
  formData.append("lesson_id", lessonId.toString());
  
  return makeApiRequest<{ message: string }>(`${API_BASE}/courses/mark_progress`, formData);
};

/**
 * Desmarca una lección como completada
 */
export const unmarkLessonComplete = async (
  lessonId: number
): Promise<ApiResponse<{ message: string }>> => {
  const formData = new FormData();
  formData.append("lesson_id", lessonId.toString());
  
  return makeApiRequest<{ message: string }>(`${API_BASE}/courses/unmark_progress`, formData);
};

export default {
  // Auth functions
  initRegister,
  verifyRegister,
  login,
  logout,
  initRestorePassword,
  restorePassword,
  getUsers,
  refreshAccessToken,
  checkAuth,
  
  // Support functions
  sendSupportEmail,
  
  // Profile functions
  getUserProfile,
  updateUserCredentials,
  updateUserPassword,
  getUserStats,
  uploadProfileImage,
  deleteUserAccount,
  
  // Editor functions
  getFileById,
  
  // Utility functions
  buildFullEmail,
  isValidEmail,
  isValidPassword,
  setApiBase,
  getApiBase,
  
  // Error handling
  handleApiError,
  isNetworkError,
  isAuthError,
  
  // Constants
  API_BASE
};
