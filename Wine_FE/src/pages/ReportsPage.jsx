import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  useTheme,
  alpha,
  Fade,
  TextField,
  Chip,
} from "@mui/material";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DownloadIcon from "@mui/icons-material/Download";
import DataUsageIcon from "@mui/icons-material/DataUsage";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import cs from "date-fns/locale/cs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { getSensorDataBetweenDates } from "../services/sensors";
import { formatDateTimeForBackend } from "../utils/dateHelpers";
import ContentLoader from "../components/common/ContentLoader";
import {
  formatTemperature,
  formatHumidity,
  formatDate,
} from "../utils/formatters";
import { mockConfig } from "../services/mockData";

const USE_MOCK_FOR_SENSORS =
  import.meta.env.VITE_USE_MOCK_SENSORS === "true"
    ? true
    : import.meta.env.VITE_USE_MOCK_SENSORS === "false"
    ? false
    : true;

const ReportsPage = () => {
  const theme = useTheme();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reportType, setReportType] = useState("temperature");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reportData, setReportData] = useState(null);

  const getDateLimits = () => {
    if (USE_MOCK_FOR_SENSORS) {
      return {
        minDate: new Date(mockConfig.dateRange.startDate),
        maxDate: new Date(mockConfig.dateRange.endDate),
      };
    } else {
      const maxDate = new Date();
      const minDate = new Date();
      minDate.setMonth(minDate.getMonth() - 6);
      return { minDate, maxDate };
    }
  };

  const { minDate, maxDate } = getDateLimits();

  useEffect(() => {
    const end = new Date();
    if (end > maxDate) {
      end.setTime(maxDate.getTime());
    }

    const start = new Date(end);
    start.setDate(start.getDate() - 7);
    if (start < minDate) {
      start.setTime(minDate.getTime());
    }

    setStartDate(start);
    setEndDate(end);
  }, [USE_MOCK_FOR_SENSORS]);

  useEffect(() => {
    if (reportData) {
      setReportData(null);
    }
  }, [reportType]);

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      setError("Vyberte prosím datum začátku a konce");
      return;
    }

    if (startDate < minDate) {
      setError(
        `Datum začátku nesmí být před ${minDate.toLocaleDateString(
          "cs-CZ"
        )} (nejstarší dostupná data)`
      );
      return;
    }

    if (endDate > maxDate) {
      setError(
        `Datum konce nesmí být po ${maxDate.toLocaleDateString(
          "cs-CZ"
        )} (nejnovější dostupná data)`
      );
      return;
    }

    if (endDate < startDate) {
      setError("Datum konce musí být po datu začátku");
      return;
    }

    const dayDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

    if (dayDiff > 31) {
      setError("Pro snadnější analýzu dat zvolte období kratší než 31 dní");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let startDateTime, endDateTime;

      if (USE_MOCK_FOR_SENSORS) {
        startDateTime = startDate.toISOString().split("T")[0];
        endDateTime = endDate.toISOString().split("T")[0];
      } else {
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);

        startDateTime = formatDateTimeForBackend(startOfDay);
        endDateTime = formatDateTimeForBackend(endOfDay);
      }

      const sensorData = await getSensorDataBetweenDates(
        startDateTime,
        endDateTime
      );

      if (sensorData && Array.isArray(sensorData) && sensorData.length > 0) {
        const sortedData = [...sensorData].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );

        const readings = sortedData.map((reading) => ({
          timestamp: reading.timestamp,
          value:
            reportType === "temperature"
              ? reading.temperature
              : reading.humidity,
          date: formatDate(reading.timestamp),
          time: new Date(reading.timestamp).toLocaleTimeString("cs-CZ"),
        }));

        const sum = readings.reduce((acc, item) => acc + item.value, 0);
        const average = readings.length > 0 ? sum / readings.length : 0;

        const minValue = Math.min(...readings.map((item) => item.value));
        const maxValue = Math.max(...readings.map((item) => item.value));

        const optimalRange =
          reportType === "temperature"
            ? USE_MOCK_FOR_SENSORS
              ? mockConfig.temperature
              : { optimalMin: 16, optimalMax: 22 }
            : USE_MOCK_FOR_SENSORS
            ? mockConfig.humidity
            : { optimalMin: 25, optimalMax: 45 };

        setReportData({
          average: parseFloat(average.toFixed(1)),
          type: reportType,
          startDate: formatDate(startDateTime),
          endDate: formatDate(endDateTime),
          minValue: parseFloat(minValue.toFixed(1)),
          maxValue: parseFloat(maxValue.toFixed(1)),
          readings: readings,
          rawData: sortedData,
          optimalMin: optimalRange.optimalMin,
          optimalMax: optimalRange.optimalMax,
          dataSource: USE_MOCK_FOR_SENSORS ? "mock" : "api",
        });
      } else {
        throw new Error("Nebyly nalezeny žádné záznamy pro zadané období");
      }
    } catch (err) {
      console.error("Error generating report:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Nepodařilo se vygenerovat report. Zkontrolujte připojení k serveru."
      );
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!reportData) return;

    const headers = `Datum,Čas,${
      reportType === "temperature" ? "Teplota (°C)" : "Vlhkost (%)"
    }`;

    const csvContent = [
      headers,
      ...reportData.readings.map(
        (reading) => `${reading.date},${reading.time},${reading.value}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${reportType}_report_${reportData.startDate}_${reportData.endDate}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const value = data.value;
      const unit = reportType === "temperature" ? "°C" : "%";

      return (
        <Paper
          sx={{
            p: 2,
            backgroundColor: alpha(theme.palette.background.paper, 0.95),
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {new Date(label).toLocaleString("cs-CZ")}
          </Typography>
          <Typography variant="body2" color={data.color}>
            {reportType === "temperature" ? "Teplota" : "Vlhkost"}: {value}
            {unit}
          </Typography>
        </Paper>
      );
    }

    return null;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ fontWeight: 600 }}
        >
          Reporty a analýzy
        </Typography>

        <Typography variant="body1" color="text.secondary">
          Generujte podrobné reporty pro analýzu teplotních a vlhkostních dat
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
          <Grid container spacing={3} sx={{ mt: 0 }}>
            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Datum začátku"
                value={startDate}
                onChange={setStartDate}
                minDate={minDate}
                maxDate={endDate || maxDate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    helperText="Vyberte počáteční datum"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <DatePicker
                label="Datum konce"
                value={endDate}
                onChange={setEndDate}
                minDate={startDate || minDate}
                maxDate={maxDate}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    helperText="Vyberte koncové datum"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="report-type-label">Typ reportu</InputLabel>
                <Select
                  labelId="report-type-label"
                  id="report-type"
                  value={reportType}
                  label="Typ reportu"
                  onChange={(e) => setReportType(e.target.value)}
                >
                  <MenuItem value="temperature">Teplota</MenuItem>
                  <MenuItem value="humidity">Vlhkost</MenuItem>
                </Select>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ mt: 0.5, ml: 1.5 }}
                >
                  Vyberte typ dat pro zobrazení v reportu
                </Typography>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={handleGenerateReport}
                  disabled={loading || !startDate || !endDate}
                  startIcon={<AnalyticsIcon />}
                >
                  Vygenerovat report
                </Button>
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </Paper>

      {loading && (
        <ContentLoader message="Generování reportu..." height="200px" />
      )}

      {reportData && !loading && (
        <Fade in={!loading} timeout={800}>
          <Paper sx={{ p: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Výsledky reportu
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={exportToCSV}
              >
                Export CSV
              </Button>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.04)"
                          : "rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Období
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <CalendarTodayIcon
                        sx={{ fontSize: 18, mr: 1, color: "primary.main" }}
                      />
                      <Typography>
                        {reportData.startDate} až {reportData.endDate}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor:
                        theme.palette.mode === "dark"
                          ? "rgba(255, 255, 255, 0.04)"
                          : "rgba(0, 0, 0, 0.02)",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      gutterBottom
                    >
                      Statistiky
                    </Typography>
                    <Typography>
                      Průměr:{" "}
                      {reportType === "temperature"
                        ? formatTemperature(reportData.average)
                        : formatHumidity(reportData.average)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Min:{" "}
                      {reportType === "temperature"
                        ? formatTemperature(reportData.minValue)
                        : formatHumidity(reportData.minValue)}{" "}
                      | Max:{" "}
                      {reportType === "temperature"
                        ? formatTemperature(reportData.maxValue)
                        : formatHumidity(reportData.maxValue)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={reportData.readings}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="timestamp"
                    tickFormatter={(tick) =>
                      new Date(tick).toLocaleDateString("cs-CZ")
                    }
                  />
                  <YAxis
                    tickFormatter={(tick) => {
                      return reportType === "temperature"
                        ? `${tick}°C`
                        : `${tick}%`;
                    }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <ReferenceLine
                    y={reportData.average}
                    label="Průměr"
                    stroke={theme.palette.primary.main}
                    strokeDasharray="3 3"
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name={
                      reportData.type === "temperature" ? "Teplota" : "Vlhkost"
                    }
                    stroke={theme.palette.primary.main}
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Fade>
      )}
    </Container>
  );
};

export default ReportsPage;
