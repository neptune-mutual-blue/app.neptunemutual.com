import { useLanguageContext } from '@/src/i18n/i18n'
import { convertFromUnits } from '@/utils/bn'
import { formatCurrency } from '@/utils/formatter/currency'

export const TokenAmountSpan = ({
  amountInUnits,
  symbol = undefined,
  className = null,
  decimals
}) => {
  const { locale } = useLanguageContext()

  return (
    <span
      className={className}
      title={`${
        formatCurrency(
          convertFromUnits(amountInUnits, decimals).toString(),
          locale,
          symbol,
          typeof symbol !== 'undefined'
        ).long
      }`}
      data-testid='token-amount-span'
    >
      {
        formatCurrency(
          convertFromUnits(amountInUnits, decimals).toString(),
          locale,
          symbol,
          typeof symbol !== 'undefined'
        ).short
      }
    </span>
  )
}
