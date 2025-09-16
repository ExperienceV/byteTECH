import { useState, useEffect } from 'react';
import { getPlatformStats, PlatformStats } from '@/lib/api';

export interface UseStatsReturn {
  stats: PlatformStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useStats = (): UseStatsReturn => {
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Fetching platform stats...');
      const response = await getPlatformStats();
      console.log('📊 Stats response:', response);
      
      if (response.ok) {
        setStats(response.data);
        console.log('✅ Stats loaded successfully:', response.data);
      } else {
        const errorMsg = response.message || 'Error al cargar estadísticas';
        setError(errorMsg);
        console.error('❌ Stats API error:', errorMsg, response);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('❌ Error fetching stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
  };
};
