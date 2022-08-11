/**
 * @template T
 * @param {(...args: any[]) => T} callback
 * @param {number} [delay]
 * @returns {(...args: any[]) => number}
 */
export function debounce(callback, delay = 0) {
  let timeout;
  return function (...args) {
    if (delay) {
      clearTimeout(timeout);
      timeout = setTimeout(() => callback(...args), delay);
    } else {
      callback(...args);
    }
    return delay;
  };
}
