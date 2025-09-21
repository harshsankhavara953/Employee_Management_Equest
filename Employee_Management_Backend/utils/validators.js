/**
 * Validates if a value is a positive number
 * @param {any} value - The value to validate
 * @returns {boolean} - True if the value is a positive number, false otherwise
 */
export const isPositiveNumber = (value) => {
    // Check if value is null, undefined, or empty string
    if (value === null || value === undefined || value === '') {
        return false;
    }

    // Convert to number
    const num = Number(value);

    // Check if it's a valid number and greater than 0
    return !isNaN(num) && isFinite(num) && num > 0;
};

/**
 * Validates if a value is a non-negative number (including zero)
 * @param {any} value - The value to validate
 * @returns {boolean} - True if the value is a non-negative number, false otherwise
 */
export const isNonNegativeNumber = (value) => {
    // Check if value is null, undefined, or empty string
    if (value === null || value === undefined || value === '') {
        return false;
    }

    // Convert to number
    const num = Number(value);

    // Check if it's a valid number and greater than or equal to 0
    return !isNaN(num) && isFinite(num) && num >= 0;
};

/**
 * Validates if a value is a valid integer
 * @param {any} value - The value to validate
 * @returns {boolean} - True if the value is a valid integer, false otherwise
 */
export const isInteger = (value) => {
    // Check if value is null, undefined, or empty string
    if (value === null || value === undefined || value === '') {
        return false;
    }

    // Convert to number
    const num = Number(value);

    // Check if it's a valid number and an integer
    return !isNaN(num) && isFinite(num) && Number.isInteger(num);
};

/**
 * Validates if a value is a positive integer
 * @param {any} value - The value to validate
 * @returns {boolean} - True if the value is a positive integer, false otherwise
 */
export const isPositiveInteger = (value) => {
    return isInteger(value) && isPositiveNumber(value);
};
