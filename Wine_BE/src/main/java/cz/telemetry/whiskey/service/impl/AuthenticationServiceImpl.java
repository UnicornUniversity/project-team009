package cz.telemetry.whiskey.service.impl;

import static cz.telemetry.whiskey.api.JwtClaims.ROLE_CLAIM;
import static cz.telemetry.whiskey.api.JwtClaims.USERNAME;

import cz.telemetry.whiskey.api.request.AuthRequest;
import cz.telemetry.whiskey.api.request.RefreshTokenRequest;
import cz.telemetry.whiskey.api.response.LoginResponse;
import cz.telemetry.whiskey.config.properties.WhiskeyProperties;
import cz.telemetry.whiskey.domain.Profile;
import cz.telemetry.whiskey.domain.RefreshToken;
import cz.telemetry.whiskey.exception.EntityNotFoundException;
import cz.telemetry.whiskey.repository.ProfileRepository;
import cz.telemetry.whiskey.repository.RefreshTokenRepository;
import cz.telemetry.whiskey.service.AuthenticationService;
import cz.telemetry.whiskey.service.ProfileService;
import cz.telemetry.whiskey.utils.StaticObjectFactory;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

  private final AuthenticationManager authenticationManager;
  private final StaticObjectFactory staticObjectFactory;
  private final ProfileRepository userRepository;
  private final ProfileService userService;
  private final RefreshTokenRepository refreshTokenRepository;
  private final JwtEncoder jwtEncoder;
  private final JwtDecoder jwtDecoder;
  private final WhiskeyProperties whiskeyProperties;


  @NonNull
  @Override
  public LoginResponse performLogin(@NonNull AuthRequest request) {
    final var authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(
            request.username(),
            request.password()
        ));

    if (!authentication.isAuthenticated()) {
      throw new AccessDeniedException("Unauthorized");
    }

    final var user = userRepository.findByUsername(request.username())
        .orElseThrow(() -> new EntityNotFoundException(Profile.class));
    userRepository.updateLastLogin(user.getUsername());
    return performLoginForUser(authentication, user.getId());
  }

  @NonNull
  @Override
  public LoginResponse refresh(@NonNull RefreshTokenRequest request) {
    final var claims = jwtDecoder.decode(request.refreshToken());

    if (!refreshTokenRepository.exists(request.refreshToken())) {
      throw new EntityNotFoundException(RefreshToken.class);
    }

    final var user = userRepository.findById(UUID.fromString(claims.getSubject()))
        .orElseThrow(() -> new EntityNotFoundException(Profile.class));
    final var now = staticObjectFactory.getNowAsInstant();

    final var accessTokenClaims = JwtClaimsSet.builder().claims(c -> c.putAll(claims.getClaims()))
        .expiresAt(now.plus(whiskeyProperties.getAccessToken().getDuration()))
        .id(staticObjectFactory.getRandomId().toString()).build();

    final var refreshExpiry = now.plus(whiskeyProperties.getRefreshToken().getDuration());
    final var refreshTokenClaims = JwtClaimsSet.builder().claims(c -> c.putAll(claims.getClaims()))
        .expiresAt(refreshExpiry).id(staticObjectFactory.getRandomId().toString()).build();

    return getLoginResponse(user, accessTokenClaims, refreshTokenClaims);
  }

  @Scheduled(cron = "@hourly")
  public void clearExpiredRefreshTokens() {
    refreshTokenRepository.deleteExpired();
  }

  @NonNull
  @Override
  public LoginResponse registerUser(@NonNull AuthRequest request) {
    final var userId = userService.registerNewUser(request);

    return performLoginForUser(authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.username(), request.password())),
        userId);
  }

  private JwtClaimsSet createAccessToken(UUID id, Profile user, Instant now,
      Authentication authentication) {
    final var claims = JwtClaimsSet.builder()
        .id(id.toString())
        .issuedAt(staticObjectFactory.now());

    final var scope = authentication.getAuthorities().stream()
        .map(GrantedAuthority::getAuthority)
        .collect(Collectors.joining(" "));
    claims.claim(ROLE_CLAIM, scope);
    claims.subject(user.getId().toString());
    claims.claim(USERNAME, user.getUsername());
    claims.subject(user.getId().toString());
    claims.expiresAt(now.plus(whiskeyProperties.getAccessToken().getDuration()));

    return claims.build();
  }

  private LoginResponse performLoginForUser(Authentication authentication, UUID userId) {
    final var user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException(
        Profile.class));
    final var now = staticObjectFactory.getNowAsInstant();

    final var accessTokenClaims = createAccessToken(staticObjectFactory.getRandomId(), user, now,
        authentication);
    final var refreshTokenClaims = JwtClaimsSet.from(accessTokenClaims)
        .expiresAt(now.plus(whiskeyProperties.getRefreshToken().getDuration())).build();

    return getLoginResponse(user, accessTokenClaims, refreshTokenClaims);
  }

  private LoginResponse getLoginResponse(Profile user, JwtClaimsSet accessTokenClaims,
      JwtClaimsSet refreshTokenClaims) {
    final var accessTokenValue = jwtEncoder.encode(JwtEncoderParameters.from(accessTokenClaims))
        .getTokenValue();
    final var refreshTokenValue = jwtEncoder.encode(JwtEncoderParameters.from(refreshTokenClaims))
        .getTokenValue();
    refreshTokenRepository.save(
        new RefreshToken(refreshTokenValue, refreshTokenClaims.getExpiresAt(), user));
    return new LoginResponse(accessTokenValue, refreshTokenValue);
  }
}
