import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import CommentJobForm from '@/components/CommentJobForm';
import QueueStatus from '@/components/QueueStatus';
import JobHistory from '@/components/JobHistory';
import {
  MessageSquare,
  Play,
  Pause,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function AutoComment() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<{
    hasValidCookies: boolean;
    canStartJob: boolean;
  } | null>(null);
  const [recentJobId, setRecentJobId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      checkUserStatus();
    }
  }, [user]);

  const checkUserStatus = async () => {
    if (!user) return;

    try {
      const response = await api.getUserJobStatus(user.id);
      setUserStatus(response.data);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to check user status',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobStarted = (jobId: string) => {
    setRecentJobId(jobId);
    toast({
      title: 'Job Started',
      description: 'Your comment job has been queued successfully!',
    });
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='h-8 w-8 animate-spin' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>
            Auto-Comment Dashboard
          </h1>
          <p className='text-muted-foreground'>
            Automate your LinkedIn engagement with AI-powered comments
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <Badge
            variant={userStatus?.hasValidCookies ? 'default' : 'destructive'}
            className='flex items-center gap-1'
          >
            {userStatus?.hasValidCookies ? (
              <>
                <CheckCircle className='h-3 w-3' />
                LinkedIn Connected
              </>
            ) : (
              <>
                <AlertCircle className='h-3 w-3' />
                LinkedIn Required
              </>
            )}
          </Badge>
        </div>
      </div>

      {/* Status Overview Cards */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Jobs</CardTitle>
            <MessageSquare className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>24</div>
            <p className='text-xs text-muted-foreground'>+12 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Success Rate</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>87%</div>
            <p className='text-xs text-muted-foreground'>+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Avg. Comments</CardTitle>
            <CheckCircle className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>4.2</div>
            <p className='text-xs text-muted-foreground'>per successful job</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Avg. Duration</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>45m</div>
            <p className='text-xs text-muted-foreground'>per job execution</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue='start-job' className='space-y-4'>
        <TabsList className='grid w-full grid-cols-3'>
          <TabsTrigger value='start-job'>Start New Job</TabsTrigger>
          <TabsTrigger value='queue-status'>Queue Status</TabsTrigger>
          <TabsTrigger value='job-history'>Job History</TabsTrigger>
        </TabsList>

        <TabsContent value='start-job' className='space-y-4'>
          {!userStatus?.hasValidCookies ? (
            <Card className='border-destructive'>
              <CardHeader>
                <CardTitle className='text-destructive'>
                  LinkedIn Connection Required
                </CardTitle>
                <CardDescription>
                  You need to connect your LinkedIn account before starting
                  comment jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className='space-y-4'>
                  <p className='text-sm text-muted-foreground'>
                    To use the auto-comment feature, you must:
                  </p>
                  <ol className='list-decimal list-inside space-y-2 text-sm text-muted-foreground'>
                    <li>Install the LinkedIn Cookie Extension</li>
                    <li>Log into LinkedIn in your browser</li>
                    <li>Allow the extension to capture your cookies</li>
                    <li>Wait for the backend to validate your connection</li>
                  </ol>
                  <div className='pt-4'>
                    <Button variant='outline' onClick={checkUserStatus}>
                      Check Connection Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className='space-y-4'>
              {recentJobId && (
                <Card className='border-green-200 bg-green-50'>
                  <CardContent className='pt-6'>
                    <div className='flex items-center gap-2 text-green-800'>
                      <CheckCircle className='h-5 w-5' />
                      <span className='font-medium'>
                        Job started successfully! Job ID: {recentJobId}
                      </span>
                    </div>
                    <p className='text-sm text-green-700 mt-1'>
                      Your comment job is now in the queue. Monitor its progress
                      in the Queue Status tab.
                    </p>
                  </CardContent>
                </Card>
              )}

              <CommentJobForm
                onJobStarted={handleJobStarted}
                userId={user?.id || ''}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value='queue-status' className='space-y-4'>
          <QueueStatus />
        </TabsContent>

        <TabsContent value='job-history' className='space-y-4'>
          <JobHistory />
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='flex flex-wrap gap-2'>
            <Button variant='outline' size='sm'>
              <Play className='mr-2 h-4 w-4' />
              Resume All Jobs
            </Button>
            <Button variant='outline' size='sm'>
              <Pause className='mr-2 h-4 w-4' />
              Pause All Jobs
            </Button>
            <Button variant='outline' size='sm'>
              <Clock className='mr-2 h-4 w-4' />
              View Active Jobs
            </Button>
            <Button variant='outline' size='sm'>
              <MessageSquare className='mr-2 h-4 w-4' />
              Test Connection
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
