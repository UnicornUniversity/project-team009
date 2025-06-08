import api from "./api";

export const login = async (username, password) => {
  try {
    const response = await api.post("/auth/login", { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Přihlášení selhalo");
  }
};

export const register = async (username, password) => {
  try {
    const response = await api.post("/auth/register", { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registrace selhala");
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Obnovení tokenu selhalo");
  }
};

export const logout = () => {
  return true;
};
