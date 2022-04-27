import { convertFromUnits } from "@/utils/bn";
import { useNumberFormat } from "@/src/hooks/useNumberFormat";

export const TokenAmountSpan = ({ amountInUnits, symbol, className }) => {
  const { formatCurrency } = useNumberFormat();

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
