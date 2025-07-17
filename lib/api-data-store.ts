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
      
      const rawTopics = await response.json()
      // console.log('🔍 Raw topics from API (before normalization):', rawTopics.map((t: any) => ({ 
      //   id: t.id, 
      //   title: t.title, 
      //   hasSnakeCase: !!(t.created_at || t.updated_at || t.lessons_count) 
      // })))
      
      // NORMALIZE TOPIC DATA - Convert snake_case to camelCase
      const normalizedTopics = rawTopics.map((topic: any) => ({
        id: topic.id,
        title: topic.title || '',
        description: topic.description || '',
        category: topic.category || '',
        difficulty: topic.difficulty || 'Beginner',
        status: topic.status || 'Draft',
        image: topic.image || '',
        lessons: topic.lessons || topic.lessons_count || 0,
        students: topic.students || topic.students_count || 0,
        hasAssessment: topic.hasAssessment || topic.has_assessment || false,
        // Convert snake_case to camelCase
        createdAt: topic.created_at || topic.createdAt,
        updatedAt: topic.updated_at || topic.updatedAt,
        // Remove any snake_case properties by not including them
      }))
      
      // console.log('🔍 Normalized topics (after cleanup):', normalizedTopics.map((t: any) => ({ 
      //   id: t.id, 
      //   title: t.title, 
      //   hasSnakeCase: !!(t.created_at || t.updated_at || t.lessons_count) 
      // })))
      
      return normalizedTopics
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
      
      const rawLessons = await response.json()
      // console.log('🔥 NUCLEAR SOLUTION: Raw lessons from API count:', rawLessons.length, 'with snake_case properties:', rawLessons.filter((l: any) => l.topic_id || l.video_url || l.social_links || l.created_at || l.updated_at).length)
      
      // NUCLEAR SOLUTION: BULLETPROOF NORMALIZATION AT API LEVEL
      // This ensures NO snake_case lesson objects can EVER escape the API layer
      const bulletproofLessons = rawLessons
        .filter((lesson: any) => lesson && typeof lesson === 'object' && lesson.id)
        .map((lesson: any) => {
          // Create completely clean object - NO snake_case properties possible
          const bulletproofLesson = {
            id: lesson.id,
            topicId: lesson.topic_id || lesson.topicId || 0,
            title: String(lesson.title || ''),
            description: String(lesson.description || ''),
            content: String(lesson.content || ''),
            duration: String(lesson.duration || '15 min'),
            difficulty: String(lesson.difficulty || 'Beginner'),
            status: String(lesson.status || 'Draft'),
            order: Number(lesson.order || 0),
            image: String(lesson.image || ''),
            videoUrl: String(lesson.video_url || lesson.videoUrl || ''),
            socialLinks: typeof lesson.social_links === 'object' ? lesson.social_links : 
                        typeof lesson.socialLinks === 'object' ? lesson.socialLinks : {},
            prerequisites: Array.isArray(lesson.prerequisites) ? lesson.prerequisites : [],
            downloads: Array.isArray(lesson.downloads) ? lesson.downloads : [],
            createdAt: lesson.created_at || lesson.createdAt || new Date().toISOString(),
            updatedAt: lesson.updated_at || lesson.updatedAt || new Date().toISOString(),
          }
          
          // CRITICAL: Verify NO snake_case properties exist at API level
          const hasSnakeCase = Object.keys(bulletproofLesson).some(key => key.includes('_'))
          if (hasSnakeCase) {
            // console.error('🚨 CRITICAL: snake_case property found in API normalized lesson:', bulletproofLesson)
          }
          
          return bulletproofLesson
        })
      
      // console.log('🔥 NUCLEAR: Bulletproof lessons created at API level - count:', bulletproofLessons.length)
      // console.log('🔥 NUCLEAR: Verification - no snake_case lessons can escape:', bulletproofLessons.every((l: any) => 
      //   !Object.keys(l).some(key => key.includes('_'))
      // ))
      
      return bulletproofLessons
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
      
      const rawLessons = await response.json()
      // console.log(`🔥 NUCLEAR SOLUTION: Raw lessons for topic ${topicId} count:`, rawLessons.length, 'with snake_case properties:', rawLessons.filter((l: any) => l.topic_id || l.video_url || l.social_links || l.created_at || l.updated_at).length)
      
      // NUCLEAR SOLUTION: BULLETPROOF NORMALIZATION AT API LEVEL FOR TOPIC LESSONS
      const bulletproofLessons = rawLessons
        .filter((lesson: any) => lesson && typeof lesson === 'object' && lesson.id)
        .map((lesson: any) => {
          // Create completely clean object - NO snake_case properties possible
          const bulletproofLesson = {
            id: lesson.id,
            topicId: lesson.topic_id || lesson.topicId || topicId,
            title: String(lesson.title || ''),
            description: String(lesson.description || ''),
            content: String(lesson.content || ''),
            duration: String(lesson.duration || '15 min'),
            difficulty: String(lesson.difficulty || 'Beginner'),
            status: String(lesson.status || 'Draft'),
            order: Number(lesson.order || 0),
            image: String(lesson.image || ''),
            videoUrl: String(lesson.video_url || lesson.videoUrl || ''),
            socialLinks: typeof lesson.social_links === 'object' ? lesson.social_links : 
                        typeof lesson.socialLinks === 'object' ? lesson.socialLinks : {},
            prerequisites: Array.isArray(lesson.prerequisites) ? lesson.prerequisites : [],
            downloads: Array.isArray(lesson.downloads) ? lesson.downloads : [],
            createdAt: lesson.created_at || lesson.createdAt || new Date().toISOString(),
            updatedAt: lesson.updated_at || lesson.updatedAt || new Date().toISOString(),
          }
          
          // CRITICAL: Verify NO snake_case properties exist at API level
          const hasSnakeCase = Object.keys(bulletproofLesson).some(key => key.includes('_'))
          if (hasSnakeCase) {
            // console.error(`🚨 CRITICAL: snake_case property found in API normalized lesson for topic ${topicId}:`, bulletproofLesson)
          }
          
          return bulletproofLesson
        })
      
      // console.log(`🔥 NUCLEAR: Bulletproof lessons for topic ${topicId} created at API level - count:`, bulletproofLessons.length)
      
      return bulletproofLessons
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
      
      const rawLesson = await response.json()
      // console.log(`🔥 NUCLEAR SOLUTION: Raw lesson ${id} from API, title: "${rawLesson.title}", has snake_case:`, !!(rawLesson.topic_id || rawLesson.video_url || rawLesson.social_links || rawLesson.created_at || rawLesson.updated_at))
      
      // NUCLEAR SOLUTION: BULLETPROOF NORMALIZATION FOR SINGLE LESSON
      if (!rawLesson || typeof rawLesson !== 'object' || !rawLesson.id) {
        return null
      }
      
      const bulletproofLesson = {
        id: rawLesson.id,
        topicId: rawLesson.topic_id || rawLesson.topicId || 0,
        title: String(rawLesson.title || ''),
        description: String(rawLesson.description || ''),
        content: String(rawLesson.content || ''),
        duration: String(rawLesson.duration || '15 min'),
        difficulty: String(rawLesson.difficulty || 'Beginner'),
        status: String(rawLesson.status || 'Draft'),
        order: Number(rawLesson.order || 0),
        image: String(rawLesson.image || ''),
        videoUrl: String(rawLesson.video_url || rawLesson.videoUrl || ''),
        socialLinks: typeof rawLesson.social_links === 'object' ? rawLesson.social_links : 
                    typeof rawLesson.socialLinks === 'object' ? rawLesson.socialLinks : {},
        prerequisites: Array.isArray(rawLesson.prerequisites) ? rawLesson.prerequisites : [],
        downloads: Array.isArray(rawLesson.downloads) ? rawLesson.downloads : [],
        createdAt: rawLesson.created_at || rawLesson.createdAt || new Date().toISOString(),
        updatedAt: rawLesson.updated_at || rawLesson.updatedAt || new Date().toISOString(),
      }
      
      // CRITICAL: Verify NO snake_case properties exist at API level
      const hasSnakeCase = Object.keys(bulletproofLesson).some(key => key.includes('_'))
      if (hasSnakeCase) {
        // console.error(`🚨 CRITICAL: snake_case property found in API normalized single lesson ${id}:`, bulletproofLesson)
      }
      
      // console.log(`🔥 NUCLEAR: Bulletproof single lesson ${id} created at API level`)
      
      return bulletproofLesson
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
      
      const rawCompletions = await response.json()
      // console.log('🔥 LESSON COMPLETIONS: Raw data from API count:', rawCompletions.length)
      
      // NUCLEAR SOLUTION: Normalize lesson completion data to prevent snake_case
      const normalizedCompletions = rawCompletions.map((completion: any) => {
        // Create clean completion object with normalized properties
        const cleanCompletion = {
          id: completion.id,
          userId: completion.user_id || completion.userId,
          lessonId: completion.lesson_id || completion.lessonId,
          topicId: completion.topic_id || completion.topicId,
          completedAt: completion.completed_at || completion.completedAt,
          timeSpent: completion.time_spent || completion.timeSpent,
          isCompleted: completion.is_completed || completion.isCompleted,
          // Ensure no snake_case properties survive
          // DO NOT include lesson object to prevent React error #31
        }
        
        // CRITICAL: Verify NO snake_case properties exist
        const hasSnakeCase = Object.keys(cleanCompletion).some(key => key.includes('_'))
        if (hasSnakeCase) {
          console.error('🚨 LESSON COMPLETIONS: snake_case property found:', cleanCompletion)
        }
        
        return cleanCompletion
      })
      
      // console.log('🔥 LESSON COMPLETIONS: Normalized count:', normalizedCompletions.length)
      return normalizedCompletions
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
      
      const rawViews = await response.json()
      // console.log('🔥 LESSON VIEWS: Raw data from API count:', rawViews.length)
      
      // NUCLEAR SOLUTION: Normalize lesson view data to prevent snake_case
      const normalizedViews = rawViews.map((view: any) => ({
        id: view.id,
        userId: view.user_id || view.userId,
        lessonId: view.lesson_id || view.lessonId,
        topicId: view.topic_id || view.topicId,
        viewedAt: view.viewed_at || view.viewedAt,
        duration: view.duration,
      }))
      
      // console.log('🔥 LESSON VIEWS: Normalized count:', normalizedViews.length)
      return normalizedViews
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
      
      const rawAttempts = await response.json()
      console.log('🔥 ASSESSMENT ATTEMPTS: Raw data from API count:', rawAttempts.length)
      
      // NUCLEAR SOLUTION: Normalize assessment attempt data to prevent snake_case
      const normalizedAttempts = rawAttempts.map((attempt: any) => ({
        id: attempt.id,
        userId: attempt.user_id || attempt.userId,
        assessmentId: attempt.assessment_id || attempt.assessmentId,
        topicId: attempt.topic_id || attempt.topicId,
        score: attempt.score,
        correctAnswers: attempt.correct_answers || attempt.correctAnswers,
        totalQuestions: attempt.total_questions || attempt.totalQuestions,
        timeSpent: attempt.time_spent || attempt.timeSpent,
        completedAt: attempt.completed_at || attempt.completedAt,
        answers: attempt.answers || [],
      }))
      
      console.log('🔥 ASSESSMENT ATTEMPTS: Normalized count:', normalizedAttempts.length)
      return normalizedAttempts
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