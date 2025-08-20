/**
 * Auth Store - SuperClaude Generated
 * Store de autenticação usando Zustand
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,

  login: async (email: string, password: string) => {
    set({ loading: true });

    // Login mockado (sem backend)
    await new Promise((resolve) => setTimeout(resolve, 600));

    const validUsers: Array<{ email: string; password: string; user: User }> = [
      {
        email: 'admin@tracking.com',
        password: 'admin123',
        user: {
          id: '1',
          email: 'admin@tracking.com',
          name: 'Administrador',
          role: 'admin',
        },
      },
      {
        email: 'demo@example.com',
        password: 'operator',
        user: {
          id: '2',
          email: 'demo@example.com',
          name: 'Usuário Demo',
          role: 'operator',
        },
      },
    ];

    const found = validUsers.find((u) => u.email === email && u.password === password);
    if (!found) {
      set({ loading: false });
      throw new Error('Credenciais inválidas');
    }

    const token = `mock-jwt-token-${Date.now()}`;

    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('user_data', JSON.stringify(found.user));

    set({
      user: found.user,
      token,
      isAuthenticated: true,
      loading: false,
    });
  },

  logout: async () => {
    try {
      // Remover do AsyncStorage
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_data');

      set({
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  },

  initializeAuth: async () => {
    set({ loading: true });

    try {
      const token = await AsyncStorage.getItem('auth_token');
      const userData = await AsyncStorage.getItem('user_data');

      if (token && userData) {
        const user: User = JSON.parse(userData);

        // Sem backend: considerar válido se existir no storage
        set({
          user,
          token,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false });
    }
  },
}));