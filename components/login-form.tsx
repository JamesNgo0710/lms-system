"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { APP_CONFIG, UI_TEXT } from "@/lib/constants"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.ok) {
        // Wait for session to be properly established
        let session = await getSession()
        let retries = 0
        const maxRetries = 5
        
        // Retry getting session if not immediately available
        while (!session && retries < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 200))
          session = await getSession()
          retries++
        }
        
        if (session?.user) {
          toast({
            title: "Login successful",
            description: `Welcome to ${APP_CONFIG.name}`,
          })
          
          // Use router.replace to prevent back navigation to login
          router.replace("/dashboard")
        } else {
          // Session not established properly, show error
          toast({
            title: "Login failed",
            description: "Session could not be established. Please try again.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Login failed", 
          description: result?.error || "Invalid email or password. Please check your credentials and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login failed",
        description: "An error occurred during login. Please try again later.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }


  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-orange-500">
          <span className="text-2xl font-bold text-white">{APP_CONFIG.shortName}</span>
        </div>
        <CardTitle className="text-2xl">Welcome Back</CardTitle>
        <CardDescription>{UI_TEXT.loginDescription}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => {
                // Basic email validation - allow common email characters
                const value = e.target.value.replace(/[^a-zA-Z0-9@\.\-_]/g, '')
                setEmail(value)
              }} 
              placeholder="Enter your email"
              required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

      </CardContent>
    </Card>
  )
}
