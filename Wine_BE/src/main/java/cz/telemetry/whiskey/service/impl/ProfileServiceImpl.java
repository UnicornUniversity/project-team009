package cz.telemetry.whiskey.service.impl;

import cz.telemetry.whiskey.api.request.AuthRequest;
import cz.telemetry.whiskey.domain.Profile;
import cz.telemetry.whiskey.exception.UserAlreadyExistException;
import cz.telemetry.whiskey.repository.ProfileRepository;
import cz.telemetry.whiskey.service.ProfileService;
import jakarta.transaction.Transactional;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

  private final ProfileRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  @NonNull
  @Override
  public UUID registerNewUser(@NonNull AuthRequest request) {
    if (userRepository.existsByUsername(request.username())) {
      throw new UserAlreadyExistException(request.username());
    }
    return userRepository.save(
        new Profile(request.username(), passwordEncoder.encode(request.username()))).getId();
  }
}
