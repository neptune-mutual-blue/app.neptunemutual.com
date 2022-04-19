import { TokenAmountSpan } from "@/common/TokenAmountSpan";

export const TokenAmountWithPrefix = ({ amountInUnits, symbol, prefix }) => {
  return (
    <p>
      {prefix} <TokenAmountSpan amountInUnits={amountInUnits} symbol={symbol} />
    </p>
  );
};
