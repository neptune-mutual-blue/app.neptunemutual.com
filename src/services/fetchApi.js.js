import { API_BASE_URL } from "@/src/config/constants";

/**
 * @param {string} label
 * @returns {(endpoint: string, options: object) => Promise<any>}
 */
export function fetchApi(label) {
  let controller;

  return async (endpoint, options = {}) => {
    controller?.abort();
    controller = new AbortController();

    try {
      const result = await fetch(
        `${API_BASE_URL}${endpoint}`,
        Object.assign(
          {
            signal: controller.signal,
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
          },
          options
        )
      );

      return result.json();
    } catch (e) {
      if (isAbortedRequest(e)) {
        return console.log(`Aborted Request: ${label}`);
      }

      // else rethrow error so we can catch it externally
      throw new Error(e);
    }
  };
}

/**
 * @param {{ message: string }} errorMessage
 */
function isAbortedRequest(errorMessage) {
  return errorMessage.message.includes("The user aborted a request");
}
