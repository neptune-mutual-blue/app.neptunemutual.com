import { getGraphURL } from "@/src/config/environment";

const ERRORS_SUBGRAPH = {
  UNKNOWN_SUBGRAPH_URL: "UNKNOWN_SUBGRAPH_URL",
  SUBGRAPH_DATA_ERROR: "SUBGRAPH_DATA_ERROR",
  REQUEST_ABORTED: "REQUEST_ABORTED",
};

/**
 * @param {string} label
 * @returns {(networkId: number, query: string) => Promise<any>}
 */
export function fetchSubgraph(label) {
  let controller;

  return async (networkId, query) => {
    const graphURL = getGraphURL(networkId);

    if (!graphURL) {
      throw new Error(ERRORS_SUBGRAPH.UNKNOWN_SUBGRAPH_URL);
    }

    controller?.abort();
    controller = new AbortController();

    try {
      const response = await fetch(graphURL, {
        signal: controller.signal,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      });

      const { data, errors } = await response.json();

      if (errors) {
        throw new Error(ERRORS_SUBGRAPH.SUBGRAPH_DATA_ERROR);
      }

      return data;
    } catch (error) {
      if (isAbortedRequest(error)) {
        return console.log(`Aborted Request: ${label}`);
      }

      // else rethrow error so we can catch it externally
      throw new Error(error);
    }
  };
}

/**
 * @param {{ message: string }} errorMessage
 */
function isAbortedRequest(errorMessage) {
  return errorMessage.message.includes("The user aborted a request");
}
