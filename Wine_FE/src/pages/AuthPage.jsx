import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Tabs,
  Tab,
  Container,
  Paper,
  Typography,
  useTheme,
  alpha,
  Fade,
} from "@mui/material";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import logo from "../assets/oakage-full2.svg";
import { useAuth } from "../context/AuthContext";

const AuthPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [fadeIn, setFadeIn] = useState(false);

  const isRegisterPage = location.pathname === "/register";
  const [tabValue, setTabValue] = useState(isRegisterPage ? 1 : 0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    if (newValue === 0) {
      navigate("/login", { replace: true });
    } else {
      navigate("/register", { replace: true });
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (location.pathname === "/register" && tabValue !== 1) {
      setTabValue(1);
    } else if (location.pathname === "/login" && tabValue !== 0) {
      setTabValue(0);
    }
  }, [location.pathname, tabValue]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        py: 8,
        background: `radial-gradient(circle at 50% 14%, ${alpha(
          "#c7955a",
          0.15
        )} 0%, transparent 54%)`,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Fade in={fadeIn} timeout={800}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 5,
            }}
          >
            <img
              src={logo}
              alt="OakAge Logo"
              style={{
                width: "240px",
                marginBottom: "1.5rem",
                filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
              }}
            />

            <Typography
              variant="subtitle1"
              color="primary"
              textAlign="center"
              sx={{
                mt: 1,
                letterSpacing: 1,
                opacity: 0.9,
              }}
            >
              Kontrola vlhkosti a teploty vaší whisky
            </Typography>
          </Box>
        </Fade>

        <Fade
          in={fadeIn}
          timeout={1000}
          style={{ transitionDelay: fadeIn ? "200ms" : "0ms" }}
        >
          <Paper
            elevation={4}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              border: `1px solid ${alpha(theme.palette.divider, 0.08)}`,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                },
                "& .MuiTab-root": {
                  py: 2,
                  fontSize: "1rem",
                  fontWeight: 600,
                  transition: "all 0.2s",
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                  },
                },
              }}
              TabIndicatorProps={{
                style: {
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                },
              }}
            >
              <Tab label="Přihlášení" id="login-tab" />
              <Tab label="Registrace" id="register-tab" />
            </Tabs>

            <Box p={3}>
              {tabValue === 0 && <Login />}
              {tabValue === 1 && <Register />}
            </Box>
          </Paper>
        </Fade>

        <Fade
          in={fadeIn}
          timeout={1200}
          style={{ transitionDelay: fadeIn ? "400ms" : "0ms" }}
        >
          <Box sx={{ mt: 4, textAlign: "center" }}>
            <Typography variant="caption" color="text.secondary">
              Copyright © {new Date().getFullYear()} OakAge
            </Typography>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default AuthPage;
