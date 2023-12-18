import { mainnetChainIds } from '@/src/config/environment'

/**
 *
 * @param {number} networkId
 * @returns
 */
export const getNetworkInfo = (networkId) => {
  const isMainNet = mainnetChainIds.indexOf(networkId) > -1
  const isEthereum = networkId === 1
  const isArbitrum = networkId === 42161
  const isBinanceSmartChain = networkId === 56
  const isPolygon = networkId === 137

  return {
    isEthereum,
    isMainNet,
    isTestNet: !isMainNet,
    isArbitrum,
    isBinanceSmartChain,
    isPolygon
  }
}
