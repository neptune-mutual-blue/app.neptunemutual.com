import { POLLING_INTERVAL } from '../config/connectors'
import { getNodeUrl } from './getRpcUrl'
import { JsonRpcProvider, Web3Provider } from '@ethersproject/providers'

// Fallback Provider
export const getProvider = (networkId) => {
  const rpcUrl = getNodeUrl(networkId)
  const library = new JsonRpcProvider(rpcUrl)

  library.pollingInterval = POLLING_INTERVAL

  return library
}

// Used if wallet is connected
export const getLibrary = (provider) => {
  const library = new Web3Provider(provider)

  library.pollingInterval = POLLING_INTERVAL

  return library
}

export const getSigner = (library, account) => {
  return library.getSigner(account).connectUnchecked()
}

/**
 *
 * @param {Web3Provider} _library
 * @param {string=} account
 * @param {number} networkId
 * @returns
 */
export const getProviderOrSigner = (_library, account, networkId) => {
  let library = _library

  if (!library) {
    library = getProvider(networkId)
  }

  if (!account) {
    return library
  }

  return getSigner(library, account)
}
