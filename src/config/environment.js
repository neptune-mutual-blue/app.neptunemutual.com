import { SUBGRAPH_API_URLS } from '@/src/config/constants'
import { detectChainId } from '@/utils/dns'

export const getNetworkId = () => {
  const host = window.location.host
  const chainId = detectChainId(host)

  return parseInt(chainId, 10)
}

export const getGraphURL = (networkId) => SUBGRAPH_API_URLS[networkId] || null

export const isFeatureEnabled = (feature) => {
  const str =
    process.env.NEXT_PUBLIC_FEATURES ||
    'policy,liquidity,reporting,claim,bond,staking-pool,pod-staking-pool'
  const features = str.split(',').map((x) => x.trim())

  return features.indexOf(feature) > -1
}

export const mainnetChainIds = [1, 10, 56, 137, 42161, 43114]

export const isDiversifiedCoversEnabled = () => process.env.NEXT_PUBLIC_ENABLE_V2 === 'true'

export const timeouts = {
  waitForTransactionWithTimeout: 30000
}
