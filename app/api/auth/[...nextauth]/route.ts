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
              joinedDate: user.joined_date,
              token: token,
            }
          }

          return null
        } catch (error) {
          console.error('Login error:', error.response?.data?.message || error.message);
          // Clear any potentially problematic headers or data
          if (error.response?.status === 413 || error.message?.includes('headers')) {
            console.error('Large response detected, clearing cache');
          }
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
        token.joinedDate = user.joinedDate
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
        session.user.joinedDate = token.joinedDate as string
        if (token.image) {
          session.user.image = token.image as string
        }
      }
      session.accessToken = token.accessToken as string
      return session
    },
    async signOut({ token }) {
      // Clear any server-side session data
      if (token?.accessToken) {
        try {
          // You could call a Laravel logout endpoint here if needed
          // await axios.post(`${API_URL}/api/logout`, {}, {
          //   headers: { Authorization: `Bearer ${token.accessToken}` }
          // })
        } catch (error) {
          console.error('Server logout error:', error)
        }
      }
      return true
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
        maxAge: 24 * 60 * 60 // 24 hours
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 