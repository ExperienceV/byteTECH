# 👤 Sistema de Perfil - ByteTechEdu

## 📋 Descripción General

El sistema de perfil de ByteTechEdu es una solución completa para gestionar la información personal, credenciales y estadísticas de los usuarios. Está diseñado para proporcionar una experiencia fluida y segura para la gestión de cuentas de usuario.

## 🏗️ Arquitectura del Sistema

### Frontend (Next.js)
- **Página de perfil**: `/app/perfil/page.tsx`
- **Formulario de perfil**: `/components/profile-form.tsx`
- **Formulario de contraseña**: `/components/password-form.tsx`
- **Hook personalizado**: `/hooks/use-profile.ts`
- **Configuración**: `/lib/profile-config.ts`

### Backend (FastAPI)
- **Router de usuario**: `/backend/src/app/routers/user.py`
- **Consultas de usuario**: `/backend/src/app/database/queries/user.py`
- **Modelo de datos**: `/backend/src/app/models.py`

### API Client
- **Funciones de perfil**: `/lib/api.ts`

## 🔧 Funcionalidades Principales

### 1. Gestión de Información del Perfil
- **Edición en tiempo real** de campos del perfil
- **Validación automática** de todos los campos
- **Guardado automático** de cambios
- **Cancelación de edición** con restauración de datos

### 2. Sistema de Cambio de Contraseña
- **Validación de contraseña actual**
- **Indicador de fortaleza** de nueva contraseña
- **Verificación de coincidencia** de contraseñas
- **Requisitos de seguridad** visibles en tiempo real

### 3. Gestión de Imagen de Perfil
- **Subida de imágenes** con validación
- **Redimensionamiento automático**
- **Formatos soportados**: JPEG, PNG, GIF, WebP
- **Límites de tamaño**: Máximo 5MB

### 4. Sistema de Estadísticas
- **Cursos totales** y completados
- **Lecciones totales** y completadas
- **Horas de estudio** acumuladas
- **Logros desbloqueados**
- **Rango del usuario**

## 🎯 Tipos de Usuario y Roles

### Roles Disponibles
\`\`\`typescript
USER_ROLES = {
  STUDENT: "Estudiante",
  SENSEI: "Sensei", 
  ADMIN: "Administrador"
}
\`\`\`

### Estados de Verificación
\`\`\`typescript
VERIFICATION_STATUS = {
  PENDING: "Pendiente",
  VERIFIED: "Verificado",
  REJECTED: "Rechazado"
}
\`\`\`

## 🔒 Sistema de Seguridad

### Validación de Contraseñas
- **Longitud mínima**: 8 caracteres
- **Longitud máxima**: 128 caracteres
- **Requisitos obligatorios**:
  - Al menos una mayúscula
  - Al menos una minúscula
  - Al menos un número
  - Al menos un carácter especial

### Configuración de Privacidad
\`\`\`typescript
PRIVACY_SETTINGS = {
  PROFILE_VISIBILITY: ["Público", "Amigos", "Privado"],
  EMAIL_VISIBILITY: ["Público", "Amigos", "Privado"],
  STATS_VISIBILITY: ["Público", "Amigos", "Privado"]
}
\`\`\`

## 📊 Sistema de Logros y Rangos

### Rangos del Usuario
\`\`\`typescript
USER_RANKS = {
  BEGINNER: { name: "Principiante", min_points: 0, icon: "🌱" },
  INTERMEDIATE: { name: "Intermedio", min_points: 100, icon: "🚀" },
  ADVANCED: { name: "Avanzado", min_points: 500, icon: "⭐" },
  EXPERT: { name: "Experto", min_points: 1000, icon: "👑" },
  MASTER: { name: "Maestro", min_points: 2500, icon: "🏆" }
}
\`\`\`

### Logros Disponibles
- **Primer Curso**: Completar el primer curso
- **Maestro del Curso**: Completar 5 cursos
- **Puntuación Perfecta**: Obtener 100% en un curso
- **Racha de 7 Días**: Estudiar 7 días seguidos
- **Racha de 30 Días**: Estudiar 30 días seguidos
- **Mano Ayudadora**: Ayudar a 10 estudiantes
- **Madrugador**: Estudiar antes de las 8 AM
- **Búho Nocturno**: Estudiar después de las 10 PM

## 🚀 Uso del Sistema

### Para Usuarios

1. **Acceder al perfil**: `/perfil`
2. **Editar información**: Hacer clic en "Editar" en cada sección
3. **Cambiar contraseña**: Usar el formulario de contraseña
4. **Ver estadísticas**: Revisar la sección de estadísticas
5. **Subir imagen**: Hacer clic en el botón de cámara

### Para Desarrolladores

#### Importar el hook de perfil
\`\`\`typescript
import { useProfile } from '@/hooks/use-profile';

const MyComponent = () => {
  const {
    profile,
    stats,
    isLoading,
    error,
    updateProfile,
    updatePassword,
    uploadImage
  } = useProfile();
  
  // Usar las funciones según sea necesario
};
\`\`\`

#### Usar los componentes de formulario
\`\`\`typescript
import { ProfileForm } from '@/components/profile-form';
import { PasswordForm } from '@/components/password-form';

const ProfilePage = () => {
  return (
    <div>
      <h1>Mi Perfil</h1>
      <ProfileForm />
      <PasswordForm />
    </div>
  );
};
\`\`\`

#### Llamar directamente a la API
\`\`\`typescript
import { 
  getUserProfile, 
  updateUserCredentials, 
  updateUserPassword 
} from '@/lib/api';

const handleProfileUpdate = async (data: ProfileFormState) => {
  try {
    const response = await updateUserCredentials(data.name, data.email);
    if (response.ok) {
      console.log('Perfil actualizado correctamente');
    }
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
  }
};
\`\`\`

## 📱 Responsividad y UX

### Características de UX
- **Diseño responsive** para todos los dispositivos
- **Feedback visual** inmediato para todas las acciones
- **Estados de carga** claros y informativos
- **Validación en tiempo real** de formularios
- **Indicadores de cambios** sin guardar
- **Confirmación de acciones** importantes

### Componentes UI Utilizados
- Cards para organizar información
- Formularios con validación visual
- Badges para estados y roles
- Progress bars para indicadores
- Alerts para mensajes de estado
- Botones con estados de carga

## 🔄 Flujo de Trabajo

### 1. Edición de Perfil
1. Usuario hace clic en "Editar"
2. Campos se vuelven editables
3. Validación en tiempo real
4. Usuario guarda o cancela cambios
5. Confirmación de éxito o error

### 2. Cambio de Contraseña
1. Usuario hace clic en "Cambiar"
2. Ingresa contraseña actual
3. Ingresa nueva contraseña
4. Sistema valida fortaleza
5. Usuario confirma nueva contraseña
6. Sistema actualiza contraseña

### 3. Subida de Imagen
1. Usuario selecciona archivo
2. Sistema valida formato y tamaño
3. Imagen se sube al servidor
4. Perfil se actualiza automáticamente
5. Confirmación de éxito

## 📊 Métricas y Monitoreo

### Métricas Disponibles
- **Tiempo de respuesta** de formularios
- **Tasa de éxito** de actualizaciones
- **Errores de validación** más comunes
- **Uso de funcionalidades** del perfil
- **Tiempo de sesión** promedio

### Logs del Sistema
- Cambios de perfil
- Cambios de contraseña
- Subidas de imagen
- Errores de validación
- Actividad de usuarios

## 🚨 Manejo de Errores

### Tipos de Errores
1. **Errores de validación**: Campos requeridos, formatos inválidos
2. **Errores de red**: Problemas de conectividad
3. **Errores del servidor**: Fallos en el backend
4. **Errores de archivo**: Problemas con subida de imágenes

### Estrategias de Recuperación
- Validación en tiempo real
- Mensajes de error descriptivos
- Reintentos automáticos para errores de red
- Fallback a estados anteriores
- Logging detallado para debugging

## 🔮 Futuras Mejoras

### Funcionalidades Planificadas
- **Autenticación de dos factores** (2FA)
- **Sincronización con redes sociales**
- **Backup automático** de datos
- **Historial de cambios** del perfil
- **Notificaciones push** para actualizaciones
- **Exportación de datos** personales

### Mejoras Técnicas
- **WebSockets** para actualizaciones en tiempo real
- **Cache inteligente** para perfiles frecuentes
- **Machine Learning** para sugerencias de perfil
- **API GraphQL** para consultas más eficientes
- **Sistema de versionado** de perfiles

## 📞 Contacto del Equipo

- **Soporte técnico**: soporte@bytetech.edu
- **Desarrollo**: dev@bytetech.edu
- **Seguridad**: security@bytetech.edu

---

*Documentación actualizada: Diciembre 2024*
*Versión del sistema: 1.0.0*
