import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CssBaseline, Box } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers";
import cs from "date-fns/locale/cs";
import { AuthProvider } from "./context/AuthContext";
import AuthGuard from "./components/auth/AuthGuard";
import ErrorBoundary from './components/common/ErrorBoundary';
import Navbar from "./components/common/Navbar";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ReportsPage from "./pages/ReportsPage";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <ErrorBoundary>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={cs}>
          <AuthProvider>
            <Router>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "100vh",
                }}
              >
                <Navbar />
                <Box component="main" sx={{ flexGrow: 1 }}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<AuthPage />} />
                    <Route
                      path="/register"
                      element={<AuthPage />}
                    />

                    {/* Protected routes */}
                    <Route
                      path="/dashboard"
                      element={
                        <AuthGuard>
                          <DashboardPage />
                        </AuthGuard>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <AuthGuard>
                          <ReportsPage />
                        </AuthGuard>
                      }
                    />

                    {/* Default redirect */}
                    <Route
                      path="/"
                      element={<Navigate to="/login" replace />}
                    />
                    <Route
                      path="*"
                      element={<Navigate to="/login" replace />}
                    />
                  </Routes>
                </Box>
              </Box>
            </Router>
          </AuthProvider>
        </LocalizationProvider>
      </ErrorBoundary>

    </ThemeProvider>
  );
}

export default App;
