package cz.telemetry.whiskey.service;

import cz.telemetry.whiskey.api.request.AuthRequest;
import java.util.UUID;
import org.springframework.lang.NonNull;

public interface ProfileService {

  UUID registerNewUser(@NonNull AuthRequest request);
}
