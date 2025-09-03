// ============================================================================
// 🆘 FORMULARIO DE SOPORTE MEJORADO - ByteTechEdu
// ============================================================================

"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Send, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  MessageCircle,
  User,
  Mail,
  FileText,
  Lightbulb
} from 'lucide-react';
import { useSupport } from '@/hooks/use-support';
import { SUPPORT_ISSUES, FORM_VALIDATION } from '@/lib/support-config';

export const SupportForm = () => {
  const {
    formData,
    submitStatus,
    errorMessage,
    successMessage,
    updateField,
    submitForm,
    selectIssueType,
    getIssueSuggestions,
    isFormComplete,
    getFormProgress,
    resetForm
  } = useSupport();

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Generar sugerencias cuando cambie el mensaje
  useEffect(() => {
    if (formData.message.length > 20) {
      const newSuggestions = getIssueSuggestions(formData.message);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [formData.message, getIssueSuggestions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    updateField(field, value);
  };

  const getStatusIcon = () => {
    switch (submitStatus) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Send className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (submitStatus) {
      case 'loading':
        return 'Enviando...';
      case 'success':
        return 'Enviado';
      case 'error':
        return 'Error';
      default:
        return 'Enviar';
    }
  };

  const isSubmitDisabled = submitStatus === 'loading' || !isFormComplete();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-500" />
          Formulario de Soporte
        </CardTitle>
        
        {/* Barra de progreso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progreso del formulario</span>
            <span>{getFormProgress()}%</span>
          </div>
          <Progress value={getFormProgress()} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipos de problemas rápidos */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Tipo de problema (selección rápida)
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(SUPPORT_ISSUES).map(([key, value]) => (
                <Badge
                  key={key}
                  variant={formData.issue === value ? "default" : "outline"}
                  className="cursor-pointer hover:bg-blue-50 transition-colors"
                  onClick={() => selectIssueType(key as keyof typeof SUPPORT_ISSUES)}
                >
                  {value}
                </Badge>
              ))}
            </div>
          </div>

          {/* Nombre */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Nombre completo
            </label>
            <Input
              id="name"
              type="text"
              placeholder="Tu nombre completo"
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              maxLength={FORM_VALIDATION.MAX_NAME_LENGTH}
              required
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.name.length}/{FORM_VALIDATION.MAX_NAME_LENGTH}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="mail" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email de contacto
            </label>
            <Input
              id="mail"
              type="email"
              placeholder="tu@email.com"
              value={formData.mail}
              onChange={(e) => handleFieldChange('mail', e.target.value)}
              required
            />
          </div>

          {/* Asunto */}
          <div className="space-y-2">
            <label htmlFor="issue" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Asunto del problema
            </label>
            <Input
              id="issue"
              type="text"
              placeholder="Describe brevemente el problema"
              value={formData.issue}
              onChange={(e) => handleFieldChange('issue', e.target.value)}
              maxLength={FORM_VALIDATION.MAX_ISSUE_LENGTH}
              required
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.issue.length}/{FORM_VALIDATION.MAX_ISSUE_LENGTH}
            </div>
          </div>

          {/* Mensaje */}
          <div className="space-y-2">
            <label htmlFor="message" className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Descripción detallada
            </label>
            <Textarea
              id="message"
              placeholder="Describe tu problema o consulta en detalle..."
              value={formData.message}
              onChange={(e) => handleFieldChange('message', e.target.value)}
              rows={5}
              maxLength={FORM_VALIDATION.MAX_MESSAGE_LENGTH}
              required
            />
            <div className="text-xs text-gray-500 text-right">
              {formData.message.length}/{FORM_VALIDATION.MAX_MESSAGE_LENGTH}
            </div>
          </div>

          {/* Sugerencias de asunto */}
          {showSuggestions && suggestions.length > 0 && (
            <Alert className="border-blue-200 bg-blue-50">
              <Lightbulb className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800">
                <div className="space-y-2">
                  <p className="font-medium">Sugerencias de asunto basadas en tu mensaje:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-blue-100 transition-colors"
                        onClick={() => {
                          selectIssueType(suggestion as keyof typeof SUPPORT_ISSUES);
                          setShowSuggestions(false);
                        }}
                      >
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Mensajes de estado */}
          {errorMessage && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}

          {successMessage && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {successMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={isSubmitDisabled}
              className="flex-1"
            >
              {getStatusIcon()}
              {getStatusText()}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={submitStatus === 'loading'}
            >
              Limpiar
            </Button>
          </div>

          {/* Información adicional */}
          <div className="text-xs text-gray-500 text-center pt-4 border-t">
            <p>Nuestro equipo de soporte te responderá en las próximas 24 horas.</p>
            <p>Para emergencias técnicas, contacta directamente a soporte@bytetech.edu</p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SupportForm;
