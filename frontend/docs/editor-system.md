# 📚 Sistema de Editor - ByteTechEdu

## Descripción General

El sistema de editor es una herramienta completa para que los profesores (senseis) puedan crear, editar y gestionar sus cursos en la plataforma ByteTechEdu. Proporciona una interfaz intuitiva y moderna para organizar el contenido educativo en secciones y lecciones.

## 🏗️ Arquitectura del Sistema

### Componentes Principales

1. **Hook Personalizado (`useEditor`)**
   - Maneja toda la lógica de estado y operaciones del editor
   - Centraliza la comunicación con la API
   - Gestiona formularios y validaciones

2. **Componentes de UI**
   - `EditorCourseForm`: Formulario de edición de metadatos del curso
   - `EditorLessonModal`: Modal para agregar nuevas lecciones
   - `EditorGiftModal`: Modal para regalar cursos
   - `EditorFileModal`: Modal para visualizar archivos

3. **Configuración Centralizada**
   - `editor-config.ts`: Configuración de validaciones, tipos de archivo, etc.

### Estructura de Archivos

\`\`\`
lib/
├── api.ts                    # Funciones del API para el editor
├── editor-config.ts          # Configuración del sistema
hooks/
├── use-editor.ts             # Hook personalizado principal
components/
├── editor-course-form.tsx    # Formulario de edición de curso
├── editor-lesson-modal.tsx   # Modal de agregar lección
├── editor-gift-modal.tsx     # Modal de regalar curso
├── editor-file-modal.tsx     # Modal de visualización de archivos
app/editor/[courseId]/
├── page.tsx                  # Página principal del editor
docs/
├── editor-system.md          # Esta documentación
\`\`\`

## 🚀 Funcionalidades

### 1. Gestión de Metadatos del Curso

**Funcionalidades:**
- Editar nombre, descripción, precio y horas del curso
- Validación en tiempo real de formularios
- Guardado automático con feedback visual

**Componente:** `EditorCourseForm`

**Validaciones:**
- Nombre: 3-100 caracteres
- Descripción: 10-1000 caracteres
- Precio: $0-$9999.99
- Horas: 0.5-1000 horas

### 2. Gestión de Secciones

**Funcionalidades:**
- Crear nuevas secciones
- Eliminar secciones existentes
- Organización automática de contenido

**Operaciones:**
- `addSection()`: Crea una nueva sección
- `removeSection()`: Elimina una sección con confirmación

### 3. Gestión de Lecciones

**Funcionalidades:**
- Agregar lecciones con archivos (videos, documentos)
- Eliminar lecciones existentes
- Visualización de archivos
- Validación de tipos y tamaños de archivo

**Tipos de Archivo Soportados:**
- **Videos:** MP4, WebM, OGG, AVI, MOV (máx. 500MB)
- **Documentos:** PDF, DOC, DOCX (máx. 50MB)

**Operaciones:**
- `addLesson()`: Crea una nueva lección con archivo
- `removeLesson()`: Elimina una lección con confirmación
- `viewFile()`: Visualiza un archivo en modal

### 4. Regalo de Cursos

**Funcionalidades:**
- Regalar cursos a usuarios por email
- Validación de email
- Confirmación de transferencia

**Operaciones:**
- `giftCourse()`: Transfiere un curso a un usuario

### 5. Visualización de Archivos

**Funcionalidades:**
- Reproducción de videos
- Visualización de documentos PDF
- Descarga de archivos
- Apertura en nueva pestaña

## 🔧 Configuración

### Tipos de Archivo Soportados

\`\`\`typescript
export const SUPPORTED_FILE_TYPES = {
  VIDEO: ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  IMAGE: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}
\`\`\`

### Límites de Tamaño

\`\`\`typescript
export const FILE_VALIDATION = {
  MAX_SIZE: {
    VIDEO: 500 * 1024 * 1024, // 500MB
    DOCUMENT: 50 * 1024 * 1024, // 50MB
    IMAGE: 10 * 1024 * 1024 // 10MB
  },
  MIN_SIZE: 1024 // 1KB
}
\`\`\`

### Validaciones de Formularios

\`\`\`typescript
export const FORM_VALIDATION = {
  COURSE: {
    NAME: { MIN_LENGTH: 3, MAX_LENGTH: 100 },
    DESCRIPTION: { MIN_LENGTH: 10, MAX_LENGTH: 1000 },
    PRICE: { MIN: 0, MAX: 9999.99 },
    HOURS: { MIN: 0.5, MAX: 1000 }
  },
  LESSON: {
    TITLE: { MIN_LENGTH: 3, MAX_LENGTH: 200 }
  }
}
\`\`\`

## 📡 API Endpoints

### Cursos

- `GET /api/courses/course_content?course_id={id}` - Obtener contenido del curso
- `POST /api/workbrench/edit_metadata` - Editar metadatos del curso

### Secciones

- `POST /api/workbrench/new_section/{course_id}` - Crear nueva sección
- `DELETE /api/workbrench/delete_section/{section_id}` - Eliminar sección

### Lecciones

- `POST /api/workbrench/add_lesson` - Crear nueva lección
- `POST /api/workbrench/delete_lesson/{file_id}/{lesson_id}` - Eliminar lección

### Archivos

- `GET /api/media/get_file?file_id={id}` - Obtener archivo

### Regalo de Cursos

- `POST /api/workbrench/give_course` - Regalar curso a usuario

## 🎨 Interfaz de Usuario

### Diseño

- **Tema:** Dark mode con acentos cyan/purple
- **Tipografía:** Monospace para elementos técnicos
- **Componentes:** Shadcn/ui con personalización
- **Responsive:** Adaptable a móviles y desktop

### Estados Visuales

- **Loading:** Spinners y skeletons
- **Success:** Mensajes verdes con iconos
- **Error:** Mensajes rojos con iconos
- **Warning:** Mensajes amarillos para confirmaciones

### Navegación

- **Breadcrumbs:** Ruta actual del editor
- **Botones de acción:** Colores semánticos (verde=crear, rojo=eliminar, cyan=editar)
- **Modales:** Overlay con backdrop blur

## 🔒 Seguridad y Permisos

### Control de Acceso

- Solo usuarios con rol "teacher" pueden acceder
- Verificación de propiedad del curso
- Validación de sesión activa

### Validaciones

- **Frontend:** Validación en tiempo real
- **Backend:** Validación de datos y permisos
- **Archivos:** Validación de tipo y tamaño

### Manejo de Errores

- **Errores de red:** Reintentos automáticos
- **Errores de validación:** Mensajes específicos
- **Errores de permisos:** Redirección automática

## 📊 Estadísticas y Métricas

### Métricas del Curso

- Número total de secciones
- Número total de lecciones
- Número de videos vs documentos
- Horas totales del curso

### Cálculos Automáticos

\`\`\`typescript
const getCourseStats = () => {
  return {
    sections: course.content?.length || 0,
    lessons: totalLessons,
    videos: totalVideos,
    documents: totalDocuments
  };
};
\`\`\`

## 🚀 Optimizaciones

### Performance

- **Lazy loading:** Componentes cargados bajo demanda
- **Memoización:** Hooks optimizados con useCallback
- **Caché:** Archivos cacheados en IndexedDB

### UX

- **Feedback inmediato:** Estados de loading y success
- **Validación en tiempo real:** Errores mostrados al escribir
- **Confirmaciones:** Diálogos para acciones destructivas

## 🔄 Flujo de Trabajo

### 1. Carga del Editor

1. Verificación de permisos de usuario
2. Carga del contenido del curso
3. Transformación de datos para UI
4. Inicialización de formularios

### 2. Edición de Metadatos

1. Usuario hace clic en "Editar"
2. Formulario se habilita con datos actuales
3. Validación en tiempo real
4. Guardado con feedback visual

### 3. Gestión de Secciones

1. Crear sección con nombre automático
2. Sección se agrega al estado local
3. Sincronización con backend
4. Actualización de estadísticas

### 4. Gestión de Lecciones

1. Seleccionar sección para agregar lección
2. Modal de creación con validación de archivo
3. Upload del archivo al servidor
4. Creación de lección en base de datos
5. Actualización del estado local

### 5. Visualización de Archivos

1. Clic en "Ver archivo"
2. Descarga del archivo desde servidor
3. Creación de URL temporal
4. Visualización en modal apropiado

## 🐛 Manejo de Errores

### Tipos de Error

1. **Errores de Red**
   - Timeout de conexión
   - Servidor no disponible
   - Problemas de CORS

2. **Errores de Validación**
   - Datos de formulario inválidos
   - Archivos no soportados
   - Tamaños excedidos

3. **Errores de Permisos**
   - Usuario no autorizado
   - Curso no encontrado
   - Acceso denegado

### Estrategias de Recuperación

- **Reintentos automáticos** para errores de red
- **Mensajes específicos** para cada tipo de error
- **Fallbacks** para archivos corruptos
- **Redirección** para errores de permisos

## 🔮 Mejoras Futuras

### Funcionalidades Planificadas

1. **Drag & Drop**
   - Reordenar secciones y lecciones
   - Upload de archivos por drag & drop

2. **Editor de Texto Rico**
   - Descripciones con formato
   - Notas adicionales en lecciones

3. **Previsualización**
   - Vista previa de lecciones
   - Simulador de experiencia de estudiante

4. **Analytics Avanzados**
   - Métricas de engagement
   - Reportes de progreso
   - Insights de contenido

5. **Colaboración**
   - Múltiples editores
   - Sistema de comentarios
   - Control de versiones

### Optimizaciones Técnicas

1. **Caché Inteligente**
   - Cache de archivos más eficiente
   - Preload de contenido relacionado

2. **Offline Support**
   - Edición sin conexión
   - Sincronización automática

3. **Progressive Web App**
   - Instalación como app
   - Notificaciones push

## 📝 Convenciones de Código

### Nomenclatura

- **Componentes:** PascalCase (`EditorCourseForm`)
- **Hooks:** camelCase con prefijo `use` (`useEditor`)
- **Funciones:** camelCase descriptivo (`addLesson`, `removeSection`)
- **Constantes:** UPPER_SNAKE_CASE (`SUPPORTED_FILE_TYPES`)

### Estructura de Archivos

- **Un archivo por componente**
- **Hooks en carpeta separada**
- **Configuración centralizada**
- **Documentación actualizada**

### Comentarios

- **JSDoc** para funciones públicas
- **Comentarios de sección** para organización
- **Comentarios explicativos** para lógica compleja

## 🤝 Contribución

### Guías de Desarrollo

1. **Mantener consistencia** con el diseño existente
2. **Seguir patrones** establecidos en el código
3. **Documentar cambios** en esta documentación
4. **Probar funcionalidades** antes de commit

### Proceso de Review

1. **Revisión de código** por equipo
2. **Pruebas de funcionalidad**
3. **Verificación de UX**
4. **Actualización de documentación**

---

**Última actualización:** Diciembre 2024  
**Versión:** 1.0.0  
**Mantenido por:** Equipo de Desarrollo ByteTechEdu
