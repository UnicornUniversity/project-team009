import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box, Container, Typography } from "@mui/material";

import logo from "./assets/oakage-full2.svg";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c7955a",
    },
    background: {
      default: "#363535",
    },
    text: {
      primary: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: '"Inter", sans-serif',
    h3: {
      fontWeight: 400,
      letterSpacing: "0.05em",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          py: 8,
          backgroundColor: "background.default",
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ mb: 8 }}>
            <img
              src={logo}
              alt="OakAge Logo"
              style={{ width: "320px", marginBottom: "3rem", marginInline: 'auto' }}
            />
          </Box>

          <Typography
            variant="h3"
            component="h1"
            color="text.primary"
            sx={{
              letterSpacing: "0.1em",
              fontSize: "2.5rem",
              fontWeight: "600",
            }}
          >
            WHISKEY WAREHOUSE
          </Typography>

          <Typography
            variant="h5"
            color="primary"
            sx={{ mb: 4, letterSpacing: "0.1em", textTransform: "uppercase" }}
          >
            Precision humidity control
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ maxWidth: "700px", mx: "auto", fontSize: "1.1rem" }}
          >
            Monitoring and maintaining perfect aging conditions for exceptional
            whiskey maturation
          </Typography>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
