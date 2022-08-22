/**
 * @param {string} label
 */
export function fetchApi(label) {
  let controller;

  async function request(url, options = {}) {
    controller?.abort();
    controller = new AbortController();

    try {
      const result = await fetch(
        url,
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
  }

  return Object.assign(request, { abort: () => controller?.abort() });
}

/**
 * @param {{ message: string }} errorMessage
 */
function isAbortedRequest(errorMessage) {
  return errorMessage.message.includes("The user aborted a request");
}
