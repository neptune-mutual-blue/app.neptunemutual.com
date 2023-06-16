import { useState, useEffect, useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { registry } from '@neptunemutual/sdk'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useNetwork } from '@/src/context/Network'
import { useTxPoster } from '@/src/context/TxPoster'

export const useERC20Balance = (tokenAddress) => {
  const [balance, setBalance] = useState('0')
  const [loading, setLoading] = useState(false)
  const { networkId } = useNetwork()
  const { library, account } = useWeb3React()
  const { contractRead } = useTxPoster()

  const fetchBalance = useCallback(
    async ({ onTransactionResult, onError }) => {
      if (!networkId || !account || !tokenAddress) {
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
          console.log('Could not get an instance of the ERC20 from the SDK')

          return
        }

        const result = await contractRead({
          args: [account],
          instance: tokenInstance,
          methodName: 'balanceOf',
          onError
        })
        onTransactionResult(result)
      } catch (e) {
        console.error(e)
      }
    },
    [account, contractRead, library, networkId, tokenAddress]
  )

  useEffect(() => {
    let ignore = false
    setLoading(true)

    const cleanup = () => {
      setLoading(false)
    }

    const onTransactionResult = (result) => {
      const _balance = result
      if (ignore || !_balance) { return }
      setBalance(_balance.toString())
      cleanup()
    }

    const onError = () => {
      cleanup()
    }

    fetchBalance({ onTransactionResult, onError })

    return () => {
      ignore = true
    }
  }, [fetchBalance])

  // Resets loading and other states which are modified in the above hook
  // "IF" condition should match the above effect
  // Should appear after the effect which contains the async function (which sets loading state)
  useEffect(() => {
    if (!networkId || !account || !tokenAddress) {
      if (balance !== '0') {
        setBalance('0')
      }
      if (loading !== false) {
        setLoading(false)
      }
    }
  }, [account, balance, loading, networkId, tokenAddress])

  const refetch = useCallback(async () => {
    setLoading(true)

    const cleanup = () => {
      setLoading(false)
    }

    const onTransactionResult = (result) => {
      const _balance = result
      cleanup()
      if (_balance) {
        setBalance(_balance.toString())
      }
    }

    const onError = (err) => {
      cleanup()
      console.error(err)
    }

    fetchBalance({ onTransactionResult, onError })
  }, [fetchBalance])

  return { balance, loading, refetch }
}
