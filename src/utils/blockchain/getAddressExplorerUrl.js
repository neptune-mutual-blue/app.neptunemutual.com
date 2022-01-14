import { explorer } from "@/lib/connect-wallet/config/chains";

export const getAddressExplorerUrl = (address, networkId) => {
  console.log("getAddressExplorerUrl", [
    address,
    networkId,
    explorer.address[networkId],
  ]);
  return explorer.address[networkId] + address;
};
