import { useState, useEffect } from "react";
import { Box, Typography, LinearProgress, useTheme, Fade } from "@mui/material";

const RangeIndicator = ({
  currentValue,
  minValue,
  maxValue,
  label = "Hodnota",
  unit = "%",
  size = "medium",
  delay = 300,
  color = null,
}) => {
  const theme = useTheme();
  const [animate, setAnimate] = useState(false);

  const isLow = currentValue < minValue;
  const isHigh = currentValue > maxValue;
  const isOutOfRange = isLow || isHigh;

  const range = maxValue - minValue;
  const rawNormalizedValue = ((currentValue - minValue) / range) * 100;

  let displayPosition;
  if (isLow) {
    displayPosition = 0;
  } else if (isHigh) {
    displayPosition = 100;
  } else {
    displayPosition = rawNormalizedValue;
  }

  const height = size === "small" ? 4 : size === "large" ? 10 : 6;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const displayValue = `${currentValue}${unit}`;

  let leftPosition, transform;
  if (displayPosition <= 5) {
    leftPosition = "0%";
    transform = "translateX(0%)";
  } else if (displayPosition >= 95) {
    leftPosition = "100%";
    transform = "translateX(-100%)";
  } else {
    leftPosition = `${displayPosition}%`;
    transform = "translateX(-50%)";
  }

  return (
    <Box sx={{ width: "100%", my: 2 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          {label}
        </Typography>
      </Box>

      <Box sx={{ position: "relative", height: height * 2, mt: 2 }}>
        <LinearProgress
          variant="determinate"
          value={100}
          sx={{
            position: "absolute",
            top: height / 2,
            width: "100%",
            height,
            borderRadius: height / 2,
            backgroundColor:
              theme.palette.grey[theme.palette.mode === "light" ? 300 : 800],
            "& .MuiLinearProgress-bar": {
              borderRadius: height / 2,
              backgroundColor:
                theme.palette.grey[theme.palette.mode === "light" ? 300 : 800],
            },
          }}
        />

        <Box
          sx={{
            position: "absolute",
            left: "0%",
            top: height / 2,
            height: height,
            borderLeft: `2px solid ${theme.palette.primary.main}`,
            transform: "translateX(-1px)",
            zIndex: 1,
          }}
        />
        <Box
          sx={{
            position: "absolute",
            right: "0%",
            top: height / 2,
            height: height,
            borderRight: `2px solid ${theme.palette.primary.main}`,
            transform: "translateX(1px)",
            zIndex: 1,
          }}
        />

        <Fade in={animate} timeout={1000}>
          <Box
            sx={{
              position: "absolute",
              left: leftPosition,
              top: 0,
              transform,
              width: "auto",
              minWidth: height * 3,
              height: height * 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: color,
                color: "#fff",
                borderRadius: "12px",
                padding: "2px 8px",
                fontSize: "0.75rem",
                fontWeight: 600,
                boxShadow: `0 2px 4px ${
                  theme.palette.mode === "light"
                    ? "rgba(0,0,0,0.2)"
                    : "rgba(0,0,0,0.4)"
                }`,
                whiteSpace: "nowrap",
                ...(isOutOfRange && {
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    bottom: "-4px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: 0,
                    height: 0,
                    borderLeft: "4px solid transparent",
                    borderRight: "4px solid transparent",
                    borderTop: `4px solid ${color}`,
                  },
                }),
              }}
            >
              {isOutOfRange
                ? displayValue + (isLow ? " ↓" : " ↑")
                : displayValue}
            </Box>
          </Box>
        </Fade>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1.5 }}>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          Min: {minValue}
          {unit}
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          Max: {maxValue}
          {unit}
        </Typography>
      </Box>
    </Box>
  );
};

export default RangeIndicator;
