// Server-side data store that doesn't depend on localStorage
// This is a simplified version for API routes

interface User {
  id: string
  username: string
  email: string
  password: string
  role: "admin" | "student"
  firstName: string
  lastName: string
  joinedDate: string
  currentTopic?: string
  completedTopics: number
  totalTopics: number
  weeklyHours: number
  thisWeekHours: number
  profileImage?: string
}

// Users are now managed by Laravel backend - no server-side storage
const initialUsers: User[] = []

class ServerDataStore {
  private users: User[] = [...initialUsers]

  // Get all users
  getUsers(): User[] {
    return this.users
  }

  // Get user by ID
  getUserById(id: string): User | undefined {
    return this.users.find((u) => u.id === id)
  }

  // Get user by email
  getUserByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  }

  // Authenticate user
  authenticateUser(email: string, password: string): User | null {
    const user = this.users.find((u) => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    return user || null
  }

  // Change user password
  changeUserPassword(userId: string, newPassword: string): boolean {
    const userIndex = this.users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return false

    this.users[userIndex].password = newPassword
    console.log(`Password changed for user ${userId}`)
    return true
  }

  // Update user profile image
  updateUserProfileImage(userId: string, imageData: string): boolean {
    const userIndex = this.users.findIndex((u) => u.id === userId)
    if (userIndex === -1) return false

    this.users[userIndex].profileImage = imageData
    console.log(`Profile image updated for user ${userId}`)
    return true
  }

  // Add new user
  addUser(user: Omit<User, "id">): User {
    const newUser: User = {
      ...user,
      id: (Math.max(0, ...this.users.map((u) => Number.parseInt(u.id))) + 1).toString(),
    }
    this.users.push(newUser)
    console.log(`New user created: ${newUser.id}`)
    return newUser
  }

  // Update user
  updateUser(id: string, updates: Partial<User>): boolean {
    const userIndex = this.users.findIndex((u) => u.id === id)
    if (userIndex === -1) return false

    this.users[userIndex] = { ...this.users[userIndex], ...updates }
    console.log(`User updated: ${id}`)
    return true
  }

  // Delete user
  deleteUser(id: string): boolean {
    const userIndex = this.users.findIndex((u) => u.id === id)
    if (userIndex === -1) return false

    this.users.splice(userIndex, 1)
    console.log(`User deleted: ${id}`)
    return true
  }
}

// Export singleton instance
export const serverDataStore = new ServerDataStore()
export type { User } 