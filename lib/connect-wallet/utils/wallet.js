import { ACTIVE_CONNECTOR_KEY } from '@/lib/connect-wallet/config/localstorage'
import { ConnectorNames } from '../config/connectors'
import * as binanceWalletUtils from './binanceWallet'
import * as metamaskUtils from './metamask'
import * as okxWalletUtils from './okx-wallet'

const isWalletInstalled = key => {
  const { ethereum } = window

  let installed = false

  if (ethereum?.providers?.length) {
    ethereum.providers.forEach((p) => {
      if (p[key]) installed = true
    })
  } else {
    if (ethereum?.[key]) installed = true
  }

  return installed
}

export const isMetaMaskInstalled = () => {
  return isWalletInstalled('isMetaMask')
}

export const isCoinbaseInstalled = () => {
  return isWalletInstalled('isCoinbaseWallet')
}

export const isOkxInstalled = () => {
  return Boolean(window?.okxwallet)
}

export const isBinanceChainInstalled = () => {
  return Boolean(window?.BinanceChain)
}

export const getCorrectEthereumProvider = (ethereum, connectorName) => {
  let provider = ethereum
  const connector = connectorName || window.localStorage.getItem(ACTIVE_CONNECTOR_KEY)

  if (ethereum?.providers?.length) {
    ethereum.providers.forEach(p => {
      if (
        (p.isMetaMask && connector === ConnectorNames.Injected) ||
        (p.isCoinbaseWallet && connector === ConnectorNames.Coinbase)
      ) {
        provider = p
      }
    })
  }

  return provider
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

    case ConnectorNames.Coinbase:
    case ConnectorNames.Injected:
      return metamaskUtils.setupNetwork(selectedChainId, connectorName)

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

  return getCorrectEthereumProvider(window.ethereum).request({
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
