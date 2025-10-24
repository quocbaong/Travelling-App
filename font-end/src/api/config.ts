import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// API Configuration
const getBaseUrl = () => {
  if (__DEV__) {
    // Development URLs
    if (Platform.OS === 'android') {
      return 'http://192.168.1.27:8080/api'; // Android emulator with real IP
    } else if (Platform.OS === 'ios') {
      return 'http://192.168.1.27:8080/api'; // iOS simulator with real IP
    } else {
      return 'http://localhost:8080/api'; // Web
    }
  }
  // Production URL (replace with your actual production URL)
  return 'https://your-production-api.com/api';
};

export const API_CONFIG = {
  BASE_URL: getBaseUrl(),
  ENDPOINTS: {
    // Auth
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    USER: '/auth/user',
    
    // Destinations
    DESTINATIONS: '/destinations',
    DESTINATIONS_FEATURED: '/destinations/featured',
    DESTINATIONS_POPULAR: '/destinations/popular',
    DESTINATIONS_SEARCH: '/destinations/search',
    DESTINATIONS_CATEGORY: '/destinations/category',
    
    // Bookings
    BOOKINGS: '/bookings',
    BOOKINGS_USER: '/bookings/user',
    BOOKINGS_UPCOMING: '/bookings/user',
    BOOKINGS_COMPLETED: '/bookings/user',
    
    // Reviews
    REVIEWS: '/reviews',
    REVIEWS_DESTINATION: '/reviews/destination',
    REVIEWS_USER: '/reviews/user',
    
    // Favorites
    FAVORITES: '/favorites',
    FAVORITES_USER: '/favorites/user',
    FAVORITES_CHECK: '/favorites/check',
  },
  TIMEOUT: 10000, // 10 seconds
};

// HTTP Client helper
export class HttpClient {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    
    // Debug logging
    console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    // Add Authorization header if token exists
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      // timeout: API_CONFIG.TIMEOUT, // timeout not supported in React Native fetch
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Handle API response format: { success: boolean, message: string, data: T }
      if (data.success !== undefined) {
        if (!data.success) {
          throw new Error(data.message || 'API request failed');
        }
        return data.data;
      }
      
      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  static async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  static async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Error handling utility
export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
