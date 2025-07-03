"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Download, Star, FileText, Video, CheckCircle, Play, Clock, Users } from "lucide-react"
import type { Topic } from "@/lib/data-store"

interface TopicPreviewProps {
  topic: Topic
}

const mockLessons = [
  { id: 1, title: "Introduction to the Topic", completed: true, type: "video", duration: "15 min" },
  { id: 2, title: "Basic Concepts", completed: true, type: "video", duration: "12 min" },
  { id: 3, title: "Practical Examples", completed: false, type: "video", duration: "18 min" },
  { id: 4, title: "Advanced Techniques", completed: false, type: "video", duration: "22 min" },
]

const mockResources = [
  { name: "Getting Started Guide", size: "2.5 MB", type: "PDF" },
  { name: "Reference Materials", size: "4.2 MB", type: "PDF" },
  { name: "Practice Exercises", size: "1.8 MB", type: "PDF" },
  { name: "Additional Resources", size: "3.1 MB", type: "PDF" },
]

// Make this the default export so it can be imported without braces.
export default function TopicPreview({ topic }: TopicPreviewProps) {
  const mockProgress = 65 // Simulated student progress
  const mockRating = 4.8
  const mockDuration = "2-3 hours"

  return (
    <div className="space-y-6 p-4 bg-gray-50 rounded-lg">
      {/* Preview Notice */}
      <div className="bg-purple-100 border border-purple-300 rounded-lg p-3">
        <p className="text-sm text-purple-700 font-medium">
          📖 Student View Preview - This is exactly how students see this topic
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-gray-900 relative rounded-t-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-70" />
                    <p className="text-lg font-semibold">{topic.title}</p>
                    <p className="text-sm opacity-70">Video Content Preview</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">{topic.description || "Topic Overview"}</h2>
                  <Badge variant="outline">{topic.difficulty}</Badge>
                </div>
                <p className="text-gray-600 mb-4">
                  {topic.description ||
                    "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore dolore magna aliquat enim ad minim consectetur."}
                </p>
                <p className="text-gray-600 mb-6">
                  This comprehensive course covers all the essential concepts and practical applications you need to
                  master this topic.
                </p>

                {/* Resource Links */}
                <div className="space-y-2">
                  <p className="font-medium">
                    YouTube: <span className="text-blue-600">https://www.youtube.com/watch?v=example</span>
                  </p>
                  <p className="font-medium">
                    Discord: <span className="text-blue-600">https://discord.gg/nft-community</span>
                  </p>
                  <p className="font-medium">
                    Twitter: <span className="text-blue-600">https://twitter.com/nftcommunity</span>
                  </p>
                  <p className="font-medium">
                    Instagram: <span className="text-blue-600">https://www.instagram.com/nftcommunity</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Downloads */}
          <Card>
            <CardHeader>
              <CardTitle>Downloads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockResources.map((resource, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-sm">{resource.name}</p>
                        <p className="text-xs text-gray-500">{resource.size}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" disabled>
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Topic Info */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration</span>
                  <span className="font-medium">{mockDuration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Students</span>
                  <span className="font-medium">{topic.students}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{mockRating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category</span>
                  <Badge variant="outline">{topic.category}</Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span className="font-medium">{mockProgress}%</span>
                  </div>
                  <Progress value={mockProgress} className="h-2" />
                </div>
                {topic.hasAssessment ? (
                  <Button className="w-full" disabled>
                    Take Assessment
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    No Assessment Available
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Lessons */}
          <Card>
            <CardHeader>
              <CardTitle>Lessons ({topic.lessons || mockLessons.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockLessons.map((lesson) => (
                  <div key={lesson.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                    {lesson.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                    )}
                    <Video className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{lesson.title}</p>
                      <p className="text-xs text-gray-500">{lesson.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Topic Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Topic Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">Enrolled Students</span>
                  </div>
                  <span className="font-semibold">{topic.students}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Average Completion</span>
                  </div>
                  <span className="font-semibold">78%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">Student Rating</span>
                  </div>
                  <span className="font-semibold">{mockRating}/5</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
