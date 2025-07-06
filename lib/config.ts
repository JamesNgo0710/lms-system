// Configuration helper for environment-specific settings
export const config = {
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // API URLs
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  
  // Feature flags
  enableDemo: process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
  enableDebug: process.env.NODE_ENV === 'development',
  
  // External service URLs
  defaultImageService: process.env.NEXT_PUBLIC_DEFAULT_IMAGE_SERVICE || 'https://via.placeholder.com',
  avatarService: process.env.NEXT_PUBLIC_AVATAR_SERVICE || 'https://ui-avatars.com/api',
  
  // Storage configuration
  storagePrefix: process.env.NEXT_PUBLIC_STORAGE_PREFIX || 'lms-data',
  
  // Authentication
  nextAuthSecret: process.env.NEXTAUTH_SECRET || 'your-secret-key-for-development',
  nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  
  // File upload limits
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '10485760'), // 10MB
  allowedFileTypes: (process.env.NEXT_PUBLIC_ALLOWED_FILE_TYPES || '.jpg,.jpeg,.png,.pdf,.doc,.docx').split(','),
  
  // Rate limiting
  rateLimitRequests: parseInt(process.env.RATE_LIMIT_REQUESTS || '100'),
  rateLimitWindow: parseInt(process.env.RATE_LIMIT_WINDOW || '900000'), // 15 minutes
  
  // Email configuration (if needed)
  emailProvider: process.env.EMAIL_PROVIDER || 'smtp',
  emailFrom: process.env.EMAIL_FROM || 'noreply@lms.com',
  
  // Analytics (if needed)
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  
  // Social authentication (if needed)
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  
  // Database (if migrating from localStorage)
  databaseUrl: process.env.DATABASE_URL,
  
  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  
  // Redis (for caching/sessions if needed)
  redisUrl: process.env.REDIS_URL,
  
  // Content delivery
  cdnUrl: process.env.NEXT_PUBLIC_CDN_URL,
  
  // Security
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Backup/sync
  backupInterval: parseInt(process.env.BACKUP_INTERVAL || '3600000'), // 1 hour
  syncEnabled: process.env.SYNC_ENABLED === 'true',
} as const

// Helper functions for configuration
export const getStorageKey = (key: string) => `${config.storagePrefix}-${key}`

export const getImageUrl = (path: string, width = 400, height = 225) => {
  if (path.startsWith('http')) return path
  if (config.cdnUrl) return `${config.cdnUrl}${path}`
  return `${config.defaultImageService}/${width}x${height}?text=LMS+Content`
}

export const getAvatarUrl = (name: string, size = 40) => {
  return `${config.avatarService}/?name=${encodeURIComponent(name)}&size=${size}&background=f97316&color=fff`
}

export const isFeatureEnabled = (feature: string) => {
  return process.env[`NEXT_PUBLIC_FEATURE_${feature.toUpperCase()}`] === 'true'
}

export const getEnvironmentInfo = () => ({
  environment: process.env.NODE_ENV,
  version: process.env.npm_package_version || '1.0.0',
  buildTime: process.env.BUILD_TIME || new Date().toISOString(),
  commit: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown',
}) 