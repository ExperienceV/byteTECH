// ============================================================================
// 👤 HOOK PERSONALIZADO PARA PERFIL - ByteTechEdu
// ============================================================================

import { useState, useCallback, useEffect } from 'react';
import { 
  getUserProfile, 
  updateUserCredentials, 
  updateUserPassword, 
  getUserStats,
  uploadProfileImage,
  deleteUserAccount,
  handleApiError 
} from '@/lib/api';
import { 
  UserProfile, 
  UpdateProfileRequest, 
  UserStats, 
  ApiResponse 
} from '@/lib/api';
import { PROFILE_VALIDATION, USER_ROLES, VERIFICATION_STATUS } from '@/lib/profile-config';

// Estados del perfil
export type ProfileFormState = {
  name: string;
  email: string;
  bio?: string;
  location?: string;
  website?: string;
};

// Estados de la contraseña
export type PasswordFormState = {
  current_password: string;
  new_password: string;
  confirm_password: string;
};

// Estados de edición
export type EditMode = 'none' | 'profile' | 'password' | 'security' | 'notifications';

// Hook personalizado para perfil
export const useProfile = () => {
  // Estado del perfil
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Estado de edición
  const [editMode, setEditMode] = useState<EditMode>('none');
  const [isSaving, setIsSaving] = useState(false);

  // Estado de formularios
  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    name: '',
    email: '',
    bio: '',
    location: '',
    website: ''
  });

  const [passwordForm, setPasswordForm] = useState<PasswordFormState>({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Cargar perfil del usuario
  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');

      const response: ApiResponse<UserProfile> = await getUserProfile();
      
      if (response.ok) {
        setProfile(response.data);
        setProfileForm({
          name: response.data.name,
          email: response.data.email,
          bio: response.data.bio || '',
          location: response.data.location || '',
          website: response.data.website || ''
        });
      } else {
        setError(handleApiError(response));
      }
    } catch (err: any) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar estadísticas del usuario
  const loadStats = useCallback(async () => {
    try {
      const response: ApiResponse<UserStats> = await getUserStats();
      
      if (response.ok) {
        setStats(response.data);
      }
    } catch (err: any) {
      console.error('Error loading stats:', err);
    }
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    loadProfile();
    loadStats();
  }, [loadProfile, loadStats]);

  // Validar formulario de perfil
  const validateProfileForm = useCallback((data: ProfileFormState): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validar nombre
    if (!data.name.trim()) {
      errors.push('El nombre es requerido');
    } else if (data.name.length < PROFILE_VALIDATION.NAME.MIN_LENGTH) {
      errors.push(`El nombre debe tener al menos ${PROFILE_VALIDATION.NAME.MIN_LENGTH} caracteres`);
    } else if (data.name.length > PROFILE_VALIDATION.NAME.MAX_LENGTH) {
      errors.push(`El nombre no puede exceder ${PROFILE_VALIDATION.NAME.MAX_LENGTH} caracteres`);
    } else if (!PROFILE_VALIDATION.NAME.PATTERN.test(data.name)) {
      errors.push('El nombre solo puede contener letras y espacios');
    }

    // Validar email
    if (!data.email.trim()) {
      errors.push('El email es requerido');
    } else if (!PROFILE_VALIDATION.EMAIL.PATTERN.test(data.email)) {
      errors.push('El email no tiene un formato válido');
    }

    // Validar bio
    if (data.bio && data.bio.length > PROFILE_VALIDATION.BIO.MAX_LENGTH) {
      errors.push(`La biografía no puede exceder ${PROFILE_VALIDATION.BIO.MAX_LENGTH} caracteres`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Validar formulario de contraseña
  const validatePasswordForm = useCallback((data: PasswordFormState): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // Validar contraseña actual
    if (!data.current_password.trim()) {
      errors.push('La contraseña actual es requerida');
    }

    // Validar nueva contraseña
    if (!data.new_password.trim()) {
      errors.push('La nueva contraseña es requerida');
    } else if (data.new_password.length < PROFILE_VALIDATION.PASSWORD.MIN_LENGTH) {
      errors.push(`La nueva contraseña debe tener al menos ${PROFILE_VALIDATION.PASSWORD.MIN_LENGTH} caracteres`);
    } else if (data.new_password.length > PROFILE_VALIDATION.PASSWORD.MAX_LENGTH) {
      errors.push(`La nueva contraseña no puede exceder ${PROFILE_VALIDATION.PASSWORD.MAX_LENGTH} caracteres`);
    } else {
      // Validar requisitos de contraseña
      if (PROFILE_VALIDATION.PASSWORD.REQUIRE_UPPERCASE && !/[A-Z]/.test(data.new_password)) {
        errors.push('La contraseña debe contener al menos una mayúscula');
      }
      if (PROFILE_VALIDATION.PASSWORD.REQUIRE_LOWERCASE && !/[a-z]/.test(data.new_password)) {
        errors.push('La contraseña debe contener al menos una minúscula');
      }
      if (PROFILE_VALIDATION.PASSWORD.REQUIRE_NUMBERS && !/\d/.test(data.new_password)) {
        errors.push('La contraseña debe contener al menos un número');
      }
      if (PROFILE_VALIDATION.PASSWORD.REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*(),.?":{}|<>]/.test(data.new_password)) {
        errors.push('La contraseña debe contener al menos un carácter especial');
      }
    }

    // Validar confirmación
    if (data.new_password !== data.confirm_password) {
      errors.push('Las contraseñas no coinciden');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }, []);

  // Actualizar perfil
  const updateProfile = useCallback(async (): Promise<boolean> => {
    const validation = validateProfileForm(profileForm);
    if (!validation.isValid) {
      setError(validation.errors.join('. '));
      return false;
    }

    try {
      setIsSaving(true);
      setError('');

      const response = await updateUserCredentials(profileForm.name, profileForm.email);
      
      if (response.ok) {
        setProfile(response.data.user);
        setEditMode('none');
        return true;
      } else {
        setError(handleApiError(response));
        return false;
      }
    } catch (err: any) {
      setError(handleApiError(err));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [profileForm, validateProfileForm]);

  // Actualizar contraseña
  const updatePassword = useCallback(async (): Promise<boolean> => {
    const validation = validatePasswordForm(passwordForm);
    if (!validation.isValid) {
      setError(validation.errors.join('. '));
      return false;
    }

    try {
      setIsSaving(true);
      setError('');

      const response = await updateUserPassword(passwordForm.current_password, passwordForm.new_password);
      
      if (response.ok) {
        setPasswordForm({
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
        setEditMode('none');
        return true;
      } else {
        setError(handleApiError(response));
        return false;
      }
    } catch (err: any) {
      setError(handleApiError(err));
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [passwordForm, validatePasswordForm]);

  // Subir imagen de perfil
  const uploadImage = useCallback(async (file: File): Promise<boolean> => {
    try {
      const response = await uploadProfileImage(file);
      
      if (response.ok) {
        // Actualizar el perfil con la nueva imagen
        if (profile) {
          setProfile({ ...profile, profile_image: response.data.image_url });
        }
        return true;
      } else {
        setError(handleApiError(response));
        return false;
      }
    } catch (err: any) {
      setError(handleApiError(err));
      return false;
    }
  }, [profile]);

  // Eliminar cuenta
  const deleteAccount = useCallback(async (password: string): Promise<boolean> => {
    try {
      const response = await deleteUserAccount(password);
      
      if (response.ok) {
        return true;
      } else {
        setError(handleApiError(response));
        return false;
      }
    } catch (err: any) {
      setError(handleApiError(err));
      return false;
    }
  }, []);

  // Actualizar campo del formulario de perfil
  const updateProfileField = useCallback((field: keyof ProfileFormState, value: string) => {
    setProfileForm(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  }, [error]);

  // Actualizar campo del formulario de contraseña
  const updatePasswordField = useCallback((field: keyof PasswordFormState, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  }, [error]);

  // Cancelar edición
  const cancelEdit = useCallback(() => {
    if (profile) {
      setProfileForm({
        name: profile.name,
        email: profile.email,
        bio: profile.bio || '',
        location: profile.location || '',
        website: profile.website || ''
      });
    }
    setPasswordForm({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
    setEditMode('none');
    setError('');
  }, [profile]);

  // Obtener rol del usuario
  const getUserRole = useCallback((): string => {
    if (!profile) return '';
    
    if (profile.is_sensei) {
      return USER_ROLES.SENSEI;
    }
    return USER_ROLES.STUDENT;
  }, [profile]);

  // Obtener estado de verificación
  const getVerificationStatus = useCallback((): string => {
    if (!profile) return '';
    
    if (profile.is_verify) {
      return VERIFICATION_STATUS.VERIFIED;
    }
    return VERIFICATION_STATUS.PENDING;
  }, [profile]);

  // Verificar si hay cambios en el perfil
  const hasProfileChanges = useCallback((): boolean => {
    if (!profile) return false;
    
    return (
      profileForm.name !== profile.name ||
      profileForm.email !== profile.email ||
      profileForm.bio !== (profile.bio || '') ||
      profileForm.location !== (profile.location || '') ||
      profileForm.website !== (profile.website || '')
    );
  }, [profile, profileForm]);

  // Verificar si hay cambios en la contraseña
  const hasPasswordChanges = useCallback((): boolean => {
    return (
      passwordForm.current_password.trim() !== '' ||
      passwordForm.new_password.trim() !== '' ||
      passwordForm.confirm_password.trim() !== ''
    );
  }, [passwordForm]);

  return {
    // Estado
    profile,
    stats,
    isLoading,
    error,
    editMode,
    isSaving,
    profileForm,
    passwordForm,

    // Funciones
    loadProfile,
    loadStats,
    updateProfile,
    updatePassword,
    uploadImage,
    deleteAccount,
    updateProfileField,
    updatePasswordField,
    cancelEdit,
    setEditMode,

    // Utilidades
    getUserRole,
    getVerificationStatus,
    hasProfileChanges,
    hasPasswordChanges,
    validateProfileForm,
    validatePasswordForm
  };
};

export default useProfile;
