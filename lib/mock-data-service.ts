/**
 * Mock Data Service
 * Provides sample data when no backend is connected
 * Ensures the application works out-of-the-box
 */

// Mock data that matches the backend structure
export const mockTopics = [
  {
    id: 1,
    title: "General Info on Blockchain Tech",
    category: "Basics",
    status: "Published" as const,
    students: 156,
    lessons: 3,
    createdAt: "2023-01-15",
    hasAssessment: true,
    difficulty: "Beginner" as const,
    description: "Learn the fundamentals of blockchain technology, including how it works, its key features like decentralization and immutability, and explore various real-world applications across different industries.",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=225&fit=crop&crop=center"
  },
  {
    id: 2,
    title: "Getting Started With Crypto",
    category: "Basics",
    status: "Published" as const,
    students: 89,
    lessons: 2,
    createdAt: "2023-02-20",
    hasAssessment: true,
    difficulty: "Beginner" as const,
    description: "Introduction to cryptocurrency basics, understanding digital currencies, and learning how to create and secure your first cryptocurrency wallet with best practices.",
    image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=225&fit=crop&crop=center"
  },
  {
    id: 3,
    title: "Using MetaMask",
    category: "Wallets",
    status: "Published" as const,
    students: 134,
    lessons: 2,
    createdAt: "2023-03-10",
    hasAssessment: true,
    difficulty: "Beginner" as const,
    description: "Complete guide to installing, setting up, and using MetaMask browser extension. Learn about network switching, token management, and advanced security features.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=225&fit=crop&crop=center"
  },
  {
    id: 4,
    title: "Decentralised Finance (DeFi)",
    category: "DeFi",
    status: "Published" as const,
    students: 67,
    lessons: 2,
    createdAt: "2023-01-25",
    hasAssessment: true,
    difficulty: "Intermediate" as const,
    description: "Explore decentralized finance protocols, yield farming strategies, liquidity pools, and learn advanced techniques for maximizing DeFi yields while managing risks.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=225&fit=crop&crop=center"
  },
  {
    id: 5,
    title: "Non-Fungible Tokens (NFTs)",
    category: "NFTs",
    status: "Published" as const,
    students: 245,
    lessons: 1,
    createdAt: "2023-02-15",
    hasAssessment: false,
    difficulty: "Beginner" as const,
    description: "Understanding non-fungible tokens (NFTs), their technology, use cases, marketplaces, and applications in digital art, gaming, and various other industries.",
    image: "https://images.unsplash.com/photo-1640161704729-cbe966a08476?w=400&h=225&fit=crop&crop=center"
  },
  {
    id: 6,
    title: "Smart Contracts",
    category: "Advanced",
    status: "Published" as const,
    students: 78,
    lessons: 2,
    createdAt: "2023-04-01",
    hasAssessment: true,
    difficulty: "Advanced" as const,
    description: "Deep dive into smart contracts, their development, deployment, and real-world applications in various blockchain ecosystems.",
    image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=400&h=225&fit=crop&crop=center"
  }
]

export const mockUsers = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@lms.com",
    role: "admin",
    firstName: "Admin",
    lastName: "User",
    joinedDate: "2023-01-01",
    completedTopics: 6,
    totalTopics: 6,
    weeklyHours: 15,
    thisWeekHours: 8
  },
  {
    id: "2",
    name: "John Doe",
    email: "john@example.com",
    role: "student",
    firstName: "John",
    lastName: "Doe",
    joinedDate: "2023-02-15",
    completedTopics: 3,
    totalTopics: 6,
    weeklyHours: 12,
    thisWeekHours: 5
  },
  {
    id: "3",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "student",
    firstName: "Jane",
    lastName: "Smith",
    joinedDate: "2023-03-01",
    completedTopics: 4,
    totalTopics: 6,
    weeklyHours: 18,
    thisWeekHours: 10
  }
]

export const mockLessons = [
  {
    id: 1,
    topicId: 1,
    title: "What is Blockchain Technology?",
    description: "Introduction to blockchain fundamentals and core concepts",
    duration: "15 minutes",
    difficulty: "Beginner" as const,
    order: 1,
    status: "Published" as const,
    createdAt: "2023-01-15",
    content: "Learn about the basic concepts of blockchain technology...",
    prerequisites: [],
    socialLinks: {},
    downloads: []
  },
  {
    id: 2,
    topicId: 1,
    title: "How Blockchain Works",
    description: "Deep dive into blockchain mechanics and processes",
    duration: "20 minutes",
    difficulty: "Beginner" as const,
    order: 2,
    status: "Published" as const,
    createdAt: "2023-01-16",
    content: "Understanding how blockchain technology works...",
    prerequisites: ["What is Blockchain Technology?"],
    socialLinks: {},
    downloads: []
  }
]

export const mockAssessments = [
  {
    id: 1,
    topicId: 1,
    totalQuestions: 10,
    timeLimit: "30:00",
    retakePeriod: "7 days",
    cooldownPeriod: 1,
    status: "Published" as const,
    createdAt: "2023-01-20",
    questions: [
      {
        id: 1,
        type: "multiple-choice" as const,
        question: "What is blockchain technology primarily used for?",
        options: ["Gaming only", "Decentralized transactions", "Social media", "Video streaming"],
        correctAnswer: 1
      },
      {
        id: 2,
        type: "true-false" as const,
        question: "Blockchain is a centralized database system.",
        correctAnswer: "false"
      }
    ]
  }
]

/**
 * Mock Data Service Class
 * Simulates API calls with realistic delays
 */
export class MockDataService {
  private static instance: MockDataService

  private constructor() {}

  static getInstance(): MockDataService {
    if (!MockDataService.instance) {
      MockDataService.instance = new MockDataService()
    }
    return MockDataService.instance
  }

  /**
   * Simulate API delay
   */
  private async simulateDelay(ms: number = 300) {
    await new Promise(resolve => setTimeout(resolve, ms))
  }

  async getTopics() {
    await this.simulateDelay()
    return mockTopics
  }

  async getTopic(id: number) {
    await this.simulateDelay()
    return mockTopics.find(topic => topic.id === id) || null
  }

  async getUsers() {
    await this.simulateDelay()
    return mockUsers
  }

  async getUser(id: string) {
    await this.simulateDelay()
    return mockUsers.find(user => user.id === id) || null
  }

  async getLessons() {
    await this.simulateDelay()
    return mockLessons
  }

  async getLessonsByTopic(topicId: number) {
    await this.simulateDelay()
    return mockLessons.filter(lesson => lesson.topicId === topicId)
  }

  async getAssessments() {
    await this.simulateDelay()
    return mockAssessments
  }

  async getAssessmentByTopic(topicId: number) {
    await this.simulateDelay()
    return mockAssessments.find(assessment => assessment.topicId === topicId) || null
  }

  // Create/Update/Delete operations (just return success for demo)
  async createTopic(data: any) {
    await this.simulateDelay(500)
    const newTopic = { ...data, id: Date.now() }
    console.log('Mock: Created topic', newTopic)
    return newTopic
  }

  async updateTopic(id: number, data: any) {
    await this.simulateDelay(500)
    console.log('Mock: Updated topic', id, data)
    return { ...data, id }
  }

  async deleteTopic(id: number) {
    await this.simulateDelay(500)
    console.log('Mock: Deleted topic', id)
    return true
  }

  async createUser(data: any) {
    await this.simulateDelay(500)
    const newUser = { ...data, id: Date.now().toString() }
    console.log('Mock: Created user', newUser)
    return newUser
  }

  async updateUser(id: string, data: any) {
    await this.simulateDelay(500)
    console.log('Mock: Updated user', id, data)
    return { ...data, id }
  }

  async deleteUser(id: string) {
    await this.simulateDelay(500)
    console.log('Mock: Deleted user', id)
    return true
  }

  // User progress and completion methods
  async getUserLessonCompletions(userId: string) {
    await this.simulateDelay()
    return [
      {
        id: '1',
        userId,
        lessonId: 1,
        topicId: 1,
        completedAt: '2023-01-20T10:00:00Z',
        timeSpent: 900
      },
      {
        id: '2',
        userId,
        lessonId: 2,
        topicId: 1,
        completedAt: '2023-01-21T14:30:00Z',
        timeSpent: 1200
      }
    ]
  }

  async getUserLessonViews(userId: string) {
    await this.simulateDelay()
    return [
      {
        id: '1',
        userId,
        lessonId: 1,
        topicId: 1,
        viewedAt: '2023-01-20T09:45:00Z',
        duration: 900
      },
      {
        id: '2',
        userId,
        lessonId: 2,
        topicId: 1,
        viewedAt: '2023-01-21T14:15:00Z',
        duration: 1200
      }
    ]
  }

  async getUserAssessmentAttempts(userId: string) {
    await this.simulateDelay()
    return [
      {
        id: '1',
        userId,
        assessmentId: 1,
        topicId: 1,
        score: 85,
        correctAnswers: 8,
        totalQuestions: 10,
        timeSpent: 1800,
        completedAt: '2023-01-22T16:00:00Z',
        answers: [1, 'false', 1, 'true', 1, 0, 'false', 1, 'false', 1]
      }
    ]
  }

  async getTopicProgress(userId: string, topicId: number) {
    await this.simulateDelay()
    // Return different progress based on topic for variety
    const progressMap: Record<number, any> = {
      1: { completed: 2, total: 3, percentage: 67 },
      2: { completed: 1, total: 2, percentage: 50 },
      3: { completed: 2, total: 2, percentage: 100 },
      4: { completed: 0, total: 2, percentage: 0 },
      5: { completed: 1, total: 1, percentage: 100 },
      6: { completed: 0, total: 2, percentage: 0 }
    }
    
    return progressMap[topicId] || { completed: 0, total: 0, percentage: 0 }
  }
}

export const mockDataService = MockDataService.getInstance()