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
      <div
        className={classNames(
          "uppercase font-semibold text-sm",
          right ? "text-right" : "",
          titleClasses
        )}
      >
        {title}
      </div>
      <div
        className={classNames(
          "w-full flex gap-1 justify-start items-center",
          right ? "text-right justify-end" : "",
          valueClasses
        )}
      >
        <div className="text-lg font-normal font-numbers whitespace-nowrap">
          {value}
        </div>
      </div>
    </div>
  );
};
