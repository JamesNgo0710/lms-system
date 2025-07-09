'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ChevronUp, ChevronDown, MessageSquare, Pin, Lock, Eye, EyeOff, Edit, Trash2, Reply, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { CommunityService, type CommunityPost, type CommunityComment } from '@/lib/services/community.service';
import Link from 'next/link';

interface CommentThreadProps {
  comment: CommunityComment;
  postId: number;
  currentUserId?: number;
  isAdmin?: boolean;
  onCommentUpdate: (updatedComment: CommunityComment) => void;
  onCommentDelete: (commentId: number) => void;
  onReplySubmit: (parentId: number, content: string) => Promise<void>;
}

function CommentThread({ comment, postId, currentUserId, isAdmin, onCommentUpdate, onCommentDelete, onReplySubmit }: CommentThreadProps) {
  const { toast } = useToast();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleVote = async (voteType: 1 | -1) => {
    try {
      await CommunityService.vote({
        voteable_type: 'comment',
        voteable_id: comment.id,
        vote_type: voteType
      });
      
      // Update comment vote locally
      const currentUserVote = comment.user_vote;
      let newVoteCount = comment.vote_count;
      
      if (currentUserVote) {
        newVoteCount -= currentUserVote.vote_type;
      }
      
      if (!currentUserVote || currentUserVote.vote_type !== voteType) {
        newVoteCount += voteType;
        onCommentUpdate({
          ...comment,
          vote_count: newVoteCount,
          user_vote: { ...currentUserVote, vote_type: voteType } as any
        });
      } else {
        onCommentUpdate({
          ...comment,
          vote_count: newVoteCount,
          user_vote: undefined
        });
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: 'Error',
        description: 'Failed to record vote',
        variant: 'destructive'
      });
    }
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      await onReplySubmit(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit reply',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await CommunityService.deleteComment(comment.id);
      onCommentDelete(comment.id);
      toast({
        title: 'Success',
        description: 'Comment deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete comment',
        variant: 'destructive'
      });
    }
  };

  const canEdit = CommunityService.canUserEdit(comment, currentUserId);
  const canDelete = CommunityService.canUserDelete(comment, currentUserId, isAdmin);
  const canModerate = CommunityService.canUserModerate(isAdmin);

  return (
    <div className={`${comment.depth > 0 ? 'ml-8 border-l-2 border-muted pl-4' : ''}`}>
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarImage src={comment.author.profile_image} />
                <AvatarFallback>{comment.author.first_name[0]}{comment.author.last_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">{comment.author.name}</p>
                <p className="text-xs text-muted-foreground">
                  {CommunityService.formatTimeAgo(comment.created_at)}
                  {comment.updated_at !== comment.created_at && (
                    <span> • edited {CommunityService.formatTimeAgo(comment.updated_at)}</span>
                  )}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Vote buttons */}
              {currentUserId && (
                <div className="flex items-center gap-1">
                  <Button
                    variant={comment.user_vote?.vote_type === 1 ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleVote(1)}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </Button>
                  <span className="text-xs font-semibold">{comment.vote_count}</span>
                  <Button
                    variant={comment.user_vote?.vote_type === -1 ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handleVote(-1)}
                    className="h-6 w-6 p-0"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </div>
              )}
              
              {/* Actions menu */}
              {(canEdit || canDelete || canModerate) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <MoreVertical className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {canEdit && (
                      <DropdownMenuItem>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {canDelete && (
                      <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    )}
                    {canModerate && (
                      <DropdownMenuItem onClick={() => CommunityService.hideComment(comment.id)}>
                        {comment.is_hidden ? <Eye className="w-4 h-4 mr-2" /> : <EyeOff className="w-4 h-4 mr-2" />}
                        {comment.is_hidden ? 'Show' : 'Hide'}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-3 whitespace-pre-wrap">{comment.content}</p>
          
          {currentUserId && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="h-8 text-xs"
            >
              <Reply className="w-3 h-3 mr-1" />
              Reply
            </Button>
          )}

          {isReplying && (
            <form onSubmit={handleReplySubmit} className="mt-3 space-y-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                rows={3}
                disabled={isSubmitting}
                maxLength={5000}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting || !replyContent.trim()}
                >
                  {isSubmitting ? 'Submitting...' : 'Reply'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Nested replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-2">
          {comment.replies.map((reply) => (
            <CommentThread
              key={reply.id}
              comment={reply}
              postId={postId}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onCommentUpdate={onCommentUpdate}
              onCommentDelete={onCommentDelete}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function PostPage() {
  const { data: session } = useSession();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [post, setPost] = useState<CommunityPost | null>(null);
  const [comments, setComments] = useState<CommunityComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const postId = parseInt(params.id as string);
  const currentUserId = session?.user?.id;
  const isAdmin = session?.user?.role === 'admin';

  useEffect(() => {
    if (postId) {
      loadPost();
      loadComments();
    }
  }, [postId]);

  const loadPost = async () => {
    try {
      const postData = await CommunityService.getPost(postId);
      setPost(postData);
    } catch (error) {
      console.error('Error loading post:', error);
      toast({
        title: 'Error',
        description: 'Failed to load post',
        variant: 'destructive'
      });
    }
  };

  const loadComments = async () => {
    try {
      setLoading(true);
      const commentsData = await CommunityService.getComments(postId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
      toast({
        title: 'Error',
        description: 'Failed to load comments',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePostVote = async (voteType: 1 | -1) => {
    if (!session || !post) {
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
      
      // Update post vote locally
      const currentUserVote = post.user_vote;
      let newVoteCount = post.vote_count;
      
      if (currentUserVote) {
        newVoteCount -= currentUserVote.vote_type;
      }
      
      if (!currentUserVote || currentUserVote.vote_type !== voteType) {
        newVoteCount += voteType;
        setPost({
          ...post,
          vote_count: newVoteCount,
          user_vote: { ...currentUserVote, vote_type: voteType } as any
        });
      } else {
        setPost({
          ...post,
          vote_count: newVoteCount,
          user_vote: undefined
        });
      }
    } catch (error) {
      console.error('Error voting:', error);
      toast({
        title: 'Error',
        description: 'Failed to record vote',
        variant: 'destructive'
      });
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim() || !session) return;

    setIsSubmittingComment(true);
    try {
      await CommunityService.createComment(postId, { content: newCommentContent });
      setNewCommentContent('');
      loadComments(); // Refresh comments
      toast({
        title: 'Success',
        description: 'Comment posted successfully'
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: 'Error',
        description: 'Failed to post comment',
        variant: 'destructive'
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleReplySubmit = async (parentId: number, content: string) => {
    await CommunityService.createComment(postId, { content, parent_id: parentId });
    loadComments(); // Refresh comments
  };

  const handleCommentUpdate = (updatedComment: CommunityComment) => {
    const updateCommentsRecursively = (comments: CommunityComment[]): CommunityComment[] => {
      return comments.map(comment => {
        if (comment.id === updatedComment.id) {
          return updatedComment;
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: updateCommentsRecursively(comment.replies)
          };
        }
        return comment;
      });
    };
    
    setComments(updateCommentsRecursively(comments));
  };

  const handleCommentDelete = (commentId: number) => {
    const removeCommentRecursively = (comments: CommunityComment[]): CommunityComment[] => {
      return comments.filter(comment => {
        if (comment.id === commentId) {
          return false;
        }
        if (comment.replies && comment.replies.length > 0) {
          comment.replies = removeCommentRecursively(comment.replies);
        }
        return true;
      });
    };
    
    setComments(removeCommentRecursively(comments));
  };

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const canEdit = CommunityService.canUserEdit(post, currentUserId);
  const canDelete = CommunityService.canUserDelete(post, currentUserId, isAdmin);
  const canModerate = CommunityService.canUserModerate(isAdmin);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Back button */}
        <Link href="/dashboard/community">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Button>
        </Link>

        {/* Post */}
        <Card>
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
                <h1 className="text-2xl font-bold mb-3">{post.title}</h1>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                </div>
              </div>
              
              {/* Post vote buttons */}
              {session && (
                <div className="flex flex-col items-center gap-1 ml-4">
                  <Button
                    variant={post.user_vote?.vote_type === 1 ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePostVote(1)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <span className="font-semibold text-sm">{post.vote_count}</span>
                  <Button
                    variant={post.user_vote?.vote_type === -1 ? "default" : "ghost"}
                    size="sm"
                    onClick={() => handlePostVote(-1)}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose max-w-none mb-6">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span>{post.comment_count} comments</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comment form */}
        {session && !post.is_locked && (
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">Add a Comment</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCommentSubmit} className="space-y-4">
                <Textarea
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  placeholder="Share your thoughts..."
                  rows={4}
                  disabled={isSubmittingComment}
                  maxLength={5000}
                />
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmittingComment || !newCommentContent.trim()}
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Comments */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            Comments ({comments.length})
          </h3>
          
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <h4 className="text-lg font-semibold mb-2">No comments yet</h4>
                <p className="text-muted-foreground">
                  {session ? 'Be the first to share your thoughts!' : 'Log in to join the discussion'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <CommentThread
                  key={comment.id}
                  comment={comment}
                  postId={postId}
                  currentUserId={currentUserId}
                  isAdmin={isAdmin}
                  onCommentUpdate={handleCommentUpdate}
                  onCommentDelete={handleCommentDelete}
                  onReplySubmit={handleReplySubmit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 