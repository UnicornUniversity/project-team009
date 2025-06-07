package cz.telemetry.whiskey.service;

import cz.telemetry.whiskey.security.sensor.SensorData;
import cz.telemetry.whiskey.security.sensor.SensorDataDto;
import jakarta.persistence.criteria.CriteriaBuilder;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Created by User: Vu
 * Date: 30.03.2025
 * Time: 16:28
 */
public interface SensorDataService {
    boolean saveSensorData(SensorDataDto dto);

    Optional<Double> getCurrentTemperature();

    Optional<Double> getCurrentHumidity();

    Optional<Double> getAverageTemperatureByDate(LocalDate date);

    Optional<Double> getAverageHumidityByDate(LocalDate date);

    Optional<Double> getAverageTemperatureBetween(LocalDate start, LocalDate end);

    Optional<Double> getAverageHumidityBetween(LocalDate start, LocalDate end);

    List<SensorData> getSensorDataBetween(Instant from, Instant to);

}
