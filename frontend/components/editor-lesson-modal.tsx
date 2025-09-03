// ============================================================================
// 📚 EDITOR LESSON MODAL COMPONENT
// ============================================================================
// Componente modal para agregar una nueva lección

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Upload, X, FileText, Video, AlertCircle } from 'lucide-react';
import { LessonFormData } from '@/hooks/use-editor';
import { FILE_VALIDATION, SUPPORTED_FILE_TYPES, FORM_VALIDATION } from '@/lib/editor-config';

interface EditorLessonModalProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onSubmit: (lessonData: LessonFormData) => void;
}

export const EditorLessonModal: React.FC<EditorLessonModalProps> = ({
  isOpen,
  isLoading,
  error,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState<LessonFormData>({
    title: '',
    file: null
  });
  const [validationErrors, setValidationErrors] = useState<{
    title?: string;
    file?: string;
  }>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const errors: { title?: string; file?: string } = {};

    // Validar título
    if (!formData.title || formData.title.length < FORM_VALIDATION.LESSON.TITLE.MIN_LENGTH) {
      errors.title = `El título debe tener al menos ${FORM_VALIDATION.LESSON.TITLE.MIN_LENGTH} caracteres`;
    } else if (formData.title.length > FORM_VALIDATION.LESSON.TITLE.MAX_LENGTH) {
      errors.title = `El título no puede exceder ${FORM_VALIDATION.LESSON.TITLE.MAX_LENGTH} caracteres`;
    }

    // Validar archivo
    if (!formData.file) {
      errors.file = 'Debes seleccionar un archivo';
    } else {
      if (formData.file.size < FILE_VALIDATION.MIN_SIZE) {
        errors.file = 'El archivo es demasiado pequeño';
      } else {
        const isVideo = SUPPORTED_FILE_TYPES.VIDEO.includes(formData.file.type as any);
        const isDocument = SUPPORTED_FILE_TYPES.DOCUMENT.includes(formData.file.type as any);
        
        if (!isVideo && !isDocument) {
          errors.file = 'Tipo de archivo no soportado';
        } else {
          const maxSize = isVideo ? FILE_VALIDATION.MAX_SIZE.VIDEO : FILE_VALIDATION.MAX_SIZE.DOCUMENT;
          if (formData.file.size > maxSize) {
            errors.file = `El archivo es demasiado grande (máximo ${Math.round(maxSize / (1024 * 1024))}MB)`;
          }
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
    
    // Limpiar error de archivo al seleccionar uno nuevo
    if (file) {
      setValidationErrors(prev => ({ ...prev, file: undefined }));
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({ ...prev, title }));
    
    // Limpiar error de título al escribir
    if (title) {
      setValidationErrors(prev => ({ ...prev, title: undefined }));
    }
  };

  const getFileTypeIcon = (file: File) => {
    const isVideo = SUPPORTED_FILE_TYPES.VIDEO.includes(file.type as any);
    return isVideo ? <Video className="w-4 h-4 text-red-400" /> : <FileText className="w-4 h-4 text-blue-400" />;
  };

  const getFileTypeBadge = (file: File) => {
    const isVideo = SUPPORTED_FILE_TYPES.VIDEO.includes(file.type as any);
    return (
      <Badge className={`font-mono text-xs ${
        isVideo ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
      }`}>
        {isVideo ? 'video' : 'documento'}
      </Badge>
    );
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-slate-900/95 border border-slate-800 rounded-xl p-6 w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="font-mono text-lg font-bold text-white">
              Agregar Lección
            </CardTitle>
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
            {/* Mensaje de error */}
            {error && (
              <Alert className="border-red-500/30 bg-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-400" />
                <AlertDescription className="text-red-400 font-mono text-sm">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {/* Título de la lección */}
            <div>
              <label className="block text-cyan-400 font-mono text-sm mb-2">
                TÍTULO DE LA LECCIÓN
              </label>
              <Input
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="Introducción al curso..."
                className={`bg-slate-800/50 border-slate-700 text-white font-mono ${
                  validationErrors.title ? 'border-red-500' : ''
                }`}
                required
              />
              {validationErrors.title && (
                <p className="text-red-400 font-mono text-xs mt-1">
                  {validationErrors.title}
                </p>
              )}
            </div>

            {/* Selección de archivo */}
            <div>
              <label className="block text-cyan-400 font-mono text-sm mb-2">
                ARCHIVO
              </label>
              <div className="border-2 border-dashed border-slate-700 rounded-lg p-4 text-center">
                <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileChange}
                  accept="video/*,.pdf,.doc,.docx"
                  className="hidden"
                  id="lesson-file"
                  required
                />
                <label htmlFor="lesson-file" className="cursor-pointer">
                  <span className="text-cyan-400 font-mono text-sm">
                    Haz clic para seleccionar archivo
                  </span>
                  <p className="text-slate-500 font-mono text-xs mt-1">
                    Videos, PDFs, documentos soportados
                  </p>
                </label>
                
                {/* Información del archivo seleccionado */}
                {formData.file && (
                  <div className="mt-3 p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      {getFileTypeIcon(formData.file)}
                      <span className="text-white font-mono text-sm">
                        {formData.file.name}
                      </span>
                      {getFileTypeBadge(formData.file)}
                    </div>
                    <div className="text-slate-400 font-mono text-xs">
                      Tamaño: {formatFileSize(formData.file.size)}
                    </div>
                  </div>
                )}
              </div>
              {validationErrors.file && (
                <p className="text-red-400 font-mono text-xs mt-1">
                  {validationErrors.file}
                </p>
              )}
            </div>

            {/* Información de tipos soportados */}
            <div className="bg-slate-800/30 rounded-lg p-3">
              <h4 className="text-slate-300 font-mono text-sm mb-2">
                Tipos de archivo soportados:
              </h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Video className="w-3 h-3 text-red-400" />
                  <span className="text-slate-400 font-mono text-xs">
                    Videos: MP4, WebM, OGG, AVI, MOV (máx. 500MB)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText className="w-3 h-3 text-blue-400" />
                  <span className="text-slate-400 font-mono text-xs">
                    Documentos: PDF, DOC, DOCX (máx. 50MB)
                  </span>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                disabled={isLoading || !formData.title || !formData.file}
                className="flex-1 bg-green-500 hover:bg-green-600 text-black font-mono"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Lección
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
