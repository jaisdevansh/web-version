import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id?: string;
  _id?: string;
  name: string;
  username?: string;
  email?: string;
  phone?: string;
  role?: 'user' | 'host' | 'admin' | 'superadmin' | 'staff' | 'waiter' | 'security' | string;
  profileImage?: string;
  gender?: 'Male' | 'Female' | 'Other' | '' | string;
  dob?: string;
  location?: string;
  
  // Synced from backend schema
  googleId?: string | null;
  appleId?: string | null;
  tokenVersion?: number;
  hostId?: string | null;
  preferredZone?: string;
  onboardingCompleted?: boolean;
  emailVerified?: boolean;
  isActive?: boolean;
  referralCode?: string;
  referredBy?: string | null;
  referralsCount?: number;
  loyaltyPoints?: number;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
        if (typeof window !== 'undefined') {
          // Set secure cookie for token instead of localStorage
          document.cookie = `party_auth_token=${token}; path=/; max-age=7776000; Secure; SameSite=Lax`;
          if (user.role) localStorage.setItem('party_user_role', user.role);
        }
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        if (typeof window !== 'undefined') {
          // Clear cookie
          document.cookie = 'party_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax';
          localStorage.removeItem('party_user_role');
          localStorage.removeItem('party-auth-storage'); // Clear the persisted store
          window.location.href = '/login';
        }
      },
      updateUser: (updatedFields) => set((state) => ({ 
        user: state.user ? { ...state.user, ...updatedFields } : null 
      })),
    }),
    {
      name: 'party-auth-storage', 
      partialize: (state) => Object.fromEntries(
        Object.entries(state).filter(([key]) => key !== 'token')
      ) as Partial<AuthState>,
      onRehydrateStorage: () => (state) => {
        // Read token from cookie on rehydration
        if (typeof window !== 'undefined') {
          const match = document.cookie.match(/(?:^|; )party_auth_token=([^;]+)/);
          const cookieToken = match ? match[1] : null;
          if (cookieToken && state) {
            state.token = cookieToken;
          }
        }
      },
    }
  )
);
