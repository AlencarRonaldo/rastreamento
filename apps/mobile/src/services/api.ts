/**
 * API Service - SuperClaude Generated
 * Cliente HTTP para comunicação com o backend
 */

import Constants from 'expo-constants';

const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  setAuthToken(token: string) {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  removeAuthToken() {
    delete this.defaultHeaders.Authorization;
  }
}

export const api = new ApiClient(API_BASE_URL);

// Tipos para as APIs
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  token: string;
}

export interface Vehicle {
  id: string;
  plate: string;
  model: string;
  year: number;
  color: string;
  deviceId: string;
  lastPosition?: {
    latitude: number;
    longitude: number;
    speed: number;
    heading: number;
    timestamp: string;
    ignition: boolean;
    battery: number;
  };
  status: 'online' | 'offline' | 'idle';
}

export interface Alert {
  id: string;
  vehicleId: string;
  type: 'speed' | 'geofence_enter' | 'geofence_exit' | 'ignition_on' | 'ignition_off' | 'battery_low' | 'sos' | 'offline';
  message: string;
  timestamp: string;
  read: boolean;
  data?: any;
}

export interface Route {
  id: string;
  vehicleId: string;
  startTime: string;
  endTime: string;
  distance: number;
  duration: number;
  points: Array<{
    latitude: number;
    longitude: number;
    timestamp: string;
    speed: number;
  }>;
}

// API Methods
export const vehicleApi = {
  getAll: () => api.get<Vehicle[]>('/vehicles'),
  getById: (id: string) => api.get<Vehicle>(`/vehicles/${id}`),
  getRoutes: (vehicleId: string, startDate: string, endDate: string) =>
    api.get<Route[]>(`/vehicles/${vehicleId}/routes?start=${startDate}&end=${endDate}`),
};

export const alertApi = {
  getAll: () => api.get<Alert[]>('/alerts'),
  markAsRead: (id: string) => api.put(`/alerts/${id}/read`),
  getUnreadCount: () => api.get<{ count: number }>('/alerts/unread-count'),
};

export const authApi = {
  login: (credentials: LoginRequest) => api.post<LoginResponse>('/auth/login', credentials),
  verify: () => api.get('/auth/verify'),
  logout: () => api.post('/auth/logout'),
};