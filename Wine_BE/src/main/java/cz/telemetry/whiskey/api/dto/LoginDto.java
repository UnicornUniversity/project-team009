package cz.telemetry.whiskey.api.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Created by User: Vu Date: 05.03.2025 Time: 9:34
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginDto {

  private String email;
  private String password;

}
