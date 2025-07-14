"use client"

import { getSession } from "next-auth/react"

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
  private API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  private constructor() {}

  static getInstance(): ApiDataStore {
    if (!ApiDataStore.instance) {
      ApiDataStore.instance = new ApiDataStore()
    }
    return ApiDataStore.instance
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
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/topics`, { headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch topics: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching topics:', error)
      return []
    }
  }

  async getTopic(id: number): Promise<Topic | null> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/topics/${id}`, { headers })
      
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
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/topics`, {
        method: 'POST',
        headers,
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
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/topics/${id}`, {
        method: 'PUT',
        headers,
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
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/topics/${id}`, {
        method: 'DELETE',
        headers,
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
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/lessons`, { headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lessons: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching lessons:', error)
      return []
    }
  }

  async getLessonsByTopic(topicId: number): Promise<Lesson[]> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/topics/${topicId}/lessons`, { headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lessons for topic: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching lessons by topic:', error)
      return []
    }
  }

  async getLesson(id: number): Promise<Lesson | null> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/lessons/${id}`, { headers })
      
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
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/lessons`, {
        method: 'POST',
        headers,
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
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/lessons/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(lesson),
      })
      
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
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/lessons/${id}`, {
        method: 'DELETE',
        headers,
      })
      
      return response.ok
    } catch (error) {
      console.error('Error deleting lesson:', error)
      return false
    }
  }

  // Lesson Completions API
  async markLessonComplete(lessonId: number, timeSpent?: number): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/lessons/${lessonId}/complete`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ time_spent: timeSpent }),
      })
      
      return response.ok
    } catch (error) {
      console.error('Error marking lesson complete:', error)
      return false
    }
  }

  async markLessonIncomplete(lessonId: number): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/lessons/${lessonId}/complete`, {
        method: 'DELETE',
        headers,
      })
      
      return response.ok
    } catch (error) {
      console.error('Error marking lesson incomplete:', error)
      return false
    }
  }

  async trackLessonView(lessonId: number, duration?: number): Promise<boolean> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/lessons/${lessonId}/view`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ duration }),
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
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/assessments`, { headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch assessments: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching assessments:', error)
      return []
    }
  }

  async getAssessmentByTopic(topicId: number): Promise<Assessment | null> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/topics/${topicId}/assessment`, { headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch assessment for topic: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching assessment by topic:', error)
      return null
    }
  }

  async getAssessment(id: number): Promise<Assessment | null> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/assessments/${id}`, { headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch assessment: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching assessment:', error)
      return null
    }
  }

  async submitAssessment(assessmentId: number, answers: (string | number)[], timeSpent: number): Promise<AssessmentAttempt | null> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/assessments/${assessmentId}/submit`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ answers, time_spent: timeSpent }),
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
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/assessments/${assessmentId}/attempts`, { headers })
      
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
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/users`, { headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching users:', error)
      return []
    }
  }

  async getUser(id: string): Promise<User | null> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/users/${id}`, { headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/users/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error updating user:', error)
      return null
    }
  }

  // Helper methods for compatibility with existing hooks
  async getUserLessonCompletions(userId: string): Promise<LessonCompletion[]> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/users/${userId}/lesson-completions`, { headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lesson completions: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching lesson completions:', error)
      return []
    }
  }

  async getUserLessonViews(userId: string): Promise<LessonView[]> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/users/${userId}/lesson-views`, { headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch lesson views: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching lesson views:', error)
      return []
    }
  }

  async getUserAssessmentAttempts(userId: string): Promise<AssessmentAttempt[]> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/users/${userId}/assessment-attempts`, { headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch assessment attempts: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching assessment attempts:', error)
      return []
    }
  }

  async getTopicProgress(userId: string, topicId: number): Promise<{ completed: number; total: number; percentage: number }> {
    try {
      const headers = await this.getAuthHeaders()
      const response = await fetch(`${this.API_URL}/api/users/${userId}/topics/${topicId}/progress`, { headers })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch topic progress: ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching topic progress:', error)
      return { completed: 0, total: 0, percentage: 0 }
    }
  }
}

export const apiDataStore = ApiDataStore.getInstance()
export default apiDataStore