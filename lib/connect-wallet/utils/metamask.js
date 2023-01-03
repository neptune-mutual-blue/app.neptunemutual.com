import { getCorrectEthereumProvider } from '@/lib/connect-wallet/utils/wallet'
import { chains } from '../config/chains'

/**
 * @param {number} networkId
 */
const getNetworkParams = (networkId) => {
  return chains.find((x) => x.chainId === `0x${networkId.toString(16)}`)
}

/**
 * @param {number} networkId
 */
export const setupNetwork = async (networkId, connectorName) => {
  const provider = getCorrectEthereumProvider(window.ethereum, connectorName)

  if (!provider) {
    console.error("Can't setup network - window.ethereum is undefined")
    return false
  }

  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: getNetworkParams(networkId).chainId }]
    })
    return true
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      return addChain(networkId, connectorName)
    }
    // handle other "switch" errors
    console.error(switchError)
  }

  return false
}

/**
 * @param {number} networkId
 */
export const addChain = async (networkId, connectorName) => {
  const provider = getCorrectEthereumProvider(window.ethereum, connectorName)

  if (!provider) {
    console.error("Can't setup network - window.ethereum is undefined")
    return false
  }

  try {
    await provider.request({
      method: 'wallet_addEthereumChain',
      params: [getNetworkParams(networkId)]
    })
    return true
  } catch (addError) {
    // handle "add" error
    console.error(addError)
  }
  return false
}
