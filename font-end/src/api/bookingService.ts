import { Booking, Destination } from '../types';
import { HttpClient, API_CONFIG } from './config';

class BookingService {
  async getUserBookings(userId: string): Promise<Booking[]> {
    try {
      console.log('🔍 Fetching bookings for userId:', userId);
      console.log('🔍 Endpoint:', `${API_CONFIG.ENDPOINTS.BOOKINGS_USER}/${userId}`);
      const response = await HttpClient.get<any[]>(`${API_CONFIG.ENDPOINTS.BOOKINGS_USER}/${userId}`);
      console.log('✅ Raw bookings response:', response);
      
      // Transform backend data to frontend format
      const bookings = response.map((booking: any) => {
        // Calculate departure and return dates from travelDate and duration
        const travelDate = new Date(booking.travelDate);
        const durationDays = parseInt(booking.destination?.duration?.match(/\d+/)?.[0] || '7');
        const returnDate = new Date(travelDate);
        returnDate.setDate(returnDate.getDate() + durationDays);
        
        return {
          id: booking.id,
          destination: booking.destination,
          userId: booking.userId,
          startDate: booking.travelDate,
          endDate: returnDate.toISOString(),
          departureDate: travelDate.toLocaleDateString('en-GB'), // dd/mm/yyyy
          returnDate: returnDate.toLocaleDateString('en-GB'), // dd/mm/yyyy
          guests: booking.numberOfTravelers || 1,
          totalPrice: booking.totalPrice || 0,
          status: booking.status?.toLowerCase() || 'pending',
          createdAt: booking.createdAt || booking.bookingDate || new Date().toISOString(),
          paymentMethod: booking.paymentMethod,
          specialRequests: Array.isArray(booking.specialRequests) 
            ? booking.specialRequests.join(', ') 
            : booking.specialRequests || ''
        } as Booking;
      });
      
      console.log('✅ Transformed bookings:', bookings);
      return bookings;
    } catch (error) {
      console.error('❌ getUserBookings error:', error);
      throw error;
    }
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
    specialRequests?: string,
    totalPrice?: number,
    paymentMethod?: string
  ): Promise<Booking> {
    const bookingData = {
      userId: userId,
      destinationId: destination.id,
      travelDate: new Date(startDate).toISOString(),
      numberOfTravelers: guests,
      totalPrice: totalPrice || destination.price,
      paymentMethod: paymentMethod || 'credit_card', // Use actual payment method
      specialRequests: specialRequests || '',
    };

    console.log('📤 Creating booking with data:', bookingData);
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


