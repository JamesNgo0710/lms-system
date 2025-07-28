"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
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
  Download,
  Settings,
  Archive,
  Camera,
  Plus,
  Check
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useTopics, useLessons, useLessonCompletions, useAssessmentAttempts, useUsers } from "@/hooks/use-api-data-store"
import { useToast } from "@/hooks/use-toast"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"
import { DEFAULT_VALUES } from "@/lib/constants"
import { generateAvatarUrl, getExternalCoursesTemplate } from "@/lib/demo-data"

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

// Predefined skills list for search and add functionality
const PREDEFINED_SKILLS = [
  "JavaScript", "TypeScript", "Python", "Java", "C++", "C#", "PHP", "Ruby", "Go", "Rust",
  "React", "Vue.js", "Angular", "Next.js", "Node.js", "Express.js", "Laravel", "Django", "Flask", "Spring",
  "HTML", "CSS", "SASS", "SCSS", "Tailwind CSS", "Bootstrap", "Material-UI", "Styled Components",
  "MySQL", "PostgreSQL", "MongoDB", "Redis", "SQLite", "Oracle", "SQL Server",
  "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "Git", "GitHub", "GitLab",
  "Machine Learning", "Data Science", "Artificial Intelligence", "Deep Learning", "Neural Networks",
  "Web Development", "Mobile Development", "Backend Development", "Frontend Development", "Full Stack",
  "DevOps", "Testing", "QA", "Agile", "Scrum", "Project Management", "UI/UX Design", "Graphic Design",
  "API Development", "RESTful APIs", "GraphQL", "Microservices", "System Design", "Software Architecture",
  "Linux", "Windows", "macOS", "Bash", "PowerShell", "Vim", "VS Code", "IntelliJ", "Eclipse"
]

// Predefined professional interests for search and add functionality
const PREDEFINED_INTERESTS = [
  "Web Development", "Mobile Development", "Software Engineering", "Data Science", "Machine Learning",
  "Artificial Intelligence", "Cybersecurity", "Cloud Computing", "DevOps", "Blockchain",
  "Game Development", "UI/UX Design", "Product Management", "Project Management", "Business Analysis",
  "Digital Marketing", "E-commerce", "Fintech", "Healthcare Technology", "Education Technology",
  "IoT (Internet of Things)", "Augmented Reality", "Virtual Reality", "Robotics", "Automation",
  "Quality Assurance", "Database Administration", "System Administration", "Network Security",
  "Technical Writing", "Research & Development", "Open Source", "Startups", "Enterprise Solutions",
  "Agile Methodologies", "Scrum", "Lean Development", "Continuous Integration", "Microservices",
  "API Development", "Frontend Technologies", "Backend Technologies", "Full Stack Development"
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
  skills: string[]
}

export default function ProfilePage() {
  const { data: session, update: updateSession } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const viewUserId = searchParams.get('userId')
  const isAdminView = searchParams.get('admin') === 'true'
  
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [isArchiving, setIsArchiving] = useState(false)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState<any>({})
  const [skillsPopoverOpen, setSkillsPopoverOpen] = useState(false)
  const [interestsPopoverOpen, setInterestsPopoverOpen] = useState(false)
  const [customInterest, setCustomInterest] = useState('')
  
  // Data store hooks
  const { getTopicById } = useTopics()
  const { getLessonById } = useLessons()
  const { getUserLessonCompletions } = useLessonCompletions()
  const { getTopicAssessmentAttempts } = useAssessmentAttempts()
  const { users, updateUser } = useUsers()
  
  // Determine which user profile to show
  const currentUser = session?.user
  const targetUser = viewUserId ? users.find(u => u.id === viewUserId) : currentUser
  const user = targetUser || currentUser
  
  // Check if current user is admin and can edit other profiles
  const canEdit = !viewUserId || (currentUser?.role === 'admin' && isAdminView)

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Load profile image from localStorage
  useEffect(() => {
    if (user?.id) {
      const savedImage = localStorage.getItem(`profileImage_${user.id}`)
      if (savedImage) {
        setProfileImage(savedImage)
      }
    }
  }, [user?.id])
  
  // Initialize edit form when user changes
  useEffect(() => {
    if (user) {
      // Parse skills string into array
      const skillsArray = user.skills 
        ? user.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
        : ['Laravel', 'CSS', 'PHP'] // Default skills if none exist
      
      // Parse interests string into array
      const interestsArray = user.interests 
        ? user.interests.split(',').map(interest => interest.trim()).filter(interest => interest.length > 0)
        : ['Web Development', 'Software Engineering'] // Default interests if none exist
      
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'student',
        bio: user.bio || 'Passionate learner with a keen interest in technology and innovation.',
        phone: user.phone || '',
        location: user.location || '',
        skills: skillsArray,
        interests: interestsArray
      })
    }
  }, [user])

  // Listen for profile image updates
  useEffect(() => {
    const handleProfileImageUpdate = (event: CustomEvent) => {
      if (user?.id && event.detail.userId === user.id) {
        setProfileImage(event.detail.imageData)
      }
    }

    window.addEventListener('profileImageUpdate', handleProfileImageUpdate as EventListener)
    return () => window.removeEventListener('profileImageUpdate', handleProfileImageUpdate as EventListener)
  }, [user?.id])

  // Get actual completed courses from data store
  const getCompletedCourses = () => {
    if (!user || !isHydrated) return []
    
    const completions = getUserLessonCompletions(user.id)
    console.log('🔍 Profile: User completions:', completions.length, completions)
    
    // Group completions by topic and get unique topics
    const topicCompletions: { [key: number]: { completedAt: string; lessons: number } } = {}
    
    completions.forEach(completion => {
      const topicId = Number(completion.topicId)
      console.log('🔍 Profile: Processing completion:', { 
        completionId: completion.id, 
        topicId, 
        completedAt: completion.completedAt,
        isCompleted: completion.isCompleted 
      })
      
      if (!topicCompletions[topicId]) {
        topicCompletions[topicId] = {
          completedAt: completion.completedAt,
          lessons: 0
        }
      }
      topicCompletions[topicId].lessons += 1
      // Keep the latest completion date
      if (completion.completedAt > topicCompletions[topicId].completedAt) {
        topicCompletions[topicId].completedAt = completion.completedAt
      }
    })

    console.log('🔍 Profile: Topic completions:', topicCompletions)

    // Convert to array of completed courses with assessment scores
    return Object.entries(topicCompletions).map(([topicId, data]) => {
      const topic = getTopicById(Number(topicId))
      const assessmentAttempts = getTopicAssessmentAttempts(user.id, Number(topicId))
      
      console.log(`🔍 Profile: Topic ${topicId} assessment attempts:`, assessmentAttempts.length)
      assessmentAttempts.forEach((attempt, i) => {
        console.log(`🔍 Profile: Attempt ${i}:`, {
          id: attempt.id,
          userId: attempt.userId,
          assessmentId: attempt.assessmentId,
          topicId: attempt.topicId,
          score: attempt.score,
          completedAt: attempt.completedAt
        })
      })
      
      // Get the best assessment score for this topic
      const bestAttempt = assessmentAttempts.length > 0 
        ? assessmentAttempts.reduce((best, current) => 
            current.score > best.score ? current : best
          )
        : null
      
      console.log(`🔍 Profile: Topic ${topicId} best attempt score:`, bestAttempt?.score)
      
      return {
        course: topic?.title || `Topic ${topicId}`,
        completedDate: new Date(data.completedAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        lessonsCompleted: data.lessons,
        assessmentScore: bestAttempt ? `${bestAttempt.score}%` : 'Not taken',
        assessmentPassed: bestAttempt ? bestAttempt.score >= 70 : false
      }
    })
  }

  const completedCourses = getCompletedCourses()

  // Export to PDF functionality
  const exportToPDF = async () => {
    if (!user) return
    
    setIsExporting(true)
    try {
      const profileElement = document.getElementById('profile-content')
      if (!profileElement) {
        throw new Error('Profile content not found')
      }

      // Create canvas from HTML
      const canvas = await html2canvas(profileElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // Add image to PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }

      // Save PDF
      pdf.save(`${user.firstName}_${user.lastName}_Profile.pdf`)
      
      toast({
        title: "Success",
        description: "Profile exported to PDF successfully",
      })
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast({
        title: "Error",
        description: "Failed to export profile to PDF",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  // Handle Edit button click
  const handleEdit = () => {
    if (canEdit) {
      setIsEditing(true)
    } else {
      router.push('/dashboard/settings')
    }
  }
  
  // Handle save profile changes
  const handleSaveProfile = async () => {
    if (!user || !canEdit) return
    
    try {
      // Use the Laravel backend API directly
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${(session as any)?.accessToken}`,
        },
        body: JSON.stringify({
          first_name: editForm.firstName,
          last_name: editForm.lastName,
          bio: editForm.bio,
          phone: editForm.phone,
          location: editForm.location,
          skills: editForm.skills.join(', '), // Convert array back to comma-separated string
          interests: editForm.interests.join(', '), // Convert array back to comma-separated string
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
      }

      const updatedUser = await response.json()
      
      // Update the local user data in data store
      updateUser(user.id, {
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        bio: editForm.bio,
        phone: editForm.phone,
        location: editForm.location,
        skills: editForm.skills.join(', '),
        interests: editForm.interests.join(', '),
        profileImage: profileImage || user.profileImage
      })
      
      // Refresh session with updated user data
      try {
        const refreshResponse = await fetch('/api/auth/refresh', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json()
          await updateSession({
            ...session,
            user: {
              ...session?.user,
              firstName: refreshData.user.firstName,
              lastName: refreshData.user.lastName,
              name: refreshData.user.name,
              bio: refreshData.user.bio,
              phone: refreshData.user.phone,
              location: refreshData.user.location,
              skills: refreshData.user.skills,
              interests: refreshData.user.interests,
              joinedDate: refreshData.user.joinedDate,
            }
          })
          
          // Force page refresh to ensure updated data is shown
          window.location.reload()
        }
      } catch (refreshError) {
        console.error("Error refreshing session:", refreshError)
      }
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
      
      setIsEditing(false)
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile",
        variant: "destructive",
      })
    }
  }
  
  // Handle cancel edit
  const handleCancelEdit = () => {
    setIsEditing(false)
    // Reset form to original values
    if (user) {
      const skillsArray = user.skills 
        ? user.skills.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
        : ['Laravel', 'CSS', 'PHP'] // Default skills if none exist
      
      const interestsArray = user.interests 
        ? user.interests.split(',').map(interest => interest.trim()).filter(interest => interest.length > 0)
        : ['Web Development', 'Software Engineering'] // Default interests if none exist
      
      setEditForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: user.role || 'student',
        bio: user.bio || 'Passionate learner with a keen interest in technology and innovation.',
        phone: user.phone || '',
        location: user.location || '',
        skills: skillsArray,
        interests: interestsArray
      })
    }
  }

  // Add skill to the list
  const addSkill = (skill: string) => {
    if (!editForm.skills.includes(skill)) {
      setEditForm({
        ...editForm,
        skills: [...editForm.skills, skill]
      })
    }
    setSkillsPopoverOpen(false)
  }

  // Remove skill from the list
  const removeSkill = (skillToRemove: string) => {
    setEditForm({
      ...editForm,
      skills: editForm.skills.filter(skill => skill !== skillToRemove)
    })
  }

  // Add interest to the list
  const addInterest = (interest: string) => {
    if (!editForm.interests.includes(interest)) {
      setEditForm({
        ...editForm,
        interests: [...editForm.interests, interest]
      })
    }
    setInterestsPopoverOpen(false)
  }

  // Remove interest from the list
  const removeInterest = (interestToRemove: string) => {
    setEditForm({
      ...editForm,
      interests: editForm.interests.filter(interest => interest !== interestToRemove)
    })
  }

  // Add custom interest
  const addCustomInterest = () => {
    if (customInterest.trim() && !editForm.interests.includes(customInterest.trim())) {
      setEditForm({
        ...editForm,
        interests: [...editForm.interests, customInterest.trim()]
      })
      setCustomInterest('')
    }
    setInterestsPopoverOpen(false)
  }

  // Handle Archive button click
  const handleArchive = async () => {
    if (!user) return
    
    setIsArchiving(true)
    try {
      // In a real app, this would make an API call to archive/deactivate the account
      // For now, we'll simulate the action
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Account Archived",
        description: "Your account has been successfully archived. You can reactivate it anytime.",
      })
      
      // In a real app, you might redirect to a deactivation confirmation page
      // or log the user out
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsArchiving(false)
    }
  }

  // Handle profile image upload
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 2MB",
        variant: "destructive",
      })
      return
    }

    setIsUploadingImage(true)

    try {
      // Convert to base64
      const reader = new FileReader()
      reader.onloadend = async () => {
        const base64 = reader.result as string

        // Update via API
        const response = await fetch(`/api/users/${user.id}/profile-image`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageData: base64 }),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`)
        }

        // Save to localStorage for immediate display
        localStorage.setItem(`profileImage_${user.id}`, base64)
        setProfileImage(base64)

        // Dispatch custom event for other components
        window.dispatchEvent(new CustomEvent('profileImageUpdate', {
          detail: { userId: user.id, imageData: base64 }
        }))

        toast({
          title: "Success",
          description: "Profile image updated successfully",
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Profile image upload error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile image",
        variant: "destructive",
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  // Mock user data - In real app, this would come from your database
  const userData = {
    id: "1",
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    role: user?.role || "student",
    phone: DEFAULT_VALUES.user.phone,
    location: DEFAULT_VALUES.user.location,
    bio: "Passionate learner with a keen interest in technology and innovation. Always excited to explore new concepts and apply them in real-world scenarios.",
    website: "https://johndoe.dev",
    linkedin: "linkedin.com/in/johndoe",
    twitter: "@johndoe",
    joinDate: "2023-01-15",
    avatar: "/profile-photo.png",
  }

  // Profile data now comes from Laravel backend

  // Determine profile image source
  const displayImage = profileImage || generateAvatarUrl(user?.name || DEFAULT_VALUES.user.firstName + " " + DEFAULT_VALUES.user.lastName)

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
          {isAdminView && (
            <Badge variant="outline" className="text-orange-600 border-orange-600">
              Admin View
            </Badge>
          )}
          <span className="text-sm font-medium">
            {user.firstName} {user.lastName}
          </span>
        </div>
      </div>

      {/* Profile Card */}
      <Card className="bg-orange-500 text-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CardTitle className="text-white">
                {isAdminView ? `${user.firstName}'s Profile` : 'User Profile'}
              </CardTitle>
              {isEditing && (
                <Badge variant="secondary" className="bg-white text-orange-600">
                  Editing Mode
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {isAdminView && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-orange-600"
                  onClick={() => router.push('/dashboard/reports')}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Reports
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Profile Content */}
      <div id="profile-content" className="print:bg-white print:shadow-none">
        <Card className="print:border-0 print:shadow-none">
          <CardContent className="p-8 print:p-4">
            {/* Professional Header for PDF */}
            <div className="hidden print:block mb-6 border-b pb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Professional Profile</h1>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{user.firstName} {user.lastName}</h2>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p>Generated on {new Date().toLocaleDateString()}</p>
                  <p>Member since {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 print:gap-6">
              {/* Profile Info */}
              <div className="lg:col-span-1">
                <div className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-32 h-32 mx-auto mb-4">
                      <AvatarImage
                        src={displayImage}
                        alt={`${user.firstName} ${user.lastName}`}
                      />
                      <AvatarFallback className="text-2xl">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-full"
                      onClick={() => document.getElementById('profile-image-upload')?.click()}
                      disabled={isUploadingImage}
                    >
                      <Camera className="w-5 h-5" />
                    </Button>
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                  {isEditing ? (
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Input
                          value={editForm.firstName}
                          onChange={(e) => {
                            // Only allow letters, spaces, apostrophes, and hyphens for names
                            const value = e.target.value.replace(/[^a-zA-Z\s\'\-]/g, '')
                            setEditForm({...editForm, firstName: value})
                          }}
                          placeholder="First Name"
                          className="text-center"
                          maxLength={50}
                        />
                        <Input
                          value={editForm.lastName}
                          onChange={(e) => {
                            // Only allow letters, spaces, apostrophes, and hyphens for names
                            const value = e.target.value.replace(/[^a-zA-Z\s\'\-]/g, '')
                            setEditForm({...editForm, lastName: value})
                          }}
                          placeholder="Last Name"
                          className="text-center"
                          maxLength={50}
                        />
                      </div>
                      <Input
                        value={editForm.email}
                        disabled
                        placeholder="Email (cannot be changed)"
                        className="text-center bg-gray-100 text-gray-600 cursor-not-allowed"
                      />
                      {isAdminView && (
                        <select 
                          value={editForm.role} 
                          onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                          className="w-full p-2 border rounded text-center"
                        >
                          <option value="student">Student</option>
                          <option value="admin">Admin</option>
                          <option value="creator">Creator</option>
                        </select>
                      )}
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-gray-600 capitalize">{user.role}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        <strong>Start Date:</strong> {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'Not available'}
                      </p>
                    </>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Bio:</h3>
                  {isEditing ? (
                    <Textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      placeholder="Tell us about yourself..."
                      className="text-sm"
                      rows={4}
                      maxLength={500}
                    />
                  ) : (
                    <p className="text-sm text-gray-600">
                      {user.bio || 'Passionate learner with a keen interest in technology and innovation.'}
                    </p>
                  )}
                </div>
                
                {/* Contact Information */}
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold mb-2">Contact Information:</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      {isEditing ? (
                        <Input
                          value={editForm.phone}
                          onChange={(e) => {
                            // Only allow numbers, spaces, dashes, parentheses, and + symbol
                            const value = e.target.value.replace(/[^0-9\s\-\(\)\+]/g, '')
                            setEditForm({...editForm, phone: value})
                          }}
                          placeholder="Phone number"
                          className="text-sm"
                          maxLength={20}
                        />
                      ) : (
                        <span className="text-gray-600">{user.phone || 'Not provided'}</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      {isEditing ? (
                        <Input
                          value={editForm.location}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                          placeholder="Location"
                          className="text-sm"
                          maxLength={100}
                        />
                      ) : (
                        <span className="text-gray-600">{user.location || 'Not provided'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills and Interests */}
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Skills */}
                  <div className="bg-gray-900 text-white p-6 rounded-lg print:bg-white print:text-black print:border print:border-gray-300">
                    <h3 className="text-lg font-semibold mb-4">Skills</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Skills/Expertise:</h4>
                        {isEditing ? (
                          <div className="mt-2 space-y-2">
                            {/* Selected skills display */}
                            <div className="flex flex-wrap gap-2">
                              {editForm.skills && editForm.skills.map((skill, index) => (
                                <Badge 
                                  key={index} 
                                  variant="secondary" 
                                  className="bg-gray-700 text-white hover:bg-gray-600"
                                >
                                  {skill}
                                  <button
                                    onClick={() => removeSkill(skill)}
                                    className="ml-2 hover:text-red-300"
                                    type="button"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            
                            {/* Add skill popover */}
                            <Popover open={skillsPopoverOpen} onOpenChange={setSkillsPopoverOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Skill
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 p-0" align="start">
                                <Command>
                                  <CommandInput placeholder="Search skills..." />
                                  <CommandList>
                                    <CommandEmpty>No skills found.</CommandEmpty>
                                    <CommandGroup>
                                      {PREDEFINED_SKILLS
                                        .filter(skill => !editForm.skills.includes(skill))
                                        .map((skill) => (
                                        <CommandItem
                                          key={skill}
                                          onSelect={() => addSkill(skill)}
                                          className="cursor-pointer"
                                        >
                                          <Check className="mr-2 h-4 w-4 opacity-0" />
                                          {skill}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-300">{user.skills || 'Laravel, CSS, PHP'}</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">Learning Progress:</h4>
                        <div className="space-y-2 mt-2">
                          <div className="flex justify-between text-sm">
                            <span>Completed Courses</span>
                            <span>{completedCourses.length}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Total Learning Hours</span>
                            <span>{user.thisWeekHours || 0}h</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Interests */}
                  <div className="bg-gray-900 text-white p-6 rounded-lg print:bg-white print:text-black print:border print:border-gray-300">
                    <h3 className="text-lg font-semibold mb-4">Professional Interests</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium">Professional Interests:</h4>
                        {isEditing ? (
                          <div className="mt-2 space-y-2">
                            {/* Selected interests display */}
                            <div className="flex flex-wrap gap-2">
                              {editForm.interests && editForm.interests.map((interest, index) => (
                                <Badge 
                                  key={index} 
                                  variant="secondary" 
                                  className="bg-gray-700 text-white hover:bg-gray-600"
                                >
                                  {interest}
                                  <button
                                    onClick={() => removeInterest(interest)}
                                    className="ml-2 hover:text-red-300"
                                    type="button"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            
                            {/* Add interest popover */}
                            <Popover open={interestsPopoverOpen} onOpenChange={setInterestsPopoverOpen}>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                                >
                                  <Plus className="w-4 h-4 mr-2" />
                                  Add Interest
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-64 p-0" align="start">
                                <Command>
                                  <CommandInput placeholder="Search interests..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      <div className="p-2">
                                        <p className="text-sm text-gray-500 mb-2">No predefined interests found.</p>
                                        <div className="flex space-x-2">
                                          <Input
                                            placeholder="Custom interest"
                                            value={customInterest}
                                            onChange={(e) => setCustomInterest(e.target.value)}
                                            className="text-sm"
                                            maxLength={50}
                                          />
                                          <Button
                                            size="sm"
                                            onClick={addCustomInterest}
                                            disabled={!customInterest.trim()}
                                          >
                                            Add
                                          </Button>
                                        </div>
                                      </div>
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {PREDEFINED_INTERESTS
                                        .filter(interest => !editForm.interests.includes(interest))
                                        .map((interest) => (
                                        <CommandItem
                                          key={interest}
                                          onSelect={() => addInterest(interest)}
                                          className="cursor-pointer"
                                        >
                                          <Check className="mr-2 h-4 w-4 opacity-0" />
                                          {interest}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                    <div className="p-2 border-t">
                                      <p className="text-xs text-gray-500 mb-2">Add custom interest:</p>
                                      <div className="flex space-x-2">
                                        <Input
                                          placeholder="Custom interest"
                                          value={customInterest}
                                          onChange={(e) => setCustomInterest(e.target.value)}
                                          className="text-sm"
                                          maxLength={50}
                                        />
                                        <Button
                                          size="sm"
                                          onClick={addCustomInterest}
                                          disabled={!customInterest.trim()}
                                        >
                                          Add
                                        </Button>
                                      </div>
                                    </div>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-300">{user.interests || 'Web Development, Software Engineering'}</p>
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">Account Status:</h4>
                        <div className="space-y-2 mt-2">
                          <Badge variant={user.role === 'admin' ? 'default' : 'outline'} className="text-xs">
                            {user.role?.toUpperCase()}
                          </Badge>
                          <div className="text-sm text-gray-300">
                            Member since: {user.joinedDate ? new Date(user.joinedDate).toLocaleDateString() : 'Not available'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* External Courses */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
          <CardHeader className="bg-gray-900 text-white">
            <CardTitle className="flex items-center">
              <span className="mr-2">📚</span>
              Courses Taken Or Certificates Received Outside Of The LMS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t border-gray-200 dark:border-gray-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-orange-500 hover:bg-orange-500 dark:bg-orange-600 border-b-0">
                    <TableHead className="text-white font-semibold py-4">Course</TableHead>
                    <TableHead className="text-white font-semibold py-4">Location</TableHead>
                    <TableHead className="text-white font-semibold py-4">Month/Year</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {externalCourses.map((course, index) => (
                    <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                      <TableCell className="font-semibold text-gray-900 dark:text-gray-100 py-4">{course.course}</TableCell>
                      <TableCell className="py-4 text-gray-600 dark:text-gray-400">{course.location}</TableCell>
                      <TableCell className="py-4 text-gray-600 dark:text-gray-400">{course.monthYear}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Completed Courses */}
        <Card className="shadow-sm border border-gray-200 dark:border-gray-800">
          <CardHeader className="bg-gray-900 text-white">
            <CardTitle className="flex items-center">
              <span className="mr-2">✅</span>
              Course Completed Within The LMS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="border-t border-gray-200 dark:border-gray-800 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-orange-500 hover:bg-orange-500 dark:bg-orange-600 border-b-0">
                    <TableHead className="text-white font-semibold py-4">Course</TableHead>
                    <TableHead className="text-white font-semibold py-4">Completed Date</TableHead>
                    <TableHead className="text-white font-semibold py-4">Lessons Completed</TableHead>
                    <TableHead className="text-white font-semibold py-4">Assessment Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedCourses.length > 0 ? (
                    completedCourses.map((course, index) => (
                      <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                        <TableCell className="font-semibold text-gray-900 dark:text-gray-100 py-4">{course.course}</TableCell>
                        <TableCell className="py-4 text-gray-600 dark:text-gray-400">{course.completedDate}</TableCell>
                        <TableCell className="py-4 font-medium text-gray-900 dark:text-gray-100">{course.lessonsCompleted}</TableCell>
                        <TableCell className="py-4">
                          <div className="flex items-center space-x-2">
                            <span className={`font-medium ${
                              course.assessmentScore === 'Not taken' 
                                ? 'text-gray-500' 
                                : course.assessmentPassed 
                                  ? 'text-green-600' 
                                  : 'text-red-600'
                            }`}>
                              {course.assessmentScore}
                            </span>
                            {course.assessmentPassed && (
                              <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50 dark:bg-green-900/20">
                                <Award className="w-3 h-3 mr-1" />
                                Passed
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        {isHydrated ? "No courses completed yet" : "Loading..."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Button */}
      <div className="text-center">
        <Button 
          variant="outline" 
          className="border-orange-500 text-orange-500 hover:bg-orange-50"
          onClick={exportToPDF}
          disabled={isExporting}
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? "Exporting..." : "Export To PDF"}
        </Button>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pb-8">
        {isEditing ? (
          <>
            <Button 
              className="bg-green-500 hover:bg-green-600"
              onClick={handleSaveProfile}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
            <Button 
              variant="outline" 
              className="border-gray-500 text-gray-500 hover:bg-gray-50"
              onClick={handleCancelEdit}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </>
        ) : (
          <>
            {canEdit && (
              <Button 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={handleEdit}
              >
                <Settings className="w-4 h-4 mr-2" />
                {isAdminView ? 'Edit User' : 'Edit Profile'}
              </Button>
            )}
            
            {!isAdminView && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-orange-500 text-orange-500 hover:bg-orange-50"
                    disabled={isArchiving}
                  >
                    <Archive className="w-4 h-4 mr-2" />
                    {isArchiving ? "Archiving..." : "Archive Account"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to archive your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will deactivate your account and hide your profile from other users. 
                      You can reactivate your account at any time by logging in again. 
                      Your data will be preserved.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleArchive}
                      className="bg-red-500 hover:bg-red-600"
                      disabled={isArchiving}
                    >
                      {isArchiving ? "Archiving..." : "Archive Account"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            )}
          </>
        )}
      </div>
    </div>
  )
}
