import { DEMO_CONFIG, APP_CONFIG, SOCIAL_MEDIA, SUBJECT_AREAS, DEFAULT_VALUES } from './constants'

// Demo Users Configuration
export const getDemoUsers = () => [
  {
    id: "1",
    email: DEMO_CONFIG.adminEmail,
    password: DEMO_CONFIG.adminPassword,
    name: "Admin User",
    firstName: "Admin",
    lastName: "User",
    role: "admin" as const
  },
  {
    id: "2", 
    email: DEMO_CONFIG.studentEmail,
    password: DEMO_CONFIG.studentPassword,
    name: "Student User",
    firstName: "Student",
    lastName: "User", 
    role: "student" as const
  },
  {
    id: "3",
    email: "learner@lms.com", 
    password: "learner123",
    name: "Alex Johnson",
    firstName: "Alex",
    lastName: "Johnson",
    role: "student" as const
  }
]

// Demo Topics Configuration
export const getDemoTopics = () => [
  {
    id: 1,
    title: "Introduction to Technology",
    category: SUBJECT_AREAS.default,
    status: "Published" as const,
    students: 245,
    lessons: 8,
    createdAt: new Date(2024, 0, 15).toISOString(),
    hasAssessment: true,
    difficulty: "Beginner" as const,
    description: "Learn the fundamentals of modern technology, including core concepts and practical applications.",
    image: APP_CONFIG.placeholderImageUrl,
  },
  {
    id: 2,
    title: "Advanced Programming Concepts",
    category: "Programming",
    status: "Published" as const,
    students: 156,
    lessons: 12,
    createdAt: new Date(2024, 0, 20).toISOString(),
    hasAssessment: true,
    difficulty: "Advanced" as const,
    description: "Master advanced programming techniques and design patterns for professional development.",
    image: APP_CONFIG.placeholderImageUrl,
  },
  {
    id: 3,
    title: "Digital Marketing Fundamentals",
    category: "Marketing",
    status: "Published" as const,
    students: 89,
    lessons: 6,
    createdAt: new Date(2024, 1, 1).toISOString(),
    hasAssessment: true,
    difficulty: "Intermediate" as const,
    description: "Understand digital marketing strategies, analytics, and best practices for online success.",
    image: APP_CONFIG.placeholderImageUrl,
  },
  {
    id: 4,
    title: "Business Strategy Essentials",
    category: "Business",
    status: "Draft" as const,
    students: 0,
    lessons: 0,
    createdAt: new Date(2024, 1, 10).toISOString(),
    hasAssessment: false,
    difficulty: "Intermediate" as const,
    description: "Learn key business strategy concepts and frameworks for organizational success.",
    image: APP_CONFIG.placeholderImageUrl,
  },
  {
    id: 5,
    title: "UI/UX Design Principles",
    category: "Design",
    status: "Published" as const,
    students: 178,
    lessons: 10,
    createdAt: new Date(2024, 1, 15).toISOString(),
    hasAssessment: true,
    difficulty: "Intermediate" as const,
    description: "Master user interface and user experience design principles for digital products.",
    image: APP_CONFIG.placeholderImageUrl,
  },
]

// Demo Lesson Templates
export const getDemoLessons = () => [
  {
    title: "Introduction to {subject}",
    description: "Learn the fundamentals of {subject} and how it applies to modern practices.",
    duration: "15 minutes",
    difficulty: "Beginner" as const,
    content: "This lesson covers the basic concepts and terminology you need to understand {subject}.",
    socialLinks: {
      discord: SOCIAL_MEDIA.discord,
      youtube: SOCIAL_MEDIA.youtube,
      twitter: SOCIAL_MEDIA.twitter,
    },
    downloads: [
      { id: 1, name: "Course Guide.pdf", size: "2.5 MB", url: "/downloads/guide.pdf" },
      { id: 2, name: "Quick Reference.pdf", size: "1.2 MB", url: "/downloads/reference.pdf" },
    ],
  },
  {
    title: "Practical Applications",
    description: "Explore real-world applications and use cases of {subject}.",
    duration: "20 minutes",
    difficulty: "Intermediate" as const,
    content: "This lesson demonstrates how {subject} concepts are applied in practical scenarios.",
    socialLinks: {
      discord: SOCIAL_MEDIA.discord,
      youtube: SOCIAL_MEDIA.youtube,
    },
    downloads: [
      { id: 3, name: "Case Studies.pdf", size: "3.1 MB", url: "/downloads/cases.pdf" },
    ],
  },
]

// Demo Assessment Questions Templates
export const getDemoQuestions = () => [
  {
    id: 1,
    type: "multiple-choice" as const,
    question: "What is the primary purpose of this subject area?",
    options: ["Entertainment", "Education and practical application", "Gaming", "Social media"],
    correctAnswer: 1,
  },
  {
    id: 2,
    type: "true-false" as const,
    question: "This subject area requires continuous learning and practice.",
    correctAnswer: "true",
  },
  {
    id: 3,
    type: "multiple-choice" as const,
    question: "Which of the following is a key benefit of learning this subject?",
    options: ["Improved problem-solving skills", "Better entertainment", "More social connections", "Faster internet"],
    correctAnswer: 0,
  },
]



// Demo User Profiles
export const getDemoUserProfiles = () => [
  {
    id: "1",
    bio: "Experienced administrator passionate about education technology and creating engaging learning experiences.",
    location: "San Francisco, CA",
    website: "https://education-tech.com",
    linkedin: "linkedin.com/in/admin-user",
    phone: "+1 (555) 123-4567",
    joinedDate: new Date(2023, 5, 1).toISOString(),
  },
  {
    id: "2",
    bio: "Dedicated learner exploring new technologies and expanding knowledge in various fields.",
    location: "New York, NY",
    website: "https://learning-journey.com",
    twitter: "@student_learner",
    phone: "+1 (555) 987-6543",
    joinedDate: new Date(2024, 0, 15).toISOString(),
  },
  {
    id: "3",
    bio: "Technology enthusiast with a passion for continuous learning and professional development.",
    location: "Austin, TX",
    website: "https://alexjohnson.dev",
    linkedin: "linkedin.com/in/alex-johnson-dev",
    twitter: "@alex_learns",
    phone: "+1 (555) 456-7890",
    joinedDate: new Date(2024, 1, 1).toISOString(),
  },
]

// External Courses Template
export const getExternalCoursesTemplate = () => [
  {
    course: "Professional Development Certificate",
    location: "Online Platform",
    monthYear: "March 2024",
  },
  {
    course: "Industry Best Practices Workshop",
    location: "Conference Center",
    monthYear: "January 2024",
  },
  {
    course: "Advanced Skills Training",
    location: "Training Institute",
    monthYear: "November 2023",
  },
]

// Helper function to replace placeholders in text
export const replacePlaceholders = (text: string, replacements: Record<string, string> = {}) => {
  let result = text
  for (const [key, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(`{${key}}`, 'g'), value)
  }
  return result
}

// Helper function to generate avatar URL
export const generateAvatarUrl = (name: string) => {
  return APP_CONFIG.defaultAvatarUrl.replace('{name}', encodeURIComponent(name))
}

// Helper function to check if demo mode is enabled
export const isDemoMode = () => DEMO_CONFIG.enabled 