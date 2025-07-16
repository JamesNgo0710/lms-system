/**
 * Utility functions for API URL configuration
 * Handles URL truncation and standardizes API URL usage across the application
 */

/**
 * Get the Laravel API URL with proper truncation handling
 * @param includeApiPath - Whether to include '/api' in the URL (default: true)
 * @returns Complete Laravel API URL
 */
export function getApiUrl(includeApiPath: boolean = true): string {
  let apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.LARAVEL_API_URL || process.env.API_URL || 'http://localhost:8000'
  
  // Fix for truncated Laravel Cloud URL
  if (apiUrl.includes('learning-management-syst') && !apiUrl.includes('laravel.cloud')) {
    apiUrl = 'https://learning-management-system-master-zcttuk.laravel.cloud'
  }
  
  // Ensure we append /api if requested and not already present
  if (includeApiPath && !apiUrl.endsWith('/api')) {
    apiUrl = `${apiUrl}/api`
  }
  
  return apiUrl
}

/**
 * Get the base Laravel URL without /api path
 * @returns Base Laravel URL
 */
export function getBaseUrl(): string {
  return getApiUrl(false)
}

/**
 * Create a complete API endpoint URL
 * @param endpoint - The API endpoint (e.g., '/topics', '/users/123')
 * @returns Complete API URL
 */
export function createApiEndpoint(endpoint: string): string {
  const apiUrl = getApiUrl(true)
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return `${apiUrl}${cleanEndpoint}`
}

/**
 * Get proper session token from NextAuth session
 * @param session - NextAuth session object
 * @returns Access token string or null
 */
export function getSessionToken(session: any): string | null {
  return session?.accessToken || session?.user?.laravelToken || null
}

/**
 * Create standard API headers with authentication
 * @param session - NextAuth session object
 * @param additionalHeaders - Additional headers to include
 * @returns Headers object
 */
export function createApiHeaders(session: any, additionalHeaders: Record<string, string> = {}): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...additionalHeaders
  }
  
  const token = getSessionToken(session)
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  
  return headers
}

/**
 * Test if the API URL is accessible
 * @param timeout - Timeout in milliseconds (default: 5000)
 * @returns Promise<boolean> - True if accessible, false otherwise
 */
export async function testApiConnection(timeout: number = 5000): Promise<boolean> {
  try {
    const apiUrl = getApiUrl(true)
    const response = await fetch(`${apiUrl}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(timeout)
    })
    
    return response.status < 500
  } catch (error) {
    return false
  }
}