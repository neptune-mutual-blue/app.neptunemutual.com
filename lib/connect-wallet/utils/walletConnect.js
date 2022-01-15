import { getConnectorByName } from "./connectors";

export const disconnect = async () => {
  // This localStorage key is set by @web3-react/walletconnect-connector
  if (!window.localStorage.getItem("walletconnect")) {
    return;
  }

  const connector = await getConnectorByName(
    ConnectorNames.WalletConnect,
    networkId
  );
  connector.close();
  connector.walletConnectProvider = null;
};
