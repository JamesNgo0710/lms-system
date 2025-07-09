'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { CommunityService, type CreatePostData } from '@/lib/services/community.service';
import { Plus } from 'lucide-react';

interface PostCreationModalProps {
  onPostCreated?: () => void;
  triggerButton?: React.ReactNode;
}

export function PostCreationModal({ onPostCreated, triggerButton }: PostCreationModalProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<CreatePostData>({ title: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in both title and content',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await CommunityService.createPost(formData);
      
      toast({
        title: 'Success',
        description: 'Post created successfully'
      });
      
      setFormData({ title: '', content: '' });
      setIsOpen(false);
      
      if (onPostCreated) {
        onPostCreated();
      }
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreatePostData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const defaultTrigger = (
    <Button>
      <Plus className="w-4 h-4 mr-2" />
      New Post
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="post-title">Title</Label>
            <Input
              id="post-title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="What's your post about?"
              disabled={isSubmitting}
              maxLength={255}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {formData.title.length}/255 characters
            </p>
          </div>
          
          <div>
            <Label htmlFor="post-content">Content</Label>
            <Textarea
              id="post-content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Share your thoughts, ask questions, or start a discussion..."
              rows={8}
              disabled={isSubmitting}
              maxLength={10000}
              className="mt-1"
            />
            <p className="text-sm text-muted-foreground mt-1">
              {formData.content.length}/10,000 characters
            </p>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting || !formData.title.trim() || !formData.content.trim()}
            >
              {isSubmitting ? 'Creating...' : 'Create Post'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 