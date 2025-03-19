package cz.telemetry.whiskey.repository;

import cz.telemetry.whiskey.domain.Profile;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface ProfileRepository extends JpaRepository<Profile, UUID> {

  Optional<Profile> findByUsername(String username);

  boolean existsByUsername(String username);

  @Modifying
  @Query("update Profile p set p.lastLogin = current_timestamp where p.username = :username")
  void updateLastLogin(String username);
}
