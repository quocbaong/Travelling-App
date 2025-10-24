package fit.se.travelling_app_be.service;

import fit.se.travelling_app_be.entity.Booking;
import fit.se.travelling_app_be.entity.Destination;
import fit.se.travelling_app_be.repository.BookingRepository;
import fit.se.travelling_app_be.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final DestinationRepository destinationRepository;
    
    public Booking createBooking(Booking booking) {
        // Set default values
        booking.setStatus("PENDING");
        booking.setPaymentStatus("PENDING");
        booking.setBookingDate(LocalDateTime.now());
        
        return bookingRepository.save(booking);
    }
    
    public List<Booking> getBookingsByUserId(String userId) {
        return bookingRepository.findByUserId(userId);
    }
    
    public List<Booking> getActiveBookingsByUserId(String userId) {
        return bookingRepository.findActiveBookingsByUserId(userId);
    }
    
    public List<Booking> getUpcomingBookings(String userId) {
        return bookingRepository.findByUserIdAndStatus(userId, "CONFIRMED");
    }
    
    public List<Booking> getCompletedBookings(String userId) {
        return bookingRepository.findByUserIdAndStatus(userId, "COMPLETED");
    }
    
    public Optional<Booking> findById(String id) {
        return bookingRepository.findById(id);
    }
    
    public Booking updateBookingStatus(String id, String status) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }
    
    public Booking updatePaymentStatus(String id, String paymentStatus) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setPaymentStatus(paymentStatus);
        return bookingRepository.save(booking);
    }
    
    public void cancelBooking(String id) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
    }
    
    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }
}
