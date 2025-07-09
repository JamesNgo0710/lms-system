import axios from 'axios';
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
    });
  } catch (error) {
    csrfTokenRequested = false;
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
    // Ensure CSRF token is obtained before making requests
    if (typeof window !== 'undefined' && !csrfTokenRequested) {
      try {
        await getCsrfCookie();
      } catch (error) {
        console.warn('Failed to get CSRF token:', error);
      }
    }

    // Get token from NextAuth session instead of localStorage
    if (typeof window !== 'undefined') {
      try {
        const session = await getSession();
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`;
          console.log('API Request with auth token:', config.method?.toUpperCase(), config.url);
        } else {
          console.warn('No auth token found in session for request:', config.method?.toUpperCase(), config.url);
        }
      } catch (error) {
        console.warn('Failed to get session token:', error);
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