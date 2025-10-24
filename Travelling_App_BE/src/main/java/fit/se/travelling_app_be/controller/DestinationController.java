package fit.se.travelling_app_be.controller;

import fit.se.travelling_app_be.entity.Destination;
import fit.se.travelling_app_be.repository.DestinationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/destinations")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DestinationController {
    
    private final DestinationRepository destinationRepository;
    
    @GetMapping
    public ResponseEntity<List<Destination>> getAllDestinations() {
        List<Destination> destinations = destinationRepository.findAll();
        return ResponseEntity.ok(destinations);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Destination> getDestinationById(@PathVariable String id) {
        return destinationRepository.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/featured")
    public ResponseEntity<List<Destination>> getFeaturedDestinations() {
        List<Destination> destinations = destinationRepository.findByFeaturedTrue();
        return ResponseEntity.ok(destinations);
    }
    
    @GetMapping("/popular")
    public ResponseEntity<List<Destination>> getPopularDestinations() {
        List<Destination> destinations = destinationRepository.findByPopularTrue();
        return ResponseEntity.ok(destinations);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Destination>> searchDestinations(@RequestParam String query) {
        List<Destination> destinations = destinationRepository.findByNameContainingIgnoreCase(query);
        return ResponseEntity.ok(destinations);
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Destination>> getDestinationsByCategory(@PathVariable String category) {
        List<Destination> destinations = destinationRepository.findByCategory(category);
        return ResponseEntity.ok(destinations);
    }
    
    @PostMapping
    public ResponseEntity<Destination> createDestination(@RequestBody Destination destination) {
        Destination savedDestination = destinationRepository.save(destination);
        return ResponseEntity.ok(savedDestination);
    }
}
