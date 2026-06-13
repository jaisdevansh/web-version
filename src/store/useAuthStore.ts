import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email?: string;
  phone?: string;
  role?: string;
  profileImage?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: 'party-auth-storage', // name of the item in the storage (must be unique)
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          // You could also set the axios header here or in a separate hook
          localStorage.setItem('party_user_token', state.token);
        } else {
          localStorage.removeItem('party_user_token');
        }
      },
    }
  )
);
