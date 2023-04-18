import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { registry } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useERC20Details = (tokenAddress) => {
  const [name, setName] = useState()
  const [symbol, setSymbol] = useState()
  const [decimals, setDecimals] = useState()

  const [loading, setLoading] = useState(false)
  const { networkId } = useNetwork()
  const { library, account } = useWeb3React()
  const { contractRead } = useTxPoster()

  const cleanup = () => {
    setLoading(false)
  }

  const onError = useCallback(() => {
    cleanup()
  }, [])

  const fetchDetails = useCallback(
    async () => {
      if (!networkId || !account || !tokenAddress) {
        return
      }

      setLoading(true)

      try {
        const signerOrProvider = getProviderOrSigner(
          library,
          account,
          networkId
        )

        const tokenInstance = registry.IERC20.getInstance(
          tokenAddress,
          signerOrProvider
        )

        if (!tokenInstance) {
          console.log('Could not get an instance of the ERC20 from the SDK')
          return
        }

        const [nameResult, symbolResult, decimalResult] = await Promise.all([contractRead({
          instance: tokenInstance,
          methodName: 'name',
          onError
        }),
        contractRead({
          instance: tokenInstance,
          methodName: 'symbol',
          onError
        }),
        contractRead({
          instance: tokenInstance,
          methodName: 'decimals',
          onError
        })
        ])

        if (!nameResult || !symbolResult || !decimalResult) return

        setName(nameResult)
        setSymbol(symbolResult)
        setDecimals(decimalResult)

        cleanup()
      } catch (e) {
        onError()
        console.error(e)
      }
    },
    [account, contractRead, library, networkId, tokenAddress, onError]
  )

  useEffect(() => {
    fetchDetails()
  }, [fetchDetails])

  useEffect(() => {
    if (!networkId || !account || !tokenAddress) {
      setName(undefined)
      setSymbol(undefined)
      setDecimals(undefined)
    }
  }, [account, loading, networkId, tokenAddress])

  return { name, symbol, decimals, loading }
}
