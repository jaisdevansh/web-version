import axios from 'axios';
import { toast } from 'sonner';

// Create a custom axios instance
const api = axios.create({
  // Use Next.js API proxy to bypass CORS and WAF rules in both dev and prod
  baseURL: '/api1',
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
  withCredentials: true, // Required for httpOnly cookies
  timeout: 10000, // 10 seconds timeout for better UX
});

// Request interceptor to attach the auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const match = document.cookie.match(/(?:^|; )party_auth_token=([^;]+)/);
      const token = match ? match[1] : null;
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
        // Handle Unauthorized gracefully
        const match = document.cookie.match(/(?:^|; )party_auth_token=([^;]+)/);
        const hadToken = !!match;
        document.cookie = 'party_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax';
        localStorage.removeItem('party_user_role');
        
        // Only show toast and redirect if they actually had a session that expired,
        // and avoid redirecting if they are already on the public home page.
        if (hadToken) {
          toast.error('Session expired. Please log in again.');
        }
        
        setTimeout(() => {
          const publicPaths = ['/', '/login'];
          if (!publicPaths.includes(window.location.pathname) && hadToken) {
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
