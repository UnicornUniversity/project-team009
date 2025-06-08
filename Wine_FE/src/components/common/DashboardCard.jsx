import {
  Card,
  CardHeader,
  CardContent,
  Typography,
  Box,
  Tooltip,
  useTheme,
  alpha
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const DashboardCard = ({
  title,
  action,
  children,
  tooltip,
  chipContent,
  accentColor,
  elevation = 3,
}) => {
  const theme = useTheme();
  const cardAccentColor = accentColor || theme.palette.primary.main;

  return (
    <Card
      elevation={elevation}
      sx={{
        height: "100%",
        position: "relative",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        borderTop: `4px solid ${cardAccentColor}`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: theme.shadows[elevation + 2],
        },
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardHeader
        title={
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
            {tooltip && (
              <Tooltip title={tooltip} placement="top" arrow>
                <InfoOutlinedIcon
                  sx={{
                    ml: 1,
                    color: alpha(theme.palette.text.primary, 0.4),
                    fontSize: 18,
                  }}
                />
              </Tooltip>
            )}
          </Box>
        }
        action={action}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(255, 255, 255, 0.04)"
              : "rgba(0, 0, 0, 0.02)",
          "& .MuiCardHeader-title": {
            fontSize: "1.125rem",
            fontWeight: 600,
          },
        }}
      />

      <CardContent
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          height: "100%",
          position: "relative",
        }}
      >
        {chipContent && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            m: 2,
            zIndex: 1,
          }}
        >
          {chipContent}
        </Box>
      )}
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
