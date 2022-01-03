import { BscConnector } from "@binance-chain/bsc-connector";

export const getConnector = (chainId) => {
  const bscConnector = new BscConnector({ supportedChainIds: [chainId] });

  return bscConnector;
};

console.log("binance connector loaded");
