import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  Slider,
  Divider,
  useTheme,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RefreshIcon from "@mui/icons-material/Refresh";
import SaveIcon from "@mui/icons-material/Save";
import ThermostatIcon from "@mui/icons-material/Thermostat";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import cs from "date-fns/locale/cs";

const TemperatureSettings = ({ initialValues, onSave, onCancel }) => {
  const theme = useTheme();
  const [minTemperature, setMinTemperature] = useState(
    initialValues?.minTemperature || 25
  );
  const [maxTemperature, setMaxTemperature] = useState(
    initialValues?.maxTemperature || 35
  );
  const [validityDate, setValidityDate] = useState(
    initialValues?.validityDate || null
  );
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (minTemperature === "" || isNaN(minTemperature)) {
      newErrors.minTemperature = "Zadejte platnou minimální hodnotu";
    } else if (Number(minTemperature) < 15 || Number(minTemperature) > 50) {
      newErrors.minTemperature = "Hodnota musí být mezi 10-30°C";
    }

    if (maxTemperature === "" || isNaN(maxTemperature)) {
      newErrors.maxTemperature = "Zadejte platnou maximální hodnotu";
    } else if (Number(maxTemperature) < 15 || Number(maxTemperature) > 50) {
      newErrors.maxTemperature = "Hodnota musí být mezi 10-30°C";
    }

    if (Number(minTemperature) >= Number(maxTemperature)) {
      newErrors.maxTemperature =
        "Maximální hodnota musí být větší než minimální";
    }

    if (validityDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(validityDate);
      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate <= today) {
        newErrors.validityDate = "Datum platnosti musí být v budoucnosti";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSave({
        minTemperature: Number(minTemperature),
        maxTemperature: Number(maxTemperature),
        validityPeriod: validityDate
          ? validityDate.toISOString().split("T")[0]
          : null,
      });
    }
  };

  const handleSliderChange = (event, newValue) => {
    setMinTemperature(newValue[0]);
    setMaxTemperature(newValue[1]);
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  };

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: { xs: "90%", sm: 450 },
        p: 0,
        outline: "none",
        overflow: "hidden",
        borderRadius: 2,
        boxShadow: theme.shadows[10],
      }}
    >
      <Box
        sx={{
          backgroundColor: theme.palette.warning.main,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ThermostatIcon sx={{ color: "white", mr: 1.5 }} />
          <Typography
            variant="h6"
            component="h2"
            sx={{ color: "white", fontWeight: 600 }}
          >
            Nastavení teploty
          </Typography>
        </Box>
        <IconButton
          onClick={onCancel}
          size="small"
          sx={{
            color: "white",
            "&:hover": {
              backgroundColor: alpha(theme.palette.common.white, 0.15),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <Box sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                Rozsah teploty
              </Typography>
              <Slider
                value={[minTemperature, maxTemperature]}
                onChange={handleSliderChange}
                valueLabelDisplay="on"
                min={15}
                max={50}
                color="warning"
                sx={{
                  mt: 2,
                  mb: 3,
                  "& .MuiSlider-valueLabel": {
                    backgroundColor: theme.palette.warning.main,
                  },
                }}
                valueLabelFormat={(value) => `${value}°C`}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Minimální hodnota (°C)"
                    type="number"
                    value={minTemperature}
                    onChange={(e) => setMinTemperature(e.target.value)}
                    error={!!errors.minTemperature}
                    helperText={errors.minTemperature}
                    inputProps={{ min: 15, max: 50, step: 1 }}
                    variant="outlined"
                    size="small"
                    color="warning"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Maximální hodnota (°C)"
                    type="number"
                    value={maxTemperature}
                    onChange={(e) => setMaxTemperature(e.target.value)}
                    error={!!errors.maxTemperature}
                    helperText={errors.maxTemperature}
                    inputProps={{ min: 15, max: 50, step: 1 }}
                    variant="outlined"
                    size="small"
                    color="warning"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography
                variant="subtitle1"
                fontWeight={600}
                gutterBottom
                sx={{ mt: 1 }}
              >
                Platnost nastavení
              </Typography>

              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                adapterLocale={cs}
              >
                <DatePicker
                  label="Platnost do"
                  value={validityDate}
                  onChange={setValidityDate}
                  minDate={getTomorrowDate()}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      margin="normal"
                      size="small"
                      error={!!errors.validityDate}
                      color="warning"
                      helperText={
                        errors.validityDate ||
                        "Zvolte datum, do kdy bude nastavení platné (volitelné)"
                      }
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item>
              <Button
                variant="outlined"
                onClick={() => {
                  setMinTemperature(25);
                  setMaxTemperature(35);
                  setValidityDate(null);
                }}
                startIcon={<RefreshIcon />}
                sx={{ mr: 1 }}
                color="warning"
              >
                Výchozí hodnoty
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="warning"
                startIcon={<SaveIcon />}
              >
                Uložit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Paper>
  );
};

export default TemperatureSettings;
