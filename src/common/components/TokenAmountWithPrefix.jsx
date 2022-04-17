import { TokenAmountSpan } from "@/src/common/components/TokenAmountSpan";

export const TokenAmountWithPrefix = ({ amountInUnits, symbol, prefix }) => {
  return (
    <p>
      {prefix} <TokenAmountSpan amountInUnits={amountInUnits} symbol={symbol} />
    </p>
  );
};
