package cz.telemetry.whiskey.domain;

import cz.telemetry.whiskey.role.UserRole;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

@Getter
@Setter
@Entity
@Table(name = "profiles")
@EqualsAndHashCode(of = "id")
@NoArgsConstructor(force = true)
public class Profile {

  @Id
  @GeneratedValue
  private UUID id;

  @Column(unique = true)
  private final String username;

  private final String password;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime lastLogin;

  @Enumerated(EnumType.STRING)
  private UserRole role = UserRole.USER;

  public Profile(String username, String password) {
    this.username = username;
    this.password = password;
  }
}
