import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8000';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for Sanctum
});

// Track CSRF token status
let csrfTokenRequested = false;

// Get CSRF cookie for Sanctum
export const getCsrfCookie = async () => {
  if (csrfTokenRequested) return;
  csrfTokenRequested = true;
  
  try {
    await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
      timeout: 5000, // 5 second timeout
    });
    console.log('CSRF cookie obtained successfully');
  } catch (error) {
    csrfTokenRequested = false;
    console.error('Failed to get CSRF cookie:', error);
    throw error;
  }
};

// Initialize CSRF token on app startup (browser only)
export const initializeApiClient = async () => {
  if (typeof window !== 'undefined') {
    try {
      await getCsrfCookie();
    } catch (error) {
      console.warn('Failed to initialize CSRF token:', error);
    }
  }
};

// Add request interceptor to include token and handle CSRF
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from NextAuth session for authenticated endpoints
    if (typeof window !== 'undefined') {
      try {
        const session = await getSession();
        console.log('🔍 Debug session:', session);
        if (session?.accessToken) {
          // Use Bearer token authentication (Sanctum API tokens)
          config.headers.Authorization = `Bearer ${session.accessToken}`;
          console.log('✅ API Request with auth token:', config.method?.toUpperCase(), config.url);
          console.log('🔑 Token (first 20 chars):', session.accessToken.substring(0, 20) + '...');
          return config; // Skip CSRF when using Bearer tokens
        } else {
          console.log('❌ No auth token - making public API request:', config.method?.toUpperCase(), config.url);
          console.log('🔍 Session object:', session);
        }
      } catch (error) {
        console.warn('Failed to get session token:', error);
        // Don't fail the request if session check fails
      }
    }

    // Only try to get CSRF token for write operations when no Bearer token
    const needsCSRF = ['post', 'put', 'delete'].includes(config.method?.toLowerCase() || '');
    
    if (typeof window !== 'undefined' && needsCSRF && !csrfTokenRequested) {
      try {
        await getCsrfCookie();
      } catch (error) {
        console.warn('Failed to get CSRF token:', error);
        // Don't fail the request if CSRF fails
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access (browser only)
      if (typeof window !== 'undefined') {
        // Clear NextAuth session and redirect to login
        window.location.href = '/';
      }
    } else if (error.response?.status === 419) {
      // Handle CSRF token mismatch - retry once with fresh token
      if (typeof window !== 'undefined' && !error.config._retried) {
        csrfTokenRequested = false;
        try {
          await getCsrfCookie();
          error.config._retried = true;
          return apiClient.request(error.config);
        } catch (csrfError) {
          console.error('Failed to refresh CSRF token:', csrfError);
        }
      }
    }
    return Promise.reject(error);
  }
);

// Server-safe API client for NextAuth (no localStorage access)
export const serverApiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
}); 