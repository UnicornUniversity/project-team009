package cz.telemetry.whiskey.controller;

import cz.telemetry.whiskey.security.sensor.SensorData;
import cz.telemetry.whiskey.security.sensor.SensorDataDto;
import cz.telemetry.whiskey.service.SensorDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Created by User: Vu
 * Date: 30.03.2025
 * Time: 16:32
 */
@RestController
@RequestMapping("/api/sensors")
public class SensorDataController {

    @Autowired
    private SensorDataService sensorDataService;

    @PostMapping
    public ResponseEntity<String> receiveSensorData(@RequestBody SensorDataDto data) {
        boolean isSaved = sensorDataService.saveSensorData(data);
        if (isSaved) {
            return ResponseEntity.status(HttpStatus.CREATED).body("Data accepted");
        } else {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Duplicate data");
        }
    }

    @GetMapping("/temperature/current")
    public ResponseEntity<Double> getCurrentTemperature() {
        return sensorDataService.getCurrentTemperature()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/humidity/current")
    public ResponseEntity<Double> getCurrentHumidity() {
        return sensorDataService.getCurrentHumidity()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/temperature/averageByDay")
    public ResponseEntity<Double> getAverageTemperature(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return sensorDataService.getAverageTemperatureByDate(date)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/temperature/averageBetweenDays")
    public ResponseEntity<Double> getAverageTemperatureBetween(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return sensorDataService.getAverageTemperatureBetween(start, end)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/humidity/averageBetweenDays")
    public ResponseEntity<Double> getAverageHumidityBetween(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate start,
            @RequestParam("end") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate end
    ) {
        return sensorDataService.getAverageHumidityBetween(start, end)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/humidity/averageByDay")
    public ResponseEntity<Double> getAverageHumidity(@RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return sensorDataService.getAverageHumidityByDate(date)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/between")
    public List<SensorData> getSensorDataBetween(
            @RequestParam("from") Instant from,
            @RequestParam("to") Instant to
    ) {
        return sensorDataService.getSensorDataBetween(from, to);
    }


}

