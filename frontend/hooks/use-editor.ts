// ============================================================================
// 📚 EDITOR SYSTEM HOOK
// ============================================================================
// Hook personalizado para manejar el estado y lógica del editor de cursos

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getCourseContent, 
  createSection, 
  deleteSection, 
  createLesson, 
  deleteLesson, 
  editMetadata, 
  giveCourse,
  getFileById,
  handleApiError 
} from '@/lib/api';
import { 
  CourseContent, 
  Section, 
  Lesson, 
  EditMetadataRequest,
  CreateSectionResponse,
  CreateLessonResponse 
} from '@/lib/api';
import { 
  EDITOR_STATES, 
  ERROR_MESSAGES, 
  SUCCESS_MESSAGES,
  FORM_VALIDATION,
  FILE_VALIDATION,
  SUPPORTED_FILE_TYPES 
} from '@/lib/editor-config';

// Tipos para el estado del editor
export interface EditorState {
  course: CourseContent | null;
  isLoading: boolean;
  isEditing: boolean;
  isSaving: boolean;
  isAddingSection: boolean;
  isAddingLesson: boolean;
  error: string | null;
  success: string | null;
  selectedSection: number | null;
  fileModal: { url: string; type: string } | null;
  showGiftModal: boolean;
}

export interface EditFormData {
  name: string;
  description: string;
  price: string;
  hours: string;
}

export interface GiftFormData {
  email: string;
  message: string | null;
}

export interface LessonFormData {
  title: string;
  file: File | null;
}

// Hook principal del editor
export const useEditor = (courseId: string) => {
  const router = useRouter();
  
  // Estado principal
  const [state, setState] = useState<EditorState>({
    course: null,
    isLoading: true,
    isEditing: false,
    isSaving: false,
    isAddingSection: false,
    isAddingLesson: false,
    error: null,
    success: null,
    selectedSection: null,
    fileModal: null,
    showGiftModal: false
  });

  // Estado de formularios
  const [editForm, setEditForm] = useState<EditFormData>({
    name: '',
    description: '',
    price: '',
    hours: ''
  });

  const [giftForm, setGiftForm] = useState<GiftFormData>({
    email: '',
    message: null
  });

  const [lessonForm, setLessonForm] = useState<LessonFormData>({
    title: '',
    file: null
  });

  // ============================================================================
  // 🔄 FUNCIONES DE CARGA Y ACTUALIZACIÓN
  // ============================================================================

  /**
   * Carga el contenido del curso
   */
  const loadCourse = useCallback(async () => {
    if (!courseId) return;

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await getCourseContent(parseInt(courseId));
      
      if (!response.ok) {
        throw new Error(response.message || ERROR_MESSAGES.COURSE_NOT_FOUND);
      }

      const courseData = response.data.course_content;
      
      // Transformar content de objeto a array y asignar títulos
      const contentObj = courseData.content;
      const contentArr = Object.values(contentObj || {}).map((section: any, idx) => ({
        id: section.id,
        title: `Sección ${idx + 1}`,
        lessons: section.lessons || [],
      }));

      const transformedCourse = {
        ...courseData,
        content: contentArr,
        hours: courseData.hours ?? 0,
      };

      setState(prev => ({ 
        ...prev, 
        course: transformedCourse, 
        isLoading: false 
      }));

      // Actualizar formulario de edición
      setEditForm({
        name: courseData.name,
        description: courseData.description,
        price: courseData.price.toString(),
        hours: courseData.hours?.toString() || '0',
      });

    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isLoading: false 
      }));
    }
  }, [courseId]);

  // ============================================================================
  // ✏️ FUNCIONES DE EDICIÓN DE METADATOS
  // ============================================================================

  /**
   * Valida los datos del formulario de edición
   */
  const validateEditForm = useCallback((data: EditFormData): string | null => {
    if (!data.name || data.name.length < FORM_VALIDATION.COURSE.NAME.MIN_LENGTH) {
      return 'El nombre del curso debe tener al menos 3 caracteres';
    }
    if (data.name.length > FORM_VALIDATION.COURSE.NAME.MAX_LENGTH) {
      return 'El nombre del curso no puede exceder 100 caracteres';
    }
    if (!data.description || data.description.length < FORM_VALIDATION.COURSE.DESCRIPTION.MIN_LENGTH) {
      return 'La descripción debe tener al menos 10 caracteres';
    }
    if (data.description.length > FORM_VALIDATION.COURSE.DESCRIPTION.MAX_LENGTH) {
      return 'La descripción no puede exceder 1000 caracteres';
    }
    if (!data.price || parseFloat(data.price) < FORM_VALIDATION.COURSE.PRICE.MIN) {
      return 'El precio debe ser mayor o igual a 0';
    }
    if (parseFloat(data.price) > FORM_VALIDATION.COURSE.PRICE.MAX) {
      return 'El precio no puede exceder $9999.99';
    }
    if (!data.hours || parseFloat(data.hours) < FORM_VALIDATION.COURSE.HOURS.MIN) {
      return 'Las horas deben ser mayor o igual a 0.5';
    }
    if (parseFloat(data.hours) > FORM_VALIDATION.COURSE.HOURS.MAX) {
      return 'Las horas no pueden exceder 1000';
    }
    return null;
  }, []);

  /**
   * Guarda los metadatos del curso
   */
  const saveMetadata = useCallback(async () => {
    if (!state.course) return;

    const validationError = validateEditForm(editForm);
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      return;
    }

    setState(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      const metadata: EditMetadataRequest = {
        course_id: state.course.id,
        name: editForm.name,
        description: editForm.description,
        price: editForm.price,
        hours: editForm.hours,
      };

      const response = await editMetadata(metadata);
      
      if (!response.ok) {
        throw new Error(response.message || ERROR_MESSAGES.SAVE_FAILED);
      }

      // Actualizar estado local
      setState(prev => ({
        ...prev,
        course: prev.course ? {
          ...prev.course,
          name: editForm.name,
          description: editForm.description,
          price: parseFloat(editForm.price),
          hours: parseFloat(editForm.hours),
        } : null,
        isEditing: false,
        isSaving: false,
        success: SUCCESS_MESSAGES.COURSE_SAVED
      }));

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setState(prev => ({ ...prev, success: null }));
      }, 3000);

    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isSaving: false 
      }));
    }
  }, [state.course, editForm, validateEditForm]);

  // ============================================================================
  // 📁 FUNCIONES DE GESTIÓN DE SECCIONES
  // ============================================================================

  /**
   * Crea una nueva sección
   */
  const addSection = useCallback(async () => {
    if (!state.course) return;

    setState(prev => ({ ...prev, isAddingSection: true, error: null }));

    try {
      const sectionName = `Sección ${(state.course.content?.length || 0) + 1}`;
      const response = await createSection(state.course.id, sectionName);
      
      if (!response.ok) {
        throw new Error(response.message || ERROR_MESSAGES.SAVE_FAILED);
      }

      const newSection: Section = {
        id: response.data.section_id,
        title: sectionName,
        lessons: [],
      };

      setState(prev => ({
        ...prev,
        course: prev.course ? {
          ...prev.course,
          content: [...(prev.course.content || []), newSection],
        } : null,
        isAddingSection: false,
        selectedSection: newSection.id,
        success: SUCCESS_MESSAGES.SECTION_CREATED
      }));

      setTimeout(() => {
        setState(prev => ({ ...prev, success: null }));
      }, 3000);

    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isAddingSection: false 
      }));
    }
  }, [state.course]);

  /**
   * Elimina una sección
   */
  const removeSection = useCallback(async (sectionId: number) => {
    if (!state.course) return;

    if (!confirm('¿Estás seguro de que quieres eliminar esta sección? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await deleteSection(sectionId);
      
      if (!response.ok) {
        throw new Error(response.message || ERROR_MESSAGES.DELETE_FAILED);
      }

      setState(prev => ({
        ...prev,
        course: prev.course ? {
          ...prev.course,
          content: prev.course.content?.filter((section) => section.id !== sectionId) || [],
        } : null,
        success: SUCCESS_MESSAGES.SECTION_DELETED
      }));

      setTimeout(() => {
        setState(prev => ({ ...prev, success: null }));
      }, 3000);

    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, [state.course]);

  // ============================================================================
  // 📚 FUNCIONES DE GESTIÓN DE LECCIONES
  // ============================================================================

  /**
   * Valida los datos del formulario de lección
   */
  const validateLessonForm = useCallback((data: LessonFormData): string | null => {
    if (!data.title || data.title.length < FORM_VALIDATION.LESSON.TITLE.MIN_LENGTH) {
      return 'El título de la lección debe tener al menos 3 caracteres';
    }
    if (data.title.length > FORM_VALIDATION.LESSON.TITLE.MAX_LENGTH) {
      return 'El título de la lección no puede exceder 200 caracteres';
    }
    if (!data.file) {
      return 'Debes seleccionar un archivo';
    }
    if (data.file.size < FILE_VALIDATION.MIN_SIZE) {
      return 'El archivo es demasiado pequeño';
    }
    
    const isVideo = SUPPORTED_FILE_TYPES.VIDEO.includes(data.file.type as any);
    const isDocument = SUPPORTED_FILE_TYPES.DOCUMENT.includes(data.file.type as any);
    
    if (!isVideo && !isDocument) {
      return ERROR_MESSAGES.INVALID_FILE_TYPE;
    }
    
    const maxSize = isVideo ? FILE_VALIDATION.MAX_SIZE.VIDEO : FILE_VALIDATION.MAX_SIZE.DOCUMENT;
    if (data.file.size > maxSize) {
      return ERROR_MESSAGES.FILE_TOO_LARGE;
    }
    
    return null;
  }, []);

  /**
   * Crea una nueva lección
   */
  const addLesson = useCallback(async (sectionId: number, lessonData: LessonFormData) => {
    if (!state.course || !lessonData.file) return;

    const validationError = validateLessonForm(lessonData);
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      return;
    }

    setState(prev => ({ ...prev, isAddingLesson: true, error: null }));

    try {
      const formData = new FormData();
      formData.append("section_id", sectionId.toString());
      formData.append("course_id", state.course.id.toString());
      formData.append("title", lessonData.title);
      formData.append("file", lessonData.file);
      formData.append("time_validator", "0"); // Valor por defecto

      const response = await createLesson(formData);
      
      if (!response.ok) {
        throw new Error(response.message || ERROR_MESSAGES.SAVE_FAILED);
      }

      const newLesson: Lesson = {
        id: response.data.lesson_id || crypto.randomUUID(),
        title: lessonData.title,
        type: lessonData.file.type.includes("video") ? "video" : "document",
        file_id: response.data.file_id,
      };

      setState(prev => ({
        ...prev,
        course: prev.course ? {
          ...prev.course,
          content: prev.course.content?.map((section) =>
            section.id === sectionId 
              ? { ...section, lessons: [...section.lessons, newLesson] }
              : section
          ) || [],
        } : null,
        isAddingLesson: false,
        selectedSection: null,
        success: SUCCESS_MESSAGES.LESSON_CREATED
      }));

      // Limpiar formulario
      setLessonForm({ title: '', file: null });

      setTimeout(() => {
        setState(prev => ({ ...prev, success: null }));
      }, 3000);

    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isAddingLesson: false 
      }));
    }
  }, [state.course, validateLessonForm]);

  /**
   * Elimina una lección
   */
  const removeLesson = useCallback(async (fileId: string, lessonId: number | string, sectionId: number) => {
    if (!state.course) return;

    if (!confirm('¿Estás seguro de que quieres eliminar esta lección? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const idToDelete = typeof lessonId === "string" ? parseInt(lessonId) : lessonId;
      const response = await deleteLesson(fileId, idToDelete);
      
      if (!response.ok) {
        throw new Error(response.message || ERROR_MESSAGES.DELETE_FAILED);
      }

      setState(prev => ({
        ...prev,
        course: prev.course ? {
          ...prev.course,
          content: prev.course.content?.map((section) =>
            section.id === sectionId
              ? { ...section, lessons: section.lessons.filter((lesson) => lesson.id !== lessonId) }
              : section
          ) || [],
        } : null,
        success: SUCCESS_MESSAGES.LESSON_DELETED
      }));

      setTimeout(() => {
        setState(prev => ({ ...prev, success: null }));
      }, 3000);

    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, [state.course]);

  // ============================================================================
  // 🎁 FUNCIONES DE REGALO DE CURSO
  // ============================================================================

  /**
   * Regala un curso a un usuario
   */
  const giftCourse = useCallback(async () => {
    if (!state.course || !giftForm.email) return;

    setState(prev => ({ ...prev, isSaving: true, error: null }));

    try {
      const response = await giveCourse(state.course.id, giftForm.email);
      
      if (!response.ok) {
        throw new Error(response.message || ERROR_MESSAGES.SAVE_FAILED);
      }

      setState(prev => ({
        ...prev,
        isSaving: false,
        showGiftModal: false,
        success: SUCCESS_MESSAGES.COURSE_GIFTED
      }));

      // Limpiar formulario
      setGiftForm({ email: '', message: null });

      setTimeout(() => {
        setState(prev => ({ ...prev, success: null }));
      }, 3000);

    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ 
        ...prev, 
        error: errorMessage, 
        isSaving: false 
      }));
    }
  }, [state.course, giftForm.email]);

  // ============================================================================
  // 📁 FUNCIONES DE GESTIÓN DE ARCHIVOS
  // ============================================================================

  /**
   * Visualiza un archivo
   */
  const viewFile = useCallback(async (fileId: string, type?: string) => {
    try {
      const response = await getFileById(fileId);
      
      if (!response.ok) {
        throw new Error(response.message || ERROR_MESSAGES.FILE_NOT_FOUND);
      }

      const blob = response.data;
      const url = URL.createObjectURL(blob);
      
      setState(prev => ({ 
        ...prev, 
        fileModal: { url, type: type || "document" } 
      }));

    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, []);

  // ============================================================================
  // 🎛️ FUNCIONES DE CONTROL DE UI
  // ============================================================================

  const setEditing = useCallback((editing: boolean) => {
    setState(prev => ({ ...prev, isEditing: editing }));
  }, []);

  const setSelectedSection = useCallback((sectionId: number | null) => {
    setState(prev => ({ ...prev, selectedSection: sectionId }));
  }, []);

  const closeFileModal = useCallback(() => {
    setState(prev => ({ ...prev, fileModal: null }));
  }, []);

  const openGiftModal = useCallback(() => {
    setState(prev => ({ ...prev, showGiftModal: true }));
  }, []);

  const closeGiftModal = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      showGiftModal: false,
      error: null 
    }));
    setGiftForm({ email: '', message: null });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const clearSuccess = useCallback(() => {
    setState(prev => ({ ...prev, success: null }));
  }, []);

  // ============================================================================
  // 📊 FUNCIONES DE CÁLCULO
  // ============================================================================

  /**
   * Calcula las estadísticas del curso
   */
  const getCourseStats = useCallback(() => {
    if (!state.course) return null;

    const totalLessons = state.course.content?.reduce((acc, section) => acc + section.lessons.length, 0) || 0;
    const totalVideos = state.course.content?.reduce(
      (acc, section) => acc + section.lessons.filter((lesson) => lesson.type === "video").length,
      0
    ) || 0;
    const totalDocuments = state.course.content?.reduce(
      (acc, section) => acc + section.lessons.filter((lesson) => lesson.type === "document").length,
      0
    ) || 0;

    return {
      sections: state.course.content?.length || 0,
      lessons: totalLessons,
      videos: totalVideos,
      documents: totalDocuments
    };
  }, [state.course]);

  // ============================================================================
  // 🔄 EFECTOS
  // ============================================================================

  useEffect(() => {
    loadCourse();
  }, [loadCourse]);

  // ============================================================================
  // 📤 RETORNO DEL HOOK
  // ============================================================================

  return {
    // Estado
    ...state,
    
    // Formularios
    editForm,
    giftForm,
    lessonForm,
    
    // Funciones de formularios
    setEditForm,
    setGiftForm,
    setLessonForm,
    
    // Funciones principales
    loadCourse,
    saveMetadata,
    addSection,
    removeSection,
    addLesson,
    removeLesson,
    giftCourse,
    viewFile,
    
    // Funciones de UI
    setEditing,
    setSelectedSection,
    closeFileModal,
    openGiftModal,
    closeGiftModal,
    clearError,
    clearSuccess,
    
    // Funciones de cálculo
    getCourseStats,
    
    // Validaciones
    validateEditForm,
    validateLessonForm
  };
};
