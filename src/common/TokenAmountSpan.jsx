import { convertFromUnits } from "@/utils/bn";
import { formatCurrency } from "@/utils/formatter/currency";
import { useRouter } from "next/router";

export const TokenAmountSpan = ({
  amountInUnits,
  symbol,
  className = null,
  decimals,
}) => {
  const router = useRouter();

  return (
    <span
      className={className}
      title={`${
        formatCurrency(
          convertFromUnits(amountInUnits, decimals).toString(),
          router.locale,
          symbol,
          true
        ).long
      }`}
    >
      {
        formatCurrency(
          convertFromUnits(amountInUnits, decimals).toString(),
          router.locale,
          symbol,
          true
        ).short
      }
    </span>
  );
};
