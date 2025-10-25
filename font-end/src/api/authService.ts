import { User } from '../types';
import { HttpClient, API_CONFIG } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await HttpClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.LOGIN, credentials);
    
    // Store token for future requests
    if (response.token) {
      AsyncStorage.setItem('auth_token', response.token);
      AsyncStorage.setItem('user_id', response.user.id);
    }
    
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await HttpClient.post<AuthResponse>(API_CONFIG.ENDPOINTS.REGISTER, userData);
    
    // Store token for future requests
    if (response.token) {
      AsyncStorage.setItem('auth_token', response.token);
      AsyncStorage.setItem('user_id', response.user.id);
    }
    
    return response;
  }

  async logout(): Promise<void> {
    // Clear stored auth data
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_id');
  }

  // Debug method to clear all stored data
  async clearAsyncStorage(): Promise<void> {
    await AsyncStorage.clear();
  }

  async getCurrentToken(): Promise<string | null> {
    return await AsyncStorage.getItem('auth_token');
  }

  async getCurrentUserId(): Promise<string | null> {
    return await AsyncStorage.getItem('user_id');
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await this.getCurrentToken();
    return !!token;
  }

  async getCurrentUser(): Promise<User | null> {
    const userId = await this.getCurrentUserId();
    if (!userId) return null;

    try {
      return await HttpClient.get<User>(`${API_CONFIG.ENDPOINTS.USER}/${userId}`);
    } catch (error) {
      console.error('Failed to get current user:', error);
      // If user not found (404), clear stored data
      if (error instanceof Error && error.message.includes('404')) {
        await this.logout();
      }
      return null;
    }
  }


  async changePassword(userId: string, newPassword: string): Promise<void> {
    await HttpClient.put(`${API_CONFIG.ENDPOINTS.USER}/${userId}/password`, newPassword);
  }

  // Auto-refresh token if needed (for production)
  async refreshToken(): Promise<boolean> {
    try {
      // Implement token refresh logic here
      // This would typically call a refresh endpoint
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      await this.logout();
      return false;
    }
  }
}

export const authService = new AuthService();
