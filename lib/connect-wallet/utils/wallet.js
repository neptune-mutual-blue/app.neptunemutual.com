import { ConnectorNames } from '../config/connectors'
import * as binanceWalletUtils from './binanceWallet'
import * as metamaskUtils from './metamask'
import * as okxWalletUtils from './okx-wallet'

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

    case ConnectorNames.Coinbase:
    case ConnectorNames.Injected:
      return metamaskUtils.setupNetwork(selectedChainId)

    case ConnectorNames.OKXWallet:
      return okxWalletUtils.setupNetwork(selectedChainId)
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
  if (!window.ethereum) {
    return false
  }

  return window.ethereum.request({
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
