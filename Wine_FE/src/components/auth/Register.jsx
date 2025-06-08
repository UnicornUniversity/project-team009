import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Fade,
  useTheme,
  Typography,
  alpha,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BadgeIcon from "@mui/icons-material/Badge";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register, loading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!username.trim()) {
      setFormError("Uživatelské jméno je povinné");
      return;
    }

    if (!password || password.length < 6) {
      setFormError("Heslo musí mít alespoň 6 znaků");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Hesla se neshodují");
      return;
    }

    try {
      const success = await register(username, password);
      if (success) {
        setFormSuccess("Registrace úspěšná, nyní se můžete přihlásit.");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (err) {
      console.error("Registration error:", err);
      setFormError("Registrace selhala. Zkuste jiné uživatelské jméno.");
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Fade in={true} timeout={600}>
      <Box sx={{ width: "100%" }}>
        {(error || formError) && (
          <Alert
            severity="error"
            variant="filled"
            sx={{
              width: "100%",
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {formError || error}
          </Alert>
        )}

        {formSuccess && (
          <Alert
            severity="success"
            variant="filled"
            sx={{
              width: "100%",
              mb: 3,
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            {formSuccess}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Uživatelské jméno"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading || !!formSuccess}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <BadgeIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                },
              },
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Heslo"
            type={showPassword ? "text" : "password"}
            id="password"
            autoComplete="new-password"
            helperText="Zadejte minimálně 6 znaků"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading || !!formSuccess}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                    size="small"
                    disabled={!!formSuccess}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                },
              },
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Potvrdit heslo"
            type={showConfirmPassword ? "text" : "password"}
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading || !!formSuccess}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={toggleShowConfirmPassword}
                    edge="end"
                    size="small"
                    disabled={!!formSuccess}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: theme.palette.primary.main,
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderWidth: 2,
                },
              },
            }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{
              mt: 3,
              mb: 2,
              py: 1.2,
              fontSize: "1rem",
              boxShadow: "0 4px 12px rgba(199, 149, 90, 0.2)",
              "&:hover": {
                boxShadow: "0 6px 16px rgba(199, 149, 90, 0.3)",
              },
            }}
            disabled={loading || !!formSuccess}
            startIcon={loading ? undefined : <HowToRegIcon />}
          >
            {loading ? <CircularProgress size={24} /> : "Registrovat"}
          </Button>

          <Button
            fullWidth
            variant="outlined"
            onClick={() => navigate("/login")}
            sx={{
              mt: 1,
              borderRadius: 2,
              py: 1,
            }}
            disabled={loading}
          >
            <ArrowBackIcon sx={{ mr: 1 }} />
            Zpět na přihlášení
          </Button>
        </Box>
      </Box>
    </Fade>
  );
};

export default Register;
