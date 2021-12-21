import { classNames } from "@/utils/classnames";

export const Badge = ({ children, className }) => {
  return (
    <div
      className={classNames(
        "inline-block py-1 px-3 border border-21AD8C rounded-full",
        "text-sm font-semibold text-21AD8C",
        className
      )}
    >
      {children}
    </div>
  );
};
