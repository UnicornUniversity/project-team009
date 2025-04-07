package cz.telemetry.whiskey.service.impl;

import cz.telemetry.whiskey.repository.SensorDataRepository;
import cz.telemetry.whiskey.sensor.SensorData;
import cz.telemetry.whiskey.sensor.SensorDataDto;
import cz.telemetry.whiskey.service.SensorDataService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Optional;

/**
 * Created by User: Vu
 * Date: 30.03.2025
 * Time: 16:28
 */
@Service
public class SensorDataServiceImpl implements SensorDataService {

    @Autowired
    private SensorDataRepository repository;

    @Override
    @Transactional
    public boolean saveSensorData(SensorDataDto dto) {
        boolean exists = repository.existsByTimestampAndSensorId(dto.getTimestamp(), dto.getSensorId());
        if (exists) return false;

        SensorData entity = new SensorData();
        entity.setTemperature(dto.getTemperature());
        entity.setHumidity(dto.getHumidity());
        entity.setTimestamp(dto.getTimestamp());
        entity.setSensorId(dto.getSensorId());
        repository.save(entity);
        return true;
    }

    @Override
    public Optional<Double> getCurrentTemperature() {
        return repository.findTopByOrderByTimestampDesc()
                .map(SensorData::getTemperature);
    }

    public Optional<Double> getAverageTemperatureByDate(LocalDate date) {
                return Optional.ofNullable(repository.getAverageTemperatureByDate(date));
    }

    @Override
   public Optional<Double> getAverageHumidityByDate(LocalDate date) {
        return Optional.ofNullable(repository.getAverageHumidityByDate(date));
    }
}