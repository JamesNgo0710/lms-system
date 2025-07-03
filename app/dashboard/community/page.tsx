"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle, ThumbsUp, Clock, Users, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { dataStore, type CommunityPost, type CommunityStats } from "@/lib/data-store"
import { useSession } from "next-auth/react"
import { PostCreationModal } from "@/components/post-creation-modal"
import { useRouter } from "next/navigation"

export default function CommunityPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [stats, setStats] = useState<CommunityStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCommunityData = () => {
      const communityPosts = dataStore.getCommunityPosts()
      const communityStats = dataStore.getCommunityStats()
      setPosts(communityPosts)
      setStats(communityStats)
      setIsLoading(false)
    }

    loadCommunityData()

    // Subscribe to data store changes
    const unsubscribe = dataStore.subscribe(loadCommunityData)
    return unsubscribe
  }, [])

  const handlePostCreated = () => {
    // Refresh the posts when a new one is created
    const communityPosts = dataStore.getCommunityPosts()
    const communityStats = dataStore.getCommunityStats()
    setPosts(communityPosts)
    setStats(communityStats)
  }

  const handlePostClick = (postId: string) => {
    // Increment view count and navigate to post
    dataStore.incrementPostViews(postId)
    router.push(`/dashboard/community/${postId}`)
  }

  const handleLikePost = (postId: string, event: React.MouseEvent) => {
    event.stopPropagation() // Prevent navigation when clicking like
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
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Community</h1>
          <div className="w-32 h-10 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-gray-200 animate-pulse rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Community</h1>
        <PostCreationModal onPostCreated={handlePostCreated}>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Start New Discussion
          </Button>
        </PostCreationModal>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalPosts || 0}</p>
                    <p className="text-sm text-gray-600">Total Discussions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
                    <p className="text-sm text-gray-600">Active Members</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <ThumbsUp className="w-8 h-8 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalReplies || 0}</p>
                    <p className="text-sm text-gray-600">Total Replies</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Popular Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats?.topCategories.map((category) => (
                  <Badge 
                    key={category.name} 
                    variant="outline" 
                    className="cursor-pointer hover:bg-orange-100"
                  >
                    {category.name} ({category.count})
                  </Badge>
                ))}
                {/* Fallback categories if no stats */}
                {(!stats?.topCategories || stats.topCategories.length === 0) && (
                  <>
                    <Badge variant="outline" className="cursor-pointer hover:bg-orange-100">
                      Blockchain Basics
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-orange-100">
                      Smart Contracts
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-orange-100">
                      DeFi
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-orange-100">
                      NFTs
                    </Badge>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Discussions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Discussions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {posts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No discussions yet. Be the first to start a conversation!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div 
                      key={post.id} 
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handlePostClick(post.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold hover:text-orange-500">{post.title}</h3>
                            {post.isAnswered && (
                              <Badge variant="default" className="bg-green-500">
                                Answered
                              </Badge>
                            )}
                            {post.isPinned && (
                              <Badge variant="outline" className="border-orange-500 text-orange-500">
                                Pinned
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <div className="flex items-center space-x-1">
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="text-xs">
                                  {post.authorName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span>{post.authorName}</span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {post.category}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{formatTimeAgo(post.createdAt)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <span className="text-xs">Views: {post.views}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{post.replyCount}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => handleLikePost(post.id, e)}
                            className={`flex items-center space-x-1 p-0 h-auto ${
                              session?.user?.id && dataStore.hasUserLikedPost(post.id, session.user.id) 
                                ? 'text-orange-500' 
                                : 'text-gray-600 hover:text-orange-500'
                            }`}
                          >
                            <ThumbsUp className={`w-4 h-4 ${
                              session?.user?.id && dataStore.hasUserLikedPost(post.id, session.user.id) 
                                ? 'fill-current' 
                                : ''
                            }`} />
                            <span>{post.likes}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats?.topContributors.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No contributors yet
                  </p>
                ) : (
                  stats?.topContributors.map((contributor, index) => (
                    <div key={contributor.id} className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                      </div>
                      <Avatar>
                        <AvatarFallback>
                          {contributor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{contributor.name}</p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{contributor.reputation} pts</span>
                          <Badge variant="outline" className="text-xs">
                            {contributor.reputation > 50 ? "Expert" : contributor.reputation > 20 ? "Advanced" : "Beginner"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Be respectful and constructive in discussions</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Search before posting to avoid duplicates</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Use clear, descriptive titles</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Mark helpful answers as solutions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Role Info */}
          {session?.user && (
            <Card>
              <CardHeader>
                <CardTitle>Your Role</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="font-medium">{session.user.role === 'admin' ? 'Administrator' : 'Student'}</p>
                  <p className="text-gray-600 mt-1">
                    {session.user.role === 'admin' 
                      ? 'You can moderate discussions and help manage the community.' 
                      : 'Share your questions and help others learn!'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
