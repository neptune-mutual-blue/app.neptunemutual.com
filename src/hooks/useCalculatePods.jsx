import {
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { DEBOUNCE_TIMEOUT } from '@/src/config/constants'
import { useAppConstants } from '@/src/context/AppConstants'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import {
  convertFromUnits,
  convertToUnits,
  isValidNumber
} from '@/utils/bn'
import { registry } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

export const useCalculatePods = ({ coverKey, value, podAddress }) => {
  const { library, account } = useWeb3React()
  const { networkId } = useNetwork()

  const debouncedValue = useDebounce(value, DEBOUNCE_TIMEOUT)
  const [receiveAmount, setReceiveAmount] = useState('0')
  const [loading, setLoading] = useState(false)
  const { contractRead } = useTxPoster()
  const { notifyError } = useErrorNotifier()
  const { liquidityTokenDecimals } = useAppConstants()
  const tokenDecimals = useTokenDecimals(podAddress)

  useEffect(() => {
    let ignore = false

    if (
      !networkId ||
      !account ||
      !debouncedValue ||
      !isValidNumber(debouncedValue)
    ) {
      if (receiveAmount !== '0') { setReceiveAmount('0') }

      return
    }

    const handleError = (err) => {
      notifyError(err, 'Could not calculate pods')
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId)

    async function exec () {
      setLoading(true)

      const cleanup = () => {
        setLoading(false)
      }

      try {
        const instance = await registry.Vault.getInstance(
          networkId,
          coverKey,
          signerOrProvider
        )

        const onError = (err) => {
          handleError(err)
          cleanup()
        }

        const args = [
          convertToUnits(debouncedValue, liquidityTokenDecimals).toString()
        ]
        const podAmount = await contractRead({
          instance,
          methodName: 'calculatePods',

          onError,
          args
        })

        if (ignore) { return }
        setReceiveAmount(convertFromUnits(podAmount, tokenDecimals).toString())
        cleanup()
      } catch (err) {
        handleError(err)
        cleanup()
      }
    }

    exec()

    return () => {
      ignore = true
    }
  }, [
    account,
    coverKey,
    debouncedValue,
    library,
    liquidityTokenDecimals,
    networkId,
    notifyError,
    tokenDecimals,
    receiveAmount,
    contractRead
  ])

  return {
    receiveAmount,
    loading
  }
}
