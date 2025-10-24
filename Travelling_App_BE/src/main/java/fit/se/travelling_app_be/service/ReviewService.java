package fit.se.travelling_app_be.service;

import fit.se.travelling_app_be.entity.Destination;
import fit.se.travelling_app_be.entity.Review;
import fit.se.travelling_app_be.repository.DestinationRepository;
import fit.se.travelling_app_be.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final DestinationRepository destinationRepository;
    
    public Review createReview(Review review) {
        Review savedReview = reviewRepository.save(review);
        
        // Update destination rating
        updateDestinationRating(review.getDestinationId());
        
        return savedReview;
    }
    
    public List<Review> getReviewsByDestinationId(String destinationId) {
        return reviewRepository.findByDestinationIdOrderByCreatedAtDesc(destinationId);
    }
    
    public List<Review> getReviewsByUserId(String userId) {
        return reviewRepository.findByUserId(userId);
    }
    
    public Optional<Review> findReviewByUserAndDestination(String userId, String destinationId) {
        return reviewRepository.findByUserIdAndDestinationId(userId, destinationId);
    }
    
    public boolean hasUserReviewedDestination(String userId, String destinationId) {
        return reviewRepository.findByUserIdAndDestinationId(userId, destinationId).isPresent();
    }
    
    public List<Review> getReviewsByRating(String destinationId, Integer minRating) {
        return reviewRepository.findByDestinationIdAndRatingGreaterThanEqual(destinationId, minRating);
    }
    
    public Optional<Review> findById(String id) {
        return reviewRepository.findById(id);
    }
    
    public Review updateReview(String id, Review reviewDetails) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        
        review.setRating(reviewDetails.getRating());
        review.setComment(reviewDetails.getComment());
        review.setImages(reviewDetails.getImages());
        
        Review updatedReview = reviewRepository.save(review);
        
        // Update destination rating
        updateDestinationRating(review.getDestinationId());
        
        return updatedReview;
    }
    
    public void deleteReview(String id) {
        Review review = reviewRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Review not found"));
        
        String destinationId = review.getDestinationId();
        reviewRepository.deleteById(id);
        
        // Update destination rating
        updateDestinationRating(destinationId);
    }
    
    private void updateDestinationRating(String destinationId) {
        List<Review> reviews = reviewRepository.findByDestinationId(destinationId);
        
        if (!reviews.isEmpty()) {
            double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
            
            Optional<Destination> destinationOpt = destinationRepository.findById(destinationId);
            if (destinationOpt.isPresent()) {
                Destination destination = destinationOpt.get();
                destination.setRating(averageRating);
                destination.setReviewCount(reviews.size());
                destinationRepository.save(destination);
            }
        }
    }
}
