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
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import cs from "date-fns/locale/cs";

const HumiditySettings = ({ initialValues, onSave, onCancel }) => {
  const theme = useTheme();
  const [minHumidity, setMinHumidity] = useState(
    initialValues?.minHumidity || 45
  );
  const [maxHumidity, setMaxHumidity] = useState(
    initialValues?.maxHumidity || 75
  );
  const [validityDate, setValidityDate] = useState(
    initialValues?.validityDate || null
  );
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (minHumidity === "" || isNaN(minHumidity)) {
      newErrors.minHumidity = "Zadejte platnou minimální hodnotu";
    } else if (Number(minHumidity) < 0 || Number(minHumidity) > 100) {
      newErrors.minHumidity = "Hodnota musí být mezi 0-100%";
    }

    if (maxHumidity === "" || isNaN(maxHumidity)) {
      newErrors.maxHumidity = "Zadejte platnou maximální hodnotu";
    } else if (Number(maxHumidity) < 0 || Number(maxHumidity) > 100) {
      newErrors.maxHumidity = "Hodnota musí být mezi 0-100%";
    }

    if (Number(minHumidity) >= Number(maxHumidity)) {
      newErrors.maxHumidity = "Maximální hodnota musí být větší než minimální";
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
        minHumidity: Number(minHumidity),
        maxHumidity: Number(maxHumidity),
        validityPeriod: validityDate
          ? validityDate.toISOString().split("T")[0]
          : null,
      });
    }
  };

  const handleSliderChange = (event, newValue) => {
    setMinHumidity(newValue[0]);
    setMaxHumidity(newValue[1]);
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
          backgroundColor: theme.palette.info.main,
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <WaterDropIcon sx={{ color: "white", mr: 1.5 }} />
          <Typography
            variant="h6"
            component="h2"
            sx={{ color: "white", fontWeight: 600 }}
          >
            Nastavení vlhkosti
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
                Rozsah vlhkosti
              </Typography>
              <Slider
                value={[minHumidity, maxHumidity]}
                onChange={handleSliderChange}
                valueLabelDisplay="on"
                min={0}
                max={100}
                color="info"
                sx={{
                  mt: 2,
                  mb: 3,
                  "& .MuiSlider-valueLabel": {
                    backgroundColor: theme.palette.info.main,
                  },
                }}
                valueLabelFormat={(value) => `${value}%`}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Minimální hodnota (%)"
                    type="number"
                    value={minHumidity}
                    onChange={(e) => setMinHumidity(e.target.value)}
                    error={!!errors.minHumidity}
                    helperText={errors.minHumidity}
                    inputProps={{ min: 0, max: 100, step: 1 }}
                    variant="outlined"
                    size="small"
                    color="info"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Maximální hodnota (%)"
                    type="number"
                    value={maxHumidity}
                    onChange={(e) => setMaxHumidity(e.target.value)}
                    error={!!errors.maxHumidity}
                    helperText={errors.maxHumidity}
                    inputProps={{ min: 0, max: 100, step: 1 }}
                    variant="outlined"
                    size="small"
                    color="info"
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
                      helperText={
                        errors.validityDate ||
                        "Zvolte datum, do kdy bude nastavení platné"
                      }
                      color="info"
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
                color="info"
                onClick={() => {
                  setMinHumidity(45);
                  setMaxHumidity(75);
                  setValidityDate(null);
                }}
                startIcon={<RefreshIcon />}
                sx={{ mr: 1 }}
              >
                Výchozí hodnoty
              </Button>
            </Grid>
            <Grid item>
              <Button
                type="submit"
                variant="contained"
                color="info"
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

export default HumiditySettings;
