import { convertFromUnits } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";

export const TokenAmountWithPrefix = ({ amountInUnits, symbol, prefix }) => {
  return (
    <p>
      {prefix}{" "}
      <span
        title={`${
          formatCurrency(
            convertFromUnits(amountInUnits).toString(),
            symbol,
            true
          ).long
        }`}
      >
        {
          formatCurrency(
            convertFromUnits(amountInUnits).toString(),
            symbol,
            true
          ).short
        }
      </span>
    </p>
  );
};
