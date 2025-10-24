import { Destination, SearchFilters, DestinationCategory } from '../types';
import { HttpClient, API_CONFIG } from './config';
import { mockDestinations } from './mockData';

class DestinationService {
  async getAllDestinations(): Promise<Destination[]> {
    try {
      const result = await HttpClient.get<Destination[]>(API_CONFIG.ENDPOINTS.DESTINATIONS);
      console.log(`✅ Backend API success: ${result.length} destinations`);
      console.log(`📊 Sample backend destinations:`, result.slice(0, 3).map(d => ({ 
        name: d.name, 
        images: d.images?.length || 0, 
        imageUrl: d.imageUrl 
      })));
      return result;
    } catch (error) {
      console.log('🔄 Using fallback mock data for destinations');
      console.log(`📊 Mock data: ${mockDestinations.length} destinations`);
      console.log(`📊 Sample mock destinations:`, mockDestinations.slice(0, 3).map(d => ({ 
        name: d.name, 
        images: d.images?.length || 0, 
        imageUrl: d.imageUrl 
      })));
      return mockDestinations;
    }
  }

  async getFeaturedDestinations(): Promise<Destination[]> {
    try {
      return await HttpClient.get<Destination[]>(API_CONFIG.ENDPOINTS.DESTINATIONS_FEATURED);
    } catch (error) {
      console.log('🔄 Using fallback mock data for featured destinations');
      return mockDestinations.filter(dest => dest.rating >= 4.8).slice(0, 5);
    }
  }

  async getPopularDestinations(): Promise<Destination[]> {
    try {
      return await HttpClient.get<Destination[]>(API_CONFIG.ENDPOINTS.DESTINATIONS_POPULAR);
    } catch (error) {
      console.log('🔄 Using fallback mock data for popular destinations');
      return mockDestinations.filter(dest => dest.rating >= 4.6).slice(0, 8);
    }
  }

  async getDestinationById(id: string): Promise<Destination | undefined> {
    try {
      return await HttpClient.get<Destination>(`${API_CONFIG.ENDPOINTS.DESTINATIONS}/${id}`);
    } catch (error) {
      console.error('Failed to get destination:', error);
      return undefined;
    }
  }

  async getDestinationsByCategory(category: DestinationCategory): Promise<Destination[]> {
    return HttpClient.get<Destination[]>(`${API_CONFIG.ENDPOINTS.DESTINATIONS_CATEGORY}/${category}`);
  }

  async searchDestinations(filters: SearchFilters): Promise<Destination[]> {
    try {
      // Use backend search endpoint
      if (filters.searchQuery) {
        return HttpClient.get<Destination[]>(`${API_CONFIG.ENDPOINTS.DESTINATIONS_SEARCH}?query=${encodeURIComponent(filters.searchQuery)}`);
      }

      // If no search query, get all destinations and filter client-side for complex filters
      let results = await this.getAllDestinations();

      // Apply additional filters client-side
      if (filters.category) {
        results = results.filter(dest => dest.category === filters.category);
      }

      if (filters.priceRange) {
        results = results.filter(
          dest => dest.price >= filters.priceRange!.min && dest.price <= filters.priceRange!.max
        );
      }

      if (filters.rating) {
        results = results.filter(dest => dest.rating >= filters.rating!);
      }

      if (filters.duration) {
        results = results.filter(dest => dest.duration === filters.duration);
      }

      return results;
    } catch (error) {
      console.error('Search failed:', error);
      // Fallback to client-side search if backend fails
      console.log('🔄 Falling back to client-side search');
      try {
        const allDestinations = await this.getAllDestinations();
        if (filters.searchQuery) {
          return allDestinations.filter(dest => 
            dest.name.toLowerCase().includes(filters.searchQuery!.toLowerCase()) ||
            dest.country.toLowerCase().includes(filters.searchQuery!.toLowerCase())
          );
        }
        return allDestinations;
      } catch (fallbackError) {
        console.error('Fallback search also failed:', fallbackError);
        return [];
      }
    }
  }

  async getRelatedDestinations(destinationId: string): Promise<Destination[]> {
    try {
      const destination = await this.getDestinationById(destinationId);
      if (!destination) return [];

      // Get destinations from same category
      const sameCategory = await this.getDestinationsByCategory(destination.category);
      return sameCategory
        .filter(dest => dest.id !== destinationId)
        .slice(0, 4);
    } catch (error) {
      console.error('Failed to get related destinations:', error);
      return [];
    }
  }

  // Real-time updates: Listen for destination changes
  async subscribeToDestinationUpdates(callback: (destinations: Destination[]) => void): Promise<void> {
    // For now, we'll use polling. In production, use WebSocket or Server-Sent Events
    setInterval(async () => {
      try {
        const destinations = await this.getAllDestinations();
        callback(destinations);
      } catch (error) {
        console.error('Failed to fetch destination updates:', error);
      }
    }, 30000); // Poll every 30 seconds
  }
}

export const destinationService = new DestinationService();


