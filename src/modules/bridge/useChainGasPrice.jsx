import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { useWeb3React } from '@web3-react/core'

export const useChainGasPrice = () => {
  const { library } = useWeb3React()
  const [chainGasPrice, setChainGasPrice] = useState('0')

  const getAndUpdateChainGasPrice = useCallback(async () => {
    if (!library) { return '0' }

    try {
      const _gasPrice = await library.getGasPrice()
      setChainGasPrice(_gasPrice.toString())

      return _gasPrice.toString()
    } catch (e) {
      console.error(`Error in getting current chain gas Price: ${e}`)
    }

    return '0'
  }, [library])

  useEffect(() => {
    getAndUpdateChainGasPrice()
  }, [getAndUpdateChainGasPrice])

  return {
    chainGasPrice
  }
}
