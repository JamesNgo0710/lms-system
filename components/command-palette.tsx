"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Plus, 
  MessageSquare,
  FileText,
  Target,
  Calendar,
  Download,
  User,
  Play,
  Eye,
  TrendingUp,
  Clock,
  Shield,
  Bell,
  HelpCircle,
  Command
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface CommandItem {
  id: string
  title: string
  description: string
  icon: any
  href?: string
  action?: () => void
  category: string
  keywords: string[]
}

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  const commands: CommandItem[] = [
    // Navigation Commands
    {
      id: "dashboard",
      title: "Go to Dashboard",
      description: "View main dashboard",
      icon: BarChart3,
      href: "/dashboard",
      category: "Navigation",
      keywords: ["dashboard", "home", "main"]
    },
    {
      id: "users",
      title: "User Management",
      description: "Manage user accounts",
      icon: Users,
      href: "/dashboard/user-management",
      category: "Navigation",
      keywords: ["users", "accounts", "manage", "people"]
    },
    {
      id: "topics",
      title: "Manage Topics",
      description: "Create and edit learning topics",
      icon: BookOpen,
      href: "/dashboard/manage-topics",
      category: "Navigation",
      keywords: ["topics", "courses", "lessons", "content"]
    },
    {
      id: "reports",
      title: "Analytics & Reports",
      description: "View detailed analytics",
      icon: TrendingUp,
      href: "/dashboard/reports",
      category: "Navigation",
      keywords: ["analytics", "reports", "statistics", "data"]
    },
    {
      id: "community",
      title: "Community Forum",
      description: "View forum discussions",
      icon: MessageSquare,
      href: "/dashboard/community",
      category: "Navigation",
      keywords: ["community", "forum", "discussions", "posts"]
    },
    {
      id: "settings",
      title: "Settings",
      description: "Configure account settings",
      icon: Settings,
      href: "/dashboard/settings",
      category: "Navigation",
      keywords: ["settings", "preferences", "configuration"]
    },
    {
      id: "profile",
      title: "Profile",
      description: "View and edit profile",
      icon: User,
      href: "/dashboard/profile",
      category: "Navigation",
      keywords: ["profile", "account", "personal"]
    },
    {
      id: "admin",
      title: "Admin Panel",
      description: "Advanced administration tools",
      icon: Shield,
      href: "/dashboard/admin",
      category: "Navigation",
      keywords: ["admin", "administration", "system", "advanced"]
    },

    // Action Commands
    {
      id: "create-topic",
      title: "Create New Topic",
      description: "Add a new learning topic",
      icon: Plus,
      href: "/dashboard/manage-topics/create",
      category: "Actions",
      keywords: ["create", "new", "topic", "course", "add"]
    },
    {
      id: "add-user",
      title: "Add New User",
      description: "Register a new user account",
      icon: Plus,
      href: "/dashboard/user-management",
      category: "Actions",
      keywords: ["add", "new", "user", "register", "create"]
    },
    {
      id: "export-data",
      title: "Export Data",
      description: "Download analytics data",
      icon: Download,
      action: () => {
        toast({
          title: "Export started",
          description: "Your data export is being prepared",
        })
      },
      category: "Actions",
      keywords: ["export", "download", "data", "csv", "backup"]
    },
    {
      id: "refresh-dashboard",
      title: "Refresh Dashboard",
      description: "Update dashboard data",
      icon: Clock,
      action: () => {
        window.location.reload()
      },
      category: "Actions",
      keywords: ["refresh", "reload", "update", "sync"]
    },

    // Quick Access
    {
      id: "user-reports",
      title: "User Reports",
      description: "View user analytics",
      icon: Users,
      href: "/dashboard/reports?tab=users",
      category: "Quick Access",
      keywords: ["user", "reports", "analytics", "students"]
    },
    {
      id: "video-reports",
      title: "Video Reports",
      description: "View video analytics",
      icon: Play,
      href: "/dashboard/reports?tab=videos",
      category: "Quick Access",
      keywords: ["video", "reports", "analytics", "lessons"]
    },
    {
      id: "system-health",
      title: "System Health",
      description: "Check system status",
      icon: Shield,
      href: "/dashboard/admin",
      category: "Quick Access",
      keywords: ["system", "health", "status", "monitoring"]
    },

    // Help & Support
    {
      id: "help",
      title: "Help & Documentation",
      description: "Get help and view docs",
      icon: HelpCircle,
      action: () => {
        window.open("https://docs.example.com", "_blank")
      },
      category: "Help",
      keywords: ["help", "documentation", "support", "guide"]
    },
    {
      id: "shortcuts",
      title: "Keyboard Shortcuts",
      description: "View available shortcuts",
      icon: Command,
      action: () => {
        toast({
          title: "Keyboard Shortcuts",
          description: "Cmd+K: Open command palette, Cmd+R: Refresh",
        })
      },
      category: "Help",
      keywords: ["shortcuts", "keyboard", "hotkeys", "commands"]
    }
  ]

  const filteredCommands = commands.filter(command => {
    const searchTerm = query.toLowerCase()
    return (
      command.title.toLowerCase().includes(searchTerm) ||
      command.description.toLowerCase().includes(searchTerm) ||
      command.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
    )
  })

  const groupedCommands = filteredCommands.reduce((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = []
    }
    acc[command.category].push(command)
    return acc
  }, {} as Record<string, CommandItem[]>)

  const executeCommand = (command: CommandItem) => {
    if (command.href) {
      router.push(command.href)
    } else if (command.action) {
      command.action()
    }
    onClose()
    setQuery("")
    setSelectedIndex(0)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault()
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          )
          break
        case "ArrowUp":
          e.preventDefault()
          setSelectedIndex(prev => prev > 0 ? prev - 1 : 0)
          break
        case "Enter":
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex])
          }
          break
        case "Escape":
          e.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex, onClose])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Command Palette</DialogTitle>
        </DialogHeader>
        <div className="flex items-center border-b px-4 py-3">
          <Search className="w-4 h-4 text-gray-400 mr-2" />
          <Input
            placeholder="Search commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            autoFocus
          />
          <Badge variant="secondary" className="ml-2">
            {filteredCommands.length} results
          </Badge>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto p-2">
          {Object.entries(groupedCommands).map(([category, commands]) => (
            <div key={category} className="mb-4">
              <div className="px-2 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider">
                {category}
              </div>
              <div className="space-y-1">
                {commands.map((command, index) => {
                  const globalIndex = filteredCommands.indexOf(command)
                  const isSelected = globalIndex === selectedIndex
                  
                  return (
                    <Button
                      key={command.id}
                      variant="ghost"
                      className={`w-full justify-start p-3 h-auto ${
                        isSelected ? "bg-orange-50 dark:bg-orange-900/20" : ""
                      }`}
                      onClick={() => executeCommand(command)}
                    >
                      <command.icon className="w-4 h-4 mr-3 text-gray-500" />
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                          {command.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {command.description}
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </div>
          ))}
          
          {filteredCommands.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No commands found for "{query}"</p>
              <p className="text-sm mt-1">Try searching for navigation, actions, or help</p>
            </div>
          )}
        </div>
        
        <div className="border-t px-4 py-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>↑↓ navigate</span>
            <span>⏎ select</span>
            <span>esc close</span>
          </div>
          <div className="flex items-center gap-2">
            <Command className="w-3 h-3" />
            <span>Command Palette</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}