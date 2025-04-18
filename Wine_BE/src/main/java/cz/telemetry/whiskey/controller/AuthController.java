package cz.telemetry.whiskey.controller;

import cz.telemetry.whiskey.annotation.CustomApiResponse;
import cz.telemetry.whiskey.api.request.AuthRequest;
import cz.telemetry.whiskey.api.request.RefreshTokenRequest;
import cz.telemetry.whiskey.api.response.LoginResponse;
import cz.telemetry.whiskey.service.AuthenticationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Authorization")
@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {

  private final AuthenticationService authenticationService;

  @PostMapping("/login")
  @Operation(summary = "${api.auth.login.title}", description = "${api.auth.login.detail}")
  @CustomApiResponse(description = "${api.auth.registration.start}")
  public ResponseEntity<LoginResponse> login(@Valid @RequestBody AuthRequest request) {
    return ResponseEntity.ok(authenticationService.performLogin(request));
  }

  @PostMapping("/register")
  @Operation(summary = "${api.auth.registration.title}", description = "${api.auth.registration.detail}")
  @CustomApiResponse(description = "${api.auth.registration.start}")
  public ResponseEntity<LoginResponse> register(@RequestBody AuthRequest request) {
    return ResponseEntity.ok(authenticationService.registerUser(request));
  }

  @PostMapping("/refresh")
  @Operation(summary = "${api.auth.refresh.title}", description = "${api.auth.refresh.detail}")
  @CustomApiResponse(description = "${api.auth.refresh.start}")
  public ResponseEntity<LoginResponse> refreshToken(
      @Valid @RequestBody RefreshTokenRequest request) {
    return ResponseEntity.ok(authenticationService.refresh(request));
  }
}
