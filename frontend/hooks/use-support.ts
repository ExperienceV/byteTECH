// ============================================================================
// 🆘 HOOK PERSONALIZADO PARA SOPORTE - ByteTechEdu
// ============================================================================

import { useState, useCallback } from 'react';
import { sendSupportEmail, handleApiError } from '@/lib/api';
import { SupportForm, ApiResponse } from '@/lib/api';
import { SUPPORT_ISSUES, FORM_VALIDATION } from '@/lib/support-config';

// Estados del formulario de soporte
export type SupportFormState = {
  name: string;
  mail: string;
  issue: string;
  message: string;
};

// Estados de envío
export type SubmitStatus = 'idle' | 'loading' | 'success' | 'error';

// Hook personalizado para soporte
export const useSupport = () => {
  // Estado del formulario
  const [formData, setFormData] = useState<SupportFormState>({
    name: '',
    mail: '',
    issue: '',
    message: ''
  });

  // Estado de envío
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Validación del formulario
  const validateForm = useCallback((data: SupportFormState): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validar nombre
    if (!data.name.trim()) {
      errors.push('El nombre es requerido');
    } else if (data.name.length < FORM_VALIDATION.MIN_NAME_LENGTH) {
      errors.push(`El nombre debe tener al menos ${FORM_VALIDATION.MIN_NAME_LENGTH} caracteres`);
    } else if (data.name.length > FORM_VALIDATION.MAX_NAME_LENGTH) {
      errors.push(`El nombre no puede exceder ${FORM_VALIDATION.MAX_NAME_LENGTH} caracteres`);
    }

    // Validar email
    if (!data.mail.trim()) {
      errors.push('El email es requerido');
    } else if (!isValidEmail(data.mail)) {
      errors.push('El email no tiene un formato válido');
    }

    // Validar asunto
    if (!data.issue.trim()) {
      errors.push('El asunto es requerido');
    } else if (data.issue.length < FORM_VALIDATION.MIN_ISSUE_LENGTH) {
      errors.push(`El asunto debe tener al menos ${FORM_VALIDATION.MIN_ISSUE_LENGTH} caracteres`);
    } else if (data.issue.length > FORM_VALIDATION.MAX_ISSUE_LENGTH) {
      errors.push(`El asunto no puede exceder ${FORM_VALIDATION.MAX_ISSUE_LENGTH} caracteres`);
    }

    // Validar mensaje
    if (!data.message.trim()) {
      errors.push('El mensaje es requerido');
    } else if (data.message.length < FORM_VALIDATION.MIN_MESSAGE_LENGTH) {
      errors.push(`El mensaje debe tener al menos ${FORM_VALIDATION.MIN_MESSAGE_LENGTH} caracteres`);
    } else if (data.message.length > FORM_VALIDATION.MAX_MESSAGE_LENGTH) {
      errors.push(`El mensaje no puede exceder ${FORM_VALIDATION.MAX_MESSAGE_LENGTH} caracteres`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Función para validar email
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Función para actualizar un campo del formulario
  const updateField = useCallback((field: keyof SupportFormState, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar mensajes de error al editar
    if (errorMessage) {
      setErrorMessage('');
    }
  }, [errorMessage]);

  // Función para actualizar múltiples campos
  const updateMultipleFields = useCallback((updates: Partial<SupportFormState>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    
    // Limpiar mensajes de error al editar
    if (errorMessage) {
      setErrorMessage('');
    }
  }, [errorMessage]);

  // Función para resetear el formulario
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      mail: '',
      issue: '',
      message: ''
    });
    setSubmitStatus('idle');
    setErrorMessage('');
    setSuccessMessage('');
  }, []);

  // Función para enviar el formulario
  const submitForm = useCallback(async (): Promise<boolean> => {
    // Validar formulario
    const validation = validateForm(formData);
    if (!validation.isValid) {
      setErrorMessage(validation.errors.join('. '));
      setSubmitStatus('error');
      return false;
    }

    // Cambiar estado a loading
    setSubmitStatus('loading');
    setErrorMessage('');
    setSuccessMessage('');

    try {
      // Enviar formulario
      const response: ApiResponse = await sendSupportEmail(formData);
      
      if (response.ok) {
        setSubmitStatus('success');
        setSuccessMessage('Mensaje enviado correctamente. Te responderemos pronto.');
        
        // Resetear formulario después de un delay
        setTimeout(() => {
          resetForm();
        }, 3000);
        
        return true;
      } else {
        setSubmitStatus('error');
        setErrorMessage(handleApiError(response));
        return false;
      }
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(handleApiError(error));
      return false;
    }
  }, [formData, validateForm, resetForm]);

  // Función para seleccionar un tipo de problema predefinido
  const selectIssueType = useCallback((issueType: keyof typeof SUPPORT_ISSUES) => {
    updateField('issue', SUPPORT_ISSUES[issueType]);
  }, [updateField]);

  // Función para obtener sugerencias de asunto basadas en el mensaje
  const getIssueSuggestions = useCallback((message: string): string[] => {
    const suggestions: string[] = [];
    
    if (message.toLowerCase().includes('error') || message.toLowerCase().includes('bug')) {
      suggestions.push(SUPPORT_ISSUES.BUG);
    }
    
    if (message.toLowerCase().includes('cuenta') || message.toLowerCase().includes('login')) {
      suggestions.push(SUPPORT_ISSUES.ACCOUNT);
    }
    
    if (message.toLowerCase().includes('curso') || message.toLowerCase().includes('lección')) {
      suggestions.push(SUPPORT_ISSUES.COURSE);
    }
    
    if (message.toLowerCase().includes('pago') || message.toLowerCase().includes('factura')) {
      suggestions.push(SUPPORT_ISSUES.PAYMENT);
    }
    
    if (message.toLowerCase().includes('función') || message.toLowerCase().includes('característica')) {
      suggestions.push(SUPPORT_ISSUES.FEATURE);
    }
    
    return suggestions.slice(0, 3); // Máximo 3 sugerencias
  }, []);

  // Función para verificar si el formulario está completo
  const isFormComplete = useCallback((): boolean => {
    return Object.values(formData).every(value => value.trim().length > 0);
  }, [formData]);

  // Función para obtener el progreso del formulario (0-100)
  const getFormProgress = useCallback((): number => {
    const totalFields = Object.keys(formData).length;
    const filledFields = Object.values(formData).filter(value => value.trim().length > 0).length;
    return Math.round((filledFields / totalFields) * 100);
  }, [formData]);

  return {
    // Estado
    formData,
    submitStatus,
    errorMessage,
    successMessage,
    
    // Funciones
    updateField,
    updateMultipleFields,
    resetForm,
    submitForm,
    selectIssueType,
    getIssueSuggestions,
    isFormComplete,
    getFormProgress,
    
    // Utilidades
    isValidEmail,
    validateForm
  };
};

export default useSupport;
