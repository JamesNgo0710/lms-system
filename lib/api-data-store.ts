"use client"

import { getSession } from "next-auth/react"
import { detectBackend, config } from './config'
import { mockDataService } from './mock-data-service'

// Types (imported from existing data-store.ts)
interface Topic {
  id: number
  title: string
  category: string
  status: "Published" | "Draft"
  students: number
  lessons: number
  createdAt: string
  hasAssessment: boolean
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  description?: string
  image?: string
}

interface Lesson {
  id: number
  topicId: number
  title: string
  description: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  videoUrl?: string
  prerequisites: string[]
  content: string
  socialLinks: {
    twitter?: string
    discord?: string
    youtube?: string
    instagram?: string
  }
  downloads: {
    id: number
    name: string
    size: string
    url: string
  }[]
  order: number
  status: "Published" | "Draft"
  createdAt: string
  image?: string
}

interface LessonCompletion {
  id: string
  userId: string
  lessonId: number
  topicId: number
  completedAt: string
  timeSpent?: number
}

interface LessonView {
  id: string
  userId: string
  lessonId: number
  topicId: number
  viewedAt: string
  duration?: number
}

interface Assessment {
  id: number
  topicId: number
  totalQuestions: number
  timeLimit: string
  retakePeriod: string
  cooldownPeriod: number
  questions: Question[]
  createdAt: string
  status: "Published" | "Draft"
}

interface AssessmentAttempt {
  id: string
  userId: string
  assessmentId: number
  topicId: number
  score: number
  correctAnswers: number
  totalQuestions: number
  timeSpent: number
  completedAt: string
  answers: (string | number)[]
}

interface Question {
  id: number
  type: "true-false" | "multiple-choice"
  question: string
  options?: string[]
  correctAnswer: string | number
  image?: string
}

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
  bio?: string
  phone?: string
  location?: string
  skills?: string
  interests?: string
}

class ApiDataStore {
  private static instance: ApiDataStore
  private backendConfig: any = null

  private constructor() {}

  static getInstance(): ApiDataStore {
    if (!ApiDataStore.instance) {
      ApiDataStore.instance = new ApiDataStore()
    }
    return ApiDataStore.instance
  }

  /**
   * Get backend configuration
   */
  private async getBackendConfig() {
    if (!this.backendConfig) {
      this.backendConfig = await detectBackend()
    }
    return this.backendConfig
  }

  /**
   * Get API URL dynamically
   */
  private async getApiUrl() {
    const backend = await this.getBackendConfig()
    return backend.apiUrl
  }

  /**
   * Helper method to make API requests with dynamic URL
   */
  private async makeApiRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const apiUrl = await this.getApiUrl()
    const headers = await this.getAuthHeaders()
    
    const response = await fetch(`${apiUrl}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    })

    return response
  }

  /**
   * Legacy method for backward compatibility - converts old API calls to new format
   */
  private async makeRequest(url: string, options: RequestInit = {}): Promise<Response> {
    // Extract endpoint from full URL
    const endpoint = url.replace(/^https?:\/\/[^\/]+/, '').replace(/^\$\{this\.API_URL\}/, '')
    return this.makeApiRequest(endpoint, options)
  }

  private async getAuthHeaders() {
    const session = await getSession()
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${(session as any)?.accessToken}`,
    }
  }

  // Topics API
  async getTopics(): Promise<Topic[]> {
    try {
      const backend = await this.getBackendConfig()
      
      // Use mock data if backend not connected
      if (!backend.isConnected) {
        return await mockDataService.getTopics()
      }

      const response = await this.makeApiRequest('/api/topics')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch topics: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching topics:', error)
      // Fallback to mock data on error
      return await mockDataService.getTopics()
    }
  }

  async getTopic(id: number): Promise<Topic | null> {
    try {
      const response = await this.makeApiRequest(`/api/topics/${id}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch topic: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching topic:', error)
      return null
    }
  }

  async createTopic(topic: Omit<Topic, 'id'>): Promise<Topic | null> {
    try {
      const response = await this.makeApiRequest('/api/topics', {
        method: 'POST',
        body: JSON.stringify(topic),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create topic: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error creating topic:', error)
      return null
    }
  }

  async updateTopic(id: number, topic: Partial<Topic>): Promise<Topic | null> {
    try {
      const response = await this.makeApiRequest(`/api/topics/${id}`, {
        method: 'PUT',
        body: JSON.stringify(topic),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update topic: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating topic:', error)
      return null
    }
  }

  async deleteTopic(id: number): Promise<boolean> {
    try {
      const response = await this.makeApiRequest(`/api/topics/${id}`, {
        method: 'DELETE',
      })
      
      return response.ok
    } catch (error) {
      console.error('Error deleting topic:', error)
      return false
    }
  }

  // Lessons API
  async getLessons(): Promise<Lesson[]> {
    try {
      const backend = await this.getBackendConfig()
      
      // Use mock data if backend not connected
      if (!backend.isConnected) {
        return await mockDataService.getLessons()
      }

      const response = await this.makeApiRequest('/api/lessons')
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lessons: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching lessons:', error)
      // Fallback to mock data on error
      return await mockDataService.getLessons()
    }
  }

  async getLessonsByTopic(topicId: number): Promise<Lesson[]> {
    try {
      const backend = await this.getBackendConfig()
      
      // Use mock data if backend not connected
      if (!backend.isConnected) {
        return await mockDataService.getLessonsByTopic(topicId)
      }

      const response = await this.makeApiRequest(`/api/topics/${topicId}/lessons`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lessons for topic: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching lessons by topic:', error)
      // Fallback to mock data on error
      return await mockDataService.getLessonsByTopic(topicId)
    }
  }

  async getLesson(id: number): Promise<Lesson | null> {
    try {
      const response = await this.makeApiRequest(`/api/lessons/${id}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lesson: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching lesson:', error)
      return null
    }
  }

  async createLesson(lesson: Omit<Lesson, 'id'>): Promise<Lesson | null> {
    try {
      const response = await this.makeApiRequest(`/api/lessons`, {
        method: 'POST',
        body: JSON.stringify(lesson),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to create lesson: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error creating lesson:', error)
      return null
    }
  }

  async updateLesson(id: number, lesson: Partial<Lesson>): Promise<Lesson | null> {
    try {
      const response = await this.makeApiRequest(`/api/lessons/${id}`, { method: 'PUT',body: JSON.stringify(lesson), })
      
      if (!response.ok) {
        throw new Error(`Failed to update lesson: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating lesson:', error)
      return null
    }
  }

  async deleteLesson(id: number): Promise<boolean> {
    try {
      const response = await this.makeApiRequest(`/api/lessons/${id}`, { method: 'DELETE', })
      
      return response.ok
    } catch (error) {
      console.error('Error deleting lesson:', error)
      return false
    }
  }

  // Lesson Completions API
  async markLessonComplete(lessonId: number, timeSpent?: number): Promise<boolean> {
    try {
      const response = await this.makeApiRequest(`/api/lessons/${lessonId}/complete`, { method: 'POST',body: JSON.stringify({ time_spent: timeSpent }),
      })
      
      return response.ok
    } catch (error) {
      console.error('Error marking lesson complete:', error)
      return false
    }
  }

  async markLessonIncomplete(lessonId: number): Promise<boolean> {
    try {
      const response = await this.makeApiRequest(`/api/lessons/${lessonId}/complete`, { method: 'DELETE', })
      
      return response.ok
    } catch (error) {
      console.error('Error marking lesson incomplete:', error)
      return false
    }
  }

  async trackLessonView(lessonId: number, duration?: number): Promise<boolean> {
    try {
      const response = await this.makeApiRequest(`/api/lessons/${lessonId}/view`, { method: 'POST',body: JSON.stringify({ duration }),
      })
      
      return response.ok
    } catch (error) {
      console.error('Error tracking lesson view:', error)
      return false
    }
  }

  // Assessments API
  async getAssessments(): Promise<Assessment[]> {
    try {
      const backend = await this.getBackendConfig()
      
      // Use mock data if backend not connected
      if (!backend.isConnected) {
        return await mockDataService.getAssessments()
      }

      const response = await this.makeApiRequest(`/api/assessments`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch assessments: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching assessments:', error)
      // Fallback to mock data on error
      return await mockDataService.getAssessments()
    }
  }

  async getAssessmentByTopic(topicId: number): Promise<Assessment | null> {
    try {
      const backend = await this.getBackendConfig()
      
      // Use mock data if backend not connected
      if (!backend.isConnected) {
        return await mockDataService.getAssessmentByTopic(topicId)
      }

      const response = await this.makeApiRequest(`/api/topics/${topicId}/assessment`)
      
      if (response.status === 404) {
        // Return null for 404s instead of throwing error to reduce console spam
        return null
      }
      
      if (!response.ok) {
        throw new Error(`Failed to fetch assessment for topic: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      // Only log errors that aren't 404s
      if (!error.message?.includes('404')) {
        console.error('Error fetching assessment by topic:', error)
      }
      // Return null instead of falling back to mock data for missing assessments
      return null
    }
  }

  async getAssessment(id: number): Promise<Assessment | null> {
    try {
      const response = await this.makeApiRequest(`/api/assessments/${id}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch assessment: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching assessment:', error)
      return null
    }
  }

  async createAssessment(assessment: Omit<Assessment, 'id'>): Promise<Assessment | null> {
    try {
      const response = await this.makeApiRequest(`/api/assessments`, { method: 'POST',body: JSON.stringify(assessment), })
      
      if (!response.ok) {
        throw new Error(`Failed to create assessment: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error creating assessment:', error)
      return null
    }
  }

  async updateAssessment(id: number, assessment: Partial<Assessment>): Promise<Assessment | null> {
    try {
      const response = await this.makeApiRequest(`/api/assessments/${id}`, { method: 'PUT',body: JSON.stringify(assessment), })
      
      if (!response.ok) {
        throw new Error(`Failed to update assessment: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating assessment:', error)
      return null
    }
  }

  async deleteAssessment(id: number): Promise<boolean> {
    try {
      const response = await this.makeApiRequest(`/api/assessments/${id}`, { method: 'DELETE', })
      
      return response.ok
    } catch (error) {
      console.error('Error deleting assessment:', error)
      return false
    }
  }

  async submitAssessment(assessmentId: number, answers: (string | number)[], timeSpent: number): Promise<AssessmentAttempt | null> {
    try {
      const response = await this.makeApiRequest(`/api/assessments/${assessmentId}/submit`, { method: 'POST',body: JSON.stringify({ answers, time_spent: timeSpent }),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to submit assessment: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error submitting assessment:', error)
      return null
    }
  }

  async getAssessmentAttempts(assessmentId: number): Promise<AssessmentAttempt[]> {
    try {
      const response = await this.makeApiRequest(`/api/assessments/${assessmentId}/attempts`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch assessment attempts: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching assessment attempts:', error)
      return []
    }
  }

  // Users API
  async getUsers(): Promise<User[]> {
    try {
      const backend = await this.getBackendConfig()
      
      // Use mock data if backend not connected
      if (!backend.isConnected) {
        return await mockDataService.getUsers()
      }

      const response = await this.makeApiRequest(`/api/users`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching users:', error)
      // Fallback to mock data on error
      return await mockDataService.getUsers()
    }
  }

  async getUser(id: string): Promise<User | null> {
    try {
      const response = await this.makeApiRequest(`/api/users/${id}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User | null> {
    try {
      const response = await this.makeApiRequest(`/api/users`, { method: 'POST',body: JSON.stringify(userData), })
      
      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error creating user:', error)
      return null
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const response = await this.makeApiRequest(`/api/users/${id}`, { method: 'PUT',body: JSON.stringify(userData), })
      
      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating user:', error)
      return null
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await this.makeApiRequest(`/api/users/${id}`, { method: 'DELETE', })
      
      return response.ok
    } catch (error) {
      console.error('Error deleting user:', error)
      return false
    }
  }

  // Helper methods for compatibility with existing hooks
  async getUserLessonCompletions(userId: string): Promise<LessonCompletion[]> {
    try {
      const backend = await this.getBackendConfig()
      
      // Use mock data if backend not connected
      if (!backend.isConnected) {
        return await mockDataService.getUserLessonCompletions(userId)
      }

      const response = await this.makeApiRequest(`/api/users/${userId}/lesson-completions`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lesson completions: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching lesson completions:', error)
      // Fallback to mock data on error
      return await mockDataService.getUserLessonCompletions(userId)
    }
  }

  async getUserLessonViews(userId: string): Promise<LessonView[]> {
    try {
      const backend = await this.getBackendConfig()
      
      // Use mock data if backend not connected
      if (!backend.isConnected) {
        return await mockDataService.getUserLessonViews(userId)
      }

      const response = await this.makeApiRequest(`/api/users/${userId}/lesson-views`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lesson views: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching lesson views:', error)
      // Fallback to mock data on error
      return await mockDataService.getUserLessonViews(userId)
    }
  }

  async getUserAssessmentAttempts(userId: string): Promise<AssessmentAttempt[]> {
    try {
      const backend = await this.getBackendConfig()
      
      // Use mock data if backend not connected
      if (!backend.isConnected) {
        return await mockDataService.getUserAssessmentAttempts(userId)
      }

      const response = await this.makeApiRequest(`/api/users/${userId}/assessment-attempts`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch assessment attempts: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching assessment attempts:', error)
      // Fallback to mock data on error
      return await mockDataService.getUserAssessmentAttempts(userId)
    }
  }

  async getTopicProgress(userId: string, topicId: number): Promise<{ completed: number; total: number; percentage: number }> {
    try {
      const backend = await this.getBackendConfig()
      
      // Use mock data if backend not connected
      if (!backend.isConnected) {
        return await mockDataService.getTopicProgress(userId, topicId)
      }

      const response = await this.makeApiRequest(`/api/users/${userId}/topics/${topicId}/progress`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch topic progress: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching topic progress:', error)
      // Fallback to mock data on error
      return await mockDataService.getTopicProgress(userId, topicId)
    }
  }
}

export const apiDataStore = ApiDataStore.getInstance()
export default apiDataStore