import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  Filter,
  Calendar,
  Clock,
  MessageSquare,
  Eye,
  Download,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

const STATUS_COLORS = {
  waiting: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  active: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
};

export default function JobHistory() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  useEffect(() => {
    if (user) {
      fetchJobHistory();
    }
  }, [user, pagination.page, statusFilter, dateFilter]);

  const fetchJobHistory = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await api.getJobHistory(
        user.id,
        pagination.page,
        pagination.limit,
        statusFilter,
        dateFilter
      );

      setJobs(response.data.jobs);
      setPagination(response.data.pagination);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: 'Failed to fetch job history',
        variant: 'destructive',
      });
      console.error('Error fetching job history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.keywords.some((keyword) =>
        keyword.toLowerCase().includes(searchTerm.toLowerCase())
      ) || job.id.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock className='h-4 w-4' />;
      case 'active':
        return <MessageSquare className='h-4 w-4' />;
      case 'completed':
        return <Calendar className='h-4 w-4' />;
      case 'failed':
        return <Eye className='h-4 w-4' />;
      default:
        return <Clock className='h-4 w-4' />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    return `${diffHours}h ${remainingMins}m`;
  };

  const exportHistory = () => {
    const csvContent = [
      [
        'Job ID',
        'Keywords',
        'Status',
        'Created',
        'Completed',
        'Comments Posted',
        'Posts Scraped',
      ],
      ...filteredJobs.map((job) => [
        job.id,
        job.keywords.join(', '),
        job.status,
        formatDate(job.createdAt),
        job.completedAt ? formatDate(job.completedAt) : '-',
        job.result?.commentedCount || '-',
        job.result?.totalPostsScraped || '-',
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comment-job-history-${
      new Date().toISOString().split('T')[0]
    }.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const handleRefresh = () => {
    fetchJobHistory();
  };

  if (isLoading && jobs.length === 0) {
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
            <CardTitle>Job History</CardTitle>
            <CardDescription>
              Track and analyze your comment job performance
            </CardDescription>
          </div>
          <div className='flex items-center gap-2'>
            <Button
              onClick={handleRefresh}
              variant='outline'
              size='sm'
              disabled={isLoading}
            >
              <Loader2
                className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`}
              />
            </Button>
            <Button onClick={exportHistory} variant='outline' size='sm'>
              <Download className='mr-2 h-4 w-4' />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className='flex flex-col md:flex-row gap-4 mb-6'>
          <div className='flex-1'>
            <Label htmlFor='search'>Search Jobs</Label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
              <Input
                id='search'
                placeholder='Search by keywords or job ID...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>

          <div className='w-full md:w-48'>
            <Label htmlFor='status-filter'>Status</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='waiting'>Waiting</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='failed'>Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='w-full md:w-48'>
            <Label htmlFor='date-filter'>Date Range</Label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Time</SelectItem>
                <SelectItem value='today'>Today</SelectItem>
                <SelectItem value='week'>This Week</SelectItem>
                <SelectItem value='month'>This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Summary */}
        <div className='mb-4 text-sm text-muted-foreground'>
          Showing {filteredJobs.length} of {pagination.total} jobs
        </div>

        {/* Jobs Table */}
        <div className='border rounded-lg'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job ID</TableHead>
                <TableHead>Keywords</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Results</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredJobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell className='font-mono text-sm'>{job.id}</TableCell>
                  <TableCell>
                    <div className='flex flex-wrap gap-1'>
                      {job.keywords.map((keyword, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='text-xs'
                        >
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant='outline'
                      className={
                        STATUS_COLORS[job.status as keyof typeof STATUS_COLORS]
                      }
                    >
                      <div className='flex items-center gap-1'>
                        {getStatusIcon(job.status)}
                        {job.status}
                      </div>
                    </Badge>
                  </TableCell>
                  <TableCell className='text-sm'>
                    {formatDate(job.createdAt)}
                  </TableCell>
                  <TableCell className='text-sm'>
                    {job.completedAt
                      ? getDuration(job.createdAt, job.completedAt)
                      : job.status === 'active'
                      ? getDuration(job.createdAt)
                      : '-'}
                  </TableCell>
                  <TableCell>
                    {job.result ? (
                      <div className='text-sm'>
                        <div className='font-medium text-green-600'>
                          {job.result.commentedCount} comments
                        </div>
                        <div className='text-muted-foreground'>
                          {job.result.totalPostsScraped} posts scraped
                        </div>
                      </div>
                    ) : job.error ? (
                      <div
                        className='text-sm text-red-600 max-w-32 truncate'
                        title={job.error}
                      >
                        {job.error}
                      </div>
                    ) : (
                      <span className='text-muted-foreground'>-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button variant='ghost' size='sm'>
                      <Eye className='h-4 w-4' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className='flex items-center justify-center gap-2 mt-6'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>

            <span className='text-sm text-muted-foreground'>
              Page {pagination.page} of {pagination.pages}
            </span>

            <Button
              variant='outline'
              size='sm'
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
            >
              Next
            </Button>
          </div>
        )}

        {filteredJobs.length === 0 && !isLoading && (
          <div className='text-center py-8 text-muted-foreground'>
            No jobs found matching your criteria
          </div>
        )}
      </CardContent>
    </Card>
  );
}
