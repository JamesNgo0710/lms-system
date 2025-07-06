import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { serverDataStore } from "@/lib/server-data-store"
import { config } from "@/lib/config"

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

        // Authenticate user from server data store
        const user = serverDataStore.authenticateUser(credentials.email, credentials.password)

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            image: user.profileImage,
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
        token.image = user.image
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
        session.user.id = token.sub as string
        if (token.image) {
          session.user.image = token.image as string
        }
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
  secret: config.nextAuthSecret,
  debug: config.enableDebug,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 