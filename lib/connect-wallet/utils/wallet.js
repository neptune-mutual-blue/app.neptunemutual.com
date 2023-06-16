import { ACTIVE_CONNECTOR_KEY } from '@/lib/connect-wallet/config/localstorage'
import {
  getBinanceWalletProvider,
  getCoinbaseWalletProvider,
  getInjectedProvider,
  getMetaMaskProvider,
  getOkxWalletProvider
} from '@/lib/connect-wallet/providers'

import { ConnectorNames } from '../config/connectors'
import * as binanceWalletUtils from './connectors/binanceWallet'
import * as bitKeepWalletUtils from './connectors/bitkeep-wallet'
import * as coinbaseWalletUtils from './connectors/coinbase-wallet'
import * as injectedWalletUtils from './connectors/injected'
import * as metamaskUtils from './connectors/metamask'
import * as okxWalletUtils from './connectors/okx-wallet'

const getCurrentConnector = () => {
  return window.localStorage.getItem(ACTIVE_CONNECTOR_KEY)
}

/**
 *
 * @param {string} connectorName
 * @param {number} selectedChainId
 * @returns {Promise<boolean>} Success or failure
 */
export const setupNetwork = async (connectorName, selectedChainId) => {
  if (!selectedChainId) {
    return false
  }

  switch (connectorName) {
    case ConnectorNames.BSC:
      return binanceWalletUtils.setupNetwork(selectedChainId)

    case ConnectorNames.MetaMask:
      return metamaskUtils.setupNetwork(selectedChainId)

    case ConnectorNames.Injected:
      return injectedWalletUtils.setupNetwork(selectedChainId)

    case ConnectorNames.OKXWallet:
      return okxWalletUtils.setupNetwork(selectedChainId)

    case ConnectorNames.CoinbaseWallet:
      return coinbaseWalletUtils.setupNetwork(selectedChainId)

    case ConnectorNames.BitKeepWallet:
      return bitKeepWalletUtils.setupNetwork(selectedChainId)
  }

  return false
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @param tokenImage
 * returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress,
  tokenSymbol,
  tokenDecimals,
  tokenImage
) => {
  const connectorName = getCurrentConnector()

  let provider = null

  switch (connectorName) {
    case ConnectorNames.BSC: {
      provider = getBinanceWalletProvider()
      break
    }

    case ConnectorNames.MetaMask: {
      provider = getMetaMaskProvider()
      break
    }

    case ConnectorNames.Injected: {
      provider = getInjectedProvider()
      break
    }

    case ConnectorNames.OKXWallet: {
      provider = getOkxWalletProvider()
      break
    }

    case ConnectorNames.CoinbaseWallet: {
      provider = getCoinbaseWalletProvider()
      break
    }
  }

  if (!provider || !provider.request || typeof provider.request !== 'function') {
    return false
  }

  return provider.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image: tokenImage
      }
    }
  })
}

export const isNotFrame = () => {
  return ((window === null || window === undefined ? undefined : window.parent) === window)
}
