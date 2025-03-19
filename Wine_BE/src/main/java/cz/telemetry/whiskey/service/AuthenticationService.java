package cz.telemetry.whiskey.service;

import cz.telemetry.whiskey.api.request.AuthRequest;
import cz.telemetry.whiskey.api.request.RefreshTokenRequest;
import cz.telemetry.whiskey.api.response.LoginResponse;
import org.springframework.lang.NonNull;

public interface AuthenticationService {

  @NonNull
  LoginResponse performLogin(@NonNull AuthRequest request);

  @NonNull
  LoginResponse refresh(@NonNull RefreshTokenRequest request);

  @NonNull
  LoginResponse registerUser(@NonNull AuthRequest request);
}
