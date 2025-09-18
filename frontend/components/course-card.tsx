// ============================================================================
// 📚 COURSE CARD COMPONENT
// ============================================================================
// Componente de tarjeta de curso con funcionalidades avanzadas

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Edit, 
  BookOpen, 
  Clock, 
  DollarSign, 
  User, 
  Star,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle,
  Lock
} from 'lucide-react';
import { CourseData } from '@/hooks/use-courses';
import { UI_CONFIG } from '@/lib/courses-config';

interface CourseCardProps {
  course: CourseData;
  userType?: 'student' | 'sensei' | 'guest';
  showProgress?: boolean;
  showActions?: boolean;
  onViewCourse?: (courseId: number) => void;
  onEditCourse?: (courseId: number) => void;
  onPurchaseCourse?: (courseId: number) => void;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  userType = 'guest',
  showProgress = false,
  showActions = true,
  onViewCourse,
  onEditCourse,
  onPurchaseCourse,
  className = ''
}) => {
  // ============================================================================
  // 🧮 FUNCIONES DE CÁLCULO
  // ============================================================================

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return '#10B981'; // green
    if (percentage >= 75) return '#06B6D4'; // cyan
    if (percentage >= 50) return '#F59E0B'; // orange
    return '#EF4444'; // red
  };

  const formatPrice = (price: number) => {
    if (price === 0) return 'Gratis';
    return `${price.toFixed(2)}`;
  };

  const formatDuration = (hours?: number) => {
    if (!hours) return 'Duración variable';
    if (hours < 1) return `${Math.round(hours * 60)}m`;
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // ============================================================================
  // 🎨 FUNCIONES DE UI
  // ============================================================================

  // Estado: simplificado o no mostrado

  const getDifficultyBadge = () => {
    if (!course.difficulty) return null;
    
    const difficultyColors = {
      beginner: 'bg-green-500/20 text-green-400',
      intermediate: 'bg-yellow-500/20 text-yellow-400',
      advanced: 'bg-orange-500/20 text-orange-400',
      expert: 'bg-red-500/20 text-red-400'
    };
    
    return (
      <Badge className={`text-xs font-mono ${difficultyColors[course.difficulty as keyof typeof difficultyColors] || 'bg-slate-500/20 text-slate-400'}`}>
        {course.difficulty.charAt(0).toUpperCase() + course.difficulty.slice(1)}
      </Badge>
    );
  };

  const getCategoryBadge = () => {
    if (!course.category) return null;
    
    return (
      <Badge variant="outline" className="text-xs font-mono border-slate-600 text-slate-300">
        {course.category}
      </Badge>
    );
  };

  // ============================================================================
  // 🎯 FUNCIONES DE ACCIÓN
  // ============================================================================

  const handleViewCourse = () => {
    if (onViewCourse) {
      onViewCourse(course.id);
    }
  };

  const handleEditCourse = () => {
    if (onEditCourse && userType === 'sensei') {
      onEditCourse(course.id);
    }
  };

  const handlePurchaseCourse = () => {
    if (onPurchaseCourse && userType === 'guest') {
      onPurchaseCourse(course.id);
    }
  };

  // ============================================================================
  // 🖼️ RENDERIZADO DE IMAGEN
  // ============================================================================

  const renderCourseImage = () => {
    if (course.miniature_id) {
      return (
        <img
          src={`https://api.bytetechedu.com/api/media/get_file?file_id=${course.miniature_id}`}
          alt={course.name}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/api/placeholder/400/300';
          }}
        />
      );
    }

    return (
      <div className="w-full h-48 bg-gradient-to-br from-slate-700 to-slate-900 rounded-t-lg flex items-center justify-center">
        <BookOpen className="w-16 h-16 text-slate-500" />
      </div>
    );
  };

  // ============================================================================
  // 🎨 RENDERIZADO PRINCIPAL
  // ============================================================================

  return (
    <Card className={`bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 group ${className}`}>
      {/* Imagen del curso */}
      <div className="relative overflow-hidden rounded-t-lg">
        {renderCourseImage()}
        
        {/* Overlay superior derecho reservado (sin dificultad/estado) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2" />
        
        {/* Overlay de categoría */}
        {course.category && (
          <div className="absolute top-3 left-3">
            {getCategoryBadge()}
          </div>
        )}
        
        {/* Overlay de precio */}
        <div className="absolute bottom-3 right-3">
          <Badge className={`text-sm font-mono ${
            course.price === 0 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-slate-900/80 text-white'
          }`}>
            {formatPrice(course.price)}
          </Badge>
        </div>
      </div>

      {/* Contenido de la tarjeta */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="font-mono text-lg font-bold text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">
            {course.name}
          </CardTitle>
          
          {/* Rating */}
          {course.rating && (
            <div className="flex items-center gap-1 flex-shrink-0">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-yellow-400 font-mono text-sm">
                {course.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>
        
        {/* Descripción */}
        <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
          {course.description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Información del curso */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-slate-300">
            <User className="w-4 h-4 text-cyan-400" />
            <span className="font-mono">
              {course.sensei_name || course.instructor || 'Instructor'}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-4 h-4 text-purple-400" />
            <span className="font-mono">
              {formatDuration(course.hours)}
            </span>
          </div>
          
          {course.lessons_count && (
            <div className="flex items-center gap-2 text-slate-300">
              <BookOpen className="w-4 h-4 text-green-400" />
              <span className="font-mono">
                {course.lessons_count} lecciones
              </span>
            </div>
          )}
          
          {course.students_count && (
            <div className="flex items-center gap-2 text-slate-300">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="font-mono">
                {course.students_count} estudiantes
              </span>
            </div>
          )}
        </div>

        {/* Progreso del curso */}
        {showProgress && course.progress !== undefined && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300 font-mono">Progreso</span>
              <span className="text-cyan-400 font-mono font-medium">
                {course.progress}%
              </span>
            </div>
            <Progress 
              value={course.progress} 
              className="h-2"
              style={{
                '--progress-color': getProgressColor(course.progress)
              } as React.CSSProperties}
            />
            <div className="text-xs text-slate-400 font-mono text-center" />
          </div>
        )}

        {/* Fecha de creación/actualización */}
        {(course.created_at || course.updated_at) && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="w-3 h-3" />
            <span className="font-mono">
              {course.updated_at ? `Actualizado ${formatDate(course.updated_at)}` : `Creado ${formatDate(course.created_at)}`}
            </span>
          </div>
        )}

        {/* Botones de acción */}
        {showActions && (
          <div className="flex gap-2 pt-2">
            {/* Botón principal */}
            {userType === 'sensei' ? (
              <Button
                onClick={handleEditCourse}
                className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-mono"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            ) : course.progress !== undefined ? (
              <Button
                onClick={handleViewCourse}
                className="flex-1 bg-green-500 hover:bg-green-600 text-black font-mono"
              >
                {course.progress === 100 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completado
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Continuar
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handlePurchaseCourse}
                className="flex-1 bg-purple-500 hover:bg-purple-600 text-black font-mono"
              >
                {course.price === 0 ? (
                  <>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Inscribirse
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Comprar
                  </>
                )}
              </Button>
            )}

            {/* Botón secundario */}
            <Button
              onClick={handleViewCourse}
              variant="outline"
              size="sm"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
