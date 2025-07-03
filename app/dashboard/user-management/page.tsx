"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Edit, Trash2, Camera, Copy, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useUsers } from "@/hooks/use-data-store"

interface UserFormData {
  id?: string
  firstName: string
  lastName: string
  email: string
  role: "admin" | "student" | "creator"
  password?: string
}

export default function UserManagementPage() {
  const { users, addUser, updateUser, deleteUser } = useUsers()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserFormData | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    firstName: "",
    lastName: "",
    email: "",
    role: "student",
    password: "",
  })
  const { toast } = useToast()

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
    })
    setIsDialogOpen(true)
  }

  const handleSaveUser = () => {
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
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
      })
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
        role: formData.role,
        joinedDate: new Date().toLocaleDateString(),
        completedTopics: 0,
        totalTopics: 12,
        weeklyHours: 0,
        thisWeekHours: 0,
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
    // Use timestamp + counter for more deterministic approach
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
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Role</TableHead>
                <TableHead className="text-white">Edit/Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
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
                  <AvatarFallback className="text-white text-lg">
                    {formData.firstName[0] || "U"}
                    {formData.lastName[0] || ""}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
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
    </div>
  )
}
