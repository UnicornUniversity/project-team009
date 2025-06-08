/**
 * @param {number} temperature Temperature value
 * @param {string} unit Unit to display
 * @param {number} decimals Number of decimal places
 * @returns {string} Formatted temperature
 */
export const formatTemperature = (temperature, unit = "°C", decimals = 1) => {
  if (temperature === null || temperature === undefined) {
    return "N/A";
  }

  return `${Number(temperature).toFixed(decimals)}${unit}`;
};

/**
 * @param {number} humidity Humidity value
 * @param {number} decimals Number of decimal places
 * @returns {string} Formatted humidity
 */
export const formatHumidity = (humidity, decimals = 1) => {
  if (humidity === null || humidity === undefined) {
    return "N/A";
  }

  return `${Number(humidity).toFixed(decimals)}%`;
};

/**
 * @param {Date|string} date Date
 * @param {Object} options Intl.DateTimeFormat options
 * @returns {string} Formatted date
 */
export const formatDate = (date, options = {}) => {
  if (!date) {
    return "N/A";
  }

  const defaultOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    ...options,
  };

  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("cs-CZ", defaultOptions).format(dateObj);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};

/**
 * @param {Date|string} time Time
 * @param {boolean} includeSeconds Whether to include seconds
 * @returns {string} Formatted time
 */
export const formatTime = (time, includeSeconds = false) => {
  if (!time) {
    return "N/A";
  }

  const options = {
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds && { second: "2-digit" }),
  };

  try {
    const timeObj = typeof time === "string" ? new Date(time) : time;
    return new Intl.DateTimeFormat("cs-CZ", options).format(timeObj);
  } catch (error) {
    console.error("Error formatting time:", error);
    return "Invalid Time";
  }
};

/**
 * @param {Date|string} datetime Datetime
 * @param {boolean} includeSeconds Whether to include seconds
 * @returns {string} Formatted datetime
 */
export const formatDateTime = (datetime, includeSeconds = false) => {
  if (!datetime) {
    return "N/A";
  }

  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    ...(includeSeconds && { second: "2-digit" }),
  };

  try {
    const datetimeObj =
      typeof datetime === "string" ? new Date(datetime) : datetime;
    return new Intl.DateTimeFormat("cs-CZ", options).format(datetimeObj);
  } catch (error) {
    console.error("Error formatting datetime:", error);
    return "Invalid DateTime";
  }
};

/**
 * @param {number} current Current value
 * @param {number} previous Previous value
 * @param {number} decimals Number of decimal places
 * @param {boolean} showPlus Whether to show + sign for positive differences
 * @returns {string} Formatted difference or empty string
 */
export const formatDifference = (
  current,
  previous,
  decimals = 1,
  showPlus = true
) => {
  if (
    current === null ||
    previous === null ||
    current === undefined ||
    previous === undefined
  ) {
    return "";
  }

  const difference = current - previous;
  const sign = difference > 0 ? (showPlus ? "+" : "") : "";

  return `${sign}${difference.toFixed(decimals)}`;
};
