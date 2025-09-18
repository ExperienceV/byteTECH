// ============================================================================
// 🔐 FORMULARIO DE CAMBIO DE CONTRASEÑA - ByteTechEdu
// ============================================================================

"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  X, 
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { useProfile, PasswordFormState } from '@/hooks/use-profile';
import { PROFILE_VALIDATION } from '@/lib/profile-config';

type ProfileHook = ReturnType<typeof useProfile>

export const PasswordForm = ({ profileHook }: { profileHook?: ProfileHook }) => {
  const {
    editMode,
    isSaving,
    error,
    passwordForm,
    updatePasswordField,
    updatePassword,
    cancelEdit,
    setEditMode,
    hasPasswordChanges
  } = profileHook ?? useProfile();

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [localError, setLocalError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleFieldChange = (field: keyof PasswordFormState, value: string) => {
    updatePasswordField(field, value);
    setLocalError('');
    setSuccessMessage('');
  };

  const handleSave = async () => {
    const success = await updatePassword();
    if (success) {
      setSuccessMessage('Contraseña actualizada correctamente');
      setLocalError('');
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleCancel = () => {
    cancelEdit();
    setLocalError('');
    setSuccessMessage('');
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const isEditing = editMode === 'password';
  const canSave = hasPasswordChanges() && !isSaving;

  // Validación en tiempo real
  const getPasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: '' };
    
    let score = 0;
    const checks = {
      length: password.length >= PROFILE_VALIDATION.PASSWORD.MIN_LENGTH,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      numbers: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    score += checks.length ? 1 : 0;
    score += checks.uppercase ? 1 : 0;
    score += checks.lowercase ? 1 : 0;
    score += checks.numbers ? 1 : 0;
    score += checks.special ? 1 : 0;

    if (score <= 2) return { score, label: 'Débil', color: 'text-red-500' };
    if (score <= 3) return { score, label: 'Media', color: 'text-yellow-500' };
    if (score <= 4) return { score, label: 'Fuerte', color: 'text-blue-500' };
    return { score, label: 'Muy Fuerte', color: 'text-green-500' };
  };

  const passwordStrength = getPasswordStrength(passwordForm.new_password);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-red-500" />
            Cambiar Contraseña
          </CardTitle>
          
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode('password')}
              className="flex items-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Cambiar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!canSave}
                className="flex items-center gap-2"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isSaving ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Contraseña actual */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Contraseña actual
          </label>
          <div className="relative">
            <Input
              type={showPasswords.current ? "text" : "password"}
              value={passwordForm.current_password}
              onChange={(e) => handleFieldChange('current_password', e.target.value)}
              placeholder="Ingresa tu contraseña actual"
              disabled={!isEditing}
              className={isEditing ? '' : 'bg-gray-50'}
            />
            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Nueva contraseña */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Nueva contraseña
          </label>
          <div className="relative">
            <Input
              type={showPasswords.new ? "text" : "password"}
              value={passwordForm.new_password}
              onChange={(e) => handleFieldChange('new_password', e.target.value)}
              placeholder="Ingresa tu nueva contraseña"
              disabled={!isEditing}
              maxLength={PROFILE_VALIDATION.PASSWORD.MAX_LENGTH}
              className={isEditing ? '' : 'bg-gray-50'}
            />
            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
          
          {/* Indicador de fortaleza de contraseña */}
          {isEditing && passwordForm.new_password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Fortaleza:</span>
                <span className={passwordStrength.color}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength.score <= 2 ? 'bg-red-500' :
                    passwordStrength.score <= 3 ? 'bg-yellow-500' :
                    passwordStrength.score <= 4 ? 'bg-blue-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Requisitos de contraseña */}
          {isEditing && (
            <div className="text-xs text-gray-600 space-y-1">
              <p className="font-medium">La contraseña debe contener:</p>
              <ul className="space-y-1 ml-2">
                <li className={`flex items-center gap-1 ${
                  passwordForm.new_password.length >= PROFILE_VALIDATION.PASSWORD.MIN_LENGTH 
                    ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {passwordForm.new_password.length >= PROFILE_VALIDATION.PASSWORD.MIN_LENGTH 
                    ? <CheckCircle className="w-3 h-3" /> 
                    : <AlertCircle className="w-3 h-3" />
                  }
                  Al menos {PROFILE_VALIDATION.PASSWORD.MIN_LENGTH} caracteres
                </li>
                <li className={`flex items-center gap-1 ${
                  /[A-Z]/.test(passwordForm.new_password) ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {/[A-Z]/.test(passwordForm.new_password) 
                    ? <CheckCircle className="w-3 h-3" /> 
                    : <AlertCircle className="w-3 h-3" />
                  }
                  Al menos una mayúscula
                </li>
                <li className={`flex items-center gap-1 ${
                  /[a-z]/.test(passwordForm.new_password) ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {/[a-z]/.test(passwordForm.new_password) 
                    ? <CheckCircle className="w-3 h-3" /> 
                    : <AlertCircle className="w-3 h-3" />
                  }
                  Al menos una minúscula
                </li>
                <li className={`flex items-center gap-1 ${
                  /\d/.test(passwordForm.new_password) ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {/\d/.test(passwordForm.new_password) 
                    ? <CheckCircle className="w-3 h-3" /> 
                    : <AlertCircle className="w-3 h-3" />
                  }
                  Al menos un número
                </li>
                <li className={`flex items-center gap-1 ${
                  /[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.new_password) ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {/[!@#$%^&*(),.?":{}|<>]/.test(passwordForm.new_password) 
                    ? <CheckCircle className="w-3 h-3" /> 
                    : <AlertCircle className="w-3 h-3" />
                  }
                  Al menos un carácter especial
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Confirmar nueva contraseña */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Confirmar nueva contraseña
          </label>
          <div className="relative">
            <Input
              type={showPasswords.confirm ? "text" : "password"}
              value={passwordForm.confirm_password}
              onChange={(e) => handleFieldChange('confirm_password', e.target.value)}
              placeholder="Confirma tu nueva contraseña"
              disabled={!isEditing}
              className={isEditing ? '' : 'bg-gray-50'}
            />
            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
          
          {/* Indicador de coincidencia */}
          {isEditing && passwordForm.new_password && passwordForm.confirm_password && (
            <div className={`text-sm flex items-center gap-1 ${
              passwordForm.new_password === passwordForm.confirm_password 
                ? 'text-green-600' 
                : 'text-red-600'
            }`}>
              {passwordForm.new_password === passwordForm.confirm_password ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              {passwordForm.new_password === passwordForm.confirm_password 
                ? 'Las contraseñas coinciden' 
                : 'Las contraseñas no coinciden'
              }
            </div>
          )}
        </div>

        {/* Mensajes de estado */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {localError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{localError}</AlertDescription>
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

        {/* Indicador de cambios */}
        {isEditing && hasPasswordChanges() && (
          <Alert className="border-blue-200 bg-blue-50">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Tienes cambios sin guardar. Recuerda guardar antes de salir.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordForm;
