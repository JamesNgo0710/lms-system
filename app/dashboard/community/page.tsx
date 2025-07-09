"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Search, MessageSquare, Users, TrendingUp, Eye, Heart, MessageCircle } from 'lucide-react'
import { PostCreationModal } from "@/components/post-creation-modal"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { CommunityService, CommunityPost, CommunityStats } from "@/lib/services/community.service"

export default function CommunityPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [stats, setStats] = useState<CommunityStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    loadCommunityData()
  }, [])

  const loadCommunityData = async () => {
    try {
      setIsLoading(true)
      const [postsData, statsData] = await Promise.all([
        CommunityService.getPosts(),
        CommunityService.getStats()
      ])
      setPosts(postsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading community data:', error)
      toast({
        title: "Error",
        description: "Failed to load community data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePostClick = (postId: string) => {
    router.push(`/dashboard/community/${postId}`)
  }

  const handleLike = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!session?.user?.id) return

    try {
      const result = await CommunityService.togglePostLike(postId)
      
      // Update local state
      setPosts(prevPosts => 
        prevPosts.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes: result.totalLikes,
                isLikedByUser: result.liked
              }
            : post
        )
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

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["All", ...Array.from(new Set(posts.map(post => post.category)))]

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading community...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-gray-600 mt-2">Connect, share, and learn together</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPosts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Replies</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalReplies}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Answered Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.answeredRate}%</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.map(post => (
          <Card 
            key={post.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handlePostClick(post.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {post.isPinned && (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                        Pinned
                      </Badge>
                    )}
                    {post.isAnswered && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Answered
                      </Badge>
                    )}
                    <Badge variant="outline">{post.category}</Badge>
                  </div>
                  <CardTitle className="text-lg hover:text-blue-600 transition-colors">
                    {post.title}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    by {post.authorName} • {new Date(post.createdAt).toLocaleDateString()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-2">
                {post.content.length > 150 ? `${post.content.substring(0, 150)}...` : post.content}
              </p>
              
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-1 mb-4">
                  {post.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {post.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{post.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Post Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.replyCount}</span>
                  </div>
                  <button
                    onClick={(e) => handleLike(post.id, e)}
                    className={`flex items-center gap-1 hover:text-red-500 transition-colors ${
                      post.isLikedByUser ? 'text-red-500' : ''
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.isLikedByUser ? 'fill-current' : ''}`} />
                    <span>{post.likes}</span>
                  </button>
                </div>
                <Badge 
                  variant={post.status === 'active' ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {post.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory !== "All" 
              ? "Try adjusting your search criteria." 
              : "Be the first to start a discussion!"
            }
          </p>
          {(!searchTerm && selectedCategory === "All") && (
            <Button onClick={() => setIsModalOpen(true)}>
              Create First Post
            </Button>
          )}
        </div>
      )}

      {/* Post Creation Modal */}
      <PostCreationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onPostCreated={loadCommunityData}
      />
    </div>
  )
}
