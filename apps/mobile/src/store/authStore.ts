/**
 * Auth Store - SuperClaude Generated
 * Store de autenticação usando Zustand
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';

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
    
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { user, token } = response.data;

      // Salvar no AsyncStorage
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_data', JSON.stringify(user));

      set({
        user,
        token,
        isAuthenticated: true,
        loading: false,
      });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
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
        const user = JSON.parse(userData);
        
        // Verificar se o token ainda é válido
        try {
          await api.get('/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error) {
          // Token inválido, fazer logout
          await get().logout();
        }
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({ loading: false });
    }
  },
}));