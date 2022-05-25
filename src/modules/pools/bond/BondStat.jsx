import { classNames } from "@/utils/classnames";
import { formatCurrency } from "@/utils/formatter/currency";
import { useRouter } from "next/router";

export const BondStat = ({
  title,
  tooltip,
  value,
  right,
  valueClasses,
  titleClasses,
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col w-1/2">
      {value && (
        <>
          <h6
            className={classNames(
              "uppercase font-semibold text-sm",
              right && "text-right",
              titleClasses
            )}
          >
            {title}
          </h6>
          <p
            title={tooltip}
            className={classNames(
              "text-lg font-normal font-numbers",
              right && "text-right",
              valueClasses
            )}
          >
            {formatCurrency(value, router.locale, "NPM", true).short}
          </p>
        </>
      )}
    </div>
  );
};
