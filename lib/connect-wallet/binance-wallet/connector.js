import { BscConnector } from "@binance-chain/bsc-connector";

export const getConnector = (chainId) => {
  return new BscConnector({ supportedChainIds: [chainId] });
};
