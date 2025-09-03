// ============================================================================
// 👤 FORMULARIO DE PERFIL MEJORADO - ByteTechEdu
// ============================================================================

"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  MapPin, 
  Globe, 
  Edit, 
  Save, 
  X, 
  Camera,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useProfile, ProfileFormState } from '@/hooks/use-profile';
import { PROFILE_VALIDATION } from '@/lib/profile-config';

export const ProfileForm = () => {
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
  } = useProfile();

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
            Información del Perfil
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
        {/* Información básica */}
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

        {/* Información adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ubicación */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Ubicación
            </label>
            <Input
              value={profileForm.location || ''}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              placeholder="Ciudad, País"
              disabled={!isEditing}
              className={isEditing ? '' : 'bg-gray-50'}
            />
          </div>

          {/* Sitio web */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Sitio web
            </label>
            <Input
              value={profileForm.website || ''}
              onChange={(e) => handleFieldChange('website', e.target.value)}
              placeholder="https://tu-sitio.com"
              disabled={!isEditing}
              className={isEditing ? '' : 'bg-gray-50'}
            />
          </div>
        </div>

        {/* Biografía */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Biografía
          </label>
          <Textarea
            value={profileForm.bio || ''}
            onChange={(e) => handleFieldChange('bio', e.target.value)}
            placeholder="Cuéntanos sobre ti..."
            rows={4}
            disabled={!isEditing}
            maxLength={PROFILE_VALIDATION.BIO.MAX_LENGTH}
            className={isEditing ? '' : 'bg-gray-50'}
          />
          <div className="text-xs text-gray-500 text-right">
            {(profileForm.bio || '').length}/{PROFILE_VALIDATION.BIO.MAX_LENGTH}
          </div>
        </div>

        {/* Información del sistema */}
        {!isEditing && profile && (
          <>
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rol del usuario */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Rol
                </label>
                <Badge variant="secondary" className="w-fit">
                  {profile.is_sensei ? 'Sensei' : 'Estudiante'}
                </Badge>
              </div>

              {/* Estado de verificación */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Estado de verificación
                </label>
                <Badge 
                  variant={profile.is_verify ? "default" : "secondary"}
                  className="w-fit"
                >
                  {profile.is_verify ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verificado
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Pendiente
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </>
        )}

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
