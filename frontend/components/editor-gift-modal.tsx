// ============================================================================
// 🎁 EDITOR GIFT MODAL COMPONENT
// ============================================================================
// Componente modal para regalar un curso a un usuario

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Gift, X, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import { GiftFormData } from '@/hooks/use-editor';

interface EditorGiftModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  success: string | null;
  courseName: string;
  onClose: () => void;
  onSubmit: () => void;
  onFormChange: (data: GiftFormData) => void;
  formData: GiftFormData;
}

export const EditorGiftModal: React.FC<EditorGiftModalProps> = ({
  isOpen,
  isLoading,
  error,
  success,
  courseName,
  onClose,
  onSubmit,
  onFormChange,
  formData
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      setValidationError('Debes ingresar un email');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setValidationError('Debes ingresar un email válido');
      return;
    }
    
    setValidationError(null);
    onSubmit();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    onFormChange({ ...formData, email });
    
    // Limpiar errores de validación al escribir
    if (validationError) {
      setValidationError(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-slate-900/95 border border-slate-800 rounded-xl p-6 w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-400" />
              <CardTitle className="font-mono text-lg font-bold text-white">
                Regalar curso
              </CardTitle>
            </div>
            <Button 
              onClick={onClose} 
              variant="ghost" 
              size="sm"
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Información del curso */}
            <div className="bg-slate-800/30 rounded-lg p-3">
              <h4 className="text-slate-300 font-mono text-sm mb-1">
                Curso a regalar:
              </h4>
              <p className="text-white font-mono text-sm">
                {courseName}
              </p>
            </div>

            {/* Mensajes de estado */}
            {error && (
              <Alert className="border-red-500/30 bg-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <AlertDescription className="text-red-400 font-mono text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-500/30 bg-green-500/20">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <AlertDescription className="text-green-400 font-mono text-sm">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            {/* Email del usuario */}
            <div>
              <label className="block text-cyan-400 font-mono text-sm mb-2">
                Email del usuario
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={handleEmailChange}
                  placeholder="usuario@email.com"
                  className={`bg-slate-800/50 border-slate-700 text-white font-mono pl-10 ${
                    validationError ? 'border-red-500' : ''
                  }`}
                  required
                />
              </div>
              {validationError && (
                <p className="text-red-400 font-mono text-xs mt-1">
                  {validationError}
                </p>
              )}
            </div>

            {/* Información adicional */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <h4 className="text-blue-400 font-mono text-sm mb-2">
                ℹ️ Información importante:
              </h4>
              <ul className="text-slate-400 font-mono text-xs space-y-1">
                <li>• El usuario recibirá acceso completo al curso</li>
                <li>• La transferencia es inmediata y permanente</li>
                <li>• El usuario debe tener una cuenta registrada</li>
                <li>• Esta acción no se puede deshacer</li>
              </ul>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={isLoading || !formData.email}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-black font-mono"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    Regalar
                  </>
                )}
              </Button>
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
