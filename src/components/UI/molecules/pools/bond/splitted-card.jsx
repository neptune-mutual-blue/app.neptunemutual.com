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
          "text-lg font-normal font-numbers",
          right && "text-right",
          valueClasses
        )}
      >
        {value}
      </p>
    </div>
  );
};
