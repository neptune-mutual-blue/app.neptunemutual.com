import { InjectedConnector } from "@web3-react/injected-connector";

/**
 *
 * @param {number} chainId
 */
export const getConnector = (chainId) => {
  const connector = new InjectedConnector({ supportedChainIds: [chainId] });

  return connector;
};

console.log("injected connector loaded");
