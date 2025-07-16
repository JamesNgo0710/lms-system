// Configuration helper for environment-specific settings
export const config = {
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // API URLs - Support multiple potential backend configurations
  apiUrl: (() => {
    let url = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000';
    // Fix for truncated Laravel Cloud URL
    if (url.includes('learning-management-syst') && !url.includes('laravel.cloud')) {
      url = 'https://learning-management-system-master-zcttuk.laravel.cloud';
    }
    return url;
  })(),
  frontendUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  
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

// Backend Detection and Configuration
export interface BackendConfig {
  apiUrl: string
  isConnected: boolean
  type: 'laravel' | 'mock' | 'unknown'
  version?: string
}

class BackendDetector {
  private static instance: BackendDetector
  private cachedConfig: BackendConfig | null = null
  private lastCheck: number = 0
  private readonly CACHE_DURATION = 30000 // 30 seconds

  private constructor() {}

  static getInstance(): BackendDetector {
    if (!BackendDetector.instance) {
      BackendDetector.instance = new BackendDetector()
    }
    return BackendDetector.instance
  }

  /**
   * Detect and configure backend connection
   */
  async detectBackend(): Promise<BackendConfig> {
    const now = Date.now()
    
    // Return cached result if recent
    if (this.cachedConfig && (now - this.lastCheck) < this.CACHE_DURATION) {
      return this.cachedConfig
    }

    const potentialUrls = [
      process.env.NEXT_PUBLIC_API_URL,
      process.env.NEXT_PUBLIC_LARAVEL_API_URL,
      'http://localhost:8000',
      'http://127.0.0.1:8000',
      'http://localhost:8080',
      'http://127.0.0.1:8080',
    ].filter(Boolean).map(url => {
      // Fix for truncated Laravel Cloud URL
      if (url.includes('learning-management-syst') && !url.includes('laravel.cloud')) {
        return 'https://learning-management-system-master-zcttuk.laravel.cloud';
      }
      return url;
    }) as string[]

    // Test each potential URL
    for (const url of potentialUrls) {
      try {
        const isConnected = await this.testConnection(url)
        if (isConnected) {
          this.cachedConfig = {
            apiUrl: url,
            isConnected: true,
            type: 'laravel',
          }
          this.lastCheck = now
          
          if (config.enableDebug) {
            console.log(`✅ Backend detected at: ${url}`)
          }
          
          return this.cachedConfig
        }
      } catch (error) {
        if (config.enableDebug) {
          console.debug(`❌ Failed to connect to: ${url}`)
        }
      }
    }

    // No backend found, use mock mode
    if (config.enableDebug) {
      console.warn('⚠️ No backend detected, using mock data mode')
    }
    
    this.cachedConfig = {
      apiUrl: config.frontendUrl,
      isConnected: false,
      type: 'mock',
    }
    this.lastCheck = now

    return this.cachedConfig
  }

  /**
   * Test backend connection
   */
  private async testConnection(url: string): Promise<boolean> {
    try {
      // Try health check first
      const healthResponse = await fetch(`${url}/api/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: AbortSignal.timeout(3000),
      })
      
      if (healthResponse.status < 500) {
        return true
      }
    } catch (error) {
      // Health check failed, try topics endpoint
      try {
        const topicsResponse = await fetch(`${url}/api/topics`, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: AbortSignal.timeout(3000),
        })
        
        // Even 401/403 means backend is running
        return topicsResponse.status < 500
      } catch (secondError) {
        return false
      }
    }
    
    return false
  }

  /**
   * Force refresh backend detection
   */
  async refreshBackend(): Promise<BackendConfig> {
    this.cachedConfig = null
    this.lastCheck = 0
    return this.detectBackend()
  }

  /**
   * Get current backend config (cached)
   */
  getCurrentConfig(): BackendConfig | null {
    return this.cachedConfig
  }
}

export const backendDetector = BackendDetector.getInstance()

// Convenience functions
export const detectBackend = () => backendDetector.detectBackend()
export const refreshBackend = () => backendDetector.refreshBackend()
export const getCurrentBackend = () => backendDetector.getCurrentConfig() 