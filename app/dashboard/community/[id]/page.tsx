"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, ThumbsUp, Eye, MessageCircle, Clock, Pin } from "lucide-react"
import { dataStore, type CommunityPost } from "@/lib/data-store"
import { useSession } from "next-auth/react"
import { ThreadedReplies } from "@/components/threaded-replies"

export default function CommunityPostPage() {
  const { data: session } = useSession()
  const params = useParams()
  const router = useRouter()
  const postId = params.id as string
  
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [hasLiked, setHasLiked] = useState(false)

  useEffect(() => {
    loadPost()
    
    const unsubscribe = dataStore.subscribe(() => {
      loadPost()
    })
    
    return unsubscribe
  }, [postId])

  const loadPost = () => {
    const foundPost = dataStore.getCommunityPostById(postId)
    setPost(foundPost || null)
    setIsLoading(false)
    
    // Check if user has liked this post
    if (foundPost && session?.user?.id) {
      setHasLiked(dataStore.hasUserLikedPost(postId, session.user.id))
    }
  }

  const handleLikePost = () => {
    if (!session?.user?.id) {
      alert("Please log in to like posts")
      return
    }
    dataStore.togglePostLike(postId, session.user.id)
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
        <Button onClick={() => router.push('/dashboard/community')} className="bg-orange-500 hover:bg-orange-600">
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
                  <Badge variant="outline" className="border-orange-500 text-orange-500">
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

          {/* Post actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={handleLikePost}
                className={`flex items-center space-x-2 ${hasLiked ? 'text-orange-500' : 'text-gray-500'}`}
              >
                <ThumbsUp className={`w-5 h-5 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{post.likes}</span>
                <span className="hidden sm:inline">
                  {post.likes === 1 ? 'Like' : 'Likes'}
                </span>
              </Button>
              
              <div className="flex items-center space-x-2 text-gray-500">
                <MessageCircle className="w-5 h-5" />
                <span>{post.replyCount}</span>
                <span className="hidden sm:inline">
                  {post.replyCount === 1 ? 'Reply' : 'Replies'}
                </span>
              </div>
            </div>

            {/* Admin actions could go here */}
            {session?.user?.role === 'admin' && (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Pin Post
                </Button>
                <Button variant="outline" size="sm">
                  Close Post
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Replies Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">
            Replies ({post.replyCount})
          </h2>
        </CardHeader>
        <CardContent>
          <ThreadedReplies 
            postId={postId} 
            isPostAuthor={isPostAuthor}
            onReplyAdded={() => {
              // Refresh the post to update reply count
              loadPost()
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
} 