# 🆘 Sistema de Soporte - ByteTechEdu

## 📋 Descripción General

El sistema de soporte de ByteTechEdu es una solución completa para manejar consultas, reportes de bugs y solicitudes de los usuarios. Está diseñado para proporcionar una experiencia fluida tanto para los usuarios como para el equipo de soporte.

## 🏗️ Arquitectura del Sistema

### Frontend (Next.js)
- **Página de soporte**: `/app/soporte/page.tsx`
- **Componente del formulario**: `/components/support-form.tsx`
- **Hook personalizado**: `/hooks/use-support.ts`
- **Configuración**: `/lib/support-config.ts`

### Backend (FastAPI)
- **Router de soporte**: `/backend/src/app/routers/support.py`
- **Utilidades de email**: `/backend/src/app/utils/util_routers.py`
- **Modelo de datos**: `/backend/src/app/models.py`

### API Client
- **Funciones de soporte**: `/lib/api.ts`

## 🔧 Funcionalidades Principales

### 1. Formulario de Soporte Inteligente
- **Validación en tiempo real** de todos los campos
- **Sugerencias automáticas** de tipo de problema basadas en el mensaje
- **Barra de progreso** visual del formulario
- **Selección rápida** de tipos de problemas predefinidos

### 2. Tipos de Problemas Soportados
```typescript
SUPPORT_ISSUES = {
  TECHNICAL: "Problema Técnico",
  ACCOUNT: "Problema de Cuenta", 
  COURSE: "Problema con Curso",
  PAYMENT: "Problema de Pago",
  FEATURE: "Solicitud de Función",
  BUG: "Reporte de Bug",
  OTHER: "Otro"
}
```

### 3. Sistema de Prioridades
```typescript
SUPPORT_PRIORITIES = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta", 
  URGENT: "Urgente"
}
```

### 4. Validación de Formularios
- **Nombre**: 2-100 caracteres
- **Email**: Formato válido requerido
- **Asunto**: 5-200 caracteres
- **Mensaje**: 10-1000 caracteres

## 🚀 Uso del Sistema

### Para Usuarios

1. **Acceder a la página de soporte**: `/soporte`
2. **Seleccionar tipo de problema** (opcional, se puede hacer manualmente)
3. **Completar el formulario** con información detallada
4. **Recibir confirmación** de envío
5. **Esperar respuesta** del equipo de soporte

### Para Desarrolladores

#### Importar el hook de soporte
```typescript
import { useSupport } from '@/hooks/use-support';

const MyComponent = () => {
  const {
    formData,
    submitStatus,
    errorMessage,
    successMessage,
    updateField,
    submitForm,
    selectIssueType,
    resetForm
  } = useSupport();
  
  // Usar las funciones según sea necesario
};
```

#### Usar el componente de formulario
```typescript
import { SupportForm } from '@/components/support-form';

const SupportPage = () => {
  return (
    <div>
      <h1>Centro de Soporte</h1>
      <SupportForm />
    </div>
  );
};
```

#### Llamar directamente a la API
```typescript
import { sendSupportEmail } from '@/lib/api';

const handleSupportRequest = async (data: SupportForm) => {
  try {
    const response = await sendSupportEmail(data);
    if (response.ok) {
      console.log('Mensaje enviado correctamente');
    }
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
  }
};
```

## 📧 Sistema de Email

### Configuración
El sistema utiliza **Resend API** para el envío de emails:
- **API Key**: Configurada en variables de entorno
- **Email remitente**: Configurado en `settings.SENDER_MAIL`
- **Email destinatario**: Configurado en `settings.RECEIVER_MAIL`

### Flujo de Email
1. Usuario envía formulario
2. Backend recibe datos
3. Se formatea el mensaje
4. Se envía via Resend API
5. Se confirma el envío al usuario

## 🔒 Seguridad y Validación

### Validación del Frontend
- Validación en tiempo real de campos
- Sanitización de entrada de usuario
- Límites de caracteres por campo
- Validación de formato de email

### Validación del Backend
- Validación de modelo Pydantic
- Sanitización de datos antes del envío
- Manejo seguro de errores
- Logging de actividades

## 📱 Responsividad y UX

### Características de UX
- **Diseño responsive** para todos los dispositivos
- **Feedback visual** inmediato para todas las acciones
- **Estados de carga** claros y informativos
- **Mensajes de error** descriptivos y útiles
- **Sugerencias inteligentes** para mejorar la experiencia

### Componentes UI Utilizados
- Cards para organizar información
- Badges para tipos de problemas
- Progress bars para mostrar progreso
- Alerts para mensajes de estado
- Formularios con validación visual

## 🧪 Testing y Desarrollo

### Funciones de Testing (Solo en Desarrollo)
```typescript
// Probar conectividad con el backend
const isConnected = await testConnection();

// Limpiar cookies de sesión
clearSessionCookies();
```

### Variables de Entorno
```bash
# API URL del backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Configuración de Resend
RESEND_API_KEY=your_resend_api_key
SENDER_MAIL=soporte@bytetech.edu
RECEIVER_MAIL=soporte@bytetech.edu
```

## 🔄 Flujo de Trabajo del Soporte

### 1. Recepción de Ticket
- Usuario envía formulario
- Sistema valida datos
- Se crea ticket interno
- Se envía email de confirmación

### 2. Procesamiento
- Equipo de soporte recibe ticket
- Se asigna prioridad y categoría
- Se investiga el problema
- Se contacta al usuario si es necesario

### 3. Resolución
- Se implementa solución
- Se actualiza estado del ticket
- Se notifica al usuario
- Se cierra el ticket

## 📊 Métricas y Monitoreo

### Métricas Disponibles
- **Tiempo de respuesta** promedio
- **Tickets por categoría**
- **Tickets por prioridad**
- **Tiempo de resolución** promedio
- **Satisfacción del usuario**

### Logs del Sistema
- Envío de emails
- Errores de validación
- Fallos de API
- Actividad de usuarios

## 🚨 Manejo de Errores

### Tipos de Errores
1. **Errores de validación**: Campos requeridos, formatos inválidos
2. **Errores de red**: Problemas de conectividad
3. **Errores del servidor**: Fallos en el backend
4. **Errores de email**: Problemas con el servicio de email

### Estrategias de Recuperación
- Reintentos automáticos para errores de red
- Fallback a mensajes de error genéricos
- Logging detallado para debugging
- Notificaciones al equipo de desarrollo

## 🔮 Futuras Mejoras

### Funcionalidades Planificadas
- **Sistema de tickets** con seguimiento
- **Chat en vivo** para soporte inmediato
- **Base de conocimientos** integrada
- **Sistema de calificaciones** post-resolución
- **Integración con CRM** externo
- **Notificaciones push** para actualizaciones

### Mejoras Técnicas
- **WebSockets** para actualizaciones en tiempo real
- **Cache inteligente** para respuestas frecuentes
- **Analytics avanzados** de uso
- **Machine Learning** para categorización automática
- **API GraphQL** para consultas más eficientes

## 📞 Contacto del Equipo

- **Soporte técnico**: soporte@bytetech.edu
- **Desarrollo**: dev@bytetech.edu
- **Emergencias**: +1-XXX-XXX-XXXX

---

*Documentación actualizada: Diciembre 2024*
*Versión del sistema: 1.0.0*
