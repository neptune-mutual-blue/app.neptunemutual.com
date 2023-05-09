import { ConnectorNames } from '../config/connectors'

/**
 * Asynchronously load the selected connector only
 *
 * @param {string} name
 * @param {number} chainId
 */
export const getConnectorByName = async (name, chainId) => {
  switch (name) {
    case ConnectorNames.Injected: {
      const c = await import('../injected/connector')

      return c.getConnector(chainId)
    }
    case ConnectorNames.MetaMask: {
      const c = await import('../metamask/connector')

      return c.getConnector(chainId)
    }
    case ConnectorNames.CoinbaseWallet: {
      const c = await import('../coinbase-wallet/connector')

      return c.getConnector(chainId)
    }
    case ConnectorNames.BitKeepWallet: {
      const c = await import('../bitkeep-wallet/connector')

      return c.getConnector(chainId)
    }
    case ConnectorNames.OKXWallet: {
      const c = await import('../okx-wallet/connector')

      return c.getConnector(chainId)
    }
    case ConnectorNames.BSC: {
      const c = await import('../binance-wallet/connector')

      return c.getConnector(chainId)
    }
    case ConnectorNames.Gnosis: {
      const c = await import('../gnosis-safe/connector')

      return c.getConnector(chainId)
    }
    default:
      return null
  }
}
