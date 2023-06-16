import { config } from '@neptunemutual/sdk'

export const getApproximateBlocksPerYear = (chainId) => {
  const blockTime =
    config.networks.getChainConfig(chainId).approximateBlockTime

  return parseInt(3.156e7 / blockTime)
}
