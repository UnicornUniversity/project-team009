import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Fade,
  Chip,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import HumiditySettings from "./HumiditySettings";
import AnimatedStat from "../common/AnimatedStat";
import ContentLoader from "../common/ContentLoader";
import DashboardCard from "../common/DashboardCard";
import RangeIndicator from "../common/RangeIndicator";
import {
  getCurrentHumidity,
  getSensorDataBetweenDates,
} from "../../services/sensors";
import { generateHumidity } from "../../services/mockData";
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

const HumidityDisplay = () => {
  const theme = useTheme();
  const [currentHumidity, setCurrentHumidity] = useState(null);
  const [prevHumidity, setPrevHumidity] = useState(null);
  const [minHumidity, setMinHumidity] = useState(() => {
    return Number(localStorage.getItem("minHumidity")) || 45;
  });
  const [maxHumidity, setMaxHumidity] = useState(() => {
    return Number(localStorage.getItem("maxHumidity")) || 75;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [dataTimestamp, setDataTimestamp] = useState(null);
  const [lastRequestTime, setLastRequestTime] = useState(null);
  const [prevDataTimestamp, setPrevDataTimestamp] = useState(null);
  const [validUntil, setValidUntil] = useState(() => {
    const stored = localStorage.getItem("humidityValidUntil");
    return stored ? new Date(stored) : null;
  });
  const lastHumidityRef = useRef(null);

  const fetchHumidity = async () => {
    const requestTime = new Date();

    try {
      setLoading(true);
      setError(null);

      try {
        let newHumidity, newSensorTimestamp;

        if (USE_MOCK_FOR_SENSORS) {
          newHumidity = await getCurrentHumidity();
          newSensorTimestamp = new Date();

          const previousMinute = new Date();
          previousMinute.setMinutes(previousMinute.getMinutes() - 1);
          const mockPrevHumidity = parseFloat(generateHumidity(previousMinute));
          setPrevHumidity(mockPrevHumidity);
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
            newHumidity = latestReading.humidity;
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
              setPrevHumidity(previousReading.humidity);
              setPrevDataTimestamp(new Date(previousReading.timestamp));
            } else if (currentHumidity !== null) {
              setPrevHumidity(currentHumidity);
              setPrevDataTimestamp(dataTimestamp);
            }
          } else {
            newHumidity = await getCurrentHumidity();
            newSensorTimestamp = requestTime;

            if (currentHumidity !== null) {
              setPrevHumidity(currentHumidity);
              setPrevDataTimestamp(dataTimestamp);
            }
          }
        }

        setCurrentHumidity(newHumidity);
        setDataTimestamp(newSensorTimestamp);
        setLastRequestTime(requestTime);
        lastHumidityRef.current = newHumidity;
      } catch (err) {
        console.error("Error fetching humidity data:", err);
        setError(err.message || "Nepodařilo se načíst data o vlhkosti");
        setLastRequestTime(requestTime);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHumidity();
    const interval = setInterval(fetchHumidity, 30 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (validUntil && new Date() > validUntil) {
      setMinHumidity(45);
      setMaxHumidity(75);
      setValidUntil(null);
      localStorage.removeItem("minHumidity");
      localStorage.removeItem("maxHumidity");
      localStorage.removeItem("humidityValidUntil");
    }
  }, [validUntil]);

  useEffect(() => {
    localStorage.setItem("minHumidity", minHumidity);
    localStorage.setItem("maxHumidity", maxHumidity);
  }, [minHumidity, maxHumidity]);

  const handleOpenSettings = () => {
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  const handleSaveSettings = (settings) => {
    setMinHumidity(settings.minHumidity);
    setMaxHumidity(settings.maxHumidity);

    if (settings.validityPeriod) {
      const validityDate = new Date(settings.validityPeriod);
      setValidUntil(validityDate);
      localStorage.setItem("humidityValidUntil", validityDate.toISOString());
    } else {
      setValidUntil(null);
      localStorage.removeItem("humidityValidUntil");
    }

    setSettingsOpen(false);
  };

  const getHumidityStatus = () => {
    if (currentHumidity === null) return null;
    if (currentHumidity < minHumidity) return "low";
    if (currentHumidity > maxHumidity) return "high";
    return "optimal";
  };

  const humidityStatus = getHumidityStatus();

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
    <Tooltip title="Nastavení limitů vlhkosti" arrow>
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
      title="Vlhkost"
      accentColor={theme.palette.info.main}
      tooltip="Aktuální vlhkost vzduchu ve skladu whiskey"
      chipContent={humidityStatus && getStatusChip(humidityStatus)}
      action={actionButton}
    >
      {loading && !currentHumidity ? (
        <ContentLoader message="Načítání dat vlhkosti..." />
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
                      humidityStatus === "optimal"
                        ? "success.main"
                        : "error.main",
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
                  <WaterDropIcon
                    color={humidityStatus === "optimal" ? "success" : "error"}
                    sx={{ fontSize: 36 }}
                  />
                </Box>
              </Box>
            </Fade>
          </Box>

          <AnimatedStat
            label="Aktuální hodnota"
            value={currentHumidity}
            previousValue={prevHumidity}
            unit="%"
            large
            delay={300}
            color={
              humidityStatus === "optimal"
                ? theme.palette.success.main
                : theme.palette.error.main
            }
            trendTooltip={
              prevHumidity !== null ? (
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                    Předchozí hodnota
                  </Typography>
                  <Typography variant="body2">{prevHumidity}%</Typography>
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
            currentValue={currentHumidity}
            minValue={minHumidity}
            maxValue={maxHumidity}
            label="Rozsah vlhkosti"
            unit="%"
            delay={600}
            color={
              humidityStatus === "optimal"
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
        aria-labelledby="humidity-settings-modal"
      >
        <Box>
          <HumiditySettings
            initialValues={{
              minHumidity,
              maxHumidity,
              validityDate: validUntil || null,
            }}
            onSave={handleSaveSettings}
            onCancel={handleCloseSettings}
          />
        </Box>
      </Modal>
    </DashboardCard>
  );
};

export default HumidityDisplay;
