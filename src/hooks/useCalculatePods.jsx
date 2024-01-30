import { useEffect, useState } from 'react'
import { registry } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'
import { t } from '@lingui/macro'

import { convertToUnits, convertFromUnits, isValidNumber } from '@/utils/bn'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useTxPoster } from '@/src/context/TxPoster'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useAppConstants } from '@/src/context/AppConstants'
import { useTokenDecimals } from '@/src/hooks/useTokenDecimals'
import { DEBOUNCE_TIMEOUT } from '@/src/config/constants'
import { useLingui } from '@lingui/react'

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

  const { i18n } = useLingui()

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
      notifyError(err, t(i18n)`Could not calculate pods`)
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
    contractRead,
    i18n
  ])

  return {
    receiveAmount,
    loading
  }
}
