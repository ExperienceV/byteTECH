// ============================================================================
// 🔍 COURSES FILTERS COMPONENT
// ============================================================================
// Componente de filtros y búsqueda para el sistema de cursos

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal,
  DollarSign,
  Clock,
  Target,
  Tag,
  Sparkles
} from 'lucide-react';
import { 
  FILTER_CONFIG, 
  SORT_CONFIG, 
  CATEGORY_CONFIG,
  PAGINATION_CONFIG 
} from '@/lib/courses-config';
import { CourseFilters } from '@/hooks/use-courses';

interface CoursesFiltersProps {
  searchQuery: string;
  filters: CourseFilters;
  sortBy: string;
  pageSize: number;
  totalCourses: number;
  onSearchChange: (query: string) => void;
  onFiltersChange: (filters: Partial<CourseFilters>) => void;
  onSortChange: (sortBy: string) => void;
  onPageSizeChange: (size: number) => void;
  onClearFilters: () => void;
  className?: string;
}

export const CoursesFilters: React.FC<CoursesFiltersProps> = ({
  searchQuery,
  filters,
  sortBy,
  pageSize,
  totalCourses,
  onSearchChange,
  onFiltersChange,
  onSortChange,
  onPageSizeChange,
  onClearFilters,
  className = ''
}) => {
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // ============================================================================
  // 🎯 FUNCIONES DE MANEJO
  // ============================================================================

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handlePriceRangeChange = (range: { min: number; max: number } | null) => {
    onFiltersChange({ priceRange: range });
  };

  const handleDurationRangeChange = (range: { min: number; max: number } | null) => {
    onFiltersChange({ durationRange: range });
  };

  const handleDifficultyChange = (difficulty: string | null) => {
    onFiltersChange({ difficulty });
  };

  const handleCategoryChange = (category: string | null) => {
    onFiltersChange({ category });
  };

  const handleFreeToggle = () => {
    const newValue = filters.isFree === null ? true : filters.isFree === true ? false : null;
    onFiltersChange({ isFree: newValue });
  };

  const handleProgressToggle = () => {
    const newValue = filters.hasProgress === null ? true : filters.hasProgress === true ? false : null;
    onFiltersChange({ hasProgress: newValue });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPageSizeChange(Number(e.target.value));
  };

  const toggleFilters = () => {
    setIsFiltersExpanded(!isFiltersExpanded);
  };

  const hasActiveFilters = () => {
    return (
      filters.priceRange !== null ||
      filters.durationRange !== null ||
      filters.difficulty !== null ||
      filters.category !== null ||
      filters.isFree !== null ||
      filters.hasProgress !== null
    );
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.priceRange !== null) count++;
    if (filters.durationRange !== null) count++;
    if (filters.difficulty !== null) count++;
    if (filters.category !== null) count++;
    if (filters.isFree !== null) count++;
    if (filters.hasProgress !== null) count++;
    return count;
  };

  // ============================================================================
  // 🎨 FUNCIONES DE UI
  // ============================================================================

  const getFilterBadge = (label: string, value: any, onRemove: () => void) => {
    if (value === null || value === undefined) return null;

    let displayValue = value;
    if (typeof value === 'object' && value.min !== undefined && value.max !== undefined) {
      if (value.min === 0 && value.max === 0) {
        displayValue = 'Gratis';
      } else if (value.max === 999.99) {
        displayValue = `$${value.min}+`;
      } else {
        displayValue = `$${value.min}-$${value.max}`;
      }
    }

    return (
      <Badge 
        variant="secondary" 
        className="bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer"
        onClick={onRemove}
      >
        {label}: {displayValue}
        <X className="w-3 h-3 ml-1" />
      </Badge>
    );
  };

  const getPriceRangeLabel = (range: { min: number; max: number }) => {
    if (range.min === 0 && range.max === 0) return 'Gratis';
    if (range.max === 999.99) return `$${range.min}+`;
    return `$${range.min}-$${range.max}`;
  };

  const getDurationRangeLabel = (range: { min: number; max: number }) => {
    if (range.max === 1000) return `${range.min}h+`;
    return `${range.min}-${range.max}h`;
  };

  // ============================================================================
  // 🎨 RENDERIZADO PRINCIPAL
  // ============================================================================

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barra de búsqueda y controles principales */}
      <Card className="bg-slate-900/80 backdrop-blur-sm border border-slate-800">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Buscar cursos, instructores, categorías..."
                className="pl-10 bg-slate-800/50 border-slate-700 text-white font-mono"
              />
            </div>

            {/* Controles de ordenamiento y paginación */}
            <div className="flex gap-2 items-center">
              {/* Ordenamiento */}
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="bg-slate-800/50 border border-slate-700 text-white font-mono text-sm rounded-md px-3 py-2"
              >
                {SORT_CONFIG.OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Tamaño de página */}
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="bg-slate-800/50 border border-slate-700 text-white font-mono text-sm rounded-md px-3 py-2"
              >
                {PAGINATION_CONFIG.PAGE_SIZES.map(size => (
                  <option key={size} value={size}>
                    {size} por página
                  </option>
                ))}
              </select>

              {/* Botón de filtros */}
              <Button
                onClick={toggleFilters}
                variant="outline"
                size="sm"
                className={`border-slate-700 text-slate-300 hover:bg-slate-800 ${
                  hasActiveFilters() ? 'border-cyan-500 text-cyan-400' : ''
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
                {hasActiveFilters() && (
                  <Badge className="ml-2 bg-cyan-500 text-black text-xs">
                    {getActiveFiltersCount()}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Filtros activos */}
          {hasActiveFilters() && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-700">
              <span className="text-slate-400 font-mono text-sm">Filtros activos:</span>
              
              {filters.priceRange && (
                <Badge 
                  variant="secondary" 
                  className="bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer"
                  onClick={() => onFiltersChange({ priceRange: null })}
                >
                  Precio: {getPriceRangeLabel(filters.priceRange)}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              
              {filters.durationRange && (
                <Badge 
                  variant="secondary" 
                  className="bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer"
                  onClick={() => onFiltersChange({ durationRange: null })}
                >
                  Duración: {getDurationRangeLabel(filters.durationRange)}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              
              {filters.difficulty && (
                <Badge 
                  variant="secondary" 
                  className="bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer"
                  onClick={() => onFiltersChange({ difficulty: null })}
                >
                  Dificultad: {filters.difficulty}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              
              {filters.category && (
                <Badge 
                  variant="secondary" 
                  className="bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer"
                  onClick={() => onFiltersChange({ category: null })}
                >
                  Categoría: {filters.category}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              
              {filters.isFree !== null && (
                <Badge 
                  variant="secondary" 
                  className="bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer"
                  onClick={() => onFiltersChange({ isFree: null })}
                >
                  {filters.isFree ? 'Solo gratis' : 'Solo pagos'}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
              
              {filters.hasProgress !== null && (
                <Badge 
                  variant="secondary" 
                  className="bg-slate-700 text-slate-300 hover:bg-slate-600 cursor-pointer"
                  onClick={() => onFiltersChange({ hasProgress: null })}
                >
                  {filters.hasProgress ? 'Con progreso' : 'Sin progreso'}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}

              <Button
                onClick={onClearFilters}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar todo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel de filtros expandible */}
      {isFiltersExpanded && (
        <Card className="bg-slate-900/80 backdrop-blur-sm border border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-mono">
              <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
              Filtros Avanzados
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Filtros de precio */}
            <div>
              <h3 className="flex items-center gap-2 text-cyan-400 font-mono text-sm mb-3">
                <DollarSign className="w-4 h-4" />
                RANGO DE PRECIO
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {FILTER_CONFIG.PRICE_RANGES.map((range, index) => (
                  <Button
                    key={index}
                    variant={filters.priceRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePriceRangeChange(filters.priceRange === range ? null : range)}
                    className={`font-mono text-xs ${
                      filters.priceRange === range 
                        ? 'bg-cyan-500 text-black' 
                        : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Filtros de duración */}
            <div>
              <h3 className="flex items-center gap-2 text-purple-400 font-mono text-sm mb-3">
                <Clock className="w-4 h-4" />
                DURACIÓN DEL CURSO
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FILTER_CONFIG.DURATION_RANGES.map((range, index) => (
                  <Button
                    key={index}
                    variant={filters.durationRange === range ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDurationRangeChange(filters.durationRange === range ? null : range)}
                    className={`font-mono text-xs ${
                      filters.durationRange === range 
                        ? 'bg-purple-500 text-black' 
                        : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {range.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Filtros de dificultad */}
            <div>
              <h3 className="flex items-center gap-2 text-orange-400 font-mono text-sm mb-3">
                <Target className="w-4 h-4" />
                NIVEL DE DIFICULTAD
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {FILTER_CONFIG.DIFFICULTY_LEVELS.map((level, index) => (
                  <Button
                    key={index}
                    variant={filters.difficulty === level.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDifficultyChange(filters.difficulty === level.value ? null : level.value)}
                    className={`font-mono text-xs ${
                      filters.difficulty === level.value 
                        ? 'bg-orange-500 text-black' 
                        : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {level.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Filtros de categoría */}
            <div>
              <h3 className="flex items-center gap-2 text-green-400 font-mono text-sm mb-3">
                <Tag className="w-4 h-4" />
                CATEGORÍAS
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {CATEGORY_CONFIG.MAIN_CATEGORIES.map((category, index) => (
                  <Button
                    key={index}
                    variant={filters.category === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCategoryChange(filters.category === category.value ? null : category.value)}
                    className={`font-mono text-xs ${
                      filters.category === category.value 
                        ? 'bg-green-500 text-black' 
                        : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="mr-1">{category.icon}</span>
                    {category.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Filtros especiales */}
            <div>
              <h3 className="flex items-center gap-2 text-blue-400 font-mono text-sm mb-3">
                <Sparkles className="w-4 h-4" />
                FILTROS ESPECIALES
              </h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={filters.isFree === true ? "default" : "outline"}
                  size="sm"
                  onClick={handleFreeToggle}
                  className={`font-mono text-xs ${
                    filters.isFree === true 
                      ? 'bg-green-500 text-black' 
                      : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Solo cursos gratis
                </Button>
                
                <Button
                  variant={filters.hasProgress === true ? "default" : "outline"}
                  size="sm"
                  onClick={handleProgressToggle}
                  className={`font-mono text-xs ${
                    filters.hasProgress === true 
                      ? 'bg-blue-500 text-black' 
                      : 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Con progreso guardado
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información de resultados */}
      <div className="text-center text-slate-400 font-mono text-sm">
        Mostrando {totalCourses} cursos disponibles
        {hasActiveFilters() && (
          <span className="text-cyan-400 ml-2">
            (filtrados por {getActiveFiltersCount()} criterios)
          </span>
        )}
      </div>
    </div>
  );
};
