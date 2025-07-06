"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ThumbsUp, MessageCircle, Check, ChevronDown, ChevronUp } from "lucide-react"
import { dataStore, type CommunityReply, type CommunityPost } from "@/lib/data-store"
import { useSession } from "next-auth/react"
import { useToast } from "@/hooks/use-toast"

interface ThreadedRepliesProps {
  postId: string
  isPostAuthor?: boolean
  post?: CommunityPost
  onReplyAdded?: () => void
}

interface ReplyWithChildren extends CommunityReply {
  children: ReplyWithChildren[]
}

export function ThreadedReplies({ postId, isPostAuthor = false, post, onReplyAdded }: ThreadedRepliesProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [replies, setReplies] = useState<ReplyWithChildren[]>([])
  const [newReply, setNewReply] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadReplies()
    
    const unsubscribe = dataStore.subscribe(() => {
      loadReplies()
    })
    
    return unsubscribe
  }, [postId])

  const loadReplies = () => {
    const allReplies = dataStore.getRepliesByPostId(postId)
    const threadedReplies = buildReplyTree(allReplies)
    setReplies(threadedReplies)
  }

  const buildReplyTree = (flatReplies: CommunityReply[]): ReplyWithChildren[] => {
    const replyMap = new Map<string, ReplyWithChildren>()
    const rootReplies: ReplyWithChildren[] = []

    // First pass: create all reply objects
    flatReplies.forEach(reply => {
      replyMap.set(reply.id, { ...reply, children: [] })
    })

    // Second pass: build the tree structure
    flatReplies.forEach(reply => {
      const replyWithChildren = replyMap.get(reply.id)!
      
      if (reply.parentReplyId && replyMap.has(reply.parentReplyId)) {
        // This is a child reply
        const parent = replyMap.get(reply.parentReplyId)!
        parent.children.push(replyWithChildren)
      } else {
        // This is a root reply
        rootReplies.push(replyWithChildren)
      }
    })

    return rootReplies
  }

  const handleSubmitReply = async (parentReplyId?: string) => {
    if (!session?.user || !newReply.trim()) return

    // Check if post is closed
    if (post?.status === 'closed') {
      toast({
        title: "Post is closed",
        description: "This post is closed and no longer accepting replies",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      dataStore.addCommunityReply({
        postId,
        authorId: session.user.id || "anonymous",
        authorName: `${session.user.firstName || "Anonymous"} ${session.user.lastName || ""}`.trim(),
        content: newReply.trim(),
        isAcceptedAnswer: false,
        parentReplyId
      })

      setNewReply("")
      setReplyingTo(null)
      onReplyAdded?.()
    } catch (error) {
      console.error("Error adding reply:", error)
      toast({
        title: "Error",
        description: "Failed to add reply. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeReply = (replyId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please log in to like replies",
        variant: "destructive",
      })
      return
    }
    dataStore.toggleReplyLike(replyId, session.user.id)
  }

  const handleAcceptAnswer = (replyId: string) => {
    if (!isPostAuthor) return
    dataStore.markReplyAsAccepted(replyId)
  }

  const toggleReplyExpansion = (replyId: string) => {
    const newExpanded = new Set(expandedReplies)
    if (newExpanded.has(replyId)) {
      newExpanded.delete(replyId)
    } else {
      newExpanded.add(replyId)
    }
    setExpandedReplies(newExpanded)
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

  const ReplyItem = ({ reply, depth = 0 }: { reply: ReplyWithChildren; depth?: number }) => {
    const hasLiked = session?.user?.id ? dataStore.hasUserLikedReply(reply.id, session.user.id) : false
    const isExpanded = expandedReplies.has(reply.id)
    const hasChildren = reply.children.length > 0

    return (
      <div className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''} space-y-3`}>
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs">
                  {reply.authorName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">{reply.authorName}</span>
                  <span className="text-sm text-gray-500">{formatTimeAgo(reply.createdAt)}</span>
                  {reply.isAcceptedAnswer && (
                    <Badge className="bg-green-500">
                      <Check className="w-3 h-3 mr-1" />
                      Accepted Answer
                    </Badge>
                  )}
                </div>
                <div className="text-gray-700 whitespace-pre-wrap">{reply.content}</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLikeReply(reply.id)}
                className={`flex items-center space-x-1 ${hasLiked ? 'text-orange-500' : 'text-gray-500'}`}
              >
                <ThumbsUp className={`w-4 h-4 ${hasLiked ? 'fill-current' : ''}`} />
                <span>{reply.likes}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(replyingTo === reply.id ? null : reply.id)}
                disabled={post?.status === 'closed'}
                className="flex items-center space-x-1 text-gray-500"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reply</span>
              </Button>

              {hasChildren && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleReplyExpansion(reply.id)}
                  className="flex items-center space-x-1 text-gray-500"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  <span>{reply.children.length} {reply.children.length === 1 ? 'reply' : 'replies'}</span>
                </Button>
              )}
            </div>
            
            {isPostAuthor && !reply.isAcceptedAnswer && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAcceptAnswer(reply.id)}
                className="text-green-600 border-green-600 hover:bg-green-50"
              >
                <Check className="w-4 h-4 mr-1" />
                Accept Answer
              </Button>
            )}
          </div>

          {/* Reply form for this specific reply */}
          {replyingTo === reply.id && (
            <div className="mt-4 pt-4 border-t">
              <Textarea
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                placeholder={`Reply to ${reply.authorName}...`}
                rows={3}
                className="mb-3"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null)
                    setNewReply("")
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleSubmitReply(reply.id)}
                  disabled={isSubmitting || !newReply.trim()}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  {isSubmitting ? "Replying..." : "Reply"}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Child replies */}
        {hasChildren && (isExpanded || depth === 0) && (
          <div className="space-y-3">
            {reply.children.map((childReply) => (
              <ReplyItem key={childReply.id} reply={childReply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main reply form */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold mb-3">Add your reply</h3>
        {post?.status === 'closed' ? (
          <div className="text-center py-4 text-gray-500">
            <p>This post is closed and no longer accepting replies.</p>
          </div>
        ) : (
          <>
            <Textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              placeholder="Share your thoughts or answer the question..."
              rows={4}
              className="mb-3"
            />
            <div className="flex justify-end">
              <Button
                onClick={() => handleSubmitReply()}
                disabled={isSubmitting || !newReply.trim() || !session?.user}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {!session?.user ? "Login to Reply" : isSubmitting ? "Posting..." : "Post Reply"}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Replies list */}
      <div className="space-y-4">
        {replies.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No replies yet. Be the first to respond!</p>
          </div>
        ) : (
          replies.map((reply) => (
            <ReplyItem key={reply.id} reply={reply} />
          ))
        )}
      </div>
    </div>
  )
} 