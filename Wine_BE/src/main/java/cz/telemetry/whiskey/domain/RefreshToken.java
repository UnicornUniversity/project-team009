package cz.telemetry.whiskey.domain;

import jakarta.persistence.*;

import java.time.Instant;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@EqualsAndHashCode(of = "token")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

  @Id
  @Column(columnDefinition = "TEXT")
  private String token;

  private Instant expires;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "profile")
  private Profile user;
}
