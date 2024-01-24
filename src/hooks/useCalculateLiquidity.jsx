import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { t } from '@lingui/macro'

import { convertToUnits, isValidNumber } from '@/utils/bn'
import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { registry } from '@neptunemutual/sdk'
import { useDebounce } from '@/src/hooks/useDebounce'
import { useTxPoster } from '@/src/context/TxPoster'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useMountedState } from '@/src/hooks/useMountedState'
import { DEBOUNCE_TIMEOUT } from '@/src/config/constants'
import { useLingui } from '@lingui/react'

export const useCalculateLiquidity = ({ coverKey, podAmount }) => {
  const isMounted = useMountedState()
  const { library, account } = useWeb3React()
  const { networkId } = useNetwork()

  const debouncedValue = useDebounce(podAmount, DEBOUNCE_TIMEOUT)
  const [receiveAmount, setReceiveAmount] = useState('0')
  const [loading, setLoading] = useState(false)
  const { contractRead } = useTxPoster()
  const { notifyError } = useErrorNotifier()

  const { i18n } = useLingui()

  const calculateLiquidity = useCallback(async () => {
    if (
      !networkId ||
      !account ||
      !debouncedValue ||
      !isValidNumber(debouncedValue)
    ) {
      return
    }

    const handleError = (err) => {
      notifyError(err, t(i18n)`Could not calculate liquidity`)
    }

    setLoading(true)

    const cleanup = () => {
      setLoading(false)
    }

    try {
      const signerOrProvider = getProviderOrSigner(library, account, networkId)

      const instance = await registry.Vault.getInstance(
        networkId,
        coverKey,
        signerOrProvider
      )

      const onError = (err) => {
        handleError(err)
        cleanup()
      }

      const args = [convertToUnits(debouncedValue).toString()]

      const liquidityAmount = await contractRead({
        instance,
        methodName: 'calculateLiquidity',
        onError,
        args
      })

      if (!isMounted()) { return }
      setReceiveAmount(liquidityAmount)
      cleanup()
    } catch (err) {
      handleError(err)
      cleanup()
    }
  }, [
    account,
    contractRead,
    coverKey,
    debouncedValue,
    isMounted,
    library,
    networkId,
    notifyError,
    i18n
  ])

  useEffect(() => {
    calculateLiquidity()
  }, [calculateLiquidity])

  return {
    receiveAmount,
    loading
  }
}
