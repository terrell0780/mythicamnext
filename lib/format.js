/**
 * Safely formats a value using toLocaleString, handling undefined/null.
 * @param {any} value - The value to format.
 * @param {string} [fallback='0'] - Fallback string if value is null/undefined.
 * @returns {string} - The formatted string.
 */
export const safeLocale = (value, fallback = '0') => {
    if (value === undefined || value === null) return fallback;
    return value.toLocaleString();
};
