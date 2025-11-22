# 📚 Sistema de Cursos - ByteTechEdu

## 🏗️ **Arquitectura del Sistema**

El sistema de cursos de ByteTechEdu está diseñado con una arquitectura modular y escalable que separa claramente las responsabilidades entre la presentación, la lógica de negocio y la gestión de datos.

### **Estructura de Archivos**

\`\`\`
📁 Sistema de Cursos
├── 📄 lib/courses-config.ts          # Configuración centralizada
├── 🪝 hooks/use-courses.ts           # Hook personalizado principal
├── 🧩 components/course-card.tsx     # Tarjeta de curso reutilizable
├── 🔍 components/courses-filters.tsx # Sistema de filtros y búsqueda
├── 📱 app/cursos/page.tsx            # Página principal del catálogo
└── 📚 docs/courses-system.md         # Esta documentación
\`\`\`

### **Flujo de Datos**

\`\`\`
Usuario → Componentes UI → Hook useCourses → API Backend → Base de Datos
   ↑                                                              ↓
   ←────────────── Estado React ←── Respuesta API ←───────────────
\`\`\`

## 🎯 **Funcionalidades Principales**

### **1. Catálogo de Cursos**
- **Visualización**: Grid responsivo de tarjetas de cursos
- **Información**: Título, descripción, instructor, precio, duración, categoría
- **Estados**: Disponible, comprado, en progreso, completado
- **Imágenes**: Soporte para miniaturas con fallback a placeholder

### **2. Sistema de Filtros Avanzados**
- **Búsqueda por texto**: Nombre, descripción, instructor
- **Filtros de precio**: Rangos predefinidos (Gratis, Económico, Intermedio, Premium, Lujo)
- **Filtros de duración**: Corto (<2h), Medio (2-10h), Largo (10-50h), Extenso (>50h)
- **Filtros de dificultad**: Principiante, Intermedio, Avanzado, Experto
- **Filtros de categoría**: Programación, Diseño, Marketing, Negocios, etc.
- **Filtros especiales**: Solo gratis, con progreso guardado

### **3. Ordenamiento y Paginación**
- **Opciones de orden**: Más recientes, más antiguos, precio, duración, popularidad, rating
- **Paginación**: Tamaños de página configurables (6, 12, 24, 48)
- **Navegación**: Controles de página con indicadores visuales

### **4. Gestión de Usuarios**
- **Tipos de usuario**: Estudiante, Sensei (instructor), Administrador
- **Mis cursos**: Vista personalizada según el tipo de usuario
- **Progreso**: Seguimiento del avance en cursos inscritos
- **Acciones**: Ver, editar (senseis), comprar, continuar

### **5. Sistema de Progreso**
- **Tracking automático**: Seguimiento de lecciones completadas
- **Time validator**: Simulación de tiempo requerido para completar lecciones
- **Estadísticas**: Porcentaje de progreso, nivel de competencia
- **Badges visuales**: Indicadores de estado y logros

## 🛠️ **Componentes del Sistema**

### **1. Hook `useCourses`**

El hook principal que centraliza toda la lógica del sistema de cursos.

#### **Estado Gestionado**
\`\`\`typescript
interface CoursesState {
  availableCourses: CourseData[];      // Cursos disponibles
  myCourses: CourseData[];            // Mis cursos
  currentCourse: CourseContent | null; // Curso actual
  isLoading: boolean;                 // Estado de carga general
  isLoadingMyCourses: boolean;        // Carga de mis cursos
  isLoadingCourse: boolean;           // Carga de curso específico
  error: string | null;               // Errores generales
  myCoursesError: string | null;      // Errores de mis cursos
  courseError: string | null;         // Errores de curso
  success: string | null;             // Mensajes de éxito
  filters: CourseFilters;             // Filtros aplicados
  searchQuery: string;                // Consulta de búsqueda
  currentPage: number;                // Página actual
  pageSize: number;                   // Tamaño de página
  totalCourses: number;               // Total de cursos
  sortBy: string;                     // Ordenamiento actual
  selectedCategory: string | null;    // Categoría seleccionada
  userType: 'student' | 'sensei' | 'guest'; // Tipo de usuario
}
\`\`\`

#### **Funciones Principales**
- `loadAvailableCourses()`: Carga el catálogo público
- `loadMyCourses()`: Carga los cursos del usuario
- `loadCourseContent(courseId)`: Carga contenido específico
- `updateSearchQuery(query)`: Actualiza búsqueda
- `applyFilters(filters)`: Aplica filtros
- `markLessonComplete(lessonId)`: Marca lección como completada
- `navigateToCourse(courseId)`: Navega a curso
- `navigateToEditor(courseId)`: Navega al editor (senseis)

### **2. Componente `CourseCard`**

Tarjeta reutilizable para mostrar información de cursos.

#### **Props**
\`\`\`typescript
interface CourseCardProps {
  course: CourseData;                    // Datos del curso
  userType?: 'student' | 'sensei' | 'guest'; // Tipo de usuario
  showProgress?: boolean;                // Mostrar barra de progreso
  showActions?: boolean;                 // Mostrar botones de acción
  onViewCourse?: (courseId: number) => void; // Callback ver curso
  onEditCourse?: (courseId: number) => void; // Callback editar curso
  onPurchaseCourse?: (courseId: number) => void; // Callback comprar
  className?: string;                    // Clases CSS adicionales
}
\`\`\`

#### **Características**
- **Imagen adaptativa**: Soporte para miniaturas con fallback
- **Badges informativos**: Estado, dificultad, categoría, precio
- **Información detallada**: Instructor, duración, lecciones, estudiantes
- **Barra de progreso**: Visualización del avance (opcional)
- **Botones contextuales**: Acciones según tipo de usuario y estado
- **Responsive**: Adaptación automática a diferentes tamaños de pantalla

### **3. Componente `CoursesFilters`**

Sistema completo de filtros y búsqueda.

#### **Funcionalidades**
- **Búsqueda en tiempo real**: Filtrado instantáneo por texto
- **Filtros expandibles**: Panel colapsable para filtros avanzados
- **Filtros activos**: Visualización de filtros aplicados con opción de remover
- **Controles de ordenamiento**: Selector de criterios de orden
- **Configuración de página**: Tamaño de página personalizable
- **Limpieza de filtros**: Botón para resetear todos los filtros

#### **Tipos de Filtros**
\`\`\`typescript
interface CourseFilters {
  priceRange: { min: number; max: number } | null;    // Rango de precio
  durationRange: { min: number; max: number } | null; // Rango de duración
  difficulty: string | null;                          // Nivel de dificultad
  category: string | null;                            // Categoría del curso
  isFree: boolean | null;                             // Solo cursos gratis
  hasProgress: boolean | null;                        // Con progreso guardado
}
\`\`\`

### **4. Página `CursosPage`**

Página principal que integra todos los componentes.

#### **Secciones Principales**
- **Header**: Título y descripción del catálogo
- **Mis Cursos**: Vista personalizada para usuarios autenticados
- **Estadísticas**: Métricas del catálogo (total, gratis, promedio)
- **Filtros**: Sistema de búsqueda y filtrado
- **Grid de Cursos**: Visualización de cursos con paginación
- **Controles**: Botones de recarga y navegación

## ⚙️ **Configuración del Sistema**

### **Archivo `courses-config.ts`**

Configuración centralizada para todo el sistema de cursos.

#### **Estados de Cursos**
\`\`\`typescript
export const COURSE_STATES = {
  AVAILABLE: 'available',      // Disponible para compra
  PURCHASED: 'purchased',      // Comprado por el usuario
  IN_PROGRESS: 'in_progress',  // En progreso
  COMPLETED: 'completed',      // Completado
  DRAFT: 'draft',              // Borrador (senseis)
  PUBLISHED: 'published'       // Publicado (senseis)
} as const;
\`\`\`

#### **Configuración de Filtros**
\`\`\`typescript
export const FILTER_CONFIG = {
  PRICE_RANGES: [
    { label: 'Gratis', min: 0, max: 0 },
    { label: 'Económico', min: 0.01, max: 19.99 },
    { label: 'Intermedio', min: 20, max: 49.99 },
    { label: 'Premium', min: 50, max: 99.99 },
    { label: 'Lujo', min: 100, max: 999.99 }
  ],
  DURATION_RANGES: [
    { label: 'Corto (< 2h)', min: 0, max: 2 },
    { label: 'Medio (2-10h)', min: 2, max: 10 },
    { label: 'Largo (10-50h)', min: 10, max: 50 },
    { label: 'Extenso (> 50h)', min: 50, max: 1000 }
  ],
  DIFFICULTY_LEVELS: [
    { label: 'Principiante', value: 'beginner' },
    { label: 'Intermedio', value: 'intermediate' },
    { label: 'Avanzado', value: 'advanced' },
    { label: 'Experto', value: 'expert' }
  ]
} as const;
\`\`\`

#### **Configuración de UI**
\`\`\`typescript
export const UI_CONFIG = {
  ANIMATIONS: {
    CARD_HOVER_DURATION: 200,    // Duración de hover
    LOADING_DURATION: 300,       // Duración de loading
    TRANSITION_DURATION: 150     // Duración de transiciones
  },
  LAYOUT: {
    GRID_COLUMNS: {
      MOBILE: 1,                 // Columnas en móvil
      TABLET: 2,                 // Columnas en tablet
      DESKTOP: 3,                // Columnas en desktop
      WIDE: 4                    // Columnas en pantallas grandes
    },
    CARD_ASPECT_RATIO: '16/9',  // Proporción de tarjetas
    MIN_CARD_HEIGHT: 320        // Altura mínima de tarjetas
  }
} as const;
\`\`\`

## 🔌 **Integración con Backend**

### **Endpoints Utilizados**

#### **Cursos Disponibles**
\`\`\`typescript
GET /api/courses/mtd_courses
// Obtiene todos los cursos disponibles con información del sensei
\`\`\`

#### **Mis Cursos**
\`\`\`typescript
GET /api/courses/my_courses
// Obtiene los cursos del usuario (comprados o creados)
\`\`\`

#### **Contenido del Curso**
\`\`\`typescript
GET /api/courses/course_content?course_id={id}
// Obtiene el contenido completo de un curso específico
\`\`\`

#### **Marcar Progreso**
\`\`\`typescript
POST /api/courses/mark_progress
// Marca una lección como completada
\`\`\`

### **Estructura de Respuestas**

#### **Curso Básico**
\`\`\`typescript
interface CourseData {
  id: number;
  name: string;
  description: string;
  sensei_name?: string;
  price: number;
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
\`\`\`

#### **Contenido Completo del Curso**
\`\`\`typescript
interface CourseContent {
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
\`\`\`

## 🎨 **Sistema de Diseño**

### **Paleta de Colores**
- **Primario**: Cyan (#06b6d4) - Para elementos principales y acentos
- **Éxito**: Verde (#10b981) - Para estados positivos y progreso
- **Advertencia**: Amarillo (#f59e0b) - Para estados intermedios
- **Error**: Rojo (#ef4444) - Para errores y estados negativos
- **Información**: Azul (#3b82f6) - Para información y enlaces
- **Secundario**: Púrpura (#8b5cf6) - Para elementos secundarios

### **Tipografía**
- **Familia**: `font-mono` (Monospace) para consistencia técnica
- **Tamaños**: Sistema de escalas responsivas
- **Pesos**: Bold para títulos, normal para texto, light para subtítulos

### **Componentes UI**
- **Tarjetas**: Fondo semi-transparente con backdrop-blur
- **Botones**: Variantes outline, default y ghost
- **Badges**: Indicadores de estado con colores contextuales
- **Progress**: Barras de progreso con colores dinámicos
- **Skeleton**: Estados de carga con animaciones

## 📱 **Responsividad**

### **Breakpoints**
- **Mobile**: < 640px - 1 columna
- **Tablet**: 640px - 1024px - 2 columnas
- **Desktop**: 1024px - 1280px - 3 columnas
- **Wide**: > 1280px - 4 columnas

### **Adaptaciones**
- **Grid adaptativo**: Cambio automático de columnas
- **Filtros colapsables**: Panel expandible en móviles
- **Navegación táctil**: Botones optimizados para touch
- **Imágenes responsivas**: Escalado automático de miniaturas

## 🚀 **Optimizaciones**

### **Performance**
- **Lazy loading**: Carga diferida de imágenes
- **Debouncing**: Búsqueda optimizada con delays
- **Memoización**: Hooks optimizados con useCallback
- **Virtualización**: Renderizado eficiente de listas largas

### **UX/UI**
- **Estados de carga**: Skeleton loaders y spinners
- **Feedback visual**: Mensajes de éxito/error con auto-dismiss
- **Navegación intuitiva**: Breadcrumbs y navegación contextual
- **Accesibilidad**: ARIA labels y navegación por teclado

## 🔒 **Seguridad**

### **Autenticación**
- **Cookies seguras**: HttpOnly y SameSite
- **Validación de roles**: Verificación de permisos por tipo de usuario
- **CSRF protection**: Tokens en formularios críticos

### **Validación**
- **Frontend**: Validación en tiempo real de formularios
- **Backend**: Validación de datos con Pydantic
- **Sanitización**: Limpieza de inputs de usuario

## 🧪 **Testing**

### **Estrategias de Testing**
- **Unit tests**: Funciones individuales y hooks
- **Integration tests**: Flujos completos de usuario
- **E2E tests**: Escenarios de usuario reales
- **Visual regression**: Comparación de UI entre versiones

### **Herramientas Recomendadas**
- **Jest**: Framework de testing principal
- **React Testing Library**: Testing de componentes
- **Cypress**: Testing end-to-end
- **Storybook**: Desarrollo y testing de componentes aislados

## 📈 **Métricas y Analytics**

### **Eventos Rastreados**
- **Visualización de cursos**: Impresiones de tarjetas
- **Búsquedas**: Términos de búsqueda populares
- **Filtros aplicados**: Uso de diferentes criterios
- **Conversiones**: Compras y inscripciones
- **Engagement**: Tiempo en página, scroll depth

### **KPIs Principales**
- **Tasa de conversión**: Visitas → Compras
- **Tiempo de sesión**: Engagement del usuario
- **Bounce rate**: Calidad del contenido
- **Search-to-purchase**: Efectividad de búsqueda

## 🔮 **Roadmap y Mejoras Futuras**

### **Fase 1 (Implementado)**
- ✅ Sistema básico de cursos
- ✅ Filtros y búsqueda
- ✅ Gestión de progreso
- ✅ UI responsiva

### **Fase 2 (Próximamente)**
- 🔄 Sistema de recomendaciones
- 🔄 Filtros avanzados por rating
- 🔄 Comparación de cursos
- 🔄 Wishlist y favoritos

### **Fase 3 (Futuro)**
- 📅 Calendario de cursos
- 📅 Notificaciones de nuevos cursos
- 📅 Sistema de reviews y ratings
- 📅 Integración con redes sociales

### **Fase 4 (Largo plazo)**
- 🚀 IA para recomendaciones personalizadas
- 🚀 Análisis predictivo de tendencias
- 🚀 Sistema de certificaciones
- 🚀 Marketplace de instructores

## 📚 **Recursos Adicionales**

### **Documentación Relacionada**
- [Sistema de Autenticación](./auth-system.md)
- [Sistema de Soporte](./support-system.md)
- [Sistema de Perfil](./profile-system.md)
- [Sistema de Editor](./editor-system.md)

### **Enlaces Útiles**
- [Backend API Documentation](../backend/README.md)
- [Component Library](../components/README.md)
- [Design System](../design/README.md)
- [Deployment Guide](../deployment/README.md)

---

**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0  
**Mantenido por**: Equipo de Desarrollo ByteTechEdu
