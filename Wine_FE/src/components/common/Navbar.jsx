import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Container,
  Avatar,
  Tooltip,
  Divider,
  useScrollTrigger,
  Slide,
  alpha,
  useTheme,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "../../assets/oakage-full2.svg";
import { useAuth } from "../../context/AuthContext";

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  if (!isAuthenticated) {
    return null;
  }

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleNavigation = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
    handleCloseUserMenu();
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const pages = [
    {
      title: "Přehled",
      path: "/dashboard",
      icon: <DashboardIcon fontSize="small" />,
    },
    {
      title: "Reporty",
      path: "/reports",
      icon: <AssessmentIcon fontSize="small" />,
    },
  ];

  return (
    <HideOnScroll {...props}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: "blur(8px)",
          backgroundColor: alpha(theme.palette.background.default, 0.8),
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ py: 0.5 }}>
            <Box
              sx={{
                mr: 3,
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <img src={logo} alt="OakAge Logo" style={{ height: "36px" }} />
            </Box>

            <Box
              sx={{ flexGrow: 0, display: { xs: "flex", md: "none" }, mr: 2 }}
            >
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                sx={{
                  color: "text.primary",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                  borderRadius: 1.5,
                }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: "block", md: "none" },
                  "& .MuiPaper-root": {
                    borderRadius: 2,
                    mt: 1.5,
                    boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                  },
                }}
                PaperProps={{
                  elevation: 3,
                }}
              >
                {isAuthenticated &&
                  pages.map((page) => (
                    <MenuItem
                      key={page.title}
                      onClick={() => handleNavigation(page.path)}
                      selected={isActiveRoute(page.path)}
                      sx={{
                        borderRadius: 1,
                        mx: 1,
                        my: 0.5,
                        "&.Mui-selected": {
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.1
                          ),
                          "&:hover": {
                            backgroundColor: alpha(
                              theme.palette.primary.main,
                              0.2
                            ),
                          },
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            color: isActiveRoute(page.path)
                              ? "primary.main"
                              : "text.secondary",
                            display: "flex",
                          }}
                        >
                          {page.icon}
                        </Box>
                        <Typography
                          sx={{
                            ml: 1.5,
                            color: isActiveRoute(page.path)
                              ? "primary.main"
                              : "text.primary",
                            fontWeight: isActiveRoute(page.path) ? 600 : 400,
                          }}
                        >
                          {page.title}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
              </Menu>
            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "flex", md: "none" },
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              <img src={logo} alt="OakAge Logo" style={{ height: "32px" }} />
            </Box>

            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 2 }}
            >
              {isAuthenticated &&
                pages.map((page) => (
                  <Button
                    key={page.title}
                    onClick={() => handleNavigation(page.path)}
                    sx={{
                      color: isActiveRoute(page.path)
                        ? "primary.main"
                        : "text.primary",
                      mx: 0.5,
                      px: 2,
                      py: 1,
                      fontWeight: isActiveRoute(page.path) ? 600 : 500,
                      borderRadius: 2,
                      position: "relative",
                      overflow: "hidden",
                      backgroundColor: isActiveRoute(page.path)
                        ? alpha(theme.palette.primary.main, 0.1)
                        : "transparent",
                      "&:hover": {
                        backgroundColor: isActiveRoute(page.path)
                          ? alpha(theme.palette.primary.main, 0.15)
                          : alpha(theme.palette.action.hover, 0.5),
                      },
                      "&::after": isActiveRoute(page.path)
                        ? {
                            content: '""',
                            position: "absolute",
                            bottom: 0,
                            left: "20%",
                            width: "60%",
                            height: "3px",
                            backgroundColor: "primary.main",
                            borderRadius: "3px 3px 0 0",
                          }
                        : {},
                    }}
                    startIcon={
                      <Box
                        sx={{
                          color: isActiveRoute(page.path)
                            ? "primary.main"
                            : "text.secondary",
                        }}
                      >
                        {page.icon}
                      </Box>
                    }
                  >
                    {page.title}
                  </Button>
                ))}
            </Box>

            {isAuthenticated ? (
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title={user?.username || "Uživatel"}>
                  <IconButton
                    onClick={handleOpenUserMenu}
                    sx={{
                      p: 0,
                      border: "2px solid",
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: "primary.main",
                        transform: "scale(1.05)",
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.9),
                        color: "white",
                        fontWeight: 600,
                      }}
                    >
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{
                    mt: "45px",
                    "& .MuiPaper-root": {
                      borderRadius: 2,
                      minWidth: 180,
                      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                    },
                  }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <Box
                    sx={{
                      px: 2,
                      py: 1.5,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                        color: "primary.main",
                        width: 32,
                        height: 32,
                        mr: 1.5,
                      }}
                    >
                      <AccountCircleIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>
                        {user?.username || "Uživatel"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {user?.role || "Technické oddělení"}
                      </Typography>
                    </Box>
                  </Box>

                  <Divider />

                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      py: 1.5,
                      px: 2,
                      color: theme.palette.error.main,
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                      },
                    }}
                  >
                    <LogoutIcon fontSize="small" sx={{ mr: 1.5 }} />
                    <Typography fontWeight={500}>Odhlásit se</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/login")}
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(199, 149, 90, 0.15)",
                  px: 3,
                }}
              >
                Přihlásit se
              </Button>
            )}
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
