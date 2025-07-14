"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Bell, Shield, User, Palette, Globe, Eye, EyeOff, Camera, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { compressImage, validateImageFile, debounce } from "@/lib/image-utils"

export default function SettingsPage() {
  const { data: session } = useSession()
  const user = session?.user
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("profile")
  const [isProfileSaving, setIsProfileSaving] = useState(false)
  const [isPasswordSaving, setIsPasswordSaving] = useState(false)

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  })

  // Profile image state
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [isCompressing, setIsCompressing] = useState(false)

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      })
      
      // Load saved profile image from session or localStorage
      if (user.image) {
        setProfileImage(user.image)
      } else {
        const savedImage = localStorage.getItem(`profileImage_${user.id}`)
        if (savedImage) {
          setProfileImage(savedImage)
        }
      }
    }
  }, [user])

  // Cleanup on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      // Clear any pending image processing
      const fileInput = document.getElementById('profileImageInput') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    }
  }, [])

  // Optimized image handling with compression
  const handleImageChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      toast({
        title: "Error",
        description: validation.error,
        variant: "destructive",
      })
      return
    }

    setIsCompressing(true)

    try {
      // Compress image for better performance
      const compressed = await compressImage(file, 200, 200, 0.8)
      
      // Check compressed size (should be much smaller now)
      if (compressed.size > 100 * 1024) { // 100KB limit for compressed
        toast({
          title: "Warning",
          description: "Image is still large after compression. Consider using a smaller image.",
          variant: "destructive",
        })
      }

      setImageFile(file)
      setProfileImage(compressed.dataUrl)
      
      toast({
        title: "Success",
        description: `Image compressed to ${Math.round(compressed.size / 1024)}KB`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image. Please try another image.",
        variant: "destructive",
      })
      console.error('Image compression error:', error)
    } finally {
      setIsCompressing(false)
    }
  }, [toast])

  // Debounced storage update for better performance
  const debouncedStorageUpdate = useMemo(
    () => debounce((userId: string, imageData: string | null) => {
      if (imageData) {
        localStorage.setItem(`profileImage_${userId}`, imageData)
      } else {
        localStorage.removeItem(`profileImage_${userId}`)
      }
      
      window.dispatchEvent(new CustomEvent('profileImageUpdate', {
        detail: { userId, imageData }
      }))
    }, 300),
    []
  )

  // Optimized image removal
  const handleRemoveImage = useCallback(() => {
    setProfileImage(null)
    setImageFile(null)
    
    if (user?.id) {
      debouncedStorageUpdate(user.id, null)
    }

    // Clear file input
    const fileInput = document.getElementById('profileImageInput') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }

    toast({
      title: "Success",
      description: "Profile image removed",
    })
  }, [user?.id, debouncedStorageUpdate, toast])

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Password visibility state
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleProfileSave = useCallback(async () => {
    // Validate form - only check firstName and lastName since email is read-only
    if (!profileData.firstName.trim() || !profileData.lastName.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both first name and last name",
        variant: "destructive",
      })
      return
    }

    // Validate name lengths
    if (profileData.firstName.trim().length < 2 || profileData.lastName.trim().length < 2) {
      toast({
        title: "Error",
        description: "First name and last name must be at least 2 characters long",
        variant: "destructive",
      })
      return
    }

    setIsProfileSaving(true)

    try {
      // Save profile changes (in a real app, this would call an API)
      // Profile data validation and saving process

      // Use debounced storage update for better performance
      if (profileImage && user?.id) {
        debouncedStorageUpdate(user.id, profileImage)
      }

      // Simulate API call delay (reduced for better UX)
      await new Promise(resolve => setTimeout(resolve, 500))

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })

      // Clear the image file since it's now saved
      setImageFile(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProfileSaving(false)
    }
  }, [profileData, profileImage, imageFile, user?.id, debouncedStorageUpdate, toast])

  const handlePasswordSave = useCallback(async () => {
    // Validate passwords
    if (!passwordData.currentPassword.trim() || !passwordData.newPassword.trim() || !passwordData.confirmPassword.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "New password must be at least 8 characters long",
        variant: "destructive",
      })
      return
    }

    if (passwordData.currentPassword === passwordData.newPassword) {
      toast({
        title: "Error",
        description: "New password must be different from current password",
        variant: "destructive",
      })
      return
    }

    // Check for basic password strength
    const hasUpperCase = /[A-Z]/.test(passwordData.newPassword)
    const hasLowerCase = /[a-z]/.test(passwordData.newPassword)
    const hasNumbers = /\d/.test(passwordData.newPassword)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      toast({
        title: "Error",
        description: "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        variant: "destructive",
      })
      return
    }

    setIsPasswordSaving(true)

    try {
      // Save password changes (in a real app, this would call an API)
      // Here you would typically make an API call to verify current password and update to new password
      // Updating password for user

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      toast({
        title: "Success",
        description: "Password updated successfully",
      })

      // Clear form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      // Reset password visibility
      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPasswordSaving(false)
    }
  }, [passwordData, setPasswordData, setShowPasswords, toast])

  const togglePasswordVisibility = useCallback((field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }, [])

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold dark:text-gray-100">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Keep your personal information updated.</p>
      </div>

      <Card className="max-w-4xl mx-auto dark:bg-gray-900 dark:border-gray-800">
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex">
              {/* Tab Navigation */}
              <div className="w-48 bg-gray-50 dark:bg-gray-800 p-4">
                <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-2">
                  <TabsTrigger
                    value="profile"
                    className="w-full justify-start data-[state=active]:bg-orange-500 data-[state=active]:text-white dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="password"
                    className="w-full justify-start data-[state=active]:bg-orange-500 data-[state=active]:text-white dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Change Password
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content */}
              <div className="flex-1">
                <TabsContent value="profile" className="m-0">
                  <div className="p-8">
                    <div className="space-y-6">
                      {/* Profile Photo */}
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <Avatar className="w-20 h-20">
                            <AvatarImage
                              src={profileImage || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-LtrkRm53W3uRufsiaXNMc2Q6KKm6Nv.png"}
                              alt={`${user.firstName} ${user.lastName}`}
                            />
                            <AvatarFallback className="text-lg">
                              {user.firstName[0]}
                              {user.lastName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <input
                            type="file"
                            id="profileImageInput"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            size="icon"
                            disabled={isCompressing}
                            onClick={() => document.getElementById('profileImageInput')?.click()}
                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full disabled:opacity-50"
                          >
                            <Camera className="w-4 h-4" />
                          </Button>
                          {profileImage && (
                            <Button
                              type="button"
                              size="icon"
                              onClick={handleRemoveImage}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          <p className="font-medium">Profile Photo</p>
                          {isCompressing ? (
                            <p className="text-xs text-blue-600 dark:text-blue-400">Compressing image...</p>
                          ) : (
                            <p className="text-xs">Click the camera icon to upload a new photo</p>
                          )}
                          {profileImage && !isCompressing && (
                            <p className="text-xs text-red-600 dark:text-red-400">Click the X to remove your custom photo</p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Max size: 10MB • Auto-compressed to 200×200px • Formats: JPG, PNG, GIF
                          </p>
                        </div>
                      </div>

                      {/* Name Fields */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="dark:text-gray-200">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                            placeholder="John"
                            className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                            maxLength={50}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="dark:text-gray-200">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                            placeholder="Smith"
                            className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                            maxLength={50}
                          />
                        </div>
                      </div>

                      {/* Email (Read-only) */}
                      <div className="space-y-2">
                        <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          disabled
                          className="bg-gray-50 dark:bg-gray-800 cursor-not-allowed dark:border-gray-700 dark:text-gray-400"
                          placeholder="john.smith@example.com"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400">Email cannot be changed for security reasons</p>
                      </div>

                      {/* Date Joined */}
                      <div className="space-y-2">
                        <Label className="dark:text-gray-200">Date Joined</Label>
                        <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-md border dark:border-gray-700">
                          {user.joinedDate ? 
                            new Date(user.joinedDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            }) : 
                            new Date().toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })
                          }
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex items-center space-x-4">
                        <Button 
                          onClick={handleProfileSave} 
                          disabled={isProfileSaving}
                          className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 disabled:opacity-50"
                        >
                          {isProfileSaving ? "Saving..." : "Save Changes"}
                        </Button>
                        {imageFile && (
                          <div className="text-sm text-orange-600 dark:text-orange-400 flex items-center">
                            <span className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full mr-2"></span>
                            New image selected - Click Save to apply
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="password" className="m-0">
                  <div className="p-8">
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        {/* Current Password */}
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="dark:text-gray-200">Current Password</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              type={showPasswords.current ? "text" : "password"}
                              value={passwordData.currentPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                              placeholder="••••••••"
                              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                              maxLength={128}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                              onClick={() => togglePasswordVisibility("current")}
                            >
                              {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>

                        {/* New Password */}
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="dark:text-gray-200">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showPasswords.new ? "text" : "password"}
                              value={passwordData.newPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                              placeholder="••••••••"
                              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                              maxLength={128}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                              onClick={() => togglePasswordVisibility("new")}
                            >
                              {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="dark:text-gray-200">Re-Enter New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showPasswords.confirm ? "text" : "password"}
                              value={passwordData.confirmPassword}
                              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                              placeholder="••••••••"
                              className="dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:placeholder-gray-400"
                              maxLength={128}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                              onClick={() => togglePasswordVisibility("confirm")}
                            >
                              {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Password Requirements */}
                      <div className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-gray-800 p-4 rounded-lg border border-blue-200 dark:border-gray-700">
                        <p className="font-medium text-blue-800 dark:text-gray-200 mb-2">Password requirements:</p>
                        <ul className="list-disc list-inside space-y-1 text-blue-700 dark:text-gray-300">
                          <li>At least 8 characters long</li>
                          <li>Must contain at least one uppercase letter (A-Z)</li>
                          <li>Must contain at least one lowercase letter (a-z)</li>
                          <li>Must contain at least one number (0-9)</li>
                          <li>Must be different from current password</li>
                        </ul>
                      </div>

                      {/* Save Button */}
                      <Button 
                        onClick={handlePasswordSave} 
                        disabled={isPasswordSaving}
                        className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 disabled:opacity-50"
                      >
                        {isPasswordSaving ? "Updating Password..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
