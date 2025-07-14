'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, Search, Pin, Lock, MessageSquare, ChevronUp, ChevronDown, Eye, Filter, Bookmark, Flag, Paperclip, Calendar, User, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { CommunityService, type CommunityPost, type PostsResponse, type PostFilters } from '@/lib/services/community.service';
import Link from 'next/link';

export default function CommunityPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });
  const [filters, setFilters] = useState<PostFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', attachments: null as FileList | null });
  const [submitting, setSubmitting] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadPosts();
  }, [filters]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response: PostsResponse = await CommunityService.getPosts(filters);
      setPosts(response.data);
      setPagination({
        current_page: response.current_page,
        last_page: response.last_page,
        total: response.total
      });
    } catch (error) {
      console.error('Error loading posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load community posts',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, search: searchQuery, page: 1 });
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: 'Error',
        description: 'Please fill in both title and content',
        variant: 'destructive'
      });
      return;
    }

    try {
      setSubmitting(true);
      await CommunityService.createPost({
        title: newPost.title,
        content: newPost.content,
        attachments: newPost.attachments
      });
      setNewPost({ title: '', content: '', attachments: null });
      setIsCreateDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Post created successfully'
      });
      loadPosts(); // Refresh posts
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (post: CommunityPost, voteType: 1 | -1) => {
    if (!session) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to vote',
        variant: 'destructive'
      });
      return;
    }

    try {
      await CommunityService.vote({
        voteable_type: 'post',
        voteable_id: post.id,
        vote_type: voteType
      });
      
      // Update the post in the local state
      setPosts(prevPosts => 
        prevPosts.map(p => {
          if (p.id === post.id) {
            const currentUserVote = p.user_vote;
            let newVoteCount = p.vote_count;
            
            // Remove previous vote effect
            if (currentUserVote) {
              newVoteCount -= currentUserVote.vote_type;
            }
            
            // Add new vote effect or remove if same vote
            if (!currentUserVote || currentUserVote.vote_type !== voteType) {
              newVoteCount += voteType;
              return {
                ...p,
                vote_count: newVoteCount,
                user_vote: { ...currentUserVote, vote_type: voteType } as any
              };
            } else {
              // Same vote - remove it
              return {
                ...p,
                vote_count: newVoteCount,
                user_vote: undefined
              };
            }
          }
          return p;
        })
      );
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: 'Error',
        description: 'Failed to record vote',
        variant: 'destructive'
      });
    }
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleBookmark = async (postId: number) => {
    if (!session) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to bookmark posts',
        variant: 'destructive'
      });
      return;
    }

    try {
      await CommunityService.toggleBookmark(postId);
      setBookmarkedPosts(prev => {
        const newSet = new Set(prev);
        if (newSet.has(postId)) {
          newSet.delete(postId);
          toast({ title: 'Success', description: 'Bookmark removed' });
        } else {
          newSet.add(postId);
          toast({ title: 'Success', description: 'Post bookmarked' });
        }
        return newSet;
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to bookmark post',
        variant: 'destructive'
      });
    }
  };

  const handleReport = async (postId: number, reason: string) => {
    if (!session) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to report posts',
        variant: 'destructive'
      });
      return;
    }

    try {
      await CommunityService.reportContent({
        reportable_type: 'post',
        reportable_id: postId,
        reason: reason
      });
      toast({
        title: 'Success',
        description: 'Post reported successfully'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to report post',
        variant: 'destructive'
      });
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  if (loading && posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-12 w-full" />
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Community Forum</h1>
            <p className="text-muted-foreground mt-1">
              Connect with fellow learners, ask questions, and share knowledge
            </p>
          </div>
          
          {session && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      placeholder="What's your post about?"
                      disabled={submitting}
                      maxLength={255}
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      placeholder="Share your thoughts..."
                      rows={6}
                      disabled={submitting}
                      maxLength={10000}
                    />
                  </div>
                  <div>
                    <Label htmlFor="attachments">Attachments (optional)</Label>
                    <Input
                      id="attachments"
                      type="file"
                      multiple
                      onChange={(e) => setNewPost({ ...newPost, attachments: e.target.files })}
                      disabled={submitting}
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Support: Images, PDF, Word docs, Text files (max 10MB each)
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? 'Creating...' : 'Create Post'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-screen max-w-sm sm:w-80 mx-4">
                <div className="space-y-4">
                  <h4 className="font-medium">Advanced Filters</h4>
                  
                  <div className="space-y-2">
                    <Label>Sort by</Label>
                    <Select
                      value={filters.sort_by || 'latest'}
                      onValueChange={(value) => setFilters({ ...filters, sort_by: value as any, page: 1 })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="latest">Latest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="most_voted">Most Voted</SelectItem>
                        <SelectItem value="most_commented">Most Commented</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Author</Label>
                    <Input
                      value={filters.author || ''}
                      onChange={(e) => setFilters({ ...filters, author: e.target.value, page: 1 })}
                      placeholder="Filter by author name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Minimum Votes</Label>
                    <Input
                      type="number"
                      value={filters.min_votes || ''}
                      onChange={(e) => {
                        // Only allow positive integers
                        const value = e.target.value ? Math.max(0, parseInt(e.target.value) || 0) : undefined
                        setFilters({ ...filters, min_votes: value, page: 1 })
                      }}
                      onKeyDown={(e) => {
                        // Block non-numeric characters except control keys
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                          e.preventDefault()
                        }
                      }}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Date Range</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={filters.date_from || ''}
                        onChange={(e) => setFilters({ ...filters, date_from: e.target.value, page: 1 })}
                        placeholder="From"
                      />
                      <Input
                        type="date"
                        value={filters.date_to || ''}
                        onChange={(e) => setFilters({ ...filters, date_to: e.target.value, page: 1 })}
                        placeholder="To"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="has_attachments"
                      checked={filters.has_attachments || false}
                      onChange={(e) => setFilters({ ...filters, has_attachments: e.target.checked, page: 1 })}
                      className="rounded"
                    />
                    <Label htmlFor="has_attachments">Has attachments</Label>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={clearFilters}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Clear
                    </Button>
                    <Button
                      onClick={() => setShowAdvancedFilters(false)}
                      size="sm"
                      className="flex-1"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </form>

          {/* Active filters display */}
          {(filters.search || filters.author || filters.sort_by !== 'latest' || filters.has_attachments) && (
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <Badge variant="secondary">Search: {filters.search}</Badge>
              )}
              {filters.author && (
                <Badge variant="secondary">Author: {filters.author}</Badge>
              )}
              {filters.sort_by && filters.sort_by !== 'latest' && (
                <Badge variant="secondary">Sort: {filters.sort_by.replace('_', ' ')}</Badge>
              )}
              {filters.has_attachments && (
                <Badge variant="secondary">Has attachments</Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-6 px-2"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No posts found</h3>
                <p className="text-muted-foreground mb-4">
                  {filters.search ? 'Try adjusting your search terms' : 'Be the first to start a discussion!'}
                </p>
                {session && !filters.search && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Post
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {post.is_pinned && (
                          <Badge variant="secondary">
                            <Pin className="w-3 h-3 mr-1" />
                            Pinned
                          </Badge>
                        )}
                        {post.is_locked && (
                          <Badge variant="outline">
                            <Lock className="w-3 h-3 mr-1" />
                            Locked
                          </Badge>
                        )}
                      </div>
                      <Link 
                        href={`/dashboard/community/${post.id}`}
                        className="text-xl font-semibold hover:text-blue-600 transition-colors block"
                      >
                        {post.title}
                      </Link>
                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={post.author.profile_image} />
                          <AvatarFallback>{post.author.first_name[0]}{post.author.last_name[0]}</AvatarFallback>
                        </Avatar>
                        <span>{post.author.name}</span>
                        <span>•</span>
                        <span>{CommunityService.formatTimeAgo(post.created_at)}</span>
                        {post.updated_at !== post.created_at && (
                          <>
                            <span>•</span>
                            <span>edited {CommunityService.formatTimeAgo(post.updated_at)}</span>
                          </>
                        )}
                        {post.attachments && post.attachments.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Paperclip className="w-3 h-3" />
                              <span>{post.attachments.length} file{post.attachments.length > 1 ? 's' : ''}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="flex items-start gap-2 ml-4">
                      {/* Vote buttons */}
                      {session && (
                        <div className="flex flex-col items-center gap-1">
                          <Button
                            variant={post.user_vote?.vote_type === 1 ? "default" : "ghost"}
                            size="sm"
                            onClick={() => handleVote(post, 1)}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold text-sm">{post.vote_count}</span>
                          <Button
                            variant={post.user_vote?.vote_type === -1 ? "default" : "ghost"}
                            size="sm"
                            onClick={() => handleVote(post, -1)}
                            className="h-8 w-8 p-0"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      
                      {/* Bookmark and Report */}
                      {session && (
                        <div className="flex flex-col gap-1">
                          <Button
                            variant={bookmarkedPosts.has(post.id) ? "default" : "ghost"}
                            size="sm"
                            onClick={() => handleBookmark(post.id)}
                            className="h-8 w-8 p-0"
                            title="Bookmark post"
                          >
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Report post"
                              >
                                <Flag className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleReport(post.id, 'spam')}>
                                Report as Spam
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReport(post.id, 'inappropriate')}>
                                Inappropriate Content
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReport(post.id, 'harassment')}>
                                Harassment
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleReport(post.id, 'other')}>
                                Other
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {post.content.substring(0, 200)}
                    {post.content.length > 200 && '...'}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comment_count || post.comments_count || 0} comments</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>Last activity {CommunityService.formatTimeAgo(post.last_activity_at)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page <= 1}
            >
              Previous
            </Button>
            <span className="flex items-center px-4">
              Page {pagination.current_page} of {pagination.last_page}
            </span>
            <Button
              variant="outline"
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page >= pagination.last_page}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 