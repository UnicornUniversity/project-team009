package cz.telemetry.whiskey.repository;

import cz.telemetry.whiskey.domain.RefreshToken;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

  @Query("""
      select case when COUNT(t.token) > 0
      then true else false end from RefreshToken t where t.token = :token
      """)
  boolean exists(String token);

  @Modifying
  @Query("delete from RefreshToken t where t.expires <= CURRENT_TIMESTAMP")
  void deleteExpired();
}
