// ============================================================================
// 📚 CURSOS PAGE - ByteTechEdu
// ============================================================================
// Página principal del catálogo de cursos con sistema de filtros y búsqueda

'use client';

import React, { useEffect } from 'react';
import { useCourses } from '@/hooks/use-courses';
import { CourseCard } from '@/components/course-card';
import { CoursesFilters } from '@/components/courses-filters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Star, 
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Info,
  X,
  BarChart3
} from 'lucide-react';
import { MESSAGES, UI_CONFIG } from '@/lib/courses-config';
import { CourseProgress } from '@/components/course-progress';

export default function CursosPage() {
  const {
    // Estado
    availableCourses,
    myCourses,
    isLoading,
    isLoadingMyCourses,
    error,
    myCoursesError,
    success,
    searchQuery,
    filters,
    sortBy,
    pageSize,
    totalCourses,
    userType,
    
    // Funciones de carga
    loadAvailableCourses,
    loadMyCourses,
    
    // Funciones de búsqueda y filtrado
    updateSearchQuery,
    applyFilters,
    clearFilters,
    changeSorting,
    selectCategory,
    
    // Funciones de paginación
    goToPage,
    changePageSize,
    
    // Funciones de navegación
    navigateToCourse,
    navigateToEditor,
    navigateToPurchase,
    
    // Funciones de limpieza
    clearErrors,
    clearSuccess
  } = useCourses();

  // ============================================================================
  // 🔄 EFECTOS
  // ============================================================================

  useEffect(() => {
    // Cargar mis cursos al montar el componente
    loadMyCourses();
  }, [loadMyCourses]);

  // ============================================================================
  // 🎯 FUNCIONES DE MANEJO
  // ============================================================================

  const handleViewCourse = (courseId: number) => {
    navigateToCourse(courseId);
  };

  const handleEditCourse = (courseId: number) => {
    navigateToEditor(courseId);
  };

  const handlePurchaseCourse = (courseId: number) => {
    navigateToPurchase(courseId);
  };

  const handleRefresh = () => {
    loadAvailableCourses();
    loadMyCourses();
  };

  // ============================================================================
  // 🧮 FUNCIONES DE CÁLCULO
  // ============================================================================

  const getPaginatedCourses = () => {
    const filtered = availableCourses.filter(course => {
      // Aplicar búsqueda por texto
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!course.name.toLowerCase().includes(query) &&
            !course.description.toLowerCase().includes(query) &&
            !(course.sensei_name && course.sensei_name.toLowerCase().includes(query))) {
          return false;
        }
      }

      // Aplicar filtros
      if (filters.priceRange) {
        if (course.price < filters.priceRange.min || course.price > filters.priceRange.max) {
          return false;
        }
      }

      if (filters.durationRange) {
        const hours = course.hours || 0;
        if (hours < filters.durationRange.min || hours > filters.durationRange.max) {
          return false;
        }
      }

      if (filters.difficulty && course.difficulty !== filters.difficulty) {
        return false;
      }

      if (filters.category && course.category !== filters.category) {
        return false;
      }

      if (filters.isFree !== null) {
        if (filters.isFree && course.price !== 0) return false;
        if (!filters.isFree && course.price === 0) return false;
      }

      return true;
    });

    return filtered;
  };

  const getCourseStats = () => {
    const filtered = getPaginatedCourses();
    const total = filtered.length;
    const free = filtered.filter(c => c.price === 0).length;
    const paid = total - free;
    const avgPrice = paid > 0 ? filtered.filter(c => c.price > 0).reduce((acc, c) => acc + c.price, 0) / paid : 0;
    const avgDuration = filtered.reduce((acc, c) => acc + (c.hours || 0), 0) / total;

    return { total, free, paid, avgPrice, avgDuration };
  };

  // ============================================================================
  // 🎨 COMPONENTES DE UI
  // ============================================================================

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: pageSize }).map((_, index) => (
        <Card key={index} className="bg-slate-900/80 backdrop-blur-sm border border-slate-800">
          <Skeleton className="w-full h-48 rounded-t-lg" />
          <CardHeader className="pb-3">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 w-12" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderNoResults = () => (
    <Card className="bg-slate-900/80 backdrop-blur-sm border border-slate-800">
      <CardContent className="p-12 text-center">
        <BookOpen className="w-16 h-16 text-slate-500 mx-auto mb-4" />
        <h3 className="text-xl font-mono font-bold text-white mb-2">
          No se encontraron resultados
        </h3>
        <p className="text-slate-400 mb-6">
          No hay cursos que coincidan con tu búsqueda o filtros actuales.
        </p>
        <div className="flex gap-2 justify-center">
          <Button onClick={clearFilters} variant="outline" className="border-slate-700 text-slate-300">
            Limpiar filtros
          </Button>
          <Button onClick={handleRefresh} className="bg-cyan-500 hover:bg-cyan-600 text-black">
            <RefreshCw className="w-4 h-4 mr-2" />
            Recargar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCourseGrid = () => {
    const filteredCourses = getPaginatedCourses();
    
    if (filteredCourses.length === 0) {
      return renderNoResults();
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            userType={userType}
            showProgress={false}
            showActions={true}
            onViewCourse={handleViewCourse}
            onEditCourse={handleEditCourse}
            onPurchaseCourse={handlePurchaseCourse}
          />
        ))}
      </div>
    );
  };

  const renderStats = () => {
    const stats = getCourseStats();

  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-slate-900/80 backdrop-blur-sm border border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-slate-400 font-mono text-sm">Total Cursos</p>
                <p className="text-white font-mono text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-sm border border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-slate-400 font-mono text-sm">Gratis</p>
                <p className="text-white font-mono text-xl font-bold">{stats.free}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-sm border border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Clock className="w-5 h-5 text-purple-400" />
          </div>
              <div>
                <p className="text-slate-400 font-mono text-sm">Promedio</p>
                <p className="text-white font-mono text-xl font-bold">
                  {stats.avgDuration.toFixed(1)}h
              </p>
            </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 backdrop-blur-sm border border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <TrendingUp className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-slate-400 font-mono text-sm">Precio Prom.</p>
                <p className="text-white font-mono text-xl font-bold">
                  ${stats.avgPrice.toFixed(2)}
                </p>
          </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderMyCourses = () => {
    if (userType === 'guest' || myCourses.length === 0) return null;

    return (
      <Card className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white font-mono">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Mis Cursos
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-400">
              {myCourses.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCourses.slice(0, 3).map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                userType={userType}
                showProgress={true}
                showActions={true}
                onViewCourse={handleViewCourse}
                onEditCourse={handleEditCourse}
                onPurchaseCourse={handlePurchaseCourse}
                className="h-full"
                />
              ))}
          </div>
          {myCourses.length > 3 && (
            <div className="text-center mt-4">
              <Button variant="outline" className="border-slate-700 text-slate-300">
                Ver todos mis cursos
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // ============================================================================
  // 🎨 RENDERIZADO
  // ============================================================================

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header con título y estadísticas */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {MESSAGES.PAGE_TITLE}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {MESSAGES.PAGE_DESCRIPTION}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros de búsqueda */}
        <CoursesFilters
          searchQuery={searchQuery}
          filters={filters}
          sortBy={sortBy}
          onSearchChange={updateSearchQuery}
          onFiltersChange={applyFilters}
          onClearFilters={clearFilters}
          onSortChange={changeSorting}
          onCategorySelect={selectCategory}
          className="mb-8"
        />

        {/* Sección de Progreso del Usuario */}
        {myCourses.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Mi Progreso de Aprendizaje
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {myCourses.slice(0, 3).map((course) => (
                <CourseProgress
                  key={course.id}
                  courseId={course.id}
                  courseName={course.name}
                  totalLessons={course.lessons_count || 0}
                  completedLessons={course.completed_lessons || 0}
                  totalHours={course.hours || 0}
                  completedHours={course.completed_hours || 0}
                  progressPercentage={course.progress || 0}
                  isPaid={course.is_paid || false}
                  onRefresh={() => loadMyCourses()}
                />
              ))}
            </div>
            
            {myCourses.length > 3 && (
              <div className="text-center mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => loadMyCourses()}
                  className="text-blue-600 hover:text-blue-700"
                >
                  Ver todos mis cursos ({myCourses.length})
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Contenido principal */}
        <div className="space-y-8">
          {/* Mensajes de estado */}
          {error && (
            <Alert className="mb-6 border-red-500/20 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">
                {error}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearErrors}
                  className="ml-2 text-red-300 hover:text-red-200 hover:bg-red-500/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {myCoursesError && (
            <Alert className="mb-6 border-yellow-500/20 bg-yellow-500/10">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-400">
                {myCoursesError}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearErrors}
                  className="ml-2 text-yellow-300 hover:text-yellow-200 hover:bg-yellow-500/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-500/20 bg-green-500/10">
              <CheckCircle className="h-4 w-4 text-green-400" />
              <AlertDescription className="text-green-400">
                {success}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearSuccess}
                  className="ml-2 text-green-300 hover:text-green-200 hover:bg-green-500/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Mis Cursos */}
          {renderMyCourses()}

          {/* Estadísticas */}
          {renderStats()}

          {/* Grid de cursos */}
          <div className="mb-8">
            {isLoading ? renderLoadingSkeleton() : renderCourseGrid()}
          </div>

          {/* Botón de recarga */}
          <div className="text-center">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="lg"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white font-mono"
              disabled={isLoading}
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Cargando...' : 'Recargar Cursos'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
