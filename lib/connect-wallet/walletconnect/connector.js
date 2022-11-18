import { WalletConnectConnector } from '@web3-react/walletconnect-connector'

import { POLLING_INTERVAL } from '../config/connectors'
import { getNodeUrl } from '../utils/getRpcUrl'

/**
 *
 * @param {number} chainId
 * @returns
 */
export const getConnector = (chainId) => {
  const rpcUrl = getNodeUrl(chainId)

  return new WalletConnectConnector({
    rpc: { [chainId]: rpcUrl },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
    chainId: chainId,
    supportedChainIds: [chainId]
  })
}

console.log('walletconnect connector loaded')

// const [web3WalletConnect, web3WalletConnectHooks] = initializeConnector((actions) => {
//   // Avoid testing for the best URL by only passing a single URL per chain.
//   // Otherwise, WC will not initialize until all URLs have been tested (see getBestUrl in web3-react).
//   const RPC_URLS_WITHOUT_FALLBACKS = Object.entries(RPC_URLS).reduce(
//     (map, [chainId, urls]) => ({
//       ...map,
//       [chainId]: urls[0],
//     }),
//     {}
//   )
//   return new WalletConnect({
//     actions,
//     options: {
//       rpc: RPC_URLS_WITHOUT_FALLBACKS,
//       qrcode: true,
//     },
//     onError,
//   })
// })
