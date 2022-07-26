import { getGraphURL, getNetworkId } from "@/src/config/environment";

const ERRORS_SUBGRAPH = {
  UNKNOWN_SUBGRAPH_URL: "UNKNOWN_SUBGRAPH_URL",
  SUBGRAPH_DATA_ERROR: "SUBGRAPH_DATA_ERROR",
  REQUEST_ABORTED: "REQUEST_ABORTED",
};

/**
 * @param {string} label
 * @returns {(query: string) => Promise<any>}
 */
export function fetchSubgraph(label) {
  let controller;

  return (query) => {
    const networkId = getNetworkId();
    const graphURL = getGraphURL(networkId);

    if (graphURL) {
      controller?.abort();
      controller = new AbortController();
      return fetch(graphURL, {
        signal: controller.signal,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          query,
        }),
      })
        .then((res) => res.json())
        .then(({ data, errors }) => {
          if (errors) {
            throw new Error(ERRORS_SUBGRAPH.SUBGRAPH_DATA_ERROR);
          }

          return data;
        })
        .catch((e) => {
          if (isAbortedRequest(e)) {
            return console.log(`Aborted Request: ${label}`);
          }

          // else rethrow error so we can catch it externally
          throw new Error(e);
        });
    }

    throw new Error(ERRORS_SUBGRAPH.UNKNOWN_SUBGRAPH_URL);
  };
}

/**
 * @param {{ message: string }} errorMessage
 */
function isAbortedRequest(errorMessage) {
  return errorMessage.message.includes("The user aborted a request");
}
