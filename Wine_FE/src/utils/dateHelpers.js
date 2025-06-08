/**
 * Convert JavaScript Date to backend format (YYYY-MM-DD)
 * @param {Date} date - JavaScript Date object
 * @returns {string} - Date in YYYY-MM-DD format
 */
export const formatDateForBackend = (date) => {
  if (!date) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

/**
 * Convert JavaScript Date to backend datetime format (YYYY-MM-DDTHH:mm:ss.sssZ)
 * @param {Date} date - JavaScript Date object
 * @returns {string} - Datetime in standard ISO format
 */
export const formatDateTimeForBackend = (date) => {
  if (!date) return "";

  return date.toISOString();
};

/**
 * Parse backend date format (YYYY-MM-DD) to JavaScript Date
 * @param {string} backendDate - Date in YYYY-MM-DD format
 * @returns {Date} - JavaScript Date object
 */
export const parseDateFromBackend = (backendDate) => {
  if (!backendDate) return null;

  const [year, month, day] = backendDate.split("-");
  return new Date(year, month - 1, day);
};

/**
 * Parse backend datetime format to JavaScript Date
 * @param {string} backendDateTime - Datetime from backend
 * @returns {Date} - JavaScript Date object
 */
export const parseDateTimeFromBackend = (backendDateTime) => {
  if (!backendDateTime) return null;

  return new Date(backendDateTime);
};
