import { useState, useEffect } from "react";
import { Box, Typography, Fade, useTheme, alpha, Tooltip } from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

const AnimatedStat = ({
  label,
  value,
  previousValue,
  unit = "",
  large = false,
  delay = 0,
  color,
  trendTooltip = null,
  trendTooltipProps = {},
}) => {
  const theme = useTheme();
  const [animate, setAnimate] = useState(false);

  const difference =
    previousValue !== null && value !== null ? value - previousValue : null;

  const hasIncreased = difference > 0;
  const hasDecreased = difference < 0;
  const isUnchanged = difference === 0;

  const formattedDifference =
    difference !== null
      ? `${isUnchanged ? "" : hasIncreased ? "+" : ""}${difference.toFixed(
          1
        )}${unit}`
      : "--";

  const valueColor = color || theme.palette.primary.main;

  const differenceColor = hasIncreased
    ? theme.palette.warning.main
    : hasDecreased
    ? theme.palette.info.main
    : theme.palette.text.secondary;

  useEffect(() => {
    const animateTimer = setTimeout(() => {
      setAnimate(true);
    }, delay);

    return () => clearTimeout(animateTimer);
  }, [delay]);

  const TrendBox = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: alpha(differenceColor, 0.15),
        color: differenceColor,
        borderRadius: "12px",
        px: 1.5,
        py: 0.5,
        ml: 2,
        fontSize: large ? "1rem" : "0.875rem",
        fontWeight: 600,
        height: large ? "36px" : "28px",
        transition: "all 0.3s ease",
        cursor: trendTooltip ? "help" : "default",
      }}
    >
      {hasIncreased ? (
        <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} />
      ) : hasDecreased ? (
        <TrendingDownIcon fontSize="small" sx={{ mr: 0.5 }} />
      ) : (
        <TrendingFlatIcon fontSize="small" sx={{ mr: 0.5 }} />
      )}
      {formattedDifference}
    </Box>
  );

  return (
    <Box sx={{ my: 2 }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1, fontWeight: 500 }}
      >
        {label}
      </Typography>

      <Fade in={animate} timeout={800}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant={large ? "h3" : "h5"}
            component="div"
            sx={{
              fontWeight: 600,
              color: valueColor,
              transition: "color 0.3s ease",
            }}
          >
            {value !== null ? `${value}${unit}` : "--"}
          </Typography>

          {previousValue !== null &&
            (trendTooltip ? (
              <Tooltip
                title={trendTooltip}
                arrow
                placement="top"
                enterDelay={500}
                leaveDelay={200}
                {...trendTooltipProps}
              >
                {TrendBox}
              </Tooltip>
            ) : (
              TrendBox
            ))}
        </Box>
      </Fade>
    </Box>
  );
};

export default AnimatedStat;
