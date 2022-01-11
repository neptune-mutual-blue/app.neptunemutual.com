function getChainIdFromDNS() {
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

export const getNetworkId = () => parseInt(getChainIdFromDNS(), 10);
