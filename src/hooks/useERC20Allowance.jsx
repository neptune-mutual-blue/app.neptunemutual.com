import {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { useUnlimitedApproval } from '@/src/context/UnlimitedApproval'
import { useAuthValidation } from '@/src/hooks/useAuthValidation'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { useRetry } from '@/src/hooks/useRetry'
import { t } from '@lingui/macro'
import { useLingui } from '@lingui/react'
import { registry } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'

const DELAY_BETWEEN_CHECKS = 2000 // Milliseconds
const TIMES_TO_CHECK = 10

export const useERC20Allowance = (tokenAddress) => {
  const spenderRef = useRef(null)

  const [allowance, setAllowance] = useState('0')
  const [loading, setLoading] = useState(false)
  const { networkId } = useNetwork()
  const { library, account } = useWeb3React()
  const { notifyError } = useErrorNotifier()
  const { writeContract, contractRead } = useTxPoster()
  const { getApprovalAmount } = useUnlimitedApproval()
  const { requiresAuth } = useAuthValidation()

  const { i18n } = useLingui()

  const fetchAllowance = useCallback(
    async (spender, { onTransactionResult, onError, cleanup }) => {
      if (!networkId || !account || !tokenAddress) {
        cleanup()

        return
      }

      if (!spender) {
        // Cleanup explicitly since the below useEffect cannot access spender
        cleanup()

        return
      }

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
          console.log(
            'Could not get an instance of the ERC20 from the SDK',
            tokenAddress
          )

          return
        }

        const args = [account, spender]
        const result = await contractRead({
          instance: tokenInstance,
          methodName: 'allowance',
          args,
          onError
        })

        onTransactionResult(result)
      } catch (err) {
        onError(err)
      }
    },
    [account, contractRead, library, networkId, tokenAddress]
  )

  // Resets loading and other states which are modified in the above hook
  // "IF" condition should match the above effect
  // Should appear after the effect which contains the async function (which sets loading state)
  useEffect(() => {
    if (!networkId || !account || !tokenAddress) {
      if (allowance !== '0') {
        setAllowance('0')
      }
      if (loading !== false) {
        setLoading(false)
      }
    }
  }, [account, allowance, loading, networkId, tokenAddress])

  const refetch = useCallback(
    async (spender) => {
      setLoading(true)

      const cleanup = () => {
        setLoading(false)
      }

      const handleError = (err) => {
        notifyError(err, t(i18n)`Could not get allowance`)
      }

      const onTransactionResult = (_allowance) => {
        if (_allowance) {
          setAllowance(_allowance.toString())
        }
        cleanup()
      }

      const onError = (err) => {
        handleError(err)
        cleanup()
      }

      fetchAllowance(spender, {
        onTransactionResult,
        onError,
        cleanup
      })
    },
    [fetchAllowance, notifyError, i18n]
  )

  const { stopRetrying, restartRetrying, isRetrying } = useRetry(
    async () => { return refetch(spenderRef.current) },
    {
      retries: TIMES_TO_CHECK,
      delay: DELAY_BETWEEN_CHECKS
    }
  )

  useEffect(() => {
    stopRetrying()

    // When allowance changes stop checking
  }, [allowance, stopRetrying])

  /**
   *
   * @param {string} spender
   * @param {string} amount
   */
  const approve = async (
    spender,
    amount,
    { onTransactionResult, onRetryCancel, onError }
  ) => {
    if (!networkId || !account || !tokenAddress || !spender) {
      requiresAuth()
      throw new Error('Could not approve')
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId)

    const tokenInstance = registry.IERC20.getInstance(
      tokenAddress,
      signerOrProvider
    )

    if (!tokenInstance) {
      console.log(
        'Could not get an instance of the ERC20 from the SDK',
        tokenAddress
      )
    }

    const args = [spender, getApprovalAmount(amount)]
    writeContract({
      instance: tokenInstance,
      methodName: 'approve',
      args,
      onError,
      onRetryCancel,
      onTransactionResult: (tx) => {
        tx?.wait()
          .then(() => {
            spenderRef.current = spender
            restartRetrying()
          })

        onTransactionResult(tx)
      }
    })
  }

  return { allowance, loading: loading || isRetrying, approve, refetch }
}
