import { getOkxWalletProvider } from '@/lib/connect-wallet/providers'
import { chains } from '../../config/chains'

/**
 * @param {number} networkId
 */
const getNetworkParams = (networkId) => {
  return chains.find((x) => { return x.chainId === `0x${networkId.toString(16)}` })
}

/**
 * @param {number} networkId
 */
export const setupNetwork = async (networkId) => {
  const provider = getOkxWalletProvider()

  if (!provider) {
    console.error("Can't setup network - window.okxwallet is undefined")

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
      return addChain(networkId)
    }
    // handle other "switch" errors
    console.error(switchError)
  }

  return false
}

/**
 * @param {number} networkId
 */
export const addChain = async (networkId) => {
  const provider = getOkxWalletProvider()

  if (!provider) {
    console.error("Can't setup network - window.okxwallet is undefined")

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
