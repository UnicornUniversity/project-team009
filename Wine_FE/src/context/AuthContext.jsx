import { createContext, useContext, useState, useEffect } from "react";
import { login, register, refreshToken, logout } from "../services/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");
    const loginExpiry = localStorage.getItem("loginExpiry");

    const now = new Date().getTime();
    const isExpired = loginExpiry && now > parseInt(loginExpiry);

    if (storedUser && storedToken && !isExpired) {
      const initAuth = async () => {
        try {
          setUser(JSON.parse(storedUser));
          await handleRefreshToken();
        } catch (error) {
          console.error("Initial token refresh failed:", error);
        } finally {
          setLoading(false);
        }
      };

      initAuth();

      const refreshTokenTimer = setInterval(handleRefreshToken, 15 * 60 * 1000);
      return () => clearInterval(refreshTokenTimer);
    } else {
      setLoading(false);
      if (isExpired) {
        handleLogout();
      }
    }
  }, []);

  const handleLogin = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await login(username, password);

      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);

        const expiryTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem("loginExpiry", expiryTime);

        const userInfo = response.user || { username };
        localStorage.setItem("user", JSON.stringify(userInfo));

        setUser(userInfo);
        return true;
      }

      return false;
    } catch (err) {
      setError(err.message || "Přihlášení selhalo");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (username, password) => {
    try {
      setLoading(true);
      setError(null);

      await register(username, password);
      return true;
    } catch (err) {
      setError(err.message || "Registrace selhala");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshToken = async () => {
    try {
      const storedRefreshToken = localStorage.getItem("refreshToken");

      if (!storedRefreshToken) {
        handleLogout();
        return;
      }

      const response = await refreshToken(storedRefreshToken);

      if (response.accessToken) {
        localStorage.setItem("accessToken", response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem("refreshToken", response.refreshToken);
        }
      } else {
        handleLogout();
      }
    } catch (err) {
      console.error("Token refresh failed:", err);
      handleLogout();
    }
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("loginExpiry");
    localStorage.removeItem("minTemperature");
    localStorage.removeItem("maxTemperature");
    localStorage.removeItem("temperatureValidUntil");
    localStorage.removeItem("minHumidity");
    localStorage.removeItem("maxHumidity");
    localStorage.removeItem("humidityValidUntil");
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
