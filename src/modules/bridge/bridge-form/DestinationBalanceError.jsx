import { useRouter } from 'next/router'

import {
  convertFromUnits,
  toBNSafe
} from '@/utils/bn'
import { classNames } from '@/utils/classnames'
import { formatCurrency } from '@/utils/formatter/currency'

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
