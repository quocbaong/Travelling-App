package fit.se.travelling_app_be.service;

import fit.se.travelling_app_be.entity.Destination;
import fit.se.travelling_app_be.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DestinationService {
    
    private final DestinationRepository destinationRepository;
    
    public List<Destination> getAllDestinations() {
        return destinationRepository.findAll();
    }
    
    public Optional<Destination> findById(String id) {
        return destinationRepository.findById(id);
    }
    
    public List<Destination> getFeaturedDestinations() {
        return destinationRepository.findByFeaturedTrue();
    }
    
    public List<Destination> getPopularDestinations() {
        return destinationRepository.findByPopularTrue();
    }
    
    public List<Destination> searchDestinations(String query) {
        return destinationRepository.findByNameContainingIgnoreCase(query);
    }
    
    public List<Destination> getDestinationsByCategory(String category) {
        return destinationRepository.findByCategory(category);
    }
    
    public List<Destination> getDestinationsByCountry(String country) {
        return destinationRepository.findByCountry(country);
    }
    
    public List<Destination> getDestinationsByPriceRange(BigDecimal minPrice, BigDecimal maxPrice) {
        return destinationRepository.findByPriceBetween(minPrice, maxPrice);
    }
    
    public List<Destination> getDestinationsByRating(Double minRating) {
        return destinationRepository.findByRatingGreaterThanEqual(minRating);
    }
    
    public List<Destination> getDestinationsWithFilters(String category, BigDecimal minPrice, 
                                                       BigDecimal maxPrice, Double minRating) {
        if (category != null && minPrice != null && maxPrice != null && minRating != null) {
            return destinationRepository.findByCategoryAndPriceRangeAndRating(category, minPrice, maxPrice, minRating);
        }
        
        // Fallback to simple queries if not all filters are provided
        return destinationRepository.findAll();
    }
    
    public Destination createDestination(Destination destination) {
        return destinationRepository.save(destination);
    }
    
    public Destination updateDestination(String id, Destination destinationDetails) {
        Destination destination = destinationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Destination not found"));
        
        destination.setName(destinationDetails.getName());
        destination.setCountry(destinationDetails.getCountry());
        destination.setDescription(destinationDetails.getDescription());
        destination.setShortDescription(destinationDetails.getShortDescription());
        destination.setImages(destinationDetails.getImages());
        destination.setPrice(destinationDetails.getPrice());
        destination.setDuration(destinationDetails.getDuration());
        destination.setCategory(destinationDetails.getCategory());
        destination.setFeatured(destinationDetails.getFeatured());
        destination.setPopular(destinationDetails.getPopular());
        destination.setLocation(destinationDetails.getLocation());
        destination.setHighlights(destinationDetails.getHighlights());
        destination.setAmenities(destinationDetails.getAmenities());
        
        return destinationRepository.save(destination);
    }
    
    public void deleteDestination(String id) {
        destinationRepository.deleteById(id);
    }
}
