import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c7955a",
      light: "#d5ab7d",
      dark: "#a97745",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#78909c",
      light: "#a7c0cd",
      dark: "#4b636e",
      contrastText: "#ffffff",
    },
    background: {
      default: "#2b2b2b",
      paper: "#363535",
      card: "#3f3f3f",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
    action: {
      hover: "rgba(199, 149, 90, 0.08)",
      selected: "rgba(199, 149, 90, 0.16)",
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
      fontSize: "2.5rem",
      letterSpacing: "-0.01em",
    },
    h2: {
      fontWeight: 600,
      fontSize: "2rem",
      letterSpacing: "-0.01em",
    },
    h3: {
      fontWeight: 600,
      fontSize: "1.75rem",
      letterSpacing: "0.02em",
    },
    h4: {
      fontWeight: 600,
      fontSize: "1.5rem",
      letterSpacing: "0.02em",
    },
    h5: {
      fontWeight: 600,
      fontSize: "1.25rem",
      letterSpacing: "0.02em",
    },
    h6: {
      fontWeight: 600,
      fontSize: "1rem",
      letterSpacing: "0.02em",
    },
    subtitle1: {
      fontSize: "1rem",
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: "0.875rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      letterSpacing: "0.01em",
    },
    body2: {
      fontSize: "0.875rem",
      fontWeight: 400,
      letterSpacing: "0.01em",
    },
    button: {
      fontWeight: 600,
      fontSize: "0.875rem",
      letterSpacing: "0.02em",
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    "none",
    "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    "0px 3px 3px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)",
    "0px 5px 5px -3px rgba(0,0,0,0.2),0px 4px 4px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)",
    "0px 6px 10px -4px rgba(0,0,0,0.2),0px 4px 18px 0px rgba(0,0,0,0.14),0px 3px 5px -1px rgba(0,0,0,0.12)",
    "0px 3px 14px 2px rgba(0,0,0,0.12)",
    "0px 5px 12px 4px rgba(0,0,0,0.16)",
    "0px 7px 12px 4px rgba(0,0,0,0.16)",
    "0px 9px 12px 1px rgba(0,0,0,0.16)",
    "0px 11px 15px 1px rgba(0,0,0,0.2),0px 4px 20px 3px rgba(0,0,0,0.14),0px 2px 14px 1px rgba(0,0,0,0.12)",
    ...Array(14).fill("none"),
  ],
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.12)",
        },
        elevation3: {
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.16)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "10px 16px",
          transition: "all 0.2s ease-in-out",
          textTransform: "none",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          },
        },
        contained: {
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        },
        outlined: {
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            transition: "all 0.2s",
            "&.Mui-focused": {
              boxShadow: "0 0 0 3px rgba(199, 149, 90, 0.2)",
            },
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        outlined: {
          "&.MuiInputLabel-shrink": {
            backgroundColor: "#363535",
            padding: "0 7px",
            transform: "translate(10px, -9px) scale(0.75)"
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            boxShadow: "0 6px 24px rgba(0,0,0,0.12)",
          },
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: "20px 24px",
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: "24px",
          "&:last-child": {
            paddingBottom: "24px",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(54, 53, 53, 0.8)",
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 6,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: "2px 8px",
          padding: "8px 16px",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: "rgba(199, 149, 90, 0.08)",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: "0.9rem",
        },
      },
    },
  },
});

export default theme;
