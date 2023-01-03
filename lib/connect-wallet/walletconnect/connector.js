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
