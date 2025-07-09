"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Heart, Eye, MessageCircle, Clock, Pin } from "lucide-react"
import { CommunityService, CommunityPost } from "@/lib/services/community.service"
import { useSession } from "next-auth/react"
import { ThreadedReplies } from "@/components/threaded-replies"
import { useToast } from "@/hooks/use-toast"

export default function CommunityPostPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string
  
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadPost()
  }, [postId])

  const loadPost = async () => {
    try {
      setIsLoading(true)
      const foundPost = await CommunityService.getPost(postId)
      setPost(foundPost)
    } catch (error) {
      console.error('Error loading post:', error)
      setPost(null)
      toast({
        title: "Error",
        description: "Failed to load post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLikePost = async () => {
    if (!session?.user?.id || !post) {
      toast({
        title: "Authentication required",
        description: "Please log in to like posts",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await CommunityService.togglePostLike(postId)
      setPost(prevPost => 
        prevPost ? {
          ...prevPost,
          likes: result.totalLikes,
          isLikedByUser: result.liked
        } : null
      )
    } catch (error) {
      console.error('Error toggling like:', error)
      toast({
        title: "Error",
        description: "Failed to update like status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleTogglePin = async () => {
    if (session?.user?.role !== 'admin' || !post) {
      toast({
        title: "Permission denied",
        description: "Only administrators can pin posts",
        variant: "destructive",
      })
      return
    }

    try {
      const updatedPost = await CommunityService.updatePost(postId, { 
        isPinned: !post.isPinned 
      })
      setPost(updatedPost)
      toast({
        title: "Success",
        description: `Post ${updatedPost.isPinned ? 'pinned' : 'unpinned'} successfully`,
      })
    } catch (error) {
      console.error('Error toggling pin:', error)
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleClose = async () => {
    if (session?.user?.role !== 'admin' || !post) {
      toast({
        title: "Permission denied",
        description: "Only administrators can close posts",
        variant: "destructive",
      })
      return
    }

    try {
      const newStatus = post.status === 'closed' ? 'active' : 'closed'
      const updatedPost = await CommunityService.updatePost(postId, { 
        status: newStatus 
      })
      setPost(updatedPost)
      toast({
        title: "Success",
        description: `Post ${newStatus === 'closed' ? 'closed' : 'reopened'} successfully`,
      })
    } catch (error) {
      console.error('Error toggling close:', error)
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours} hours ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays} days ago`
    return date.toLocaleDateString()
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="w-20 h-10 bg-gray-200 animate-pulse rounded"></div>
        <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
        <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-6">The post you're looking for doesn't exist or has been removed.</p>
        <Button onClick={() => router.push('/dashboard/community')} className="bg-blue-600 hover:bg-blue-700">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Community
        </Button>
      </div>
    )
  }

  const isPostAuthor = session?.user?.id === post.authorId

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <Button 
        variant="ghost" 
        onClick={() => router.push('/dashboard/community')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Community
      </Button>

      {/* Post Content */}
      <Card>
        <CardHeader className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                {post.isPinned && (
                  <Badge variant="outline" className="border-yellow-500 text-yellow-600">
                    <Pin className="w-3 h-3 mr-1" />
                    Pinned
                  </Badge>
                )}
                {post.isAnswered && (
                  <Badge className="bg-green-500">
                    Answered
                  </Badge>
                )}
                <Badge variant="outline">{post.category}</Badge>
                <Badge variant="secondary" className="capitalize">
                  {post.status}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>
              
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="text-xs">
                      {post.authorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{post.authorName}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatTimeAgo(post.createdAt)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{post.views} views</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Post content */}
          <div className="prose max-w-none">
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLikePost}
                className={`flex items-center space-x-2 ${
                  post.isLikedByUser 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.isLikedByUser ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
                <span className="hidden sm:inline">
                  {post.likes === 1 ? 'Like' : 'Likes'}
                </span>
              </Button>
              
              <div className="flex items-center space-x-2 text-gray-600">
                <MessageCircle className="w-4 h-4" />
                <span>{post.replyCount}</span>
                <span className="hidden sm:inline">
                  {post.replyCount === 1 ? 'Reply' : 'Replies'}
                </span>
              </div>
            </div>

            {/* Admin Actions */}
            {session?.user?.role === 'admin' && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleTogglePin}
                >
                  <Pin className="w-4 h-4 mr-1" />
                  {post.isPinned ? 'Unpin' : 'Pin'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleClose}
                >
                  {post.status === 'closed' ? 'Reopen' : 'Close'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Replies Section */}
      <ThreadedReplies 
        postId={postId} 
        isPostClosed={post.status === 'closed'}
        onReplyAdded={loadPost}
      />
    </div>
  )
} 