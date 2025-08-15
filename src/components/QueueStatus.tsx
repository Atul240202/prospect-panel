import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useCommentJobs } from '@/hooks/useCommentJobs';
import {
  Play,
  Pause,
  Trash2,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from 'lucide-react';

export default function QueueStatus() {
  const {
    stats,
    isLoading,
    lastUpdated,
    refreshStats,
    pauseQueue,
    resumeQueue,
    cleanQueue,
  } = useCommentJobs();

  const getTotalJobs = () => {
    if (!stats) return 0;
    return stats.waiting + stats.active + stats.completed + stats.failed;
  };

  const getProgressPercentage = () => {
    if (!stats) return 0;
    const total = getTotalJobs();
    if (total === 0) return 0;
    return ((stats.completed + stats.failed) / total) * 100;
  };

  if (!stats) {
    return (
      <Card>
        <CardContent className='flex items-center justify-center p-6'>
          <Loader2 className='h-6 w-6 animate-spin' />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <div>
            <CardTitle>Queue Status</CardTitle>
            <CardDescription>
              Real-time monitoring of comment job queue
            </CardDescription>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={refreshStats}
              disabled={isLoading}
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </Button>
            {lastUpdated && (
              <span className='text-xs text-muted-foreground'>
                Updated: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Overall Progress */}
        <div className='space-y-2'>
          <div className='flex items-center justify-between text-sm'>
            <span>Overall Progress</span>
            <span>{Math.round(getProgressPercentage())}%</span>
          </div>
          <Progress value={getProgressPercentage()} className='h-2' />
          <div className='text-xs text-muted-foreground'>
            {stats.completed + stats.failed} of {getTotalJobs()} jobs processed
          </div>
        </div>

        {/* Status Grid */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='text-center'>
            <div className='flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-yellow-100 rounded-full'>
              <Clock className='h-6 w-6 text-yellow-600' />
            </div>
            <div className='text-2xl font-bold text-yellow-600'>
              {stats.waiting}
            </div>
            <div className='text-sm text-muted-foreground'>Waiting</div>
          </div>

          <div className='text-center'>
            <div className='flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-blue-100 rounded-full'>
              <Loader2 className='h-6 w-6 text-blue-600' />
            </div>
            <div className='text-2xl font-bold text-blue-600'>
              {stats.active}
            </div>
            <div className='text-sm text-muted-foreground'>Active</div>
          </div>

          <div className='text-center'>
            <div className='flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-green-100 rounded-full'>
              <CheckCircle className='h-6 w-6 text-green-600' />
            </div>
            <div className='text-2xl font-bold text-green-600'>
              {stats.completed}
            </div>
            <div className='text-sm text-muted-foreground'>Completed</div>
          </div>

          <div className='text-center'>
            <div className='flex items-center justify-center w-12 h-12 mx-auto mb-2 bg-red-100 rounded-full'>
              <XCircle className='h-6 w-6 text-red-600' />
            </div>
            <div className='text-2xl font-bold text-red-600'>
              {stats.failed}
            </div>
            <div className='text-sm text-muted-foreground'>Failed</div>
          </div>
        </div>

        {/* Queue Controls */}
        <div className='flex flex-wrap gap-2'>
          <Button onClick={pauseQueue} disabled={isLoading} variant='outline'>
            <Pause className='mr-2 h-4 w-4' />
            Pause Queue
          </Button>

          <Button
            onClick={resumeQueue}
            disabled={isLoading}
            className='bg-green-600 hover:bg-green-700'
          >
            <Play className='mr-2 h-4 w-4' />
            Resume Queue
          </Button>

          <Button
            onClick={cleanQueue}
            disabled={isLoading}
            variant='outline'
            className='text-orange-600 border-orange-200 hover:bg-orange-50'
          >
            <Trash2 className='mr-2 h-4 w-4' />
            Clean Queue
          </Button>
        </div>

        {/* Status Summary */}
        <div className='pt-4 border-t'>
          <div className='flex items-center justify-between text-sm'>
            <span className='font-medium'>Queue Status:</span>
            <Badge
              variant='outline'
              className='border-green-200 text-green-700'
            >
              Running
            </Badge>
          </div>
          <div className='text-xs text-muted-foreground mt-1'>
            Queue is running normally. Jobs are being processed.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
