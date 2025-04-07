package cz.telemetry.whiskey.repository;

import cz.telemetry.whiskey.sensor.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

/**
 * Created by User: Vu
 * Date: 30.03.2025
 * Time: 16:26
 */
@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
    boolean existsByTimestampAndSensorId(Instant timestamp, String sensorId);

    Optional<SensorData> findTopByOrderByTimestampDesc();

    @Query("SELECT AVG(s.temperature) FROM SensorData s WHERE DATE(s.timestamp) = :date")
    Double getAverageTemperatureByDate(@Param("date") LocalDate date);

    @Query("SELECT AVG(s.humidity) FROM SensorData s WHERE DATE(s.timestamp) = :date")
    Double getAverageHumidityByDate(@Param("date") LocalDate date);


}
