import axios from "axios";
import * as mockData from "./mockData";

const API_URL = "/api";

const mockApi = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const USE_MOCK_FOR_SENSORS =
  import.meta.env.VITE_USE_MOCK_SENSORS === "true"
    ? true
    : import.meta.env.VITE_USE_MOCK_SENSORS === "false"
    ? false
    : true;

console.log(
  `🔧 Mock sensors: ${USE_MOCK_FOR_SENSORS ? "ENABLED" : "DISABLED"}`
);

mockApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    if (USE_MOCK_FOR_SENSORS && shouldMockEndpoint(config.url)) {
      config.mockResponse = true;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

mockApi.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (originalRequest.mockResponse) {
      console.log(`Mocking API response for: ${originalRequest.url}`);
      return handleMockRequest(originalRequest);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          return Promise.reject(error);
        }

        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        });

        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
          if (response.data.refreshToken) {
            localStorage.setItem("refreshToken", response.data.refreshToken);
          }

          originalRequest.headers[
            "Authorization"
          ] = `Bearer ${response.data.accessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * @param {string} url - API endpoint URL
 * @returns {boolean} - Whether to mock this endpoint
 */
function shouldMockEndpoint(url) {
  if (!url) return false;

  const mockEndpoints = [
    "/api/sensors/temperature/current",
    "/api/sensors/temperature/averageByDay",
    "/api/sensors/temperature/averageBetweenDays",
    "/api/sensors/humidity/current",
    "/api/sensors/humidity/averageByDay",
    "/api/sensors/humidity/averageBetweenDays",
    "/api/sensors/between",
  ];

  return mockEndpoints.some(
    (endpoint) => url.endsWith(endpoint) || url.includes(endpoint)
  );
}

/**
 * @param {Object} request - Original axios request
 * @returns {Promise} - Promise with mock response
 */
function handleMockRequest(request) {
  const url = request.url;
  const params = request.params || {};

  return new Promise((resolve) => {
    let responseData;

    if (url.includes("/api/sensors/temperature/current")) {
      responseData = mockData.getCurrentTemperature();
    } else if (url.includes("/api/sensors/humidity/current")) {
      responseData = mockData.getCurrentHumidity();
    } else if (url.includes("/api/sensors/temperature/averageByDay")) {
      responseData = mockData.getAverageTemperatureByDay(params.date);
    } else if (url.includes("/api/sensors/temperature/averageBetweenDays")) {
      responseData = mockData.getAverageTemperatureBetweenDays(
        params.start,
        params.end
      );
    } else if (url.includes("/api/sensors/humidity/averageByDay")) {
      responseData = mockData.getAverageHumidity(params.date);
    } else if (url.includes("/api/sensors/humidity/averageBetweenDays")) {
      responseData = mockData.getAverageHumidityBetweenDays(
        params.start,
        params.end
      );
    } else if (url.includes("/api/sensors/between")) {
      responseData = mockData.getSensorDataBetweenDates(params.from, params.to);
    } else {
      responseData = {};
    }

    resolve({
      data: responseData,
      status: 200,
      statusText: "OK",
      headers: {},
      config: request,
    });
  });
}

const originalGet = mockApi.get;
mockApi.get = function (url, config) {
  if (USE_MOCK_FOR_SENSORS && shouldMockEndpoint(url)) {
    return handleMockRequest({
      url,
      method: "get",
      params: config?.params,
      ...config,
    });
  }
  return originalGet.call(this, url, config);
};

const originalPost = mockApi.post;
mockApi.post = function (url, data, config) {
  if (USE_MOCK_FOR_SENSORS && shouldMockEndpoint(url)) {
    return handleMockRequest({
      url,
      method: "post",
      data,
      ...config,
    });
  }
  return originalPost.call(this, url, data, config);
};

export default mockApi;
