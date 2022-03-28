import { convertFromUnits } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";

export const TokenAmountSpan = ({ amountInUnits, symbol, className }) => {
  return (
    <span
      className={className}
      title={`${
        formatCurrency(convertFromUnits(amountInUnits).toString(), symbol, true)
          .long
      }`}
    >
      {
        formatCurrency(convertFromUnits(amountInUnits).toString(), symbol, true)
          .short
      }
    </span>
  );
};
