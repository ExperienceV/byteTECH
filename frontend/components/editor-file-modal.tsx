// ============================================================================
// 📁 EDITOR FILE MODAL COMPONENT
// ============================================================================
// Componente modal para visualizar archivos (videos, documentos, etc.)

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Download, ExternalLink, FileText, Video, Image } from 'lucide-react';

interface EditorFileModalProps {
  isOpen: boolean;
  fileUrl: string;
  fileType: string;
  fileName?: string;
  onClose: () => void;
}

export const EditorFileModal: React.FC<EditorFileModalProps> = ({
  isOpen,
  fileUrl,
  fileType,
  fileName,
  onClose
}) => {
  const getFileTypeIcon = () => {
    if (fileType === 'video') {
      return <Video className="w-5 h-5 text-red-400" />;
    } else if (fileType === 'document' || fileUrl.endsWith('.pdf')) {
      return <FileText className="w-5 h-5 text-blue-400" />;
    } else if (fileType === 'image') {
      return <Image className="w-5 h-5 text-green-400" />;
    }
    return <FileText className="w-5 h-5 text-slate-400" />;
  };

  const getFileTypeBadge = () => {
    if (fileType === 'video') {
      return <Badge className="bg-red-500/20 text-red-400 font-mono text-xs">Video</Badge>;
    } else if (fileType === 'document' || fileUrl.endsWith('.pdf')) {
      return <Badge className="bg-blue-500/20 text-blue-400 font-mono text-xs">Documento</Badge>;
    } else if (fileType === 'image') {
      return <Badge className="bg-green-500/20 text-green-400 font-mono text-xs">Imagen</Badge>;
    }
    return <Badge className="bg-slate-500/20 text-slate-400 font-mono text-xs">Archivo</Badge>;
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName || 'archivo';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(fileUrl, '_blank');
  };

  const renderFileContent = () => {
    if (fileType === 'video') {
      return (
        <video 
          src={fileUrl} 
          controls 
          className="w-full h-96 bg-black rounded-lg"
          preload="metadata"
        >
          Tu navegador no soporta la reproducción de videos.
        </video>
      );
    } else if (fileType === 'document' || fileUrl.endsWith('.pdf')) {
      return (
        <iframe 
          src={fileUrl} 
          className="w-full h-96 bg-white rounded-lg"
          title="Vista previa del documento"
        />
      );
    } else if (fileType === 'image') {
      return (
        <img 
          src={fileUrl} 
          alt={fileName || 'Imagen'} 
          className="w-full h-96 object-contain bg-slate-800 rounded-lg"
        />
      );
    } else {
      return (
        <div className="w-full h-96 bg-slate-800 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-16 h-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 font-mono">
              No se puede mostrar este tipo de archivo
            </p>
            <p className="text-slate-500 font-mono text-sm mt-2">
              Descarga el archivo para verlo
            </p>
          </div>
        </div>
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="bg-slate-900/95 border border-slate-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileTypeIcon()}
              <div>
                <CardTitle className="font-mono text-lg font-bold text-white">
                  Vista de archivo
                </CardTitle>
                {fileName && (
                  <p className="text-slate-400 font-mono text-sm">
                    {fileName}
                  </p>
                )}
              </div>
              {getFileTypeBadge()}
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Descargar
              </Button>
              <Button
                onClick={handleOpenInNewTab}
                variant="outline"
                size="sm"
                className="border-slate-700 text-slate-300 hover:bg-slate-800"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Abrir
              </Button>
              <Button 
                onClick={onClose} 
                variant="ghost" 
                size="sm"
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="overflow-auto">
          <div className="relative">
            {renderFileContent()}
            
            {/* Overlay de información */}
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg p-2">
              <div className="text-white font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span>Tipo:</span>
                  {getFileTypeBadge()}
                </div>
                {fileName && (
                  <div className="mt-1">
                    <span>Archivo:</span>
                    <span className="ml-1 text-slate-300">{fileName}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-4 p-3 bg-slate-800/30 rounded-lg">
            <h4 className="text-slate-300 font-mono text-sm mb-2">
              Controles:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-slate-400 font-mono text-xs">
              <div className="flex items-center gap-2">
                <Download className="w-3 h-3" />
                <span>Descargar archivo</span>
              </div>
              <div className="flex items-center gap-2">
                <ExternalLink className="w-3 h-3" />
                <span>Abrir en nueva pestaña</span>
              </div>
              <div className="flex items-center gap-2">
                <X className="w-3 h-3" />
                <span>Cerrar vista previa</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
