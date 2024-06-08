import { useLanguageContext } from '@/src/i18n/i18n'
import {
  convertFromUnits,
  toBN
} from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'

export const TokenAmountSpan = ({
  amountInUnits,
  symbol = undefined,
  className = null,
  decimals,
  ...rest
}) => {
  const { locale } = useLanguageContext()

  return (
    <span
      className={className}
      title={`${
        formatCurrency(
          decimals === 0 ? toBN(amountInUnits).toString() : convertFromUnits(amountInUnits, decimals).toString(),
          locale,
          symbol,
          typeof symbol !== 'undefined'
        ).long
      }`}
      data-testid='token-amount-span'
      {...rest}
    >
      {
        formatCurrency(
          decimals === 0 ? toBN(amountInUnits).toString() : convertFromUnits(amountInUnits, decimals).toString(),
          locale,
          symbol,
          typeof symbol !== 'undefined'
        ).short
      }
    </span>
  )
}
