import { User } from '../types';
import { HttpClient, API_CONFIG } from './config';

class UserService {
  async getCurrentUser(userId: string): Promise<User> {
    // Add timestamp to force fresh data
    const timestamp = Date.now();
    return HttpClient.get<User>(`${API_CONFIG.ENDPOINTS.USER}/${userId}?t=${timestamp}`);
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    return HttpClient.put<User>(`${API_CONFIG.ENDPOINTS.USER}/${userId}`, updates);
  }

  async addToFavorites(userId: string, destinationId: string): Promise<boolean> {
    try {
      await HttpClient.post(`${API_CONFIG.ENDPOINTS.FAVORITES}?userId=${userId}&destinationId=${destinationId}`);
      return true;
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      return false;
    }
  }

  async removeFromFavorites(userId: string, destinationId: string): Promise<boolean> {
    try {
      await HttpClient.delete(`${API_CONFIG.ENDPOINTS.FAVORITES}?userId=${userId}&destinationId=${destinationId}`);
      return true;
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      return false;
    }
  }

  async getFavorites(userId: string): Promise<string[]> {
    try {
      const favorites = await HttpClient.get<any[]>(`${API_CONFIG.ENDPOINTS.FAVORITES_USER}/${userId}`);
      return favorites.map(fav => fav.destinationId);
    } catch (error) {
      console.error('Failed to get favorites:', error);
      return [];
    }
  }

  async isFavorite(userId: string, destinationId: string): Promise<boolean> {
    try {
      return await HttpClient.get<boolean>(`${API_CONFIG.ENDPOINTS.FAVORITES_CHECK}?userId=${userId}&destinationId=${destinationId}`);
    } catch (error) {
      console.error('Failed to check favorite status:', error);
      return false;
    }
  }

  async toggleFavorite(userId: string, destinationId: string): Promise<boolean> {
    try {
      const isFavorite = await this.isFavorite(userId, destinationId);
      
      if (isFavorite) {
        await this.removeFromFavorites(userId, destinationId);
        return false;
      } else {
        await this.addToFavorites(userId, destinationId);
        return true;
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      return false;
    }
  }

  // Real-time updates: Listen for user data changes
  async subscribeToUserUpdates(userId: string, callback: (user: User) => void): Promise<void> {
    setInterval(async () => {
      try {
        const user = await this.getCurrentUser(userId);
        callback(user);
      } catch (error) {
        console.error('Failed to fetch user updates:', error);
      }
    }, 20000); // Poll every 20 seconds
  }
}

export const userService = new UserService();


