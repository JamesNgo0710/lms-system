"use client"

import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"
import {
  Home,
  BookOpen,
  FileText,
  Users,
  BarChart3,
  Settings,
  User,
  MessageSquare,
  ClipboardList,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import Image from "next/image"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles?: string[]
}

const studentNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Home },
  { title: "Topics", href: "/dashboard/topics", icon: BookOpen, roles: ["student", "teacher"] },
  { title: "Community", href: "/dashboard/community", icon: MessageSquare, roles: ["student", "teacher"] },
  { title: "Profile", href: "/dashboard/profile", icon: User },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

const adminNavItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: Home, roles: ["admin"] },
  { title: "Manage Topics", href: "/dashboard/manage-topics", icon: BookOpen, roles: ["admin"] },
  { title: "Manage Assessments", href: "/dashboard/manage-assessments", icon: ClipboardList, roles: ["admin"] },
  { title: "Community", href: "/dashboard/community", icon: MessageSquare, roles: ["admin"] },
  { title: "User Management", href: "/dashboard/user-management", icon: Users, roles: ["admin"] },
  { title: "Reports", href: "/dashboard/reports", icon: BarChart3, roles: ["admin"] },
  { title: "Account Settings", href: "/dashboard/settings", icon: Settings, roles: ["admin"] },
]

// Logo components for the sidebar
export const Logo = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-8 w-8 rounded bg-orange-500 flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold text-black dark:text-white whitespace-pre"
      >
        LMS System
      </motion.span>
    </Link>
  )
}

export const LogoIcon = () => {
  return (
    <Link
      href="/dashboard"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-8 w-8 rounded bg-orange-500 flex-shrink-0" />
    </Link>
  )
}

// User profile section component
const UserProfileSection = ({ open }: { open: boolean }) => {
  const { data: session } = useSession()
  const user = session?.user
  const [profileImage, setProfileImage] = useState<string | null>(null)

  // Load profile image from localStorage
  useEffect(() => {
    if (user?.id) {
      const savedImage = localStorage.getItem(`profileImage_${user.id}`)
      if (savedImage) {
        setProfileImage(savedImage)
      }
    }
  }, [user?.id])

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

  const displayImage = profileImage || user?.image || "/placeholder-user.jpg"

  if (!open) {
    return (
      <Link
        href="/dashboard/profile"
        className="flex items-center justify-center p-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md"
      >
        <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={displayImage}
            className="object-cover"
            fill
            sizes="32px"
            alt="User Avatar"
          />
        </div>
      </Link>
    )
  }

  return (
    <Link
      href="/dashboard/profile"
      className="flex items-center space-x-3 p-3 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md border border-neutral-200 dark:border-neutral-700 bg-white/50 dark:bg-neutral-800/50"
    >
      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
        <Image
          src={displayImage}
          className="object-cover"
          fill
          sizes="40px"
          alt="User Avatar"
        />
      </div>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col min-w-0 flex-1"
      >
        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
          {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.name || "User"}
        </p>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 capitalize">
          {user?.role || "User"}
        </p>
      </motion.div>
    </Link>
  )
}

export function DashboardSidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const userRole = session?.user?.role
  const [open, setOpen] = useState(false)

  const filterNavItems = (items: NavItem[]) => {
    return items.filter(item => 
      !item.roles || item.roles.includes(userRole || "student")
    )
  }

  // Use different navigation items based on user role
  const navigationItems = userRole === "admin" ? adminNavItems : studentNavItems

  // Convert navigation items to the format expected by SidebarLink
  const links = filterNavItems(navigationItems).map((item) => ({
    label: item.title,
    href: item.href,
    icon: (
      <item.icon 
        className={cn(
          "h-5 w-5 flex-shrink-0",
          pathname === item.href 
            ? "text-orange-600 dark:text-orange-400" 
            : "text-neutral-700 dark:text-neutral-200"
        )} 
      />
    ),
  }))

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {/* Logo */}
          {open ? <Logo /> : <LogoIcon />}
          
          {/* User Profile Section */}
          <div className="mt-4 mb-4">
            <UserProfileSection open={open} />
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink 
                key={idx} 
                link={link}
                className={cn(
                  "hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md px-2",
                  pathname === link.href && "bg-orange-100 dark:bg-orange-900/30"
                )}
              />
            ))}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  )
}
