import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import axios from "axios"

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
          // Create server-only API client for NextAuth
          const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8000'
          
          // Make login request directly with axios
          const response = await axios.post(`${API_URL}/api/login`, {
            email: credentials.email,
            password: credentials.password,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });

          const { user, token } = response.data;

          if (user && token) {
            return {
              id: user.id.toString(),
              email: user.email,
              name: user.name,
              firstName: user.first_name,
              lastName: user.last_name,
              role: user.role,
              image: user.profile_image,
              bio: user.bio,
              phone: user.phone,
              location: user.location,
              skills: user.skills,
              interests: user.interests,
              token: token,
            }
          }

          return null
        } catch (error) {
          console.error('Login error:', error.response?.data?.message || error.message);
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
        token.bio = user.bio
        token.phone = user.phone
        token.location = user.location
        token.skills = user.skills
        token.interests = user.interests
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
        session.user.bio = token.bio as string
        session.user.phone = token.phone as string
        session.user.location = token.location as string
        session.user.skills = token.skills as string
        session.user.interests = token.interests as string
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
    maxAge: 24 * 60 * 60, // 24 hours
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        domain: process.env.NODE_ENV === "production" ? process.env.NEXTAUTH_URL?.includes('localhost') ? undefined : ".yourdomain.com" : undefined
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 