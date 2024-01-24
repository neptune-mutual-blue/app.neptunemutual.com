import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'
import { useUnlimitedApproval } from '@/src/context/UnlimitedApproval'
import { useAuthValidation } from '@/src/hooks/useAuthValidation'
import { useErrorNotifier } from '@/src/hooks/useErrorNotifier'
import { t } from '@lingui/macro'
import { registry } from '@neptunemutual/sdk'
import { useWeb3React } from '@web3-react/core'
import { useLingui } from '@lingui/react'

const DELAY_BETWEEN_CHECKS = 2000 // Milliseconds
const TIMES_TO_CHECK = 10

export const useERC20Allowance = (tokenAddress) => {
  const [allowance, setAllowance] = useState('0')
  // Required data to start checking for updated allowance, and boolean value is used as a trigger to start and also stop
  const [checkForChange, setCheckForChange] = useState({ check: false, spender: null })
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

  // Check until allowance is updated, in an infinite loop
  useEffect(() => {
    let interval = null
    let timesRan = 0

    if (checkForChange.check) {
      interval = setInterval(() => {
        // Stop after certain number of times
        timesRan += 1
        if (timesRan > TIMES_TO_CHECK) {
          clearInterval(interval)
        }

        refetch(checkForChange.spender)
      }, DELAY_BETWEEN_CHECKS)
    }

    return () => { return clearInterval(interval) }
  }, [checkForChange, refetch])

  useEffect(() => {
    setCheckForChange(prev => {
      if (!prev.check) { // if not checking, do not update state
        return prev
      }

      return {
        check: false,
        spender: null
      }
    })

    // When allowance changes stop checking
  }, [allowance])

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
        tx?.wait(1)
          .then(() => {
            // Triggers checking allowance in a loop
            setCheckForChange({
              check: true,
              spender
            })
          })

        onTransactionResult(tx)
      }
    })
  }

  return { allowance, loading, approve, refetch }
}
