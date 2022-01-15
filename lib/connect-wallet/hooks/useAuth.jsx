import { useCallback, useEffect } from "react";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";

import { ACTIVE_CONNECTOR_KEY } from "../config/localstorage";
import { getConnectorByName } from "../utils/connectors";
import { wallets } from "../config/wallets";
import { NetworkNames } from "../config/chains";
import { setupNetwork } from "../utils/wallet";
import * as walletConnectUtils from "../utils/walletConnect";
import * as notifications from "../utils/notifications";
import { ConnectorNames } from "../config/connectors";

const handleInjectedError = async (notify, error) => {
  const { NoEthereumProviderError, UserRejectedRequestErrorInjected } =
    await import("../injected/errors");

  if (error instanceof NoEthereumProviderError) {
    return notifications.providerError(notify, error);
  }

  if (error instanceof UserRejectedRequestErrorInjected) {
    return notifications.authError(notify, error);
  }

  notifications.unidentifiedError(notify, error);
};

const handleWalletConnectError = async (notify, connector, error) => {
  const { UserRejectedRequestErrorWalletConnect, WalletConnectConnector } =
    await import("../walletconnect/errors");

  if (error instanceof UserRejectedRequestErrorWalletConnect) {
    if (connector instanceof WalletConnectConnector) {
      const walletConnector = connector;
      walletConnector.walletConnectProvider = null;
    }

    return notifications.authError(notify, error);
  }

  notifications.unidentifiedError(notify, error);
};

const handleBSCError = async (notify, error) => {
  const { NoBscProviderError } = await import("../binance-wallet/errors");

  if (error instanceof NoBscProviderError) {
    return notifications.providerError(notify, error);
  }

  notifications.unidentifiedError(notify, error);
};

const clearConnectionData = () => {
  window.localStorage.removeItem(ACTIVE_CONNECTOR_KEY);
};

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
        return activate(connector, clearConnectionData);
      }

      clearConnectionData();

      const wallet = wallets.find(
        (_wallet) => _wallet.connectorName === connectorName
      );

      return notifications.wrongNetwork(
        notify,
        NetworkNames[networkId],
        wallet.name,
        error
      );
    }

    clearConnectionData();

    switch (connectorName) {
      case ConnectorNames.Injected:
        return handleInjectedError(notify, error);

      case ConnectorNames.WalletConnect:
        return handleWalletConnectError(notify, connector, error);

      case ConnectorNames.BSC:
        return handleBSCError(notify, error);
    }

    notifications.unidentifiedError(notify, error);
  });
};

const useAuth = (networkId, notify = console.log) => {
  const { activate, deactivate, connector } = useWeb3React();

  useEffect(() => {
    if (!connector) {
      return;
    }

    connector?.addListener("Web3ReactDeactivate", clearConnectionData);
    return () => {
      connector?.removeListener("Web3ReactDeactivate", clearConnectionData);
    };
  }, [connector]);

  const login = useCallback(
    (connectorName) =>
      activateConnector(connectorName, activate, networkId, notify),
    [activate, networkId, notify]
  );

  const logout = useCallback(() => {
    clearConnectionData();

    deactivate();
    walletConnectUtils.disconnect();
  }, [deactivate]);

  return { logout, login };
};

export default useAuth;
