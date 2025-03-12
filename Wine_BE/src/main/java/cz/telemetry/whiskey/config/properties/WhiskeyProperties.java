package cz.telemetry.whiskey.config.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.NestedConfigurationProperty;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "whiskey")
public class WhiskeyProperties {

  @NestedConfigurationProperty
  private TokenProperties accessToken;

  @NestedConfigurationProperty
  private TokenProperties refreshToken;
}
