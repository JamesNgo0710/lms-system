# Next.js Frontend Integration with Laravel Sanctum

## Overview
This guide shows how to modify your existing Next.js LMS frontend to work with the Laravel Sanctum backend.

## Step 1: Install Required Packages

```bash
npm install axios
```

## Step 2: Create API Client

Create `lib/api-client.ts`:
```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for Sanctum
});

// Add request interceptor to include token
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage or cookies
    const token = localStorage.getItem('auth-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth-token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// Get CSRF cookie for Sanctum
export const getCsrfCookie = async () => {
  await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
};
```

## Step 3: Update NextAuth Configuration

Update `app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { apiClient, getCsrfCookie } from "@/lib/api-client"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Get CSRF cookie first
          await getCsrfCookie();
          
          // Make login request
          const response = await apiClient.post('/login', {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, token } = response.data;

          if (user && token) {
            // Store token in localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('auth-token', token);
            }

            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              firstName: user.first_name,
              lastName: user.last_name,
              role: user.role,
              image: user.profile_image,
              token: token,
            }
          }

          return null
        } catch (error) {
          console.error('Login error:', error);
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.image = user.image
        token.accessToken = user.token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        if (token.image) {
          session.user.image = token.image as string
        }
      }
      session.accessToken = token.accessToken as string
      return session
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

## Step 4: Create API Service Layer

Create `lib/services/user.service.ts`:
```typescript
import { apiClient } from '@/lib/api-client';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  profile_image?: string;
  joined_date: string;
  completed_topics: number;
  total_topics: number;
  weekly_hours: number;
  this_week_hours: number;
}

export const userService = {
  // Get all users (admin only)
  async getAll(): Promise<User[]> {
    const response = await apiClient.get('/users');
    return response.data;
  },

  // Get single user
  async getById(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  // Create new user (admin only)
  async create(userData: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role: string;
  }): Promise<User> {
    const response = await apiClient.post('/users', userData);
    return response.data;
  },

  // Update user
  async update(id: string, userData: Partial<User>): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  },

  // Delete user (admin only)
  async delete(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  // Update password
  async updatePassword(
    id: string,
    password: string,
    password_confirmation: string
  ): Promise<void> {
    await apiClient.put(`/users/${id}/password`, {
      password,
      password_confirmation,
    });
  },

  // Upload profile image
  async updateProfileImage(id: string, imageData: string): Promise<User> {
    const response = await apiClient.put(`/users/${id}`, {
      profile_image: imageData,
    });
    return response.data;
  },
};
```

## Step 5: Update User Management Hook

Update `hooks/use-data-store.ts` to use the API:
```typescript
import { useEffect, useState } from 'react';
import { userService, User } from '@/lib/services/user.service';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/use-toast';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const { toast } = useToast();

  // Fetch users from API
  const fetchUsers = async () => {
    if (session?.user?.role !== 'admin') {
      setLoading(false);
      return;
    }

    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [session]);

  const addUser = async (userData: any) => {
    try {
      const newUser = await userService.create({
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
        role: userData.role,
      });
      setUsers([...users, newUser]);
      return newUser;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create user",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateUser = async (id: string, userData: any) => {
    try {
      const updatedUser = await userService.update(id, {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        profile_image: userData.profileImage,
      });
      setUsers(users.map(u => u.id === id ? updatedUser : u));
      return updatedUser;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update user",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await userService.delete(id);
      setUsers(users.filter(u => u.id !== id));
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete user",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    users,
    loading,
    addUser,
    updateUser,
    deleteUser,
    refetch: fetchUsers,
  };
}
```

## Step 6: Update User Management Page

Update `app/dashboard/user-management/page.tsx` to work with API data:
```typescript
// ... imports remain the same

export default function UserManagementPage() {
  const { users, loading, addUser, updateUser, deleteUser } = useUsers();
  // ... other state variables remain the same

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

    try {
      setIsLoading(true);
      
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        toast({
          title: "Success",
          description: "User updated successfully",
        });
      } else {
        await addUser(formData);
        toast({
          title: "Success",
          description: "User created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  const handlePasswordUpdate = async () => {
    if (!passwordUserId || !newPassword || !confirmPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      await userService.updatePassword(passwordUserId, newPassword, confirmPassword);
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setIsPasswordDialogOpen(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update password",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // ... rest of the component remains the same
}
```

## Step 7: Environment Variables

Update `.env.local`:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Remove old demo credentials as they're now in Laravel
```

## Step 8: Update Types

Update `types/next-auth.d.ts`:
```typescript
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      firstName: string
      lastName: string
      role: string
      image?: string
    }
    accessToken?: string
  }

  interface User {
    id: string
    email: string
    name: string
    firstName: string
    lastName: string
    role: string
    image?: string
    token?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    firstName: string
    lastName: string
    image?: string
    accessToken?: string
  }
}
```

## Step 9: Handle Logout

Update logout functionality to clear the token:
```typescript
import { signOut } from "next-auth/react";
import { apiClient } from "@/lib/api-client";

export const handleLogout = async () => {
  try {
    // Call Laravel logout endpoint
    await apiClient.post('/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Clear local token
    localStorage.removeItem('auth-token');
    // Sign out from NextAuth
    await signOut({ callbackUrl: '/' });
  }
};
```

## Step 10: Error Handling

Create a global error handler component:
```typescript
// components/error-handler.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function ErrorHandler({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (event: any) => {
      const error = event.reason || event.error;
      
      if (error?.response?.status === 401) {
        toast({
          title: "Session Expired",
          description: "Please login again",
          variant: "destructive",
        });
        router.push('/');
      } else if (error?.response?.status === 403) {
        toast({
          title: "Access Denied",
          description: "You don't have permission to perform this action",
          variant: "destructive",
        });
      } else if (error?.response?.status === 422) {
        const errors = error.response.data.errors;
        const firstError = Object.values(errors)[0];
        toast({
          title: "Validation Error",
          description: Array.isArray(firstError) ? firstError[0] : firstError,
          variant: "destructive",
        });
      }
    };

    window.addEventListener('unhandledrejection', handleError);
    return () => window.removeEventListener('unhandledrejection', handleError);
  }, [router, toast]);

  return <>{children}</>;
}
```

## Testing the Integration

1. Start your Laravel backend:
   ```bash
   cd lms-backend
   php artisan serve
   ```

2. Start your Next.js frontend:
   ```bash
   cd lms-system
   npm run dev
   ```

3. Test login with the seeded credentials:
   - Admin: `admin@lms.com` / `admin123`
   - Teacher: `teacher@lms.com` / `teacher123`
   - Student: `student@lms.com` / `student123`

## Common Issues and Solutions

### CORS Issues
- Ensure Laravel CORS configuration allows your frontend URL
- Check that `withCredentials: true` is set in axios

### 419 CSRF Token Mismatch
- For Bearer token authentication, ensure `EnsureFrontendRequestsAreStateful` middleware is not applied to API routes
- For session-based authentication, call `getCsrfCookie()` before making requests
- Verify `SESSION_DOMAIN` in Laravel `.env` matches your setup

### 401 Unauthorized
- Check that the token is being sent in the Authorization header
- Verify the token hasn't expired
- Ensure Sanctum middleware is properly configured

### Session Not Persisting
- Verify cookies are being set with correct domain
- Check browser developer tools for cookie storage
- Ensure HTTPS is used in production

## Next Steps

1. Implement remaining API endpoints for:
   - Topics and lessons
   - Assessments
   
   - File uploads

2. Add real-time features with Laravel WebSockets
3. Implement caching with Redis
4. Set up job queues for background tasks
5. Add comprehensive error logging 