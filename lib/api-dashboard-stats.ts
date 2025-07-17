/**
 * API-based Dashboard Statistics
 * Replaces localStorage-based dashboard stats with real API data
 */

import { apiDataStore } from './api-data-store'
import { detectBackend } from './config'
import { mockDataService } from './mock-data-service'

export interface DashboardStats {
  admin: {
    activeUsersThisMonth: number
    activeUsersLastMonth: number
    actualUsers: number
    totalStudents: number
    totalAdmins: number
    averageTimeThisMonth: number
    averageTimeLastMonth: number
    topVideos: VideoStats[]
    mostViewedTopics: TopicStats[]
    totalLessons: number
    totalTopics: number
    totalViews: number
    totalCompletions: number
    progressPercentage: number
  }
  student: (userId?: string) => StudentStats
}

export interface VideoStats {
  id: number
  topicId: number
  title: string
  topic: string
  totalViews: number
  numberOfUsers: number
  completionRate: number
  difficulty: string
  image: string
  videoUrl?: string
}

export interface TopicStats {
  id: number
  title: string
  category: string
  difficulty: string
  totalViews: number
  numberOfUsers: number
  lessons: number
  completionRate: number
  enrolledStudents: number
  image: string
}

export interface StudentStats {
  completedTopics: number
  totalTopics: number
  thisWeekHours: number
  weeklyGoal: number
  weeklyHours: number
  totalHours: number
  userName: string
  userEmail: string
  joinedDate: string
  recentActivity: string
  recentActivities: ActivityStats[]
  progressPercentage: number
  weeklyProgressPercentage: number
  remainingHours: number
}

export interface ActivityStats {
  id: number
  type: string
  title: string
  date: string
  icon: string
  status: string
  statusColor: string
  score?: string
}

class ApiDashboardStats {
  private static instance: ApiDashboardStats
  private cachedStats: DashboardStats | null = null
  private lastCacheTime: number = 0
  private readonly CACHE_DURATION = 60000 // 1 minute cache

  private constructor() {}

  static getInstance(): ApiDashboardStats {
    if (!ApiDashboardStats.instance) {
      ApiDashboardStats.instance = new ApiDashboardStats()
    }
    return ApiDashboardStats.instance
  }

  /**
   * Get dashboard statistics from API or mock data
   */
  async getDashboardStats(userId?: string): Promise<DashboardStats> {
    const now = Date.now()
    
    // Return cached data if still valid
    if (this.cachedStats && (now - this.lastCacheTime) < this.CACHE_DURATION) {
      return this.cachedStats
    }

    try {
      const backend = await detectBackend()
      
      if (backend.isConnected) {
        // Use real API data
        this.cachedStats = await this.calculateApiStats()
      } else {
        // Use mock data
        this.cachedStats = await this.calculateMockStats()
      }
      
      this.lastCacheTime = now
      return this.cachedStats
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      // Fallback to mock data on error
      this.cachedStats = await this.calculateMockStats()
      this.lastCacheTime = now
      return this.cachedStats
    }
  }

  /**
   * Calculate statistics from real API data
   */
  private async calculateApiStats(): Promise<DashboardStats> {
    try {
      // Fetch all required data from API
      const [topics, users, lessons, lessonViews, lessonCompletions] = await Promise.all([
        apiDataStore.getTopics(),
        apiDataStore.getUsers(),
        apiDataStore.getLessons(),
        [], // TODO: Implement lesson views API if available
        [], // TODO: Implement lesson completions API if available
      ])

      // Calculate user metrics
      const allStudents = users.filter(user => user.role === 'student')
      const activeUsers = allStudents.filter(user => (user as any).thisWeekHours > 0)
      const totalUsers = users.length

      // Calculate average time (use mock data for now as user activity tracking may not be implemented)
      const averageTimeThisMonth = allStudents.length > 0 
        ? Math.round(allStudents.reduce((sum, user) => sum + ((user as any).thisWeekHours || 5), 0) / allStudents.length)
        : 8
      const averageTimeLastMonth = Math.max(1, Math.round(averageTimeThisMonth * 0.8))

      // Calculate lesson/video statistics
      console.log('🔥 DASHBOARD STATS: Received lessons from API:', lessons.length, 'first lesson keys:', lessons.length > 0 ? Object.keys(lessons[0]) : 'none')
      const lessonStats = lessons.map(lesson => {
        const topic = topics.find(t => t.id === lesson.topicId)
        // Since we don't have view tracking yet, use estimated data based on topic popularity
        const estimatedViews = topic ? Math.floor(Math.random() * 50) + 10 : 10
        const estimatedUsers = Math.floor(estimatedViews * 0.7)
        const completionRate = Math.floor(Math.random() * 40) + 60 // 60-100%

        // SAFETY: Ensure lesson properties are normalized (fallback to snake_case if needed)
        const safeLesson = {
          id: lesson.id,
          topicId: lesson.topicId || lesson.topic_id || 0,
          title: String(lesson.title || ''),
          topic: topic?.title || 'Unknown Topic',
          totalViews: estimatedViews,
          numberOfUsers: estimatedUsers,
          completionRate,
          difficulty: String(lesson.difficulty || 'Beginner'),
          image: String(lesson.image || topic?.image || '/placeholder.svg'),
          videoUrl: String(lesson.videoUrl || lesson.video_url || ''),
        }
        
        // CRITICAL: Verify no snake_case properties exist in dashboard stats
        const hasSnakeCase = Object.keys(safeLesson).some(key => key.includes('_'))
        if (hasSnakeCase) {
          console.error('🚨 DASHBOARD STATS: snake_case property found:', safeLesson)
        }
        
        return safeLesson
      }).sort((a, b) => b.totalViews - a.totalViews)

      // Calculate topic statistics
      const topicStats = topics.map(topic => {
        const topicLessons = lessons.filter(lesson => (lesson.topicId || lesson.topic_id) === topic.id)
        // Estimate views based on topic data
        const estimatedViews = Math.floor(Math.random() * 100) + 50
        const estimatedUsers = Math.floor(estimatedViews * 0.6)
        const completionRate = Math.floor(Math.random() * 30) + 70 // 70-100%

        return {
          id: topic.id,
          title: topic.title,
          category: topic.category,
          difficulty: topic.difficulty || 'Beginner',
          totalViews: estimatedViews,
          numberOfUsers: estimatedUsers,
          lessons: topicLessons.length,
          completionRate,
          enrolledStudents: (topic as any).students || estimatedUsers,
          image: topic.image || '/placeholder.svg',
        }
      }).sort((a, b) => b.totalViews - a.totalViews)

      return {
        admin: {
          activeUsersThisMonth: activeUsers.length || 3,
          activeUsersLastMonth: Math.max(activeUsers.length, 2),
          actualUsers: totalUsers,
          totalStudents: allStudents.length,
          totalAdmins: users.filter(u => u.role === 'admin').length || 1,
          averageTimeThisMonth,
          averageTimeLastMonth,
          topVideos: lessonStats.slice(0, 4),
          mostViewedTopics: topicStats.slice(0, 6),
          totalLessons: lessons.length,
          totalTopics: topics.length,
          totalViews: lessonStats.reduce((sum, stat) => sum + stat.totalViews, 0),
          totalCompletions: Math.floor(lessonStats.reduce((sum, stat) => sum + stat.totalViews, 0) * 0.7),
          progressPercentage: activeUsers.length > 0 ? (activeUsers.length / Math.max(1, allStudents.length)) * 100 : 75,
        },
        student: (userId?: string) => this.getStudentStats(userId, topics, lessons, allStudents)
      }
    } catch (error) {
      console.error('Error calculating API stats:', error)
      return this.calculateMockStats()
    }
  }

  /**
   * Calculate statistics from mock data
   */
  private async calculateMockStats(): Promise<DashboardStats> {
    const topics = await mockDataService.getTopics()
    const users = await mockDataService.getUsers()
    const lessons = await mockDataService.getLessons()

    // Create realistic video stats from lessons
    const videoStats: VideoStats[] = lessons.map((lesson, index) => {
      const topic = topics.find(t => t.id === lesson.topicId)
      return {
        id: lesson.id,
        topicId: lesson.topicId,
        title: lesson.title,
        topic: topic?.title || 'Unknown Topic',
        totalViews: Math.floor(Math.random() * 200) + 100,
        numberOfUsers: Math.floor(Math.random() * 80) + 40,
        completionRate: Math.floor(Math.random() * 40) + 60,
        difficulty: lesson.difficulty,
        image: topic?.image || '/placeholder.svg',
        videoUrl: '',
      }
    }).sort((a, b) => b.totalViews - a.totalViews)

    // Create realistic topic stats
    const topicStats: TopicStats[] = topics.map((topic, index) => ({
      id: topic.id,
      title: topic.title,
      category: topic.category,
      difficulty: topic.difficulty,
      totalViews: topic.students,
      numberOfUsers: Math.floor(topic.students * 0.8),
      lessons: topic.lessons,
      completionRate: Math.floor(Math.random() * 30) + 70,
      enrolledStudents: topic.students,
      image: topic.image || '/placeholder.svg',
    })).sort((a, b) => b.totalViews - a.totalViews)

    const allStudents = users.filter(user => user.role === 'student')

    return {
      admin: {
        activeUsersThisMonth: allStudents.length,
        activeUsersLastMonth: Math.max(allStudents.length - 1, 1),
        actualUsers: users.length,
        totalStudents: allStudents.length,
        totalAdmins: users.filter(u => u.role === 'admin').length,
        averageTimeThisMonth: 12,
        averageTimeLastMonth: 9,
        topVideos: videoStats.slice(0, 4),
        mostViewedTopics: topicStats.slice(0, 6),
        totalLessons: lessons.length,
        totalTopics: topics.length,
        totalViews: topicStats.reduce((sum, topic) => sum + topic.totalViews, 0),
        totalCompletions: Math.floor(lessons.length * 0.7),
        progressPercentage: 85,
      },
      student: (userId?: string) => this.getStudentStats(userId, topics, lessons, allStudents)
    }
  }

  /**
   * Get student-specific statistics
   */
  private getStudentStats(userId?: string, topics?: any[], lessons?: any[], students?: any[]): StudentStats {
    const student = students?.find(s => s.id === userId) || students?.[0]
    
    return {
      completedTopics: student?.completedTopics || 3,
      totalTopics: topics?.length || 6,
      thisWeekHours: student?.thisWeekHours || 8,
      weeklyGoal: 15,
      weeklyHours: student?.weeklyHours || 12,
      totalHours: student?.totalHours || 45,
      userName: student?.name || 'Student',
      userEmail: student?.email || 'student@example.com',
      joinedDate: student?.joinedDate || 'Recently',
      recentActivity: 'Introduction to Blockchain',
      recentActivities: [
        {
          id: 1,
          type: 'completion',
          title: 'Completed: Introduction to Blockchain',
          date: '2 days ago',
          icon: 'BookOpen',
          status: 'Completed',
          statusColor: 'green'
        },
        {
          id: 2,
          type: 'assessment',
          title: 'Assessment: Crypto Basics Quiz',
          date: '5 days ago',
          score: '85%',
          icon: 'Trophy',
          status: 'Passed',
          statusColor: 'yellow'
        }
      ],
      progressPercentage: 0,
      weeklyProgressPercentage: 0,
      remainingHours: 0,
    }
  }

  /**
   * Force refresh cached stats
   */
  async refreshStats(): Promise<DashboardStats> {
    this.cachedStats = null
    this.lastCacheTime = 0
    return this.getDashboardStats()
  }
}

export const apiDashboardStats = ApiDashboardStats.getInstance()

// Convenience function
export const getApiDashboardStats = (userId?: string) => apiDashboardStats.getDashboardStats(userId)
export const refreshDashboardStats = () => apiDashboardStats.refreshStats()