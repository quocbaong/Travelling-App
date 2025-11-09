package fit.se.travelling_app_be.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.serializer.GenericJackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializationContext;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

/**
 * Cache Configuration for Redis
 * Configures TTL (Time To Live) for different cache types
 */
@Configuration
@EnableCaching
public class CacheConfig {
    
    /**
     * Create ObjectMapper with Java 8 date/time support for Redis serialization
     */
    private ObjectMapper createObjectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        // Disable FAIL_ON_UNKNOWN_PROPERTIES để tránh lỗi khi deserialize
        mapper.configure(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return mapper;
    }
    
    /**
     * Configure Redis Cache Manager with different TTL for different cache types
     */
    @Bean
    public CacheManager cacheManager(RedisConnectionFactory factory) {
        // Create serializer with Java 8 date/time support
        GenericJackson2JsonRedisSerializer serializer = new GenericJackson2JsonRedisSerializer(createObjectMapper());
        
        // Default cache configuration
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
            .entryTtl(Duration.ofMinutes(30))  // Default TTL: 30 phút
            .serializeKeysWith(RedisSerializationContext.SerializationPair
                .fromSerializer(new StringRedisSerializer()))
            .serializeValuesWith(RedisSerializationContext.SerializationPair
                .fromSerializer(serializer))
            .disableCachingNullValues(); // Không cache null values
        
        // Cache-specific configurations
        Map<String, RedisCacheConfiguration> cacheConfigurations = new HashMap<>();
        
        // Destinations cache - 1 giờ (ít thay đổi)
        cacheConfigurations.put("destinations", 
            defaultConfig.entryTtl(Duration.ofHours(1)));
        
        // User cache - 15 phút
        cacheConfigurations.put("users", 
            defaultConfig.entryTtl(Duration.ofMinutes(15)));
        
        // Reviews cache - 10 phút
        cacheConfigurations.put("reviews", 
            defaultConfig.entryTtl(Duration.ofMinutes(10)));
        
        // Bookings cache - 5 phút (thay đổi thường xuyên hơn)
        cacheConfigurations.put("bookings", 
            defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        // Search results cache - 5 phút
        cacheConfigurations.put("search", 
            defaultConfig.entryTtl(Duration.ofMinutes(5)));
        
        return RedisCacheManager.builder(factory)
            .cacheDefaults(defaultConfig)
            .withInitialCacheConfigurations(cacheConfigurations)
            .build();
    }
}

