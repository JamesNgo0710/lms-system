// Application Constants
export const APP_CONFIG = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Learning Management System",
  shortName: process.env.NEXT_PUBLIC_APP_SHORT_NAME || "LMS",
  description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Comprehensive LMS for professional education",
  themeColor: process.env.NEXT_PUBLIC_APP_THEME_COLOR || "#f97316",
  logoUrl: process.env.NEXT_PUBLIC_APP_LOGO_URL || "/nft-logo.png",
  defaultAvatarUrl: process.env.NEXT_PUBLIC_DEFAULT_AVATAR_URL || "https://ui-avatars.com/api/?name={name}&background=f97316&color=fff",
  placeholderImageUrl: process.env.NEXT_PUBLIC_PLACEHOLDER_IMAGE_URL || "https://via.placeholder.com/400x225/f97316/ffffff?text=LMS+Content",
}


// Social Media Templates
export const SOCIAL_MEDIA = {
  discord: process.env.NEXT_PUBLIC_SOCIAL_DISCORD_URL || "https://discord.gg/lms",
  youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE_URL || "https://youtube.com/@lms",
  twitter: process.env.NEXT_PUBLIC_SOCIAL_TWITTER_URL || "https://twitter.com/lms",
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM_URL || "https://instagram.com/lms",
}

// Storage Keys
export const STORAGE_KEYS = {
  prefix: process.env.NEXT_PUBLIC_STORAGE_PREFIX || "lms-data",
  topics: "topics",
  assessments: "assessments",
  users: "users",
  lessons: "lessons",
  completions: "lesson-completions",
  views: "lesson-views",
  attempts: "assessment-attempts",
  assessmentHistory: "assessment-history",
  metadata: "metadata",
}

// UI Constants
export const UI_TEXT = {
  welcomeMessage: "Continue your learning journey",
  loginDescription: "Sign in to your Learning Management System account",
  placeholderTexts: {
    email: "user@example.com",
    name: "Enter your full name",
    password: "Enter your password",
    search: "Search...",
    description: "Enter description...",
    url: "https://example.com",
    title: "Enter title...",
  },
}

// Default Values
export const DEFAULT_VALUES = {
  user: {
    firstName: "User",
    lastName: "Name",
    email: "user@example.com",
    bio: "Learning enthusiast",
    website: "https://example.com",
    location: "City, Country",
    phone: "+1 (555) 123-4567",
  },
  topic: {
    category: "General",
    difficulty: "Beginner",
    duration: "2-3 hours",
    rating: 4.5,
  },
  assessment: {
    timeLimit: "60 minutes",
    retakePeriod: "24 hours",
    cooldownPeriod: 24,
  },
}

// Subject Areas (configurable)
export const SUBJECT_AREAS = {
  default: "Technology",
  categories: [
    "Blockchain",
    "Cryptocurrency", 
    "DeFi",
    "NFTs",
    "Smart Contracts",
    "Web3",
    "Programming",
    "Business",
    "Marketing",
    "Design",
  ],
}

// Difficulty Levels
export const DIFFICULTY_LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

// Assessment Types
export const ASSESSMENT_TYPES = ["multiple-choice", "true-false", "essay"] as const;



// File Types
export const ALLOWED_FILE_TYPES = {
  images: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  documents: [".pdf", ".doc", ".docx", ".txt"],
  videos: [".mp4", ".avi", ".mov", ".wmv"],
} as const;

// Roles
export const USER_ROLES = ["admin", "teacher", "student"] as const;

// Status Types
export const STATUS_TYPES = ["Published", "Draft", "Archived"] as const; 