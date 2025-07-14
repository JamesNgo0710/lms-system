"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Camera, Copy, RefreshCw, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUsers } from "@/hooks/use-data-store"
import { useSession } from "next-auth/react"

interface UserFormData {
  id?: string
  firstName: string
  lastName: string
  email: string
  role: "admin" | "student" | "creator"
  password?: string
  profileImage?: string
}

export default function UserManagementPage() {
  const { users, addUser, updateUser, deleteUser, syncUsersFromAPI } = useUsers()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserFormData | null>(null)
  const [passwordUserId, setPasswordUserId] = useState<string | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "student",
    password: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const { data: session } = useSession()

  // Sync users from API when component loads
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      syncUsersFromAPI()
    }
  }, [session?.user?.role])

  const handleAddUser = () => {
    setEditingUser(null)
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      role: "student",
      password: "",
    })
    setIsDialogOpen(true)
  }

  const handleEditUser = (user: any) => {
    setEditingUser(user)
    setFormData({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    })
    setIsDialogOpen(true)
  }

  const handleChangePassword = (userId: string) => {
    setPasswordUserId(userId)
    setNewPassword("")
    setConfirmPassword("")
    setIsPasswordDialogOpen(true)
  }

  const handleSavePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/users/${passwordUserId}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to change password")
      }

      toast({
        title: "Success",
        description: "Password changed successfully",
      })
      setIsPasswordDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      })
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file size (2MB limit)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size must be less than 2MB",
        variant: "destructive",
      })
      return
    }

    // Convert to base64
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result as string
      setFormData({ ...formData, profileImage: base64 })
    }
    reader.readAsDataURL(file)
  }

  const handleSaveUser = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (First Name, Last Name, and Email)",
        variant: "destructive",
      })
      return
    }

    let processedData = { ...formData }

    if (!editingUser && !processedData.password) {
      toast({
        title: "Error",
        description: "Password is required for new users",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingUser) {
        // Update existing user via API
        const response = await fetch(`/api/users/${editingUser.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: processedData.firstName,
            lastName: processedData.lastName,
            email: processedData.email,
            role: processedData.role,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to update user")
        }

        // Update local state
        updateUser(editingUser.id, {
          firstName: processedData.firstName,
          lastName: processedData.lastName,
          email: processedData.email,
          role: processedData.role,
          profileImage: processedData.profileImage,
        })

        // If profile image was changed, update via API
        if (processedData.profileImage && processedData.profileImage !== editingUser.profileImage) {
          try {
            const imageResponse = await fetch(`/api/users/${editingUser.id}/profile-image`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ imageData: processedData.profileImage }),
            })

            if (!imageResponse.ok) {
              throw new Error("Failed to update profile image")
            }
          } catch (error) {
            toast({
              title: "Warning",
              description: "User updated but profile image upload failed",
              variant: "destructive",
            })
          }
        }

        toast({
          title: "Success",
          description: "User updated successfully",
        })
      } else {
        // Create new user via API
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: processedData.firstName,
            lastName: processedData.lastName,
            email: processedData.email,
            password: processedData.password!,
            role: processedData.role,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to create user")
        }

        const newUser = await response.json()

        // Add to local state for immediate UI update
        addUser({
          id: newUser.id.toString(),
          username: processedData.email.split("@")[0],
          firstName: processedData.firstName,
          lastName: processedData.lastName,
          email: processedData.email,
          password: processedData.password!,
          role: processedData.role,
          joinedDate: new Date().toLocaleDateString(),
          completedTopics: 0,
          totalTopics: 12,
          weeklyHours: 0,
          thisWeekHours: 0,
          profileImage: processedData.profileImage,
        })

        toast({
          title: "Success",
          description: "User created successfully",
        })
      }

      setIsDialogOpen(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "student",
        password: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save user",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete user")
      }

      // Remove from local state
      deleteUser(userId)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const generateRandomEmail = () => {
    const timestamp = Date.now()
    const randomNum = Math.floor(Math.random() * 1000)
    setFormData({ ...formData, email: `user${timestamp}${randomNum}@example.com` })
  }

  const copyEmail = () => {
    navigator.clipboard.writeText(formData.email)
    toast({
      title: "Copied",
      description: "Email copied to clipboard",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold dark:text-gray-100">User Management</h1>
        <Button onClick={handleAddUser} className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 w-full sm:w-auto">
          <span className="sm:hidden">Add User</span>
          <span className="hidden sm:inline">Add New User</span>
        </Button>
      </div>

      <Card className="shadow-sm border border-gray-200 dark:bg-gray-900 dark:border-gray-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
            <TableHeader>
              <TableRow className="bg-orange-500 hover:bg-orange-500 dark:bg-orange-600 border-b-0">
                <TableHead className="text-white font-semibold min-w-[80px] py-4">Profile</TableHead>
                <TableHead className="text-white font-semibold min-w-[120px] py-4">Name</TableHead>
                <TableHead className="text-white font-semibold min-w-[150px] hidden sm:table-cell py-4">Email</TableHead>
                <TableHead className="text-white font-semibold min-w-[80px] hidden md:table-cell py-4">Role</TableHead>
                <TableHead className="text-white font-semibold min-w-[120px] py-4">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border-b border-gray-100 dark:border-gray-800">
                  <TableCell className="py-4">
                    <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
                      <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback className="text-xs sm:text-sm bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300">
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium dark:text-gray-200 py-4">
                    <div>
                      <div className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 sm:hidden mt-1">
                        {user.email}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 md:hidden mt-1">
                        <span className="capitalize bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">{user.role}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell dark:text-gray-200 text-sm py-4">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell dark:text-gray-200 py-4">
                    <span className="capitalize text-sm bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">{user.role}</span>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditUser(user)}
                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200 dark:text-orange-400 dark:hover:text-orange-300 dark:border-orange-600 dark:hover:bg-orange-900/20 text-xs px-3 py-1 h-8"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      {session?.user?.role === "admin" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleChangePassword(user.id)}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:text-blue-400 dark:hover:text-blue-300 dark:border-blue-600 dark:hover:bg-blue-900/20 text-xs px-3 py-1 h-8"
                        >
                          <Key className="w-3 h-3 mr-1" />
                          <span className="hidden sm:inline">Password</span>
                          <span className="sm:hidden">Pwd</span>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:text-red-400 dark:hover:text-red-300 dark:border-red-600 dark:hover:bg-red-900/20 text-xs px-3 py-1 h-8"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        <span className="hidden sm:inline">Delete</span>
                        <span className="sm:hidden">Del</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="mx-4 max-w-md sm:max-w-lg bg-gray-800 text-white border-gray-700">
          <DialogHeader className="bg-orange-500 text-center -m-6 mb-6 p-6">
            <DialogTitle>{editingUser ? "Edit User" : "Create / Edit User"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Upload Image */}
            <div className="flex justify-center">
              <div className="relative">
                <Avatar className="w-24 h-24 bg-orange-500">
                  <AvatarImage src={formData.profileImage} />
                  <AvatarFallback className="text-white text-lg">
                    {formData.firstName[0] || "U"}
                    {formData.lastName[0] || ""}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-4 h-4" />
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label className="text-white">First Name</Label>
              <Input
                value={formData.firstName || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    firstName: e.target.value,
                  })
                }}
                placeholder="Enter First Name"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Last Name</Label>
              <Input
                value={formData.lastName || ""}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    lastName: e.target.value,
                  })
                }}
                placeholder="Enter Last Name"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-white">Email</Label>
              <div className="relative">
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  className="bg-gray-700 border-gray-600 text-white pr-20"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={copyEmail}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-gray-400 hover:text-white"
                    onClick={generateRandomEmail}
                  >
                    <RefreshCw className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label className="text-white">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "student" | "creator") => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password (only for new users) */}
            {!editingUser && (
              <div className="space-y-2">
                <Label className="text-white">Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter password"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            )}

            {/* Save Button */}
            <Button onClick={handleSaveUser} className="w-full bg-orange-500 hover:bg-orange-600">
              Save User
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="mx-4 max-w-md sm:max-w-lg bg-gray-800 text-white border-gray-700">
          <DialogHeader className="bg-orange-500 text-center -m-6 mb-6 p-6">
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-white">New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-white">Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <Button onClick={handleSavePassword} className="w-full bg-orange-500 hover:bg-orange-600">
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
