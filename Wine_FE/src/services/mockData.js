const CONFIG = {
  temperature: {
    baseline: 19.5, // Average temperature
    dailyVariation: 1.5, // Max daily variation
    hourlyVariation: 0.3, // Max hourly variation
    minValue: 16, // Minimum realistic value
    maxValue: 24, // Maximum realistic value
    optimalMin: 16, // Optimal minimum
    optimalMax: 22, // Optimal maximum
  },

  humidity: {
    baseline: 35, // Average humidity
    dailyVariation: 5, // Max daily variation
    hourlyVariation: 1.5, // Max hourly variation
    minValue: 25, // Minimum realistic value
    maxValue: 50, // Maximum realistic value
    optimalMin: 25, // Optimal minimum
    optimalMax: 45, // Optimal maximum
  },

  // Sensor config
  sensorIds: ["1"], // Available sensor IDs
  defaultSensorId: "1",

  // Date range for mock data
  dateRange: {
    startDate: new Date("2025-04-15"),
    endDate: new Date(),
  },

  // Minutes between readings
  readingFrequency: 30,
};

/**
 * Generate a random temperature
 * @param {Date} date - Date and time
 * @param {boolean} addNoise - Whether to add noise
 * @returns {number} - Temperature
 */
export function generateTemperature(date, addNoise = true) {
  const { temperature } = CONFIG;

  // Use minute-based seed for consistency
  const minuteSeed = Math.floor(date.getTime() / (60 * 1000));
  const pseudoRandom = Math.sin(minuteSeed) * 10000;
  const minuteBasedRandom = pseudoRandom - Math.floor(pseudoRandom);

  // Slightly warmer in summer, cooler in winter
  const month = date.getMonth();
  const seasonalFactor = Math.sin((month / 12) * 2 * Math.PI);
  let baseTemp = temperature.baseline + seasonalFactor * 0.7;

  // Cooler at night, warmer during day
  const hour = date.getHours();
  const dayProgress = (hour - 8) / 24;
  const dailyFactor = Math.sin(dayProgress * 2 * Math.PI);
  baseTemp += dailyFactor * temperature.dailyVariation;

  if (addNoise) {
    baseTemp += (minuteBasedRandom - 0.5) * temperature.hourlyVariation;
  }

  return Math.min(
    Math.max(baseTemp, temperature.minValue),
    temperature.maxValue
  ).toFixed(1);
}

/**
 * Generate a random humidity
 * @param {Date} date - Date and time
 * @param {boolean} addNoise - Whether to add noise
 * @returns {number} - Humidity
 */
export function generateHumidity(date, addNoise = true) {
  const { humidity } = CONFIG;

  // Use minute-based seed for consistency
  const minuteSeed = Math.floor(date.getTime() / (60 * 1000));
  const pseudoRandom = Math.sin(minuteSeed * 1.5) * 10000;
  const minuteBasedRandom = pseudoRandom - Math.floor(pseudoRandom);

  // Drier in winter, more humid in summer
  const month = date.getMonth();
  const seasonalFactor = Math.sin((month / 12) * 2 * Math.PI);
  let baseHumidity = humidity.baseline + seasonalFactor * 3;

  // Higher at night, lower during day
  const hour = date.getHours();
  const dayProgress = (hour - 8) / 24;
  const dailyFactor = Math.sin(dayProgress * 2 * Math.PI);
  baseHumidity -= dailyFactor * humidity.dailyVariation;

  if (addNoise) {
    baseHumidity += (minuteBasedRandom - 0.5) * humidity.hourlyVariation;
  }

  return Math.min(
    Math.max(baseHumidity, humidity.minValue),
    humidity.maxValue
  ).toFixed(1);
}

/**
 * Generate sensor data for a specific date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @param {number} intervalMinutes - Minutes between readings
 * @returns {Array} - Sensor data
 */
function generateSensorDataForRange(
  startDate,
  endDate,
  intervalMinutes = CONFIG.readingFrequency
) {
  const result = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const timestamp = new Date(currentDate);

    result.push({
      id: result.length + 1,
      temperature: parseFloat(generateTemperature(timestamp)),
      humidity: parseFloat(generateHumidity(timestamp)),
      timestamp: timestamp.toISOString(),
      sensorId: CONFIG.defaultSensorId,
    });

    currentDate.setMinutes(currentDate.getMinutes() + intervalMinutes);
  }

  return result;
}

/**
 * Filter sensor data based on date range
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} - Filtered sensor data
 */
function getSensorDataBetween(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  start.setHours(0, 0, 0, 0);
  end.setHours(23, 59, 59, 999);

  return generateSensorDataForRange(start, end);
}

/**
 * Get current temperature
 * @returns {number} Current temperature
 */
export function getCurrentTemperature() {
  return parseFloat(generateTemperature(new Date()));
}

/**
 * Get current humidity
 * @returns {number} Current humidity
 */
export function getCurrentHumidity() {
  return parseFloat(generateHumidity(new Date()));
}

/**
 * Get average temperature for a specific day
 * @param {string} dateStr - Date
 * @returns {number} Average temperature
 */
export function getAverageTemperatureByDay(dateStr) {
  const date = new Date(dateStr);

  let total = 0;
  const readings = 8;

  for (let i = 0; i < readings; i++) {
    const hour = Math.floor(i * (24 / readings));
    const readingDate = new Date(date);
    readingDate.setHours(hour, 0, 0, 0);
    total += parseFloat(generateTemperature(readingDate, false));
  }

  return parseFloat((total / readings).toFixed(1));
}

/**
 * Get average temperature between two dates
 * @param {string} startDateStr - Start date
 * @param {string} endDateStr - End date
 * @returns {number} Average temperature
 */
export function getAverageTemperatureBetweenDays(startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  let total = 0;
  let days = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    total += getAverageTemperatureByDay(
      currentDate.toISOString().split("T")[0]
    );
    days++;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return parseFloat((total / Math.max(1, days)).toFixed(1));
}

/**
 * Get average humidity for a specific day
 * @param {string} dateStr - Date
 * @returns {number} Average humidity
 */
export function getAverageHumidity(dateStr) {
  const date = new Date(dateStr);

  let total = 0;
  const readings = 8;

  for (let i = 0; i < readings; i++) {
    const hour = Math.floor(i * (24 / readings));
    const readingDate = new Date(date);
    readingDate.setHours(hour, 0, 0, 0);
    total += parseFloat(generateHumidity(readingDate, false));
  }

  return parseFloat((total / readings).toFixed(1));
}

/**
 * Get sensor data between two dates
 * @param {string} startDateStr - Start date
 * @param {string} endDateStr - End date
 * @returns {Array} Sensor data
 */
export function getSensorDataBetweenDates(startDateStr, endDateStr) {
  return getSensorDataBetween(new Date(startDateStr), new Date(endDateStr));
}

/**
 * Get average humidity between two dates
 * @param {string} startDateStr - Start date
 * @param {string} endDateStr - End date
 * @returns {number} Average humidity
 */
export function getAverageHumidityBetweenDays(startDateStr, endDateStr) {
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  let total = 0;
  let days = 0;
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    total += getAverageHumidity(currentDate.toISOString().split("T")[0]);
    days++;
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return parseFloat((total / Math.max(1, days)).toFixed(1));
}

export const mockConfig = CONFIG;
