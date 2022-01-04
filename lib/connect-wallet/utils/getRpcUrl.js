import { rpcUrls } from "../config/rpcUrls";
import { getOne } from "./random";

// Used if wallet is not connected
// TODO: Ping url before return (to avoid using offline nodes) - more important when using walletconnect
export const getNodeUrl = (networkId) => {
  const nodes = rpcUrls[networkId];
  return getOne(...nodes);
};
