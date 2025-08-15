import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { api, CommentJobRequest } from '@/lib/api';
import { X, Plus, Loader2 } from 'lucide-react';

interface CommentJobFormProps {
  onJobStarted?: (jobId: string) => void;
  userId: string;
}

const MESSAGE_TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'casual', label: 'Casual' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
  { value: 'thoughtful', label: 'Thoughtful' },
  { value: 'friendly', label: 'Friendly' },
];

export default function CommentJobForm({
  onJobStarted,
  userId,
}: CommentJobFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [keywords, setKeywords] = useState<string[]>(['AI', 'Startup']);
  const [newKeyword, setNewKeyword] = useState('');
  const [maxComments, setMaxComments] = useState(5);
  const [options, setOptions] = useState({
    minReactions: 10,
    excludeJobPosts: true,
    messageTone: 'professional',
    wantEmoji: false,
    wantHashtags: false,
  });

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()]);
      setNewKeyword('');
    }
  };

  const removeKeyword = (index: number) => {
    setKeywords(keywords.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (keywords.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please add at least one keyword',
        variant: 'destructive',
      });
      return;
    }

    if (maxComments < 1 || maxComments > 20) {
      toast({
        title: 'Validation Error',
        description: 'Max comments must be between 1 and 20',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const jobData: CommentJobRequest = {
        keywords,
        maxComments,
        options,
      };

      const response = await api.startCommentJob(jobData);

      toast({
        title: 'Job Started',
        description: `Comment job started successfully with ID: ${response.jobId}`,
      });

      // Reset form
      setKeywords(['AI', 'Startup']);
      setMaxComments(5);
      setOptions({
        minReactions: 10,
        excludeJobPosts: true,
        messageTone: 'professional',
        wantEmoji: false,
        wantHashtags: false,
      });

      onJobStarted?.(response.jobId);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to start comment job',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className='w-full max-w-2xl mx-auto'>
      <CardHeader>
        <CardTitle>Start Auto-Comment Job</CardTitle>
        <CardDescription>
          Configure and start an automated LinkedIn commenting job
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Keywords Section */}
          <div className='space-y-3'>
            <Label htmlFor='keywords'>Target Keywords</Label>
            <div className='flex gap-2'>
              <Input
                id='keywords'
                placeholder='Add keyword (e.g., AI, Startup)'
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) =>
                  e.key === 'Enter' && (e.preventDefault(), addKeyword())
                }
              />
              <Button type='button' onClick={addKeyword} size='sm'>
                <Plus className='h-4 w-4' />
              </Button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {keywords.map((keyword, index) => (
                <Badge
                  key={index}
                  variant='secondary'
                  className='flex items-center gap-1'
                >
                  {keyword}
                  <button
                    type='button'
                    onClick={() => removeKeyword(index)}
                    className='ml-1 hover:text-destructive'
                  >
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Max Comments */}
          <div className='space-y-2'>
            <Label htmlFor='maxComments'>Maximum Comments to Post</Label>
            <Input
              id='maxComments'
              type='number'
              min='1'
              max='20'
              value={maxComments}
              onChange={(e) => setMaxComments(parseInt(e.target.value))}
            />
            <p className='text-sm text-muted-foreground'>
              Choose between 1-20 comments per job
            </p>
          </div>

          {/* Advanced Options */}
          <div className='space-y-4'>
            <Label className='text-base font-semibold'>Advanced Options</Label>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <Label htmlFor='minReactions'>Minimum Reactions</Label>
                <Input
                  id='minReactions'
                  type='number'
                  min='0'
                  value={options.minReactions}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      minReactions: parseInt(e.target.value),
                    })
                  }
                />
                <p className='text-sm text-muted-foreground'>
                  Only comment on posts with this many reactions
                </p>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='messageTone'>Message Tone</Label>
                <Select
                  value={options.messageTone}
                  onValueChange={(value) =>
                    setOptions({ ...options, messageTone: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MESSAGE_TONES.map((tone) => (
                      <SelectItem key={tone.value} value={tone.value}>
                        {tone.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='space-y-3'>
              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Exclude Job Posts</Label>
                  <p className='text-sm text-muted-foreground'>
                    Skip posts that are job advertisements
                  </p>
                </div>
                <Switch
                  checked={options.excludeJobPosts}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, excludeJobPosts: checked })
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Include Emojis</Label>
                  <p className='text-sm text-muted-foreground'>
                    Add relevant emojis to comments
                  </p>
                </div>
                <Switch
                  checked={options.wantEmoji}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, wantEmoji: checked })
                  }
                />
              </div>

              <div className='flex items-center justify-between'>
                <div className='space-y-0.5'>
                  <Label>Include Hashtags</Label>
                  <p className='text-sm text-muted-foreground'>
                    Add relevant hashtags to comments
                  </p>
                </div>
                <Switch
                  checked={options.wantHashtags}
                  onCheckedChange={(checked) =>
                    setOptions({ ...options, wantHashtags: checked })
                  }
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button type='submit' className='w-full' disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Starting Job...
              </>
            ) : (
              'Start Comment Job'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
