import { mainnetChainIds } from '@/src/config/environment'

/**
 *
 * @param {number} networkId
 * @returns
 */
export const useValidateNetwork = (networkId) => {
  const isMainNet = mainnetChainIds.indexOf(networkId) > -1
  const isEthereum = networkId === 1

  return {
    isEthereum,
    isMainNet,
    isTestNet: !isMainNet
  }
}
