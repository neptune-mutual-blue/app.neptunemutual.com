import { registerToken } from '@/lib/connect-wallet/utils/wallet'
import { useWeb3React } from '@web3-react/core'

export const useRegisterToken = () => {
  const { account } = useWeb3React()

  const register = (address, symbol, decimals = 18) => {
    if (!account) { return }

    const url = new URL(window.location.href)
    url.pathname = typeof symbol === 'string' ? `/images/tokens/${symbol.toLowerCase()}.svg` : '/'
    const image = symbol ? url.href : undefined

    registerToken(address, symbol, decimals, image)
      .then(console.log)
      .catch(console.error)
  }

  return {
    register
  }
}
