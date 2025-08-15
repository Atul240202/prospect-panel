import { useState, useEffect, useCallback } from 'react';
import { api, QueueStats } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export function useCommentJobs() {
  const { toast } = useToast();
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.getQueueStats();
      setStats(response.stats);
      setLastUpdated(new Date());
    } catch (error: any) {
      console.error('Failed to fetch queue stats:', error);
    }
  }, []);

  const refreshStats = useCallback(async () => {
    setIsLoading(true);
    try {
      await fetchStats();
      toast({
        title: 'Stats Updated',
        description: 'Queue statistics have been refreshed',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to refresh queue statistics',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats, toast]);

  const pauseQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.pauseQueue();
      toast({
        title: 'Queue Paused',
        description: 'Comment queue has been paused successfully',
      });
      await fetchStats();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to pause queue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats, toast]);

  const resumeQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.resumeQueue();
      toast({
        title: 'Queue Resumed',
        description: 'Comment queue has been resumed successfully',
      });
      await fetchStats();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to resume queue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats, toast]);

  const cleanQueue = useCallback(async () => {
    setIsLoading(true);
    try {
      await api.cleanQueue();
      toast({
        title: 'Queue Cleaned',
        description: 'Completed and failed jobs have been cleaned',
      });
      await fetchStats();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to clean queue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchStats, toast]);

  // Auto-refresh stats every 10 seconds
  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  return {
    stats,
    isLoading,
    lastUpdated,
    refreshStats,
    pauseQueue,
    resumeQueue,
    cleanQueue,
  };
}
