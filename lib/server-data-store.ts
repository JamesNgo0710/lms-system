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

// Initial users data (same as in data-store.ts)
const initialUsers: User[] = [
  {
    id: "1",
    username: "admin",
    email: "admin@lms.com",
    password: "admin123",
    role: "admin",
    firstName: "Admin",
    lastName: "User",
    joinedDate: "01/01/22",
    completedTopics: 0,
    totalTopics: 0,
    weeklyHours: 0,
    thisWeekHours: 0,
    profileImage: undefined,
  },
  {
    id: "2",
    username: "student",
    email: "student@lms.com",
    password: "student123",
    role: "student",
    firstName: "Student",
    lastName: "User",
    joinedDate: "02/15/22",
    completedTopics: 2,
    totalTopics: 5,
    weeklyHours: 10,
    thisWeekHours: 5,
    profileImage: undefined,
  },
  {
    id: "3",
    username: "ron.burgandi",
    email: "ron.burgandi@gmail.com",
    password: "password789",
    role: "admin",
    firstName: "Ron",
    lastName: "Burgandi",
    joinedDate: "03/10/22",
    completedTopics: 0,
    totalTopics: 0,
    weeklyHours: 0,
    thisWeekHours: 0,
    profileImage: undefined,
  },
  {
    id: "4",
    username: "john.john",
    email: "johnjohn@gmail.com",
    password: "password101",
    role: "admin",
    firstName: "John",
    lastName: "John",
    joinedDate: "04/05/22",
    completedTopics: 0,
    totalTopics: 0,
    weeklyHours: 0,
    thisWeekHours: 0,
    profileImage: undefined,
  },
  {
    id: "5",
    username: "mary.magdaleine",
    email: "mary.m@yahoo.com",
    password: "password123",
    role: "admin",
    firstName: "Mary",
    lastName: "Magdaleine",
    joinedDate: "05/20/22",
    completedTopics: 0,
    totalTopics: 0,
    weeklyHours: 0,
    thisWeekHours: 0,
    profileImage: undefined,
  },
  {
    id: "6",
    username: "sergent.pepper",
    email: "sergentpg@gmail.com",
    password: "password456",
    role: "student",
    firstName: "Sergent",
    lastName: "Pepper",
    joinedDate: "06/12/22",
    completedTopics: 5,
    totalTopics: 12,
    weeklyHours: 25,
    thisWeekHours: 15,
    profileImage: undefined,
  },
]

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