// ============================================================================
// 👤 FORMULARIO DE PERFIL MEJORADO - ByteTechEdu
// ============================================================================

"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Mail, 
  Edit, 
  Save, 
  X, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useProfile, ProfileFormState } from '@/hooks/use-profile';
import { PROFILE_VALIDATION } from '@/lib/profile-config';

type ProfileHook = ReturnType<typeof useProfile>

export const ProfileForm = ({ profileHook }: { profileHook?: ProfileHook }) => {
  const {
    profile,
    profileForm,
    editMode,
    isSaving,
    error,
    updateProfileField,
    updateProfile,
    cancelEdit,
    setEditMode,
    hasProfileChanges
  } = profileHook ?? useProfile();

  const [localError, setLocalError] = useState<string>('');

  const handleFieldChange = (field: keyof ProfileFormState, value: string) => {
    updateProfileField(field, value);
    setLocalError('');
  };

  const handleSave = async () => {
    const success = await updateProfile();
    if (success) {
      setLocalError('');
    }
  };

  const handleCancel = () => {
    cancelEdit();
    setLocalError('');
  };

  const isEditing = editMode === 'profile';
  const canSave = hasProfileChanges() && !isSaving;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            Credenciales
          </CardTitle>
          
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode('profile')}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
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
        {/* Credenciales básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <User className="w-4 h-4" />
              Nombre completo
            </label>
            <Input
              value={profileForm.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              placeholder="Tu nombre completo"
              disabled={!isEditing}
              maxLength={PROFILE_VALIDATION.NAME.MAX_LENGTH}
              className={isEditing ? '' : 'bg-gray-50'}
            />
            <div className="text-xs text-gray-500 text-right">
              {profileForm.name.length}/{PROFILE_VALIDATION.NAME.MAX_LENGTH}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <Input
              type="email"
              value={profileForm.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder="tu@email.com"
              disabled={!isEditing}
              className={isEditing ? '' : 'bg-gray-50'}
            />
          </div>
        </div>

        {/* Mensajes de error */}
        {(error || localError) && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || localError}
            </AlertDescription>
          </Alert>
        )}

        {/* Indicador de cambios */}
        {isEditing && hasProfileChanges() && (
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

export default ProfileForm;
