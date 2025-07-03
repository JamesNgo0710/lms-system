"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit3, 
  Save, 
  X,
  BookOpen,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Award,
  GraduationCap,
  Users,
  Star,
  ArrowLeft,
  Download
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

const externalCourses = [
  {
    course: "Lorem Ipsum dolor sit amet",
    location: "1234 Lorem Ipsum, Sydney, NSW 2000",
    monthYear: "September 11, 2023",
  },
  {
    course: "Consectetur Adipiscing Sed",
    location: "4312 Consectetur, Sydney, NSW 2000",
    monthYear: "August 18, 2023",
  },
  {
    course: "Eiusmod Tempor Incididunt",
    location: "2134 Dolor Sit, Sydney, NSW 2000",
    monthYear: "July 09, 2023",
  },
  {
    course: "Ut Labore Dolore Magna",
    location: "3142 Adipiscing Elit, Sydney, NSW 2000",
    monthYear: "January 12, 2023",
  },
]

const completedCourses = [
  {
    course: "General Info On Blockchain Tech",
    completedDate: "October 20, 2023",
  },
  {
    course: "Getting started with Crypto",
    completedDate: "October 21, 2023",
  },
  {
    course: "Decentralised Finance (DeFi)",
    completedDate: "October 22, 2023",
  },
  {
    course: "General Info On Blockchain Tech",
    completedDate: "October 23, 2023",
  },
  {
    course: "Getting started with Crypto",
    completedDate: "October 24, 2023",
  },
]

interface ProfileFormData {
  name: string
  email: string
  phone: string
  location: string
  bio: string
  website: string
  linkedin: string
  twitter: string
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const user = session?.user
  
  // Mock user data - In real app, this would come from your database
  const userData = {
    id: "1",
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    role: user?.role || "student",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Passionate learner with a keen interest in technology and innovation. Always excited to explore new concepts and apply them in real-world scenarios.",
    website: "https://johndoe.dev",
    linkedin: "linkedin.com/in/johndoe",
    twitter: "@johndoe",
    joinDate: "2023-01-15",
    avatar: "/profile-photo.png",
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">MM</span>
          <span className="text-sm font-medium">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="bg-orange-500 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Profile</CardTitle>
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-orange-600">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      {/* Main Profile Content */}
      <Card>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1">
              <div className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-OkLjRyHfzlc5jMC7mGGZgURubqqQQA.png"
                    alt={`${user.firstName} ${user.lastName}`}
                  />
                  <AvatarFallback className="text-2xl">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600">Senior Laravel Developer</p>
                <p className="text-sm text-gray-500 mt-2">
                  <strong>Start Date:</strong> {user.joinedDate}
                </p>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold mb-2">Bio:</h3>
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore
                  dolore magna aliquat enim ad minim consectetur.
                </p>
              </div>
            </div>

            {/* Skills and Interests */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills */}
                <div className="bg-gray-900 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Skills</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Top Skills/Expertise:</h4>
                      <p className="text-sm text-gray-300">Laravel, CSS, PHP</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Other Skills:</h4>
                      <p className="text-sm text-gray-300">
                        Lorem ipsum dolor sit amet consectetur adipiscing Sed do eiusmod tempor incididunt ut labore
                      </p>
                    </div>
                  </div>
                </div>

                {/* Professional Interests */}
                <div className="bg-gray-900 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Professional Interests</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Personal Interests:</h4>
                      <p className="text-sm text-gray-300">
                        Lorem ipsum dolor sit amet consectetur adipiscing Sed do eiusmod tempor incididunt ut labore
                        dolore magna aliquat enim ad minim consectetur.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium">Hobbies:</h4>
                      <p className="text-sm text-gray-300">
                        Lorem ipsum dolor sit amet consectetur adipiscing Sed do eiusmod tempor incididunt ut labore
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Button */}
              <div className="text-center">
                <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
                  <Download className="w-4 h-4 mr-2" />
                  Export To PDF
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* External Courses */}
      <Card>
        <CardHeader className="bg-gray-900 text-white">
          <CardTitle className="flex items-center">
            <span className="mr-2">📚</span>
            Courses Taken Or Certificates Received Outside Of The LMS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-500 hover:bg-orange-500">
                <TableHead className="text-white">Course</TableHead>
                <TableHead className="text-white">Location</TableHead>
                <TableHead className="text-white">Month/Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {externalCourses.map((course, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{course.course}</TableCell>
                  <TableCell>{course.location}</TableCell>
                  <TableCell>{course.monthYear}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Completed Courses */}
      <Card>
        <CardHeader className="bg-gray-900 text-white">
          <CardTitle className="flex items-center">
            <span className="mr-2">✅</span>
            Course Completed Within The LMS
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-500 hover:bg-orange-500">
                <TableHead className="text-white">Course</TableHead>
                <TableHead className="text-white">Completed Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {completedCourses.map((course, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{course.course}</TableCell>
                  <TableCell>{course.completedDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pb-8">
        <Button className="bg-orange-500 hover:bg-orange-600">Edit</Button>
        <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50">
          Archive
        </Button>
      </div>
    </div>
  )
}
