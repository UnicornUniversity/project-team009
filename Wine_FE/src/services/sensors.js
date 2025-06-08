import api from "./api";
import {
  formatDateForBackend,
  formatDateTimeForBackend,
} from "../utils/dateHelpers";

export const getCurrentTemperature = async () => {
  try {
    const response = await api.get("/api/sensors/temperature/current");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Nepodařilo se získat aktuální teplotu"
    );
  }
};

export const getCurrentHumidity = async () => {
  try {
    const response = await api.get("/api/sensors/humidity/current");
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Nepodařilo se získat aktuální vlhkost"
    );
  }
};

export const getAverageTemperatureByDay = async (date) => {
  try {
    const backendDate =
      typeof date === "string" ? date : formatDateForBackend(date);

    const response = await api.get(`/api/sensors/temperature/averageByDay`, {
      params: { date: backendDate },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Nepodařilo se získat průměrnou teplotu"
    );
  }
};

export const getAverageTemperatureBetweenDays = async (startDate, endDate) => {
  try {
    const backendStart =
      typeof startDate === "string"
        ? startDate
        : formatDateForBackend(startDate);
    const backendEnd =
      typeof endDate === "string" ? endDate : formatDateForBackend(endDate);

    const response = await api.get(
      `/api/sensors/temperature/averageBetweenDays`,
      { params: { start: backendStart, end: backendEnd } }
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Nepodařilo se získat průměrnou teplotu"
    );
  }
};

export const getAverageHumidity = async (date) => {
  try {
    const backendDate =
      typeof date === "string" ? date : formatDateForBackend(date);

    const response = await api.get(`/api/sensors/humidity/averageByDay`, {
      params: { date: backendDate },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Nepodařilo se získat průměrnou vlhkost"
    );
  }
};

export const getAverageHumidityBetweenDays = async (startDate, endDate) => {
  try {
    const backendStart =
      typeof startDate === "string"
        ? startDate
        : formatDateForBackend(startDate);
    const backendEnd =
      typeof endDate === "string" ? endDate : formatDateForBackend(endDate);

    const response = await api.get(`/api/sensors/humidity/averageBetweenDays`, {
      params: { start: backendStart, end: backendEnd },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Nepodařilo se získat průměrnou vlhkost"
    );
  }
};

export const getSensorDataBetweenDates = async (startDate, endDate) => {
  try {
    const backendStart =
      typeof startDate === "string"
        ? startDate
        : formatDateTimeForBackend(startDate);
    const backendEnd =
      typeof endDate === "string" ? endDate : formatDateTimeForBackend(endDate);

    const response = await api.get(`/api/sensors/between`, {
      params: {
        from: backendStart,
        to: backendEnd,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Nepodařilo se získat data ze senzorů"
    );
  }
};

/**
 * Get the previous temperature reading (second to last)
 * @returns {number|null} Previous temperature or null if not available
 */
export const getPreviousTemperature = async () => {
  try {
    const endTime = new Date();
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - 24);

    const sensorData = await getSensorDataBetweenDates(startTime, endTime);

    if (sensorData && Array.isArray(sensorData) && sensorData.length >= 2) {
      const sortedData = [...sensorData].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      return sortedData[sortedData.length - 2]?.temperature || null;
    }

    return null;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Nepodařilo se získat předchozí teplotu"
    );
  }
};

/**
 * Get the previous humidity reading (second to last)
 * @returns {number|null} Previous humidity or null if not available
 */
export const getPreviousHumidity = async () => {
  try {
    const endTime = new Date();
    const startTime = new Date();
    startTime.setHours(startTime.getHours() - 24);

    const sensorData = await getSensorDataBetweenDates(startTime, endTime);

    if (sensorData && Array.isArray(sensorData) && sensorData.length >= 2) {
      const sortedData = [...sensorData].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );

      return sortedData[sortedData.length - 2]?.humidity || null;
    }

    return null;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Nepodařilo se získat předchozí vlhkost"
    );
  }
};
