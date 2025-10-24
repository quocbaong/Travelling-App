import { Booking, Destination } from '../types';
import { HttpClient, API_CONFIG } from './config';

class BookingService {
  async getUserBookings(userId: string): Promise<Booking[]> {
    return HttpClient.get<Booking[]>(`${API_CONFIG.ENDPOINTS.BOOKINGS_USER}/${userId}`);
  }

  async getBookingById(bookingId: string): Promise<Booking | undefined> {
    try {
      return await HttpClient.get<Booking>(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${bookingId}`);
    } catch (error) {
      console.error('Failed to get booking:', error);
      return undefined;
    }
  }

  async createBooking(
    destination: Destination,
    userId: string,
    startDate: string,
    endDate: string,
    guests: number,
    specialRequests?: string
  ): Promise<Booking> {
    const bookingData = {
      destinationId: destination.id,
      travelDate: new Date(startDate).toISOString(),
      numberOfTravelers: guests,
      totalPrice: destination.price,
      paymentMethod: 'credit_card',
      specialRequests: specialRequests || '',
    };

    return HttpClient.post<Booking>(API_CONFIG.ENDPOINTS.BOOKINGS, bookingData);
  }

  async cancelBooking(bookingId: string): Promise<boolean> {
    try {
      await HttpClient.put(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${bookingId}/cancel`);
      return true;
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      return false;
    }
  }

  async getUpcomingBookings(userId: string): Promise<Booking[]> {
    return HttpClient.get<Booking[]>(`${API_CONFIG.ENDPOINTS.BOOKINGS_UPCOMING}/${userId}/upcoming`);
  }

  async getPastBookings(userId: string): Promise<Booking[]> {
    return HttpClient.get<Booking[]>(`${API_CONFIG.ENDPOINTS.BOOKINGS_COMPLETED}/${userId}/completed`);
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<Booking> {
    return HttpClient.put<Booking>(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${bookingId}/status?status=${status}`);
  }

  async updatePaymentStatus(bookingId: string, paymentStatus: string): Promise<Booking> {
    return HttpClient.put<Booking>(`${API_CONFIG.ENDPOINTS.BOOKINGS}/${bookingId}/payment?paymentStatus=${paymentStatus}`);
  }

  // Real-time updates: Listen for booking changes
  async subscribeToBookingUpdates(userId: string, callback: (bookings: Booking[]) => void): Promise<void> {
    setInterval(async () => {
      try {
        const bookings = await this.getUserBookings(userId);
        callback(bookings);
      } catch (error) {
        console.error('Failed to fetch booking updates:', error);
      }
    }, 15000); // Poll every 15 seconds
  }
}

export const bookingService = new BookingService();


