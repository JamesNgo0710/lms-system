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
              // Don't include large profile_image to avoid header size issues
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
        // Store only essential data in JWT to avoid large headers
        token.id = user.id
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
        token.accessToken = user.token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // Store only essential data in session to avoid large headers
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.name = `${token.firstName} ${token.lastName}`
        session.user.email = session.user.email // Keep email from default
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
    maxAge: 8 * 60 * 60, // 8 hours (shorter session)
    updateAge: 2 * 60 * 60, // Update session every 2 hours
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
        maxAge: 8 * 60 * 60 // 8 hours (match session maxAge)
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST } 