import { mainnetChainIds } from '@/src/config/environment'

// TODO: Delete hook and move `getNetworkInfo` to utils folder
/**
 *
 * @param {number} networkId
 * @returns
 */
export const useValidateNetwork = (networkId) => {
  const isMainNet = mainnetChainIds.indexOf(networkId) > -1
  const isEthereum = networkId === 1
  const isArbitrum = networkId === 42161

  return {
    isEthereum,
    isMainNet,
    isTestNet: !isMainNet,
    isArbitrum
  }
}

export const getNetworkInfo = (networkId) => {
  const isMainNet = mainnetChainIds.indexOf(networkId) > -1
  const isEthereum = networkId === 1
  const isArbitrum = networkId === 42161

  return {
    isEthereum,
    isMainNet,
    isTestNet: !isMainNet,
    isArbitrum
  }
}
