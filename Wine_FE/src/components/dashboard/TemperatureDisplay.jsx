import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Fade,
  Chip,
  useTheme,
  alpha,
  Modal,
  IconButton,
  Tooltip,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import TemperatureSettings from "./TemperatureSettings";
import AnimatedStat from "../common/AnimatedStat";
import ContentLoader from "../common/ContentLoader";
import DashboardCard from "../common/DashboardCard";
import RangeIndicator from "../common/RangeIndicator";
import {
  getCurrentTemperature,
  getSensorDataBetweenDates,
} from "../../services/sensors";
import { generateTemperature } from "../../services/mockData";
import { keyframes } from "@emotion/react";

const USE_MOCK_FOR_SENSORS =
  import.meta.env.VITE_USE_MOCK_SENSORS === "true"
    ? true
    : import.meta.env.VITE_USE_MOCK_SENSORS === "false"
    ? false
    : true;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  70% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
`;

const TemperatureDisplay = () => {
  const theme = useTheme();
  const [currentTemp, setCurrentTemp] = useState(null);
  const [prevTemp, setPrevTemp] = useState(null);
  const [minTemperature, setMinTemperature] = useState(() => {
    return Number(localStorage.getItem("minTemperature")) || 25;
  });
  const [maxTemperature, setMaxTemperature] = useState(() => {
    return Number(localStorage.getItem("maxTemperature")) || 35;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dataTimestamp, setDataTimestamp] = useState(null);
  const [lastRequestTime, setLastRequestTime] = useState(null);
  const [prevDataTimestamp, setPrevDataTimestamp] = useState(null);
  const [validUntil, setValidUntil] = useState(() => {
    const stored = localStorage.getItem("temperatureValidUntil");
    return stored ? new Date(stored) : null;
  });
  const lastTempRef = useRef(null);

  const fetchTemperature = async () => {
    const requestTime = new Date();

    try {
      setLoading(true);
      setError(null);

      try {
        let newTemp, newSensorTimestamp;

        if (USE_MOCK_FOR_SENSORS) {
          newTemp = await getCurrentTemperature();
          newSensorTimestamp = new Date();

          const previousMinute = new Date();
          previousMinute.setMinutes(previousMinute.getMinutes() - 1);
          const mockPrevTemp = parseFloat(generateTemperature(previousMinute));
          setPrevTemp(mockPrevTemp);
          setPrevDataTimestamp(
            new Date(newSensorTimestamp.getTime() - 60 * 1000)
          );
        } else {
          const endTime = new Date();
          const startTime = new Date();
          startTime.setHours(startTime.getHours() - 24);

          const recentData = await getSensorDataBetweenDates(
            startTime,
            endTime
          );

          if (
            recentData &&
            Array.isArray(recentData) &&
            recentData.length > 0
          ) {
            const sortedData = [...recentData].sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );

            const latestReading = sortedData[sortedData.length - 1];
            newTemp = latestReading.temperature;
            newSensorTimestamp = new Date(latestReading.timestamp);

            const targetTime = new Date(
              new Date(latestReading.timestamp).getTime() - 30 * 1000
            );

            let previousReading = null;
            let smallestDiff = Infinity;

            for (const reading of sortedData) {
              const readingTime = new Date(reading.timestamp);
              const diff = targetTime.getTime() - readingTime.getTime();

              if (
                diff >= 0 &&
                diff < smallestDiff &&
                readingTime < new Date(latestReading.timestamp)
              ) {
                smallestDiff = diff;
                previousReading = reading;
              }
            }

            if (previousReading) {
              setPrevTemp(previousReading.temperature);
              setPrevDataTimestamp(new Date(previousReading.timestamp));
            } else if (currentTemp !== null) {
              setPrevTemp(currentTemp);
              setPrevDataTimestamp(dataTimestamp);
            }
          } else {
            newTemp = await getCurrentTemperature();
            newSensorTimestamp = requestTime;

            if (currentTemp !== null) {
              setPrevTemp(currentTemp);
              setPrevDataTimestamp(dataTimestamp);
            }
          }
        }

        setCurrentTemp(newTemp);
        setDataTimestamp(newSensorTimestamp);
        setLastRequestTime(requestTime);
        lastTempRef.current = newTemp;
      } catch (err) {
        console.error("Failed to fetch temperature:", err);
        setError(err.message || "Nepodařilo se načíst data o teplotě");
        setLastRequestTime(requestTime);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemperature();
    const interval = setInterval(fetchTemperature, 30 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (validUntil && new Date() > validUntil) {
      setMinTemperature(25);
      setMaxTemperature(35);
      setValidUntil(null);
      localStorage.removeItem("minTemperature");
      localStorage.removeItem("maxTemperature");
      localStorage.removeItem("temperatureValidUntil");
    }
  }, [validUntil]);

  useEffect(() => {
    localStorage.setItem("minTemperature", minTemperature);
    localStorage.setItem("maxTemperature", maxTemperature);
  }, [minTemperature, maxTemperature]);

  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  const handleSaveSettings = (settings) => {
    setMinTemperature(settings.minTemperature);
    setMaxTemperature(settings.maxTemperature);

    if (settings.validityPeriod) {
      const validityDate = new Date(settings.validityPeriod);
      setValidUntil(validityDate);
      localStorage.setItem("temperatureValidUntil", validityDate.toISOString());
    } else {
      setValidUntil(null);
      localStorage.removeItem("temperatureValidUntil");
    }

    setSettingsOpen(false);
  };

  const getTemperatureStatus = () => {
    if (currentTemp === null) return null;
    if (currentTemp < minTemperature) return "low";
    if (currentTemp > maxTemperature) return "high";
    return "optimal";
  };

  const tempStatus = getTemperatureStatus();

  const getStatusChip = (status) => {
    if (!status) return null;

    const statusConfig = {
      low: { label: "Nízká", color: "error" },
      optimal: { label: "Optimální", color: "success" },
      high: { label: "Vysoká", color: "error" },
    };

    const config = statusConfig[status];

    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        sx={{ fontWeight: 500 }}
      />
    );
  };

  const formatTimestampWithSeconds = (timestamp) => {
    if (!timestamp) return "N/A";

    return new Intl.DateTimeFormat("cs-CZ", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(timestamp);
  };

  const actionButton = (
    <Tooltip title="Nastavení limitů teploty" arrow>
      <IconButton
        aria-label="settings"
        onClick={handleOpenSettings}
        size="small"
        sx={{
          backgroundColor: alpha(theme.palette.background.paper, 0.1),
          "&:hover": {
            backgroundColor: alpha(theme.palette.background.paper, 0.2),
          },
        }}
      >
        <SettingsIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );

  return (
    <DashboardCard
      title="Teplota"
      accentColor={theme.palette.warning.main}
      tooltip="Aktuální teplota ve skladu whiskey"
      chipContent={tempStatus && getStatusChip(tempStatus)}
      action={actionButton}
    >
      {loading && !currentTemp ? (
        <ContentLoader message="Načítání teplotních dat..." />
      ) : error ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="200px"
        >
          <Typography color="error">{error}</Typography>
        </Box>
      ) : (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              my: 3,
            }}
          >
            <Fade in={!loading} timeout={800}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    backgroundColor:
                      tempStatus === "optimal" ? "success.main" : "error.main",
                    opacity: 0.6,
                    animation: `${pulse} 2s infinite ease-in-out`,
                  }}
                />

                <Box
                  sx={{
                    backgroundColor: "background.paper",
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: 3,
                    zIndex: 1,
                  }}
                >
                  <ThermostatIcon
                    color={tempStatus === "optimal" ? "success" : "error"}
                    sx={{ fontSize: 36 }}
                  />
                </Box>
              </Box>
            </Fade>
          </Box>

          <AnimatedStat
            label="Aktuální hodnota"
            value={currentTemp}
            previousValue={prevTemp}
            unit="°C"
            large
            delay={300}
            color={
              tempStatus === "optimal"
                ? theme.palette.success.main
                : theme.palette.error.main
            }
            trendTooltip={
              prevTemp !== null ? (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Předchozí hodnota
                  </Typography>
                  <Typography variant="body2">{prevTemp}°C</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {prevDataTimestamp
                      ? `Zaznamenaná: ${formatTimestampWithSeconds(
                          prevDataTimestamp
                        )}`
                      : "Čas není k dispozici"}
                  </Typography>
                </Box>
              ) : (
                "Předchozí hodnota není k dispozici"
              )
            }
          />

          <RangeIndicator
            currentValue={currentTemp}
            minValue={minTemperature}
            maxValue={maxTemperature}
            label="Rozsah teplot"
            unit="°C"
            delay={600}
            color={
              tempStatus === "optimal"
                ? theme.palette.success.main
                : theme.palette.error.main
            }
          />

          <Fade in={!loading} timeout={1500}>
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontStyle: "italic", mb: 0.5 }}
              >
                Data aktualizována: {formatTimestampWithSeconds(dataTimestamp)}
              </Typography>
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ fontStyle: "italic" }}
              >
                Poslední pokus o načtení dat:{" "}
                {formatTimestampWithSeconds(lastRequestTime)}
              </Typography>
            </Box>
          </Fade>
        </Box>
      )}

      <Modal
        open={settingsOpen}
        onClose={handleCloseSettings}
        aria-labelledby="temperature-settings-modal"
      >
        <Box>
          <TemperatureSettings
            initialValues={{
              minTemperature,
              maxTemperature,
              validityDate: validUntil,
            }}
            onSave={handleSaveSettings}
            onCancel={handleCloseSettings}
          />
        </Box>
      </Modal>
    </DashboardCard>
  );
};

export default TemperatureDisplay;
