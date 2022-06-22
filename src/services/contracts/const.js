/**
 * @typedef
 *
 * @typedef IIpfsData
 * @prop {string} productName
 * @prop {string} about
 * @prop {string} rules
 * @prop {string[]} tags
 * @prop {string[]} resolutionSources
 * @prop {Object.<string, string>} links
 *
 *
 *
 * @typedef IProduct
 * @prop {string} id
 * @prop {string} coverKey
 * @prop {string} productKey
 * @prop {IIpfsData} ipfsData
 *
 */

export const SUBGRAPH_ERRORS = {
  REQUIRED_PARAM_ERROR: "REQUIRED_PARAM_ERROR",
  URL_NOT_FOUND: "URL_NOT_FOUND",
  ERROR_404: "ERROR_404",
};
