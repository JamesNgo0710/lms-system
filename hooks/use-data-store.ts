"use client"

import { useState, useEffect } from "react"
import { dataStore, type Topic, type Assessment, type AssessmentAttempt, type User, type Lesson, type LessonCompletion, type LessonView } from "@/lib/data-store"
import { syncManager } from "@/lib/sync-manager"

export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([])

  useEffect(() => {
    setTopics(dataStore.getTopics())

    const unsubscribe = dataStore.subscribe(() => {
      setTopics(dataStore.getTopics())
    })

    return unsubscribe
  }, [])

  return {
    topics,
    addTopic: dataStore.addTopic.bind(dataStore),
    updateTopic: dataStore.updateTopic.bind(dataStore),
    deleteTopic: dataStore.deleteTopic.bind(dataStore),
    getTopicById: dataStore.getTopicById.bind(dataStore),
    getTopicStudentCount: dataStore.getTopicStudentCount.bind(dataStore),
    getTopicStudentDetails: dataStore.getTopicStudentDetails.bind(dataStore),
  }
}

export function useAssessments() {
  const [assessments, setAssessments] = useState<Assessment[]>([])

  useEffect(() => {
    setAssessments(dataStore.getAssessments())

    const unsubscribe = dataStore.subscribe(() => {
      setAssessments(dataStore.getAssessments())
    })

    return unsubscribe
  }, [])

  return {
    assessments,
    addAssessment: dataStore.addAssessment.bind(dataStore),
    updateAssessment: dataStore.updateAssessment.bind(dataStore),
    deleteAssessment: dataStore.deleteAssessment.bind(dataStore),
    getAssessmentByTopicId: dataStore.getAssessmentByTopicId.bind(dataStore),
    updateAssessmentCooldown: dataStore.updateAssessmentCooldown.bind(dataStore),
    formatCooldownPeriod: dataStore.formatCooldownPeriod.bind(dataStore),
  }
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    setUsers(dataStore.getUsers())

    const unsubscribe = dataStore.subscribe(() => {
      setUsers(dataStore.getUsers())
    })

    return unsubscribe
  }, [])

  return {
    users,
    addUser: dataStore.addUser.bind(dataStore),
    updateUser: dataStore.updateUser.bind(dataStore),
    deleteUser: dataStore.deleteUser.bind(dataStore),
  }
}

export function useLessons() {
  const [lessons, setLessons] = useState<Lesson[]>([])

  useEffect(() => {
    setLessons(dataStore.getLessons())

    const unsubscribe = dataStore.subscribe(() => {
      setLessons(dataStore.getLessons())
    })

    return unsubscribe
  }, [])

  return {
    lessons,
    addLesson: dataStore.addLesson.bind(dataStore),
    updateLesson: dataStore.updateLesson.bind(dataStore),
    deleteLesson: dataStore.deleteLesson.bind(dataStore),
    getLessonById: dataStore.getLessonById.bind(dataStore),
    getLessonsByTopicId: dataStore.getLessonsByTopicId.bind(dataStore),
  }
}

export function useLessonCompletions() {
  const [completions, setCompletions] = useState<LessonCompletion[]>([])

  useEffect(() => {
    setCompletions(dataStore.getLessonCompletions())

    const unsubscribe = dataStore.subscribe(() => {
      setCompletions(dataStore.getLessonCompletions())
    })

    return unsubscribe
  }, [])

  return {
    completions,
    getUserLessonCompletions: dataStore.getUserLessonCompletions.bind(dataStore),
    getTopicCompletions: dataStore.getTopicCompletions.bind(dataStore),
    isLessonCompleted: dataStore.isLessonCompleted.bind(dataStore),
    markLessonComplete: dataStore.markLessonComplete.bind(dataStore),
    markLessonIncomplete: dataStore.markLessonIncomplete.bind(dataStore),
    getTopicProgress: dataStore.getTopicProgress.bind(dataStore),
    trackLessonView: dataStore.trackLessonView.bind(dataStore),
  }
}

export function useLessonViews() {
  const [views, setViews] = useState<LessonView[]>([])

  useEffect(() => {
    setViews(dataStore.getLessonViews())

    const unsubscribe = dataStore.subscribe(() => {
      setViews(dataStore.getLessonViews())
    })

    return unsubscribe
  }, [])

  return {
    views,
    getUserLessonViews: dataStore.getUserLessonViews.bind(dataStore),
    getLessonViewsByLessonId: dataStore.getLessonViewsByLessonId.bind(dataStore),
    trackLessonView: dataStore.trackLessonView.bind(dataStore),
  }
}

export function useAssessmentAttempts() {
  const [attempts, setAttempts] = useState<AssessmentAttempt[]>([])

  useEffect(() => {
    setAttempts(dataStore.getAssessmentAttempts())

    const unsubscribe = dataStore.subscribe(() => {
      setAttempts(dataStore.getAssessmentAttempts())
    })

    return unsubscribe
  }, [])

  return {
    attempts,
    getUserAssessmentAttempts: dataStore.getUserAssessmentAttempts.bind(dataStore),
    getTopicAssessmentAttempts: dataStore.getTopicAssessmentAttempts.bind(dataStore),
    getLastAssessmentAttempt: dataStore.getLastAssessmentAttempt.bind(dataStore),
    canTakeAssessment: dataStore.canTakeAssessment.bind(dataStore),
    addAssessmentAttempt: dataStore.addAssessmentAttempt.bind(dataStore),
  }
}

// Hook for sync management
export function useSync() {
  const [syncStatus, setSyncStatus] = useState(syncManager.getSyncStatus())

  useEffect(() => {
    const interval = setInterval(() => {
      setSyncStatus(syncManager.getSyncStatus())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return {
    syncStatus,
    setCurrentUser: dataStore.setCurrentUser.bind(dataStore),
    getSyncStatus: syncManager.getSyncStatus.bind(syncManager),
  }
}
