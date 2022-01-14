import { explorer } from "@/lib/connect-wallet/config/chains";

export const getAddressExplorerUrl = (address, networkId) => {
  return explorer.address[networkId] + address;
};
