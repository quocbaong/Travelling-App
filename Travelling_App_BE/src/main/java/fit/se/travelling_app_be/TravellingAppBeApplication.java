package fit.se.travelling_app_be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableMongoRepositories(basePackages = "fit.se.travelling_app_be.repository")
@EnableCaching
public class TravellingAppBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(TravellingAppBeApplication.class, args);
    }

}
