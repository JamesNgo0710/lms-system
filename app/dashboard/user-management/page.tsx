"use client"

import { useState, useRef } from "react"
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
  const { users, addUser, updateUser, deleteUser } = useUsers()
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
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    if (!editingUser && !formData.password) {
      toast({
        title: "Error",
        description: "Password is required for new users",
        variant: "destructive",
      })
      return
    }

    if (editingUser) {
      // Update existing user
      updateUser(editingUser.id, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        role: formData.role,
        profileImage: formData.profileImage,
      })

      // If profile image was changed, update via API
      if (formData.profileImage && formData.profileImage !== editingUser.profileImage) {
        try {
          const response = await fetch(`/api/users/${editingUser.id}/profile-image`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageData: formData.profileImage }),
          })

          if (!response.ok) {
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
      // Add new user
      addUser({
        username: formData.email.split("@")[0],
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password!,
        role: formData.role,
        joinedDate: new Date().toLocaleDateString(),
        completedTopics: 0,
        totalTopics: 12,
        weeklyHours: 0,
        thisWeekHours: 0,
        profileImage: formData.profileImage,
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
  }

  const handleDeleteUser = (userId: string) => {
    deleteUser(userId)
    toast({
      title: "Success",
      description: "User deleted successfully",
    })
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">User Management</h1>
        <Button onClick={handleAddUser} className="bg-orange-500 hover:bg-orange-600">
          Add New User
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-500 hover:bg-orange-500">
                <TableHead className="text-white">Profile</TableHead>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Role</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                      <AvatarFallback>
                        {user.firstName[0]}{user.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">
                    {user.firstName} {user.lastName}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="capitalize">{user.role}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEditUser(user)}
                        className="text-orange-500 hover:text-orange-700"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      {session?.user?.role === "admin" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleChangePassword(user.id)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <Key className="w-4 h-4 mr-1" />
                          Password
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md bg-gray-800 text-white border-gray-700">
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
              <Label className="text-white">Name</Label>
              <Input
                value={`${formData.firstName} ${formData.lastName}`.trim()}
                onChange={(e) => {
                  const names = e.target.value.split(" ")
                  setFormData({
                    ...formData,
                    firstName: names[0] || "",
                    lastName: names.slice(1).join(" ") || "",
                  })
                }}
                placeholder="Enter Full Name"
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
        <DialogContent className="max-w-md bg-gray-800 text-white border-gray-700">
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
