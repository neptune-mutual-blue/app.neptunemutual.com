import { useCallback, useEffect } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { ACTIVE_CONNECTOR_KEY } from "../config/localstorage";
import { getConnectorByName } from "../utils/connectors";
import { wallets } from "../config/wallets";
import { NetworkNames } from "../config/chains";
import { setupNetwork } from "../utils/wallet";
import { ConnectorNames } from "../config/connectors";

const noOp = () => {};

const activateConnector = async (
  connectorName,
  activate,
  networkId,
  notify
) => {
  const connector = await getConnectorByName(connectorName, networkId);

  if (!connector) {
    console.info("Invalid Connector Name", connectorName);
    return;
  }

  window.localStorage.setItem(ACTIVE_CONNECTOR_KEY, connectorName);

  activate(connector, async (error) => {
    if (error instanceof UnsupportedChainIdError) {
      const hasSetup = await setupNetwork(connectorName, networkId);

      if (hasSetup) {
        activate(connector, () => {
          window.localStorage.removeItem(ACTIVE_CONNECTOR_KEY);
        });
        return;
      }

      window.localStorage.removeItem(ACTIVE_CONNECTOR_KEY);

      const wallet = wallets.find(
        (wallet) => wallet.connectorName === connectorName
      );

      notify({
        type: "error",
        title: "Wrong network",
        message: `Please switch to <strong>${NetworkNames[networkId]}</strong> in your <strong>${wallet.name}</strong> wallet`,
        error: error,
      });
      return;
    } else {
      window.localStorage.removeItem(ACTIVE_CONNECTOR_KEY);

      if (connectorName === ConnectorNames.Injected) {
        const { NoEthereumProviderError, UserRejectedRequestErrorInjected } =
          await import("../injected/errors");

        if (error instanceof NoEthereumProviderError) {
          notify({
            type: "error",
            title: "Provider Error",
            message: "Could not connect. No provider found",
            error: error,
          });
          return;
        }

        if (error instanceof UserRejectedRequestErrorInjected) {
          notify({
            type: "error",
            title: "Authorization Error",
            message: "Please authorize to access your account",
            error: error,
          });
          return;
        }
      }

      if (connectorName === ConnectorNames.WalletConnect) {
        const {
          UserRejectedRequestErrorWalletConnect,
          WalletConnectConnector,
        } = await import("../walletconnect/errors");

        if (error instanceof UserRejectedRequestErrorWalletConnect) {
          if (connector instanceof WalletConnectConnector) {
            const walletConnector = connector;
            walletConnector.walletConnectProvider = null;
          }
          notify({
            type: "error",
            title: "Authorization Error",
            message: "Please authorize to access your account",
            error: error,
          });
          return;
        }
      }

      if (connectorName === ConnectorNames.BSC) {
        const { NoBscProviderError } = await import("../binance-wallet/errors");

        if (error instanceof NoBscProviderError) {
          notify({
            type: "error",
            title: "Provider Error",
            message: "Could not connect. No provider found",
            error: error,
          });
          return;
        }
      }
    }

    notify({
      type: "error",
      title: "Error",
      message: "Something went wrong",
      error: error,
    });
  });
};

const deactivateConnector = async (deactivate, networkId) => {
  deactivate();
  window.localStorage.removeItem(ACTIVE_CONNECTOR_KEY);

  // This localStorage key is set by @web3-react/walletconnect-connector
  if (window.localStorage.getItem("walletconnect")) {
    const connector = await getConnectorByName(
      ConnectorNames.WalletConnect,
      networkId
    );
    connector.close();
    connector.walletConnectProvider = null;
  }
};

const useAuth = (networkId, notify = noOp) => {
  const { activate, deactivate, library, connector } = useWeb3React();

  useEffect(() => {
    if (!library || !library.provider) {
      return;
    }

    const handleDisconnect = () => deactivateConnector(deactivate, networkId);

    library.provider.on("disconnect", handleDisconnect);
    return () => {
      library.provider.removeListener("disconnect", handleDisconnect);
    };
  }, [library, deactivate, networkId]);

  useEffect(() => {
    if (!connector) {
      return;
    }

    const handleDisconnect = () => deactivateConnector(deactivate, networkId);

    connector.addListener("Web3ReactDeactivate", handleDisconnect);
    return () => {
      connector.removeListener("Web3ReactDeactivate", handleDisconnect);
    };
  }, [connector, deactivate, networkId]);

  const login = useCallback(
    (connectorName) =>
      activateConnector(connectorName, activate, networkId, notify),
    [activate, networkId, notify]
  );

  const logout = useCallback(
    () => deactivateConnector(deactivate),
    [deactivate]
  );

  return { logout, login };
};

export default useAuth;
