import { InjectedConnector } from "@web3-react/injected-connector";

/**
 *
 * @param {number} chainId
 */
export const getConnector = (chainId) => {
  return new InjectedConnector({ supportedChainIds: [chainId] });
};

console.log("injected connector loaded");
