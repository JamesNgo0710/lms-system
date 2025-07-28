"use client"

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { apiDataStore } from '@/lib/api-data-store'

// Hook for Topics
export function useTopics() {
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      loadTopics()
    }
  }, [session])

  const loadTopics = async () => {
    setLoading(true)
    const data = await apiDataStore.getTopics()
    // Normalize topic data to ensure consistent structure
    const normalizedTopics = data.filter(topic => topic && typeof topic === 'object' && topic.id).map(topic => ({
      ...topic,
      // Ensure all required fields are strings
      title: String(topic.title || ''),
      description: String(topic.description || ''),
      category: String(topic.category || ''),
      difficulty: String(topic.difficulty || 'Beginner'),
      status: String(topic.status || 'Draft'),
    }))
    setTopics(normalizedTopics)
    setLoading(false)
  }

  const getTopicById = (id: number) => {
    return topics.find(topic => topic.id === id)
  }

  const addTopic = async (topicData: any) => {
    const newTopic = await apiDataStore.createTopic(topicData)
    if (newTopic) {
      setTopics(prev => [...prev, newTopic])
    }
    return newTopic
  }

  const updateTopic = async (id: number, topicData: any) => {
    const updatedTopic = await apiDataStore.updateTopic(id, topicData)
    if (updatedTopic) {
      setTopics(prev => prev.map(topic => 
        topic.id === id ? updatedTopic : topic
      ))
    }
    return updatedTopic
  }

  const deleteTopic = async (id: number) => {
    const success = await apiDataStore.deleteTopic(id)
    if (success) {
      setTopics(prev => prev.filter(topic => topic.id !== id))
    }
    return success
  }

  return {
    topics,
    loading,
    getTopicById,
    addTopic,
    updateTopic,
    deleteTopic,
    refresh: loadTopics
  }
}

// Hook for Lessons - RESTORED WITH COMPREHENSIVE NORMALIZATION
export function useLessons() {
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      loadLessons()
    }
  }, [session])

  const loadLessons = async () => {
    setLoading(true)
    // console.log('🔄 loadLessons called - COMPREHENSIVE NORMALIZATION')
    try {
      const data = await apiDataStore.getLessons()
      // console.log('📦 Raw lesson data from API - count:', data.length)
      
      // BULLETPROOF NORMALIZATION - Completely eliminate snake_case properties
      const bulletproofLessons = data
        .filter(lesson => lesson && typeof lesson === 'object' && lesson.id)
        .map(lesson => {
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
          
          // CRITICAL: Verify NO snake_case properties exist
          const hasSnakeCase = Object.keys(bulletproofLesson).some(key => key.includes('_'))
          if (hasSnakeCase) {
            // console.error('🚨 CRITICAL: snake_case property found in normalized lesson:', bulletproofLesson)
          }
          
          return bulletproofLesson
        })
      
      // console.log('✅ Bulletproof lessons created - count:', bulletproofLessons.length)
      setLessons(bulletproofLessons)
    } catch (error) {
      // console.error('Error loading lessons:', error)
      setLessons([])
    }
    setLoading(false)
  }

  const getLessonById = (id: number) => {
    const lesson = lessons.find(lesson => lesson.id === id)
    if (!lesson || typeof lesson !== 'object' || !lesson.id) {
      // console.error('Invalid lesson in getLessonById:', { id: lesson?.id, title: lesson?.title, hasSnakeCase: !!(lesson?.topic_id || lesson?.video_url) })
      return null
    }
    
    // Return a clean object even from getId to be absolutely sure
    return {
      id: lesson.id,
      topicId: lesson.topicId,
      title: String(lesson.title || ''),
      description: String(lesson.description || ''),
      difficulty: String(lesson.difficulty || 'Beginner'),
      duration: String(lesson.duration || '15 min'),
      status: String(lesson.status || 'Draft'),
      content: String(lesson.content || ''),
      videoUrl: lesson.videoUrl || '',
      socialLinks: lesson.socialLinks || {},
      prerequisites: Array.isArray(lesson.prerequisites) ? lesson.prerequisites : [],
      downloads: Array.isArray(lesson.downloads) ? lesson.downloads : [],
      order: lesson.order || 0,
      image: lesson.image || '',
      createdAt: lesson.createdAt || '',
      updatedAt: lesson.updatedAt || ''
    }
  }

  // Removed getLessonsByTopic as it returns raw backend data
  // Use getLessonsByTopicId instead which returns normalized data

  const getLessonsByTopicId = (topicId: number) => {
    // console.log('🔍 getLessonsByTopicId called with topicId:', topicId)
    // console.log('🔍 Current lessons count:', lessons.length)
    
    const filtered = lessons.filter(lesson => lesson.topicId === topicId)
    // console.log('🔍 Filtered lessons count:', filtered.length)
    
    return filtered.map(lesson => {
      // Double-check that we return a clean object
      if (!lesson || typeof lesson !== 'object' || !lesson.id) {
        // console.error('Invalid lesson in getLessonsByTopicId:', { id: lesson?.id, title: lesson?.title, hasSnakeCase: !!(lesson?.topic_id || lesson?.video_url) })
        return null
      }
      
      // Check if this lesson has snake_case properties - if so, DO NOT return it
      if (lesson.topic_id || lesson.video_url || lesson.social_links || lesson.created_at || lesson.updated_at) {
        // console.error('🚨 FOUND LESSON WITH SNAKE_CASE IN getLessonsByTopicId - FILTERING OUT:', { id: lesson?.id, title: lesson?.title, snakeCaseFieldCount: Object.keys(lesson).filter(key => key.includes('_')).length })
        return null // Return null to filter out non-normalized lessons
      }
      
      // Return an even cleaner object to be absolutely sure
      return {
        id: lesson.id,
        topicId: lesson.topicId,
        title: String(lesson.title || ''),
        description: String(lesson.description || ''),
        difficulty: String(lesson.difficulty || 'Beginner'),
        duration: String(lesson.duration || '15 min'),
        status: String(lesson.status || 'Draft'),
        content: String(lesson.content || ''),
        videoUrl: lesson.videoUrl || '',
        socialLinks: lesson.socialLinks || {},
        prerequisites: Array.isArray(lesson.prerequisites) ? lesson.prerequisites : [],
        downloads: Array.isArray(lesson.downloads) ? lesson.downloads : [],
        order: lesson.order || 0,
        image: lesson.image || '',
        createdAt: lesson.createdAt || '',
        updatedAt: lesson.updatedAt || ''
      }
    }).filter(lesson => lesson !== null && lesson.topicId) // Remove null entries and ensure topicId exists
  }

  const addLesson = async (lessonData: any) => {
    try {
      const newLesson = await apiDataStore.createLesson(lessonData)
      if (newLesson) {
        // Create a clean object with only the necessary fields
        const cleanLesson = {
          id: newLesson.id,
          topicId: newLesson.topic_id || newLesson.topicId,
          videoUrl: newLesson.video_url || newLesson.videoUrl,
          socialLinks: newLesson.social_links || newLesson.socialLinks || {},
          prerequisites: Array.isArray(newLesson.prerequisites) ? newLesson.prerequisites : [],
          downloads: Array.isArray(newLesson.downloads) ? newLesson.downloads : [],
          createdAt: newLesson.created_at || newLesson.createdAt,
          updatedAt: newLesson.updated_at || newLesson.updatedAt,
          order: newLesson.order || 0,
          image: newLesson.image || '',
          // Ensure all required fields are strings
          title: String(newLesson.title || ''),
          description: String(newLesson.description || ''),
          difficulty: String(newLesson.difficulty || 'Beginner'),
          duration: String(newLesson.duration || '15 min'),
          status: String(newLesson.status || 'Draft'),
          content: String(newLesson.content || ''),
        }
        
        setLessons(prev => [...prev, cleanLesson])
        return cleanLesson
      }
      return newLesson
    } catch (error) {
      // console.error('Error creating lesson:', error)
      return null
    }
  }

  const updateLesson = async (id: number, lessonData: any) => {
    try {
      const updatedLesson = await apiDataStore.updateLesson(id, lessonData)
      if (updatedLesson) {
        // Create a clean object with only the necessary fields
        const cleanLesson = {
          id: updatedLesson.id,
          topicId: updatedLesson.topic_id || updatedLesson.topicId,
          videoUrl: updatedLesson.video_url || updatedLesson.videoUrl,
          socialLinks: updatedLesson.social_links || updatedLesson.socialLinks || {},
          prerequisites: Array.isArray(updatedLesson.prerequisites) ? updatedLesson.prerequisites : [],
          downloads: Array.isArray(updatedLesson.downloads) ? updatedLesson.downloads : [],
          createdAt: updatedLesson.created_at || updatedLesson.createdAt,
          updatedAt: updatedLesson.updated_at || updatedLesson.updatedAt,
          order: updatedLesson.order || 0,
          image: updatedLesson.image || '',
          // Ensure all required fields are strings
          title: String(updatedLesson.title || ''),
          description: String(updatedLesson.description || ''),
          difficulty: String(updatedLesson.difficulty || 'Beginner'),
          duration: String(updatedLesson.duration || '15 min'),
          status: String(updatedLesson.status || 'Draft'),
          content: String(updatedLesson.content || ''),
        }
        
        setLessons(prev => prev.map(lesson => 
          lesson.id === id ? cleanLesson : lesson
        ))
        return cleanLesson
      }
      return updatedLesson
    } catch (error) {
      // console.error('Error updating lesson:', error)
      return null
    }
  }

  const deleteLesson = async (id: number) => {
    const success = await apiDataStore.deleteLesson(id)
    if (success) {
      setLessons(prev => prev.filter(lesson => lesson.id !== id))
    }
    return success
  }

  // Debug current lessons state - temporarily removed for debugging
  // console.log('🔍 Current lessons state:', lessons)
  
  // Check if any lessons have snake_case properties - this is the error we're trying to fix
  const badLessons = lessons.filter(lesson => 
    lesson && (lesson.topic_id || lesson.video_url || lesson.social_links || lesson.created_at || lesson.updated_at)
  )
  
  if (badLessons.length > 0) {
    // console.error('🚨 FOUND LESSONS WITH SNAKE_CASE PROPERTIES IN STATE:', badLessons.map(lesson => ({
    //   id: lesson?.id,
    //   title: lesson?.title,
    //   snakeCaseFields: Object.keys(lesson).filter(key => key.includes('_'))
    // })))
  }

  // Filter out any lessons with snake_case properties completely to prevent React error #31
  const safeLessons = lessons.filter(lesson => {
    if (!lesson || typeof lesson !== 'object' || !lesson.id) return false
    
    // Reject any lesson that still has snake_case properties
    const hasSnakeCase = lesson.topic_id || lesson.video_url || lesson.social_links || lesson.created_at || lesson.updated_at
    if (hasSnakeCase) {
      // Do not include lessons with snake_case properties
      return false
    }
    
    return true
  })

  // Return bulletproof normalized data
  return {
    lessons: lessons, // Only bulletproof normalized lessons
    loading,
    getLessonById: (id: number) => {
      const lesson = getLessonById(id)
      // Extra safety check
      if (lesson && Object.keys(lesson).some(key => key.includes('_'))) {
        // console.error('🚨 BLOCKED: snake_case lesson from getLessonById')
        return null
      }
      return lesson
    },
    getLessonsByTopicId: (topicId: number) => {
      const lessons = getLessonsByTopicId(topicId)
      // Extra safety check
      return lessons.filter(lesson => {
        if (lesson && Object.keys(lesson).some(key => key.includes('_'))) {
          // console.error('🚨 BLOCKED: snake_case lesson from getLessonsByTopicId')
          return false
        }
        return true
      })
    },
    addLesson,
    updateLesson,
    deleteLesson,
    refresh: loadLessons
  }
}

// Hook for Lesson Completions
export function useLessonCompletions() {
  const [completions, setCompletions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [progressCache, setProgressCache] = useState<Record<string, any>>({})
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.id) {
      loadCompletions()
    }
  }, [session?.user?.id])

  const loadCompletions = async () => {
    if (!session?.user?.id) return
    
    setLoading(true)
    const data = await apiDataStore.getUserLessonCompletions(session.user.id)
    console.log('🔄 loadCompletions: Raw data from API:', data)
    setCompletions(data)
    console.log('🔄 loadCompletions: Completions set to:', data)
    setLoading(false)
  }

  const getUserLessonCompletions = (userId: string) => {
    return completions.filter(completion => completion.user_id === userId)
  }

  const markLessonComplete = async (lessonId: number, timeSpent?: number) => {
    console.log('🔄 Hook: markLessonComplete called:', { lessonId, timeSpent })
    const success = await apiDataStore.markLessonComplete(lessonId, timeSpent)
    console.log('📡 Hook: API result:', success)
    
    if (success) {
      console.log('🔄 Hook: Refreshing completions...')
      await loadCompletions() // Refresh the completions
      console.log('✅ Hook: Completions refreshed')
    }
    return success
  }

  const markLessonIncomplete = async (lessonId: number) => {
    console.log('🔄 Hook: markLessonIncomplete called:', { lessonId })
    const success = await apiDataStore.markLessonIncomplete(lessonId)
    console.log('📡 Hook: API result:', success)
    
    if (success) {
      console.log('🔄 Hook: Refreshing completions...')
      await loadCompletions() // Refresh the completions
      console.log('✅ Hook: Completions refreshed')
    }
    return success
  }

  const getTopicProgress = (userId: string, topicId: number) => {
    const cacheKey = `${userId}-${topicId}`
    
    // Return cached progress if available
    if (progressCache[cacheKey]) {
      return progressCache[cacheKey]
    }
    
    // Calculate progress from completions synchronously
    const userCompletions = completions.filter(completion => 
      completion.user_id === userId && completion.topic_id === topicId
    )
    
    // For now, return a default progress structure
    // This will be updated when the async data loads
    const progress = {
      completed: userCompletions.length,
      total: 0, // Will be updated when lessons load
      percentage: 0
    }
    
    // Cache the result
    setProgressCache(prev => ({
      ...prev,
      [cacheKey]: progress
    }))
    
    return progress
  }

  const getTopicProgressAsync = async (userId: string, topicId: number) => {
    return await apiDataStore.getTopicProgress(userId, topicId)
  }

  const isLessonCompleted = (userId: string, lessonId: number) => {
    console.log('🔍 isLessonCompleted input:', { userId, lessonId, userIdType: typeof userId, lessonIdType: typeof lessonId })
    console.log('🔍 All completions:', completions)
    
    const isCompleted = completions.some(completion => {
      const userMatch = completion.user_id === userId
      const lessonMatch = completion.lesson_id === lessonId
      const isComplete = completion.is_completed
      
      console.log('🔍 Checking completion:', { 
        completion, 
        userMatch: `${completion.user_id} === ${userId} = ${userMatch}`, 
        lessonMatch: `${completion.lesson_id} === ${lessonId} = ${lessonMatch}`,
        isComplete 
      })
      
      return userMatch && lessonMatch && isComplete
    })
    
    console.log('🔍 Final result:', isCompleted)
    return isCompleted
  }

  return {
    completions,
    loading,
    getUserLessonCompletions,
    markLessonComplete,
    markLessonIncomplete,
    getTopicProgress,
    getTopicProgressAsync,
    isLessonCompleted,
    trackLessonView: apiDataStore.trackLessonView.bind(apiDataStore),
    refresh: loadCompletions
  }
}

// Hook for Lesson Views
export function useLessonViews() {
  const [views, setViews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.id) {
      loadViews()
    }
  }, [session?.user?.id])

  const loadViews = async () => {
    if (!session?.user?.id) return
    
    setLoading(true)
    const data = await apiDataStore.getUserLessonViews(session.user.id)
    setViews(data)
    setLoading(false)
  }

  const getUserLessonViews = (userId: string) => {
    return views.filter(view => view.user_id === userId)
  }

  const trackLessonView = async (lessonId: number, duration?: number) => {
    const success = await apiDataStore.trackLessonView(lessonId, duration)
    if (success) {
      await loadViews() // Refresh the views
    }
    return success
  }

  return {
    views,
    loading,
    getUserLessonViews,
    trackLessonView,
    refresh: loadViews
  }
}

// Hook for Assessment Attempts
export function useAssessmentAttempts() {
  const [attempts, setAttempts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.id) {
      loadAttempts()
    }
  }, [session?.user?.id])

  const loadAttempts = async () => {
    if (!session?.user?.id) return
    
    setLoading(true)
    const data = await apiDataStore.getUserAssessmentAttempts(session.user.id)
    setAttempts(data)
    setLoading(false)
  }

  const getUserAssessmentAttempts = (userId: string) => {
    return attempts.filter(attempt => attempt.user_id === userId)
  }

  const getTopicAssessmentAttempts = (userId: string, topicId: number) => {
    return attempts.filter(attempt => 
      attempt.user_id === userId && attempt.topic_id === topicId
    )
  }

  const submitAssessment = async (assessmentId: number, answers: (string | number)[], timeSpent: number) => {
    const result = await apiDataStore.submitAssessment(assessmentId, answers, timeSpent)
    if (result) {
      await loadAttempts() // Refresh the attempts
    }
    return result
  }

  const addAssessmentAttempt = async (attempt: any) => {
    // This function maintains compatibility with localStorage version
    const result = await submitAssessment(attempt.assessmentId, attempt.answers, attempt.timeSpent)
    return result
  }

  const getLastAssessmentAttempt = (userId: string, topicId: number) => {
    const userAttempts = getTopicAssessmentAttempts(userId, topicId)
    return userAttempts.length > 0 ? userAttempts[userAttempts.length - 1] : null
  }

  const canTakeAssessment = (userId: string, assessmentId: number) => {
    // Find the assessment from attempts data - we don't have direct access to assessments here
    const userAssessmentAttempts = attempts.filter(a => a.assessmentId === assessmentId && a.userId === userId)
    if (userAssessmentAttempts.length === 0) return { canTake: true, message: "" }
    
    // Get the most recent attempt
    const lastAttempt = userAssessmentAttempts.sort((a, b) => 
      new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )[0]
    
    // For now, allow retaking after 1 hour
    const lastAttemptTime = new Date(lastAttempt.completedAt)
    const now = new Date()
    const hoursSinceLastAttempt = (now.getTime() - lastAttemptTime.getTime()) / (1000 * 60 * 60)
    const canTake = hoursSinceLastAttempt >= 1
    
    return {
      canTake,
      message: canTake ? "" : `You can retake this assessment in ${Math.ceil(1 - hoursSinceLastAttempt)} hour(s)`,
      timeRemaining: canTake ? 0 : Math.ceil(1 - hoursSinceLastAttempt) * 60 // in minutes
    }
  }

  return {
    attempts,
    loading,
    getUserAssessmentAttempts,
    getTopicAssessmentAttempts,
    submitAssessment,
    addAssessmentAttempt, // Backward compatibility
    getLastAssessmentAttempt, // Missing function
    canTakeAssessment, // Missing function
    refresh: loadAttempts
  }
}

// Hook for Assessments
export function useAssessments() {
  const [assessments, setAssessments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      loadAssessments()
    }
  }, [session])

  const loadAssessments = async () => {
    setLoading(true)
    const data = await apiDataStore.getAssessments()
    setAssessments(data)
    setLoading(false)
  }

  const getAssessmentById = (id: number) => {
    return assessments.find(assessment => assessment.id === id)
  }

  const getAssessmentByTopic = (topicId: number) => {
    return assessments.find(assessment => assessment.topic_id === topicId)
  }

  const getAssessmentByTopicAsync = async (topicId: number) => {
    return await apiDataStore.getAssessmentByTopic(topicId)
  }

  const getAssessmentByTopicId = getAssessmentByTopic // Alias for backward compatibility

  const createAssessment = async (assessmentData: any) => {
    const newAssessment = await apiDataStore.createAssessment(assessmentData)
    if (newAssessment) {
      setAssessments(prev => [...prev, newAssessment])
    }
    return newAssessment
  }

  const updateAssessment = async (id: number, assessmentData: any) => {
    const updatedAssessment = await apiDataStore.updateAssessment(id, assessmentData)
    if (updatedAssessment) {
      setAssessments(prev => prev.map(assessment => 
        assessment.id === id ? updatedAssessment : assessment
      ))
    }
    return updatedAssessment
  }

  const deleteAssessment = async (id: number) => {
    const success = await apiDataStore.deleteAssessment(id)
    if (success) {
      setAssessments(prev => prev.filter(assessment => assessment.id !== id))
    }
    return success
  }

  const addAssessment = createAssessment // Alias for backward compatibility
  
  const getRecentAssessmentHistory = (limit = 10) => {
    // For now, return recent assessments as assessment history
    // TODO: Implement proper assessment history tracking via API
    return assessments
      .sort((a, b) => new Date(b.createdAt || b.created_at || 0).getTime() - new Date(a.createdAt || a.created_at || 0).getTime())
      .slice(0, limit)
      .map((assessment, index) => ({
        id: `history-${assessment.id}-${index}`,
        topicId: assessment.topicId || assessment.topic_id,
        topicTitle: assessment.title || `Assessment ${assessment.id}`,
        action: 'created',
        actionBy: assessment.createdBy || 'System',
        actionByName: assessment.createdByName || 'System',
        timestamp: assessment.createdAt || assessment.created_at || new Date().toISOString(),
        details: `Assessment for topic ${assessment.topicId || assessment.topic_id}`
      }))
  }

  return {
    assessments,
    loading,
    getAssessmentById,
    getAssessmentByTopic,
    getAssessmentByTopicAsync,
    getAssessmentByTopicId, // Backward compatibility alias
    createAssessment,
    addAssessment, // Backward compatibility alias
    updateAssessment,
    deleteAssessment,
    getRecentAssessmentHistory,
    refresh: loadAssessments
  }
}

// Hook for Users
export function useUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    if (session) {
      loadUsers()
    }
  }, [session])

  const loadUsers = async () => {
    setLoading(true)
    const data = await apiDataStore.getUsers()
    setUsers(data)
    setLoading(false)
  }

  const getUserById = (id: string) => {
    return users.find(user => user.id === id)
  }

  const addUser = async (userData: any) => {
    const newUser = await apiDataStore.createUser(userData)
    if (newUser) {
      setUsers(prev => [...prev, newUser])
    }
    return newUser
  }

  const updateUser = async (id: string, userData: any) => {
    const updatedUser = await apiDataStore.updateUser(id, userData)
    if (updatedUser) {
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ))
    }
    return updatedUser
  }

  const deleteUser = async (id: string) => {
    const success = await apiDataStore.deleteUser(id)
    if (success) {
      setUsers(prev => prev.filter(user => user.id !== id))
    }
    return success
  }

  const syncUsersFromAPI = async () => {
    await loadUsers()
  }

  return {
    users,
    loading,
    getUserById,
    addUser,
    updateUser,
    deleteUser,
    syncUsersFromAPI,
    refresh: loadUsers
  }
}

// Hook for sync management (simplified for API-based approach)
export function useSync() {
  const { data: session } = useSession()
  const [syncStatus, setSyncStatus] = useState(() => ({
    lastSync: new Date().toISOString(),
    status: 'synced' as 'syncing' | 'synced' | 'error',
    pendingChanges: 0,
    isPolling: true, // For API-based approach, we're always "connected"
    currentUser: null as string | null,
    currentVersion: '1.0.0',
    metadata: {
      updatedBy: 'System',
      lastUpdated: new Date().toISOString()
    }
  }))

  // Update sync status when session changes
  useEffect(() => {
    if (session?.user?.id) {
      setSyncStatus(prev => ({
        ...prev,
        currentUser: session.user.id,
        metadata: {
          updatedBy: session.user.name || 'System',
          lastUpdated: new Date().toISOString()
        }
      }))
    }
  }, [session?.user?.id, session?.user?.name])

  // For API-based approach, sync is handled automatically via API calls
  // This hook maintains compatibility with existing components
  
  const setCurrentUser = useCallback((user: any) => {
    // This is handled by session management in API approach - no-op for compatibility
    console.log('setCurrentUser called (handled by session):', user)
  }, [])

  const getSyncStatus = useCallback(() => {
    return syncStatus
  }, [syncStatus])

  return {
    syncStatus,
    setCurrentUser,
    getSyncStatus,
  }
}