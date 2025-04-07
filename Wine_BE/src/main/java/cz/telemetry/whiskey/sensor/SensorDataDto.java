package cz.telemetry.whiskey.sensor;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Created by User: Vu
 * Date: 30.03.2025
 * Time: 16:29
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensorDataDto {
    private double temperature;
    private double humidity;
    private Instant timestamp;
    private String sensorId;
}
