"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Home,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  User,
  MessageSquare,
  ClipboardList,
  Menu,
  X,
  Search,
  Bell,
  Trophy,
  Target,
  Calendar,
  TrendingUp
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { APP_CONFIG } from "@/lib/constants"
import { getAvatarUrl } from "@/lib/config"
import { useTopics, useLessonCompletions } from "@/hooks/use-data-store"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
  badge?: number
}

export function MobileNavigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const user = session?.user
  const userRole = session?.user?.role
  const { topics } = useTopics()
  const { getTopicProgress } = useLessonCompletions()
  const [isOpen, setIsOpen] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [notifications, setNotifications] = useState(3) // Mock notifications

  // Load profile image from session or API
  useEffect(() => {
    if (user?.id) {
      // First try to get from session
      if (user.image) {
        setProfileImage(user.image)
      } else {
        // Fallback to localStorage for backward compatibility
        const savedImage = localStorage.getItem(`profileImage_${user.id}`)
        if (savedImage) {
          setProfileImage(savedImage)
        }
      }
    }
  }, [user?.id, user?.image])

  // Calculate progress stats for badges
  const progressStats = () => {
    if (!user) return { completedTopics: 0, availableAssessments: 0 }
    
    const completedTopics = topics.filter(topic => {
      const progress = getTopicProgress(user.id, topic.id)
      return progress.percentage === 100
    }).length

    const availableAssessments = topics.filter(topic => {
      const progress = getTopicProgress(user.id, topic.id) 
      return topic.hasAssessment && progress.percentage === 100
    }).length

    return { completedTopics, availableAssessments }
  }

  const stats = progressStats()

  const studentNavItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: Home },
    { title: "Topics", href: "/dashboard/topics", icon: BookOpen },
    { title: "Community", href: "/dashboard/community", icon: MessageSquare, badge: 2 },
    { title: "Achievements", href: "/dashboard/achievements", icon: Trophy, badge: stats.completedTopics },
    { title: "Profile", href: "/dashboard/profile", icon: User },
    { title: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const adminNavItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: Home },
    { title: "Manage Topics", href: "/dashboard/manage-topics", icon: BookOpen },
    { title: "Assessments", href: "/dashboard/manage-assessments", icon: ClipboardList },
    { title: "Community", href: "/dashboard/community", icon: MessageSquare },
    { title: "Users", href: "/dashboard/user-management", icon: Users },
    { title: "Reports", href: "/dashboard/reports", icon: BarChart3 },
    { title: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  const navigationItems = userRole === "admin" ? adminNavItems : studentNavItems

  const displayImage = profileImage || getAvatarUrl(user?.name || "User")

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 h-16">
        <div className="flex items-center justify-between px-4 h-full">
          {/* Left side - Menu and Logo */}
          <div className="flex items-center space-x-3">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0">
                <MobileSidebar 
                  navigationItems={navigationItems}
                  user={user}
                  displayImage={displayImage}
                  pathname={pathname}
                  onClose={() => setIsOpen(false)}
                />
              </SheetContent>
            </Sheet>

            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 relative">
                <Image
                  src={APP_CONFIG.logoUrl}
                  alt={`${APP_CONFIG.name} Logo`}
                  fill
                  className="object-contain"
                  sizes="32px"
                />
              </div>
              <span className="font-bold text-orange-600 text-sm">LMS</span>
            </Link>
          </div>

          {/* Right side - Search, Notifications, Profile */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="p-2">
              <Search className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="sm" className="p-2 relative">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-xs flex items-center justify-center p-0">
                  {notifications}
                </Badge>
              )}
            </Button>

            <Link href="/dashboard/profile">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={displayImage}
                  className="object-cover"
                  width={32}
                  height={32}
                  alt="User Avatar"
                />
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.slice(0, 5).map((item, index) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 relative transition-colors",
                  isActive
                    ? "text-orange-600 bg-orange-50"
                    : "text-gray-600 hover:text-orange-600"
                )}
                onClick={() => setIsOpen(false)}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {item.badge && item.badge > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-red-500 text-xs flex items-center justify-center p-0">
                      {item.badge > 9 ? "9+" : item.badge}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium truncate w-full text-center">
                  {item.title}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="bottomNavIndicator"
                    className="absolute top-0 w-full h-1 bg-orange-600 rounded-b"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Space for mobile navigation */}
      <div className="md:hidden h-16" />
      <div className="md:hidden h-16" />
    </>
  )
}

// Mobile Sidebar Component
function MobileSidebar({
  navigationItems,
  user,
  displayImage,
  pathname,
  onClose
}: {
  navigationItems: NavItem[]
  user: any
  displayImage: string
  pathname: string
  onClose: () => void
}) {
  const { topics } = useTopics()
  const { getTopicProgress } = useLessonCompletions()

  // Calculate quick stats
  const quickStats = () => {
    if (!user) return { completedTopics: 0, totalTopics: 0, currentStreak: 0 }
    
    const completedTopics = topics.filter(topic => {
      const progress = getTopicProgress(user.id, topic.id)
      return progress.percentage === 100
    }).length

    return {
      completedTopics,
      totalTopics: topics.length,
      currentStreak: 5 // Mock streak
    }
  }

  const stats = quickStats()

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 relative">
              <Image
                src={APP_CONFIG.logoUrl}
                alt={`${APP_CONFIG.name} Logo`}
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <div>
              <div className="font-bold text-orange-600">Learning Management</div>
              <div className="text-sm text-gray-500">System</div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User Profile */}
        <Link
          href="/dashboard/profile"
          className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg"
          onClick={onClose}
        >
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={displayImage}
              className="object-cover"
              width={48}
              height={48}
              alt="User Avatar"
            />
          </div>
          <div className="flex-1">
            <div className="font-medium">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || "User"}
            </div>
            <div className="text-sm text-gray-500 capitalize">{user?.role || "User"}</div>
          </div>
        </Link>

        {/* Quick Stats */}
        {user?.role === "student" && (
          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-orange-600">{stats.completedTopics}</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-blue-600">{Math.round((stats.completedTopics / stats.totalTopics) * 100)}%</div>
              <div className="text-xs text-gray-500">Progress</div>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded">
              <div className="text-lg font-bold text-green-600">{stats.currentStreak}</div>
              <div className="text-xs text-gray-500">Streak</div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors relative",
                  isActive
                    ? "bg-orange-100 text-orange-600"
                    : "hover:bg-gray-50 text-gray-700"
                )}
                onClick={onClose}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.title}</span>
                {item.badge && item.badge > 0 && (
                  <Badge className="ml-auto bg-red-500 text-white text-xs">
                    {item.badge > 9 ? "9+" : item.badge}
                  </Badge>
                )}
                {isActive && (
                  <motion.div
                    layoutId="sidebarIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-orange-600 rounded-r"
                  />
                )}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2025 Learning Management System
        </div>
      </div>
    </div>
  )
}