import { SUBGRAPH_API_URLS } from '@/src/config/constants'

function getChainIdFromDNS () {
  // window.location.host - subdomain.domain.com
  const parts = window.location.host.split('.')

  switch (parts[0]) {
    case 'mumbai':
      return '80001'
    case 'fuji':
      return '43113'
    case 'ropsten':
      return '3'
    case 'kovan':
      return '42'
    case 'bsctest':
      return '97'
    case 'eth':
      return '1'
    case 'bsc':
      return '56'
    case 'polygon':
      return '137'

    default:
      return process.env.NEXT_PUBLIC_FALLBACK_NETWORK || '3'
  }
}

export const getNetworkId = () => parseInt(getChainIdFromDNS(), 10)
export const getGraphURL = (networkId) => SUBGRAPH_API_URLS[networkId] || null

export const isFeatureEnabled = (feature) => {
  const str =
    process.env.NEXT_PUBLIC_FEATURES ||
    'policy,liquidity,reporting,claim,bond,staking-pool,pod-staking-pool'
  const features = str.split(',').map((x) => x.trim())

  return features.indexOf(feature) > -1
}

export const testnetChainIds = [3, 42, 97, 43113, 80001]
export const mainnetChainIds = [1, 10, 56, 137, 42161, 43114]

export const isDiversifiedCoversEnabled = () => process.env.NEXT_PUBLIC_ENABLE_V2 === 'true'

export const timeouts = {
  waitForTransactionWithTimeout: 30000
}
