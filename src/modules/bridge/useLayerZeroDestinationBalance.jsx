import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { BRIDGE_BALANCE_URL } from '@/src/config/constants'
import { getReplacedString } from '@/utils/string'

export function useLayerZeroDestinationBalance (destinationChainId) {
  const [balance, setBalance] = useState('0')
  const [loading, setLoading] = useState(false)

  const fetchBalance = useCallback(
    async () => {
      if (!destinationChainId) {
        return
      }

      const res = await fetch(getReplacedString(BRIDGE_BALANCE_URL, { networkId: destinationChainId }))
      const result = await res.json()

      return result.data || '0'
    },
    [destinationChainId]
  )

  useEffect(() => {
    let ignore = false
    setLoading(true)

    fetchBalance().then(result => {
      const _balance = result
      if (ignore || !_balance) { return }
      setBalance(_balance)
    }).finally(() => {
      setLoading(false)
    })

    return () => {
      ignore = true
    }
  }, [fetchBalance, destinationChainId])

  return {
    loading,
    balance
  }
}
