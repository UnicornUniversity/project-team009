package cz.telemetry.whiskey.config;

import cz.telemetry.whiskey.repository.ProfileRepository;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(basePackageClasses = ProfileRepository.class, enableDefaultTransactions = false)
public class JpaConfiguration {

}
