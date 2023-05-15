import {
  useCallback,
  useEffect,
  useState
} from 'react'

import { useRouter } from 'next/router'

import { getProviderOrSigner } from '@/lib/connect-wallet/utils/web3'
import { useTxPoster } from '@/src/context/TxPoster'
import { convertFromUnits, toBNSafe } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { AddressZero } from '@ethersproject/constants'
import { registry } from '@neptunemutual/sdk'
import { classNames } from '@/utils/classnames'

export const useBalance = (account, tokenAddress, destinationChainId) => {
  const [balance, setBalance] = useState('0')
  const [loading, setLoading] = useState(false)
  const { contractRead } = useTxPoster()

  const fetchBalance = useCallback(
    async ({ onTransactionResult, onError }) => {
      if (!account || !tokenAddress || !destinationChainId) {
        return
      }

      try {
        const signerOrProvider = getProviderOrSigner(
          null,
          AddressZero,
          destinationChainId
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
    [account, tokenAddress, destinationChainId, contractRead]
  )

  useEffect(() => {
    let ignore = false
    setLoading(true)

    const cleanup = () => {
      setLoading(false)
    }

    const onTransactionResult = (result) => {
      const _balance = result
      if (ignore || !_balance) return
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
