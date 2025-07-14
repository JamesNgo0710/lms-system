"use client"

import { useState, useEffect } from 'react'
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
    setTopics(data)
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

// Hook for Lessons
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
    const data = await apiDataStore.getLessons()
    setLessons(data)
    setLoading(false)
  }

  const getLessonById = (id: number) => {
    return lessons.find(lesson => lesson.id === id)
  }

  const getLessonsByTopic = async (topicId: number) => {
    return await apiDataStore.getLessonsByTopic(topicId)
  }

  const addLesson = async (lessonData: any) => {
    const newLesson = await apiDataStore.createLesson(lessonData)
    if (newLesson) {
      setLessons(prev => [...prev, newLesson])
    }
    return newLesson
  }

  const updateLesson = async (id: number, lessonData: any) => {
    const updatedLesson = await apiDataStore.updateLesson(id, lessonData)
    if (updatedLesson) {
      setLessons(prev => prev.map(lesson => 
        lesson.id === id ? updatedLesson : lesson
      ))
    }
    return updatedLesson
  }

  const deleteLesson = async (id: number) => {
    const success = await apiDataStore.deleteLesson(id)
    if (success) {
      setLessons(prev => prev.filter(lesson => lesson.id !== id))
    }
    return success
  }

  return {
    lessons,
    loading,
    getLessonById,
    getLessonsByTopic,
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
    setCompletions(data)
    setLoading(false)
  }

  const getUserLessonCompletions = (userId: string) => {
    return completions.filter(completion => completion.user_id === userId)
  }

  const markLessonComplete = async (lessonId: number, timeSpent?: number) => {
    const success = await apiDataStore.markLessonComplete(lessonId, timeSpent)
    if (success) {
      await loadCompletions() // Refresh the completions
    }
    return success
  }

  const markLessonIncomplete = async (lessonId: number) => {
    const success = await apiDataStore.markLessonIncomplete(lessonId)
    if (success) {
      await loadCompletions() // Refresh the completions
    }
    return success
  }

  const getTopicProgress = async (userId: string, topicId: number) => {
    return await apiDataStore.getTopicProgress(userId, topicId)
  }

  return {
    completions,
    loading,
    getUserLessonCompletions,
    markLessonComplete,
    markLessonIncomplete,
    getTopicProgress,
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

  return {
    attempts,
    loading,
    getUserAssessmentAttempts,
    getTopicAssessmentAttempts,
    submitAssessment,
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

  const getAssessmentByTopic = async (topicId: number) => {
    return await apiDataStore.getAssessmentByTopic(topicId)
  }

  return {
    assessments,
    loading,
    getAssessmentById,
    getAssessmentByTopic,
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

  const updateUser = async (id: string, userData: any) => {
    const updatedUser = await apiDataStore.updateUser(id, userData)
    if (updatedUser) {
      setUsers(prev => prev.map(user => 
        user.id === id ? updatedUser : user
      ))
    }
    return updatedUser
  }

  return {
    users,
    loading,
    getUserById,
    updateUser,
    refresh: loadUsers
  }
}