import {
  Box,
  CircularProgress,
  Typography,
  Fade,
  useTheme,
  alpha,
} from "@mui/material";

const Loading = ({
  message = "Načítání...",
  fullScreen = false,
  size = 40,
  color,
  sx = {},
}) => {
  const theme = useTheme();
  
  const loaderColor = color || theme.palette.primary.main;

  const pulse = {
    "0%": {
      transform: "scale(0.95)",
      boxShadow: `0 0 0 0 ${alpha(loaderColor, 0.7)}`,
    },
    "70%": {
      transform: "scale(1)",
      boxShadow: `0 0 0 10px ${alpha(loaderColor, 0)}`,
    },
    "100%": {
      transform: "scale(0.95)",
      boxShadow: `0 0 0 0 ${alpha(loaderColor, 0)}`,
    },
  };

  return (
    <Fade in={true} style={{ transitionDelay: "300ms" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: fullScreen ? "100vh" : "100%",
          minHeight: fullScreen ? "auto" : "200px",
          width: "100%",
          position: fullScreen ? "fixed" : "relative",
          top: fullScreen ? 0 : "auto",
          left: fullScreen ? 0 : "auto",
          zIndex: fullScreen ? theme.zIndex.modal : "auto",
          backgroundColor: fullScreen
            ? alpha(theme.palette.background.default, 0.8)
            : "transparent",
          backdropFilter: fullScreen ? "blur(5px)" : "none",
          ...sx,
        }}
      >
        <Box
          sx={{
            position: "relative",
            animation: fullScreen ? `${pulse} 2s infinite` : "none",
            p: fullScreen ? 3 : 0,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress
            size={size}
            thickness={4}
            sx={{
              color: loaderColor,
            }}
          />
        </Box>

        {message && (
          <Typography
            variant={fullScreen ? "h6" : "body1"}
            color="text.secondary"
            sx={{
              mt: 3,
              fontWeight: fullScreen ? 500 : 400,
              textAlign: "center",
              maxWidth: "80%",
            }}
          >
            {message}
          </Typography>
        )}
      </Box>
    </Fade>
  );
};

export default Loading;
