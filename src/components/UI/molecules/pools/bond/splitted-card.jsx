import { classNames } from "@/utils/classnames";

export const SplitedDetail = ({
  title,
  value,
  right,
  valueClasses,
  titleClasses,
}) => {
  return (
    <div className="flex flex-col w-1/2">
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
        className={classNames(
          "w-full flex gap-1 items-center text-lg font-normal font-numbers whitespace-nowrap",
          right ? "text-right justify-end" : "justify-start",
          valueClasses
        )}
      >
        {value}
      </p>
    </div>
  );
};
