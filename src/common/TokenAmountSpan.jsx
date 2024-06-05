import { convertFromUnits, toBN } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'
import { useRouter } from 'next/router'

export const TokenAmountSpan = ({
  amountInUnits,
  symbol = undefined,
  className = null,
  decimals
}) => {
  const router = useRouter()

  return (
    <span
      className={className}
      title={`${
        formatCurrency(
          decimals === 0 ? toBN(amountInUnits).toString() : convertFromUnits(amountInUnits, decimals).toString(),
          router.locale,
          symbol,
          typeof symbol !== 'undefined'
        ).long
      }`}
      data-testid='token-amount-span'
    >
      {
        formatCurrency(
          decimals === 0 ? toBN(amountInUnits).toString() : convertFromUnits(amountInUnits, decimals).toString(),
          router.locale,
          symbol,
          typeof symbol !== 'undefined'
        ).short
      }
    </span>
  )
}
