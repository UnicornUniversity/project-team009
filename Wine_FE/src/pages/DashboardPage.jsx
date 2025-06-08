import { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  Card,
  CardContent,
  Chip,
  Fade,
  Tooltip,
  useTheme,
  alpha,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import HumidityDisplay from "../components/dashboard/HumidityDisplay";
import TemperatureDisplay from "../components/dashboard/TemperatureDisplay";

const DashboardPage = () => {
  const theme = useTheme();
  const [selectedUnit, setSelectedUnit] = useState("1");
  const [fadeIn, setFadeIn] = useState(false);

  const units = [
    { id: "1", name: "Sklad sudů – Sever", status: "active" },
    { id: "2", name: "Zrací místnost – Jih", status: "soon" },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Box mb={6}>
        <Fade in={fadeIn} timeout={800}>
          <Grid container columnSpacing={2} sx={{ mt: 0 }} alignItems="center">
            <Grid item>
              <Box
                sx={{
                  p: 1.5,
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <WarehouseIcon
                  sx={{
                    fontSize: 32,
                    color: "primary.main",
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.2,
                }}
              >
                Přehled
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ fontSize: "1rem" }}
              >
                Monitoring skladovacích podmínek whiskey
              </Typography>
            </Grid>
          </Grid>
        </Fade>
      </Box>

      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Fade
            in={fadeIn}
            timeout={1000}
            style={{ transitionDelay: fadeIn ? "200ms" : "0ms" }}
          >
            <Box>
              <TemperatureDisplay />
            </Box>
          </Fade>
        </Grid>
        <Grid item xs={12} md={6}>
          <Fade
            in={fadeIn}
            timeout={1000}
            style={{ transitionDelay: fadeIn ? "300ms" : "0ms" }}
          >
            <Box>
              <HumidityDisplay />
            </Box>
          </Fade>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
