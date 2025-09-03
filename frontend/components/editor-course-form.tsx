// ============================================================================
// 📚 EDITOR COURSE FORM COMPONENT
// ============================================================================
// Componente para editar los metadatos de un curso

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Edit, Save, X, DollarSign, Clock, Users } from 'lucide-react';
import { EditFormData } from '@/hooks/use-editor';
import { FORM_VALIDATION } from '@/lib/editor-config';

interface EditorCourseFormProps {
  course: {
    id: number;
    name: string;
    description: string;
    price: number;
    hours: number;
    students?: number;
  };
  editForm: EditFormData;
  isEditing: boolean;
  isSaving: boolean;
  error: string | null;
  success: string | null;
  onEditFormChange: (data: EditFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  onStartEditing: () => void;
}

export const EditorCourseForm: React.FC<EditorCourseFormProps> = ({
  course,
  editForm,
  isEditing,
  isSaving,
  error,
  success,
  onEditFormChange,
  onSave,
  onCancel,
  onStartEditing
}) => {
  const handleInputChange = (field: keyof EditFormData, value: string) => {
    onEditFormChange({ ...editForm, [field]: value });
  };

  const validateField = (field: keyof EditFormData, value: string): string | null => {
    switch (field) {
      case 'name':
        if (!value || value.length < FORM_VALIDATION.COURSE.NAME.MIN_LENGTH) {
          return `El nombre debe tener al menos ${FORM_VALIDATION.COURSE.NAME.MIN_LENGTH} caracteres`;
        }
        if (value.length > FORM_VALIDATION.COURSE.NAME.MAX_LENGTH) {
          return `El nombre no puede exceder ${FORM_VALIDATION.COURSE.NAME.MAX_LENGTH} caracteres`;
        }
        break;
      case 'description':
        if (!value || value.length < FORM_VALIDATION.COURSE.DESCRIPTION.MIN_LENGTH) {
          return `La descripción debe tener al menos ${FORM_VALIDATION.COURSE.DESCRIPTION.MIN_LENGTH} caracteres`;
        }
        if (value.length > FORM_VALIDATION.COURSE.DESCRIPTION.MAX_LENGTH) {
          return `La descripción no puede exceder ${FORM_VALIDATION.COURSE.DESCRIPTION.MAX_LENGTH} caracteres`;
        }
        break;
      case 'price':
        const price = parseFloat(value);
        if (isNaN(price) || price < FORM_VALIDATION.COURSE.PRICE.MIN) {
          return `El precio debe ser mayor o igual a $${FORM_VALIDATION.COURSE.PRICE.MIN}`;
        }
        if (price > FORM_VALIDATION.COURSE.PRICE.MAX) {
          return `El precio no puede exceder $${FORM_VALIDATION.COURSE.PRICE.MAX}`;
        }
        break;
      case 'hours':
        const hours = parseFloat(value);
        if (isNaN(hours) || hours < FORM_VALIDATION.COURSE.HOURS.MIN) {
          return `Las horas deben ser mayor o igual a ${FORM_VALIDATION.COURSE.HOURS.MIN}`;
        }
        if (hours > FORM_VALIDATION.COURSE.HOURS.MAX) {
          return `Las horas no pueden exceder ${FORM_VALIDATION.COURSE.HOURS.MAX}`;
        }
        break;
    }
    return null;
  };

  const getFieldError = (field: keyof EditFormData): string | null => {
    return validateField(field, editForm[field]);
  };

  const hasErrors = (): boolean => {
    return Object.keys(editForm).some(key => 
      getFieldError(key as keyof EditFormData) !== null
    );
  };

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-mono text-xl font-bold text-white">
            {">"} {course.name}
          </CardTitle>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={onSave}
                  disabled={isSaving || hasErrors()}
                  className="bg-green-500 hover:bg-green-600 text-black font-mono"
                >
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </>
                  )}
                </Button>
                <Button
                  onClick={onCancel}
                  variant="outline"
                  className="border-slate-700 text-slate-300 hover:bg-slate-800"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </Button>
              </>
            ) : (
              <Button
                onClick={onStartEditing}
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-mono"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Mensajes de estado */}
        {error && (
          <Alert className="border-red-500/30 bg-red-500/20">
            <AlertDescription className="text-red-400 font-mono text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="border-green-500/30 bg-green-500/20">
            <AlertDescription className="text-green-400 font-mono text-sm">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Formulario de edición */}
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-cyan-400 font-mono text-sm mb-2">
                NOMBRE DEL CURSO
              </label>
              <Input
                value={editForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`bg-slate-800/50 border-slate-700 text-white font-mono ${
                  getFieldError('name') ? 'border-red-500' : ''
                }`}
                placeholder="Introduce el nombre del curso"
              />
              {getFieldError('name') && (
                <p className="text-red-400 font-mono text-xs mt-1">
                  {getFieldError('name')}
                </p>
              )}
            </div>

            <div>
              <label className="block text-cyan-400 font-mono text-sm mb-2">
                DESCRIPCIÓN
              </label>
              <Textarea
                value={editForm.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className={`bg-slate-800/50 border-slate-700 text-white font-mono ${
                  getFieldError('description') ? 'border-red-500' : ''
                }`}
                placeholder="Describe el contenido y objetivos del curso"
              />
              {getFieldError('description') && (
                <p className="text-red-400 font-mono text-xs mt-1">
                  {getFieldError('description')}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-cyan-400 font-mono text-sm mb-2">
                  PRECIO ($)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editForm.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`bg-slate-800/50 border-slate-700 text-white font-mono ${
                    getFieldError('price') ? 'border-red-500' : ''
                  }`}
                  placeholder="0.00"
                />
                {getFieldError('price') && (
                  <p className="text-red-400 font-mono text-xs mt-1">
                    {getFieldError('price')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-cyan-400 font-mono text-sm mb-2">
                  HORAS
                </label>
                <Input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={editForm.hours}
                  onChange={(e) => handleInputChange('hours', e.target.value)}
                  className={`bg-slate-800/50 border-slate-700 text-white font-mono ${
                    getFieldError('hours') ? 'border-red-500' : ''
                  }`}
                  placeholder="0.5"
                />
                {getFieldError('hours') && (
                  <p className="text-red-400 font-mono text-xs mt-1">
                    {getFieldError('hours')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Vista de solo lectura */
          <div className="space-y-4">
            <p className="text-slate-300 leading-relaxed">
              {course.description}
            </p>
            
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-mono">${course.price}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-cyan-400 font-mono">{course.hours}h</span>
              </div>
              
              {course.students && (
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 font-mono">
                    {course.students} estudiantes
                  </span>
                </div>
              )}
            </div>

            {/* Información adicional */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <Badge className="bg-slate-700 text-slate-300 font-mono text-xs">
                  ID: {course.id}
                </Badge>
                <Badge className="bg-blue-500/20 text-blue-400 font-mono text-xs">
                  Editor Activo
                </Badge>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
