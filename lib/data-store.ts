// Types for the LMS system
// This file contains only type definitions - no hardcoded data

export interface Topic {
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

export interface Lesson {
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

export interface LessonCompletion {
  id: string
  userId: string
  lessonId: number
  topicId: number
  completedAt: string
  timeSpent?: number
}

export interface LessonView {
  id: string
  userId: string
  lessonId: number
  topicId: number
  viewedAt: string
  duration?: number
}

export interface Assessment {
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

export interface AssessmentAttempt {
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

export interface Question {
  id: number
  type: "true-false" | "multiple-choice"
  question: string
  options?: string[]
  correctAnswer: string | number
  image?: string
}

export interface User {
  id: string
  username: string
  email: string
  password: string
  role: "admin" | "student" | "teacher"
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

export interface AssessmentHistory {
  id: string
  assessmentId: number
  userId: string
  score: number
  completedAt: string
  timeSpent: number
  totalQuestions: number
  correctAnswers: number
}

// Export empty objects for backward compatibility
export const dataStore = {
  getTopics: () => [],
  getUsers: () => [],
  getLessons: () => [],
  getAssessments: () => [],
}

export const getDashboardStats = () => ({
  admin: {
    totalUsers: 0,
    totalTopics: 0,
    totalLessons: 0,
    totalAssessments: 0,
  }
})