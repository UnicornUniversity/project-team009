import { Box, CircularProgress, Typography, useTheme } from "@mui/material";

const ContentLoader = ({ message, height = "200px", transparent = false }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height,
        width: "100%",
        backgroundColor: transparent
          ? "transparent"
          : theme.palette.background.paper,
        borderRadius: 2,
        p: 3,
      }}
    >
      <CircularProgress size={30} color="primary" />

      {message && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default ContentLoader;
