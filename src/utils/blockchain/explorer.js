import { explorer } from "@/lib/connect-wallet/config/chains";

export const getTxLink = (networkId, tx) => {
  return (explorer.tx[networkId] || "").replace("%s", tx.hash);
};

export const getAddressLink = (networkId, address) => {
  return (explorer.address[networkId] || "").replace("%s", address);
};
