"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Users,
  Clock,
  Search,
  Filter,
  GripVertical,
  Save,
  X
} from "lucide-react"
import { useTopics, useLessons, useAssessments } from "@/hooks/use-api-data-store"

export function ContentManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingTopic, setEditingTopic] = useState<any>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newTopic, setNewTopic] = useState({
    title: "",
    category: "",
    description: "",
    difficulty: "Beginner",
    status: "Draft"
  })

  const { topics } = useTopics()
  const { lessons } = useLessons()

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || topic.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateTopic = () => {
    if (!newTopic.title.trim()) return
    
    const topic = {
      id: Date.now(),
      ...newTopic,
      students: 0,
      lessons: 0,
      createdAt: new Date().toISOString(),
      hasAssessment: false
    }
    
    // TODO: Implement createTopic API call
    console.log('Creating topic:', topic)
    setNewTopic({
      title: "",
      category: "",
      description: "",
      difficulty: "Beginner",
      status: "Draft"
    })
    setIsCreateDialogOpen(false)
  }

  const handleUpdateTopic = (topicId: number, updates: any) => {
    // TODO: Implement updateTopic API call
    console.log('Updating topic:', topicId, updates)
    setEditingTopic(null)
  }

  const handleDeleteTopic = (topicId: number) => {
    if (confirm("Are you sure you want to delete this topic?")) {
      // TODO: Implement deleteTopic API call
      console.log('Deleting topic:', topicId)
    }
  }

  const getTopicLessons = (topicId: number) => {
    return lessons.filter(lesson => lesson.topicId === topicId)
  }

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage topics, lessons, and learning content</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Topic
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Topic</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input 
                  value={newTopic.title}
                  onChange={(e) => setNewTopic({...newTopic, title: e.target.value})}
                  placeholder="Enter topic title"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Category</label>
                <Input 
                  value={newTopic.category}
                  onChange={(e) => setNewTopic({...newTopic, category: e.target.value})}
                  placeholder="Enter category"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea 
                  value={newTopic.description}
                  onChange={(e) => setNewTopic({...newTopic, description: e.target.value})}
                  placeholder="Enter description"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Difficulty</label>
                  <Select value={newTopic.difficulty} onValueChange={(value) => setNewTopic({...newTopic, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select value={newTopic.status} onValueChange={(value) => setNewTopic({...newTopic, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateTopic} className="flex-1">
                  Create Topic
                </Button>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Published">Published</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        <Badge variant="outline" className="text-sm">
          {filteredTopics.length} topics
        </Badge>
      </div>

      {/* Topics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTopics.map((topic) => {
          const topicLessons = getTopicLessons(topic.id)
          const isEditing = editingTopic?.id === topic.id
          
          return (
            <Card key={topic.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {isEditing ? (
                      <Input 
                        value={editingTopic.title}
                        onChange={(e) => setEditingTopic({...editingTopic, title: e.target.value})}
                        className="mb-2"
                      />
                    ) : (
                      <CardTitle className="text-lg line-clamp-2">{topic.title}</CardTitle>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Badge 
                        variant={topic.status === "Published" ? "default" : "secondary"}
                        className={topic.status === "Published" ? "bg-green-500" : ""}
                      >
                        {topic.status}
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          topic.difficulty === 'Beginner' ? 'border-green-500 text-green-700' :
                          topic.difficulty === 'Intermediate' ? 'border-yellow-500 text-yellow-700' :
                          'border-red-500 text-red-700'
                        }`}
                      >
                        {topic.difficulty}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTopic(isEditing ? null : {...topic})}
                    >
                      {isEditing ? <X className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteTopic(topic.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Category</label>
                      <Input 
                        value={editingTopic.category}
                        onChange={(e) => setEditingTopic({...editingTopic, category: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea 
                        value={editingTopic.description || ""}
                        onChange={(e) => setEditingTopic({...editingTopic, description: e.target.value})}
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Select 
                        value={editingTopic.difficulty} 
                        onValueChange={(value) => setEditingTopic({...editingTopic, difficulty: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select 
                        value={editingTopic.status} 
                        onValueChange={(value) => setEditingTopic({...editingTopic, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Draft">Draft</SelectItem>
                          <SelectItem value="Published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      onClick={() => handleUpdateTopic(topic.id, editingTopic)}
                      className="w-full"
                      size="sm"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {topic.description || "No description available"}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          Lessons
                        </span>
                        <Badge variant="outline">{topicLessons.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          Students
                        </span>
                        <Badge variant="outline">{topic.students}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Created
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(topic.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <BookOpen className="w-4 h-4 mr-1" />
                        Lessons
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTopics.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No topics found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Try adjusting your search or filter criteria"
                : "Create your first topic to get started"
              }
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Topic
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}