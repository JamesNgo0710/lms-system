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
      bio?: string
      phone?: string
      location?: string
      skills?: string
      interests?: string
      joinedDate?: string
      laravelToken?: string
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
    bio?: string
    phone?: string
    location?: string
    skills?: string
    interests?: string
    joinedDate?: string
    token?: string
    laravelToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    firstName: string
    lastName: string
    accessToken?: string
  }
} 