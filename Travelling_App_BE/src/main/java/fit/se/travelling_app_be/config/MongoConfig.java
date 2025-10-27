package fit.se.travelling_app_be.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@Configuration
@EnableMongoAuditing
public class MongoConfig {
    // This enables automatic population of @CreatedDate and @LastModifiedDate fields
}

