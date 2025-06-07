package cz.telemetry.whiskey.security.sensor;

import cz.telemetry.whiskey.security.sensor.SensorData;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "location")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Location {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id") // volitelné, jen pro ukázku
    private Long id;

    @Column(name = "location_name", nullable = false)
    private String locationName;

    @Column(name = "sensor_name")
    private String sensorName;


}
