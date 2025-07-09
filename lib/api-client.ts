import axios from 'axios';

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

// Add request interceptor to include token (browser only)
apiClient.interceptors.request.use(
  (config) => {
    // Only access localStorage in browser context
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth-token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
        localStorage.removeItem('auth-token');
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

// Get CSRF cookie for Sanctum
export const getCsrfCookie = async () => {
  await axios.get(`${API_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  });
};

// Server-safe API client for NextAuth (no localStorage access)
export const serverApiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
}); 