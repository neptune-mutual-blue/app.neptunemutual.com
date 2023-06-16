/**
 *
 * @param {string} stringedValue
 * @param {any} defaultValue
 * @returns {any}
 *
 */
export const safeParseString = (stringedValue, defaultValue = '') => {
  if (stringedValue) {
    try {
      return JSON.parse(stringedValue)
    } catch (e) {}
  }

  return defaultValue
}
