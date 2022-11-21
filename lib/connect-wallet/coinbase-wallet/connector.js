import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { rpcUrls } from '@/lib/connect-wallet/config/rpcUrls'

export const getConnector = (chainId) => {
  return new WalletLinkConnector({
    url: rpcUrls[chainId][0],
    appName: 'neptune-mutual',
    supportedChainIds: [chainId]
  })
}
