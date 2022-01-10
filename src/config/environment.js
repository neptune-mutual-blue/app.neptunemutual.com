function getChainIdFromDNS() {
  if (typeof window === "undefined") {
    return "3";
  }

  // window.location.host - subdomain.domain.com
  const parts = window.location.host.split(".");

  switch (parts[0]) {
    case "mumbai":
      return "80001";
    case "bsctest":
      return "97";
    case "app":
      return "56";

    default:
      return "3";
  }
}

export const CHAIN_ID = getChainIdFromDNS();
export const networkId = parseInt(CHAIN_ID, 10);
