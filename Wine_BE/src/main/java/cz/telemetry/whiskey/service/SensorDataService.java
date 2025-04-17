package cz.telemetry.whiskey.service;

import cz.telemetry.whiskey.security.sensor.SensorDataDto;

import java.time.LocalDate;
import java.util.Optional;

/**
 * Created by User: Vu
 * Date: 30.03.2025
 * Time: 16:28
 */
public interface SensorDataService {
    boolean saveSensorData(SensorDataDto dto);

    Optional<Double> getCurrentTemperature();

    Optional<Double> getAverageTemperatureByDate(LocalDate date);

    Optional<Double> getAverageHumidityByDate(LocalDate date);


}
