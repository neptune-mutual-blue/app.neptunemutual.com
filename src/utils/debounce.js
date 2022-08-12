/**
 * A utility that creates a reference for debouncing an action/function
 *
 * This has to be declared outside of react component to keep the referential identity
 *
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
