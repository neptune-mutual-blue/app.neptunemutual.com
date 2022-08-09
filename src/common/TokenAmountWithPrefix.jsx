import { TokenAmountSpan } from "@/common/TokenAmountSpan";

export const TokenAmountWithPrefix = ({
  amountInUnits,
  symbol,
  prefix,
  decimals,
}) => {
  return (
    <p data-testid="token-amount-with-prefix">
      {prefix}{" "}
      <TokenAmountSpan
        amountInUnits={amountInUnits}
        symbol={symbol}
        decimals={decimals}
      />
    </p>
  );
};
