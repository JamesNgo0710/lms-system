"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { APP_CONFIG, UI_TEXT } from "@/lib/constants"
import { dataStore } from "@/lib/data-store"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [demoAccounts, setDemoAccounts] = useState<Array<{ email: string; role: string; password?: string }>>([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Get some demo accounts from the data store
    const users = dataStore.getUsers()
    const demos = [
      users.find(u => u.role === "admin"),
      users.find(u => u.role === "student")
    ].filter(Boolean).slice(0, 2).map(user => ({
      email: user!.email,
      role: user!.role,
      password: user!.email === "admin@lms.com" ? "admin123" : 
                user!.email === "student@lms.com" ? "student123" : undefined
    }))
    setDemoAccounts(demos)
  }, [])

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
        toast({
          title: "Login successful",
          description: `Welcome to ${APP_CONFIG.name}`,
        })
        router.push("/dashboard")
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password. Please check your credentials and try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login. Please try again later.",
        variant: "destructive",
      })
    }

    setIsLoading(false)
  }

  const fillDemoCredentials = (account: typeof demoAccounts[0]) => {
    if (account.password) {
      setEmail(account.email)
      setPassword(account.password)
    }
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
              onChange={(e) => setEmail(e.target.value)} 
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

        {demoAccounts.length > 0 && (
          <div className="mt-6 space-y-2 text-sm text-muted-foreground">
            <p className="font-semibold">Quick Access (Demo Accounts):</p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <div key={account.email} className="flex items-center justify-between">
                  <div>
                    <strong className="capitalize">{account.role}:</strong> {account.email}
                    {account.password && ` / ${account.password}`}
                  </div>
                  {account.password && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => fillDemoCredentials(account)}
                      className="ml-2 h-auto p-1 text-xs"
                    >
                      Use
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Note: You can create new users with custom passwords in the User Management section after logging in as an admin.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
