/**
 *
 * @param {number} networkId
 */
export const setupNetwork = async (networkId) => {
  const binanceChainIds = {
    97: 'bsc-testnet',
    56: 'bsc-mainnet',
    1: 'eth-mainnet'
  }

  const id = binanceChainIds[networkId]

  if (!id) {
    return false
  }

  try {
    await window.BinanceChain.switchNetwork(id)

    return true
  } catch (error) {
    console.error(error)
  }

  return false
}
