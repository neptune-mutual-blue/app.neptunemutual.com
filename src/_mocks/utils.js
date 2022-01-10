export function sleeper(ms) {
  return function (x) {
    return new Promise((resolve) => setTimeout(() => resolve(x), ms));
  };
}

export const TOAST_ERROR_TIMEOUT = 30000; //30 seconds
