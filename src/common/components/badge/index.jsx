import { classNames } from "@/utils/classnames";

export const Badge = ({ children, className }) => {
  return (
    <div
      className={classNames(
        "inline-block py-1 px-3 border border-current rounded-full",
        "text-sm font-semibold whitespace-nowrap",
        className
      )}
    >
      {children}
    </div>
  );
};
