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
    bio?: string
    phone?: string
    location?: string
    skills?: string
    interests?: string
    accessToken?: string
  }
} 