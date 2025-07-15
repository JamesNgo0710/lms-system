/**
 * Mock Data Service
 * Provides sample data when no backend is connected
 * Ensures the application works out-of-the-box
 */

// Mock data that matches the backend structure - no topics available
export const mockTopics: any[] = []

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

export const mockLessons: any[] = []

export const mockAssessments: any[] = []

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
    return []
  }

  async getUserLessonViews(userId: string) {
    await this.simulateDelay()
    return []
  }

  async getUserAssessmentAttempts(userId: string) {
    await this.simulateDelay()
    return []
  }

  async getTopicProgress(userId: string, topicId: number) {
    await this.simulateDelay()
    // No topics available, return empty progress
    return { completed: 0, total: 0, percentage: 0 }
  }
}

export const mockDataService = MockDataService.getInstance()