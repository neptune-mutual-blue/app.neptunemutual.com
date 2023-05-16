import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { BRIDGE_BALANCE_URL } from '@/src/config/constants'
import {
  convertFromUnits,
  toBNSafe
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'
import { getReplacedString } from '@/utils/string'

export const useBalance = (destinationChainId) => {
  const [balance, setBalance] = useState('0')
  const [loading, setLoading] = useState(false)

  const fetchBalance = useCallback(
    async () => {
      if (!destinationChainId) {
        return
      }

      const res = await fetch(getReplacedString(BRIDGE_BALANCE_URL, {
        networkId: destinationChainId
      }))
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
      if (ignore || !_balance) return
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

export const DestinationBalanceError = ({
  tokenSymbol,
  tokenDecimals,
  transferAmount,
  balance,
  className = ''
}) => {
  const { locale } = useRouter()

  const formattedBalance = formatCurrency(
    convertFromUnits(balance || '0', tokenDecimals),
    locale,
    tokenSymbol,
    true
  )

  if (!transferAmount || toBNSafe(transferAmount).isLessThanOrEqualTo(balance)) return null

  return (
    <div
      className={classNames(
        'rounded-1 border border-E52E2E border-l-4 pt-3 pr-2 pb-4 pl-4 bg-E52E2E bg-opacity-5 text-E52E2E text-sm',
        className
      )}
    >
      <p className='mb-3'>Insufficient NPM balance on the destination chain.</p>
      <span className='mt-2 font-bold'>Maximum Available: </span> <span>{formattedBalance.long}</span>
    </div>
  )
}

export const BalanceError = ({ message, className = '' }) => {
  if (!message) return null

  const splitted = message.split(': ')
  return (
    <div
      className={classNames(
        'rounded-1 border border-E52E2E border-l-4 pt-3 pr-2 pb-4 pl-4 bg-E52E2E bg-opacity-5 text-E52E2E text-sm',
        className
      )}
    >
      {splitted.length > 1
        ? (
          <>
            <span className='mt-2 font-bold'>{splitted[0]}: </span> <span>{splitted.slice(1).join(': ')}</span>
          </>
          )
        : message}
    </div>
  )
}
