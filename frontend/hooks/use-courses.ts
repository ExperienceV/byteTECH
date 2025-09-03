// ============================================================================
// 📚 COURSES SYSTEM HOOK
// ============================================================================
// Hook personalizado para manejar el estado y lógica del sistema de cursos

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getCourseContent, 
  handleApiError 
} from '@/lib/api';
import { 
  CourseContent, 
  CourseContentResponse 
} from '@/lib/api';
import { 
  COURSE_STATES, 
  USER_COURSE_TYPES,
  LESSON_PROGRESS_STATES,
  MESSAGES,
  PROGRESS_CONFIG,
  FILTER_CONFIG,
  SORT_CONFIG,
  CATEGORY_CONFIG,
  PAGINATION_CONFIG
} from '@/lib/courses-config';

// Tipos para el estado del sistema de cursos
export interface CoursesState {
  // Cursos disponibles (catálogo público)
  availableCourses: CourseData[];
  // Mis cursos (como estudiante o sensei)
  myCourses: CourseData[];
  // Curso actual seleccionado
  currentCourse: CourseContent | null;
  // Estado de carga
  isLoading: boolean;
  isLoadingMyCourses: boolean;
  isLoadingCourse: boolean;
  // Estados de error
  error: string | null;
  myCoursesError: string | null;
  courseError: string | null;
  // Estados de éxito
  success: string | null;
  // Filtros y búsqueda
  filters: CourseFilters;
  searchQuery: string;
  // Paginación
  currentPage: number;
  pageSize: number;
  totalCourses: number;
  // Ordenamiento
  sortBy: string;
  // Categoría seleccionada
  selectedCategory: string | null;
  // Estado del usuario
  userType: 'student' | 'sensei' | 'guest';
}

export interface CourseData {
  id: number;
  name: string;
  title?: string;
  description: string;
  sensei_name?: string;
  instructor?: string;
  price: number;
  duration?: string;
  hours?: number;
  miniature_id?: string;
  progress?: number;
  lessons_count?: number;
  category?: string;
  difficulty?: string;
  rating?: number;
  students_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CourseFilters {
  priceRange: { min: number; max: number } | null;
  durationRange: { min: number; max: number } | null;
  difficulty: string | null;
  category: string | null;
  isFree: boolean | null;
  hasProgress: boolean | null;
}

export interface CourseProgress {
  total_lessons: number;
  completed_lessons: number;
  progress_percentage: number;
}

export interface LessonData {
  id: number;
  section_id: number;
  title: string;
  file_id: string;
  mime_type: string;
  time_validator: number;
  is_completed: boolean;
  threads?: Array<{
    id: number;
    lesson_id: number;
    username: string | null;
    topic: string;
  }>;
}

export interface SectionData {
  id: number;
  title: string;
  lessons: LessonData[];
}

// Hook principal del sistema de cursos
export const useCourses = () => {
  const router = useRouter();
  
  // Estado principal
  const [state, setState] = useState<CoursesState>({
    availableCourses: [],
    myCourses: [],
    currentCourse: null,
    isLoading: false,
    isLoadingMyCourses: false,
    isLoadingCourse: false,
    error: null,
    myCoursesError: null,
    courseError: null,
    success: null,
    filters: {
      priceRange: null,
      durationRange: null,
      difficulty: null,
      category: null,
      isFree: null,
      hasProgress: null
    },
    searchQuery: '',
    currentPage: 1,
    pageSize: PAGINATION_CONFIG.DEFAULT_PAGE_SIZE,
    totalCourses: 0,
    sortBy: 'newest',
    selectedCategory: null,
    userType: 'guest'
  });

  // ============================================================================
  // 🔄 FUNCIONES DE CARGA Y ACTUALIZACIÓN
  // ============================================================================

  /**
   * Carga todos los cursos disponibles (catálogo público)
   */
  const loadAvailableCourses = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Simular llamada a API - en producción esto vendría del backend
      const response = await fetch('/api/courses/mtd_courses', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al cargar los cursos');
      }

      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        availableCourses: data.mtd_courses || [],
        totalCourses: data.mtd_courses?.length || 0,
        isLoading: false
      }));

    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({
        ...prev,
        error: errorMessage,
        isLoading: false
      }));
    }
  }, []);

  /**
   * Carga mis cursos (como estudiante o sensei)
   */
  const loadMyCourses = useCallback(async () => {
    setState(prev => ({ ...prev, isLoadingMyCourses: true, myCoursesError: null }));

    try {
      const response = await fetch('/api/courses/my_courses', {
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Error al cargar mis cursos');
      }

      const data = await response.json();
      
      setState(prev => ({
        ...prev,
        myCourses: data.courses || [],
        userType: data.is_sensei ? 'sensei' : 'student',
        isLoadingMyCourses: false
      }));

    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({
        ...prev,
        myCoursesError: errorMessage,
        isLoadingMyCourses: false
      }));
    }
  }, []);

  /**
   * Carga el contenido completo de un curso específico
   */
  const loadCourseContent = useCallback(async (courseId: number) => {
    if (!courseId) return;

    setState(prev => ({ ...prev, isLoadingCourse: true, courseError: null }));

    try {
      const response = await getCourseContent(courseId);
      
      if (!response.ok) {
        throw new Error(response.message || MESSAGES.ERROR.COURSE_NOT_FOUND);
      }

      const courseData = response.data.course_content;
      
      setState(prev => ({
        ...prev,
        currentCourse: courseData,
        isLoadingCourse: false
      }));

    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({
        ...prev,
        courseError: errorMessage,
        isLoadingCourse: false
      }));
    }
  }, []);

  // ============================================================================
  // 🔍 FUNCIONES DE BÚSQUEDA Y FILTRADO
  // ============================================================================

  /**
   * Actualiza la consulta de búsqueda
   */
  const updateSearchQuery = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
      currentPage: 1 // Resetear a la primera página
    }));
  }, []);

  /**
   * Aplica filtros a los cursos
   */
  const applyFilters = useCallback((newFilters: Partial<CourseFilters>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
      currentPage: 1 // Resetear a la primera página
    }));
  }, []);

  /**
   * Limpia todos los filtros
   */
  const clearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      filters: {
        priceRange: null,
        durationRange: null,
        difficulty: null,
        category: null,
        isFree: null,
        hasProgress: null
      },
      currentPage: 1
    }));
  }, []);

  /**
   * Cambia el ordenamiento de los cursos
   */
  const changeSorting = useCallback((sortBy: string) => {
    setState(prev => ({
      ...prev,
      sortBy,
      currentPage: 1
    }));
  }, []);

  /**
   * Selecciona una categoría
   */
  const selectCategory = useCallback((category: string | null) => {
    setState(prev => ({
      ...prev,
      selectedCategory: category,
      currentPage: 1
    }));
  }, []);

  // ============================================================================
  // 📄 FUNCIONES DE PAGINACIÓN
  // ============================================================================

  /**
   * Cambia a una página específica
   */
  const goToPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      currentPage: page
    }));
  }, []);

  /**
   * Cambia el tamaño de página
   */
  const changePageSize = useCallback((size: number) => {
    setState(prev => ({
      ...prev,
      pageSize: size,
      currentPage: 1 // Resetear a la primera página
    }));
  }, []);

  // ============================================================================
  // 📊 FUNCIONES DE PROGRESO
  // ============================================================================

  /**
   * Marca una lección como completada
   */
  const markLessonComplete = useCallback(async (lessonId: number) => {
    if (!state.currentCourse) return;

    try {
      const formData = new FormData();
      formData.append("lesson_id", lessonId.toString());

      const response = await fetch('/api/courses/mark_progress', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Error al marcar la lección como completada');
      }

      // Actualizar estado local
      setState(prev => {
        if (!prev.currentCourse) return prev;

        const updatedCourse = { ...prev.currentCourse };
        const updatedContent = { ...updatedCourse.content };

        // Buscar y actualizar la lección
        Object.keys(updatedContent).forEach(sectionKey => {
          const section = updatedContent[sectionKey];
          const lessonIndex = section.lessons.findIndex(l => l.id === lessonId);
          if (lessonIndex !== -1) {
            section.lessons[lessonIndex] = {
              ...section.lessons[lessonIndex],
              is_completed: true
            };
          }
        });

        // Recalcular progreso
        const totalLessons = Object.values(updatedContent).reduce(
          (acc, section) => acc + section.lessons.length, 0
        );
        const completedLessons = Object.values(updatedContent).reduce(
          (acc, section) => acc + section.lessons.filter(l => l.is_completed).length, 0
        );
        const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        updatedCourse.progress = {
          total_lessons: totalLessons,
          completed_lessons: completedLessons,
          progress_percentage: progressPercentage
        };

        return {
          ...prev,
          currentCourse: updatedCourse,
          success: MESSAGES.SUCCESS.PROGRESS_SAVED
        };
      });

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => {
        setState(prev => ({ ...prev, success: null }));
      }, 3000);

    } catch (error) {
      const errorMessage = handleApiError(error);
      setState(prev => ({ ...prev, error: errorMessage }));
    }
  }, [state.currentCourse]);

  /**
   * Simula el time validator para una lección
   */
  const simulateTimeValidator = useCallback(async (lessonId: number, timeRequired: number) => {
    if (!state.currentCourse) return;

    // Simular el paso del tiempo
    const timer = setInterval(async () => {
      // Marcar como completada automáticamente
      await markLessonComplete(lessonId);
      clearInterval(timer);
    }, timeRequired * 1000);

    return () => clearInterval(timer); // Cleanup function
  }, [state.currentCourse, markLessonComplete]);

  // ============================================================================
  // 🎯 FUNCIONES DE NAVEGACIÓN
  // ============================================================================

  /**
   * Navega a la página de un curso específico
   */
  const navigateToCourse = useCallback((courseId: number) => {
    router.push(`/course/${courseId}`);
  }, [router]);

  /**
   * Navega al editor de un curso (solo para senseis)
   */
  const navigateToEditor = useCallback((courseId: number) => {
    if (state.userType !== 'sensei') return;
    router.push(`/editor/${courseId}`);
  }, [router, state.userType]);

  /**
   * Navega a la página de compra de un curso
   */
  const navigateToPurchase = useCallback((courseId: number) => {
    router.push(`/courses/${courseId}/purchase`);
  }, [router]);

  // ============================================================================
  // 🧮 FUNCIONES DE CÁLCULO
  // ============================================================================

  /**
   * Calcula el progreso de un curso
   */
  const calculateCourseProgress = useCallback((course: CourseContent): CourseProgress => {
    const totalLessons = Object.values(course.content).reduce(
      (acc, section) => acc + section.lessons.length, 0
    );
    const completedLessons = Object.values(course.content).reduce(
      (acc, section) => acc + section.lessons.filter(l => l.is_completed).length, 0
    );
    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      total_lessons: totalLessons,
      completed_lessons: completedLessons,
      progress_percentage: progressPercentage
    };
  }, []);

  /**
   * Obtiene el nivel de progreso basado en el porcentaje
   */
  const getProgressLevel = useCallback((percentage: number) => {
    if (percentage >= PROGRESS_CONFIG.THRESHOLDS.EXPERT) return 'EXCELLENT';
    if (percentage >= PROGRESS_CONFIG.THRESHOLDS.ADVANCED) return 'HIGH';
    if (percentage >= PROGRESS_CONFIG.THRESHOLDS.INTERMEDIATE) return 'MEDIUM';
    return 'LOW';
  }, []);

  /**
   * Filtra los cursos según los criterios actuales
   */
  const getFilteredCourses = useCallback(() => {
    let filtered = [...state.availableCourses];

    // Aplicar búsqueda por texto
    if (state.searchQuery.trim()) {
      const query = state.searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.name.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        (course.sensei_name && course.sensei_name.toLowerCase().includes(query))
      );
    }

    // Aplicar filtros
    if (state.filters.priceRange) {
      filtered = filtered.filter(course =>
        course.price >= state.filters.priceRange!.min &&
        course.price <= state.filters.priceRange!.max
      );
    }

    if (state.filters.durationRange) {
      filtered = filtered.filter(course =>
        (course.hours || 0) >= state.filters.durationRange!.min &&
        (course.hours || 0) <= state.filters.durationRange!.max
      );
    }

    if (state.filters.difficulty) {
      filtered = filtered.filter(course =>
        course.difficulty === state.filters.difficulty
      );
    }

    if (state.filters.category) {
      filtered = filtered.filter(course =>
        course.category === state.filters.category
      );
    }

    if (state.filters.isFree !== null) {
      filtered = filtered.filter(course =>
        state.filters.isFree ? course.price === 0 : course.price > 0
      );
    }

    if (state.selectedCategory) {
      filtered = filtered.filter(course =>
        course.category === state.selectedCategory
      );
    }

    return filtered;
  }, [state.availableCourses, state.searchQuery, state.filters, state.selectedCategory]);

  /**
   * Obtiene los cursos paginados
   */
  const getPaginatedCourses = useCallback(() => {
    const filtered = getFilteredCourses();
    const startIndex = (state.currentPage - 1) * state.pageSize;
    const endIndex = startIndex + state.pageSize;
    
    return {
      courses: filtered.slice(startIndex, endIndex),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / state.pageSize)
    };
  }, [getFilteredCourses, state.currentPage, state.pageSize]);

  // ============================================================================
  // 🧹 FUNCIONES DE LIMPIEZA
  // ============================================================================

  /**
   * Limpia todos los errores
   */
  const clearErrors = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
      myCoursesError: null,
      courseError: null
    }));
  }, []);

  /**
   * Limpia el mensaje de éxito
   */
  const clearSuccess = useCallback(() => {
    setState(prev => ({ ...prev, success: null }));
  }, []);

  // ============================================================================
  // 🔄 EFECTOS
  // ============================================================================

  useEffect(() => {
    // Cargar cursos disponibles al montar el componente
    loadAvailableCourses();
  }, [loadAvailableCourses]);

  // ============================================================================
  // 📤 RETORNO DEL HOOK
  // ============================================================================

  return {
    // Estado
    ...state,
    
    // Funciones de carga
    loadAvailableCourses,
    loadMyCourses,
    loadCourseContent,
    
    // Funciones de búsqueda y filtrado
    updateSearchQuery,
    applyFilters,
    clearFilters,
    changeSorting,
    selectCategory,
    
    // Funciones de paginación
    goToPage,
    changePageSize,
    
    // Funciones de progreso
    markLessonComplete,
    simulateTimeValidator,
    
    // Funciones de navegación
    navigateToCourse,
    navigateToEditor,
    navigateToPurchase,
    
    // Funciones de cálculo
    calculateCourseProgress,
    getProgressLevel,
    getFilteredCourses,
    getPaginatedCourses,
    
    // Funciones de limpieza
    clearErrors,
    clearSuccess
  };
};
