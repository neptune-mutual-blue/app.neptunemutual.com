import { ConnectorNames } from "../config/connectors";

/**
 * Asynchronously load the selected connector only
 *
 * @param {string} name
 * @param {number} chainId
 */
export const getConnectorByName = async (name, chainId) => {
  switch (name) {
    case ConnectorNames.Injected: {
      const c = await import("../injected/connector");

      return c.getConnector(chainId);
    }
    case ConnectorNames.BSC: {
      const c = await import("../binance-wallet/connector");

      return c.getConnector(chainId);
    }
    default:
      return null;
  }
};
