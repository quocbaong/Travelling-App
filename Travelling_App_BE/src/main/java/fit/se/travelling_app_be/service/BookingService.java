package fit.se.travelling_app_be.service;

import fit.se.travelling_app_be.entity.Booking;
import fit.se.travelling_app_be.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BookingService {
    
    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;
    
    public Booking createBooking(Booking booking) {
        // Set default values
        // If payment method is provided and booking is created, mark as CONFIRMED
        // In real app, this should be done after payment gateway confirmation
        if (booking.getPaymentMethod() != null && !booking.getPaymentMethod().isEmpty()) {
            booking.setStatus("CONFIRMED");
            booking.setPaymentStatus("PAID");
        } else {
            booking.setStatus("PENDING");
            booking.setPaymentStatus("PENDING");
        }
        booking.setBookingDate(LocalDateTime.now());
        
        Booking savedBooking = bookingRepository.save(booking);
        
        // Create notification for the user
        String destinationName = "Unknown Destination";
        if (booking.getDestination() != null && booking.getDestination().getName() != null) {
            destinationName = booking.getDestination().getName();
        }
        
        String status = savedBooking.getStatus().equals("CONFIRMED") ? "đã xác nhận" : "đang chờ xử lý";
        notificationService.createNotification(
            booking.getUserId(),
            "Đặt chỗ thành công!",
            "Chuyến đi đến " + destinationName + " của bạn " + status + ".",
            "booking",
            savedBooking.getId()
        );
        
        return savedBooking;
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
