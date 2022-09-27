import { TokenAmountSpan } from '@/common/TokenAmountSpan'

export const TokenAmountWithPrefix = ({
  amountInUnits,
  symbol,
  prefix,
  decimals,
  ...rest
}) => {
  return (
    <p data-testid='token-amount-with-prefix' {...rest}>
      {prefix}{' '}
      <TokenAmountSpan
        amountInUnits={amountInUnits}
        symbol={symbol}
        decimals={decimals}
      />
    </p>
  )
}
