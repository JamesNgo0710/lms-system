import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Demo accounts for the LMS system
const demoUsers = [
  {
    id: "1",
    email: "admin@lms.com",
    password: "admin123",
    name: "Admin User",
    firstName: "Admin",
    lastName: "User",
    role: "admin"
  },
  {
    id: "2", 
    email: "student@lms.com",
    password: "student123",
    name: "Student User",
    firstName: "Student",
    lastName: "User", 
    role: "student"
  },
  {
    id: "3",
    email: "jimmy@lms.com", 
    password: "jimmy123",
    name: "Jimmy Smith",
    firstName: "Jimmy",
    lastName: "Smith",
    role: "student"
  }
]

const authOptions: NextAuthOptions = {
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

        // Find user in demo accounts
        const user = demoUsers.find(
          (u) => u.email === credentials.email && u.password === credentials.password
        )

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.id = token.sub as string
      }
      return session
    },
  },
  pages: {
    signIn: '/',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-for-development",
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 