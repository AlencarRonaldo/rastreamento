import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

// Mock login function - replace with actual API call
const mockLogin = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock successful login - support multiple demo accounts
  if ((email === 'admin@tracking.com' && password === 'admin123') ||
      (email === 'demo@example.com' && password === '123456')) {
    
    const isDemo = email === 'demo@example.com';
    
    return {
      user: {
        id: isDemo ? '2' : '1',
        email: email,
        name: isDemo ? 'Demo User' : 'Administrator',
        role: isDemo ? 'operator' : 'admin',
        avatar: `https://ui-avatars.com/api/?name=${isDemo ? 'Demo' : 'Admin'}&background=3b82f6&color=fff`,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date(),
      },
      token: 'mock-jwt-token-' + Date.now(),
    };
  }
  
  throw new Error('Credenciais inválidas');
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string, remember = false) => {
        set({ isLoading: true, error: null });
        
        try {
          const { user, token } = await mockLogin(email, password);
          
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Erro no login',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        set({ token, isAuthenticated: true });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);