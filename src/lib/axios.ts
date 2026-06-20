import axios from 'axios';
import { toast } from 'sonner';

// Create a custom axios instance
const api = axios.create({
  // Use local API proxy to bypass CORS and WAF rules
  baseURL: process.env.NODE_ENV === 'development' ? '/api1' : (process.env.NEXT_PUBLIC_API_URL || 'https://stayin.in/api2'),
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for httpOnly cookies
  timeout: 10000, // 10 seconds timeout for better UX
});

// Request interceptor to attach the auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('party_user_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors centrally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window === 'undefined') return Promise.reject(error); // Don't run toasts on SSR

    if (error.response) {
      const { status, data } = error.response;
      
      // Centralized error message extraction
      const errorMessage = data?.message || data?.error || 'An unexpected error occurred';

      if (status === 401) {
        // Handle Unauthorized
        toast.error('Session expired. Please log in again.');
        localStorage.removeItem('party_user_token');
        localStorage.removeItem('party_user_role');
        // We can redirect here or let useAuthStore handle it if it listens to storage events
        // Redirecting directly is usually the safest for SPA UX
        setTimeout(() => {
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }, 1500);
      } else if (status >= 500) {
        // Handle Server Errors
        toast.error('Server error. Our team has been notified.');
      } else if (status !== 404) {
        // Handle other client errors (excluding 404s to avoid toast spam on missing routes)
        toast.error(errorMessage);
      }
    } else if (error.request) {
      // Network Errors (commented out to prevent spam during development when backend is down)
      // toast.error('Network error. Please check your internet connection.');
    } else {
      toast.error('Something went wrong.');
    }

    return Promise.reject(error);
  }
);

export default api;
