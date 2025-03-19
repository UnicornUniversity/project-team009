package cz.telemetry.whiskey.api.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AuthRequest(@NotNull String username, @Size(min = 6) @NotNull String password) {

}
