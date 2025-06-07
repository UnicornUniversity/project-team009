package cz.telemetry.whiskey.service.impl;

import cz.telemetry.whiskey.repository.SensorDataRepository;
import cz.telemetry.whiskey.security.sensor.SensorData;
import cz.telemetry.whiskey.security.sensor.SensorDataDto;
import cz.telemetry.whiskey.service.SensorDataService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.*;
import java.util.List;
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

    public Optional<Double> getCurrentHumidity() {
        return repository.findTopByOrderByTimestampDesc()
                .map(SensorData::getHumidity);
    }


    public Optional<Double> getAverageTemperatureByDate(LocalDate date) {
                return Optional.ofNullable(repository.getAverageTemperatureByDate(date));
    }

    @Override
   public Optional<Double> getAverageHumidityByDate(LocalDate date) {
        return Optional.ofNullable(repository.getAverageHumidityByDate(date));
    }

    @Override
    public Optional<Double> getAverageTemperatureBetween(LocalDate start, LocalDate end) {
        Instant startInstant = start.atStartOfDay(ZoneId.systemDefault()).toInstant();
        Instant endInstant = end.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        return repository.findAverageTemperatureBetween(startInstant, endInstant);
    }

    @Override
    public List<SensorData> getSensorDataBetween(Instant from, Instant to) {
        return repository.findAllByTimestampBetween(from, to);
    }

    public Optional<Double> getAverageHumidityBetween(LocalDate start, LocalDate end) {
        Instant from = start.atStartOfDay(ZoneOffset.UTC).toInstant();
        Instant to = end.plusDays(1).atStartOfDay(ZoneOffset.UTC).toInstant();
        return repository.findAverageHumidityBetween(from, to);
    }



}