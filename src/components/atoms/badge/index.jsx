import { classNames } from "@/utils/classnames";

export const Badge = ({ children, className }) => {
  return (
    <div
      className={classNames(
        "inline-block py-1 px-3 border border-teal-neutral rounded-full",
        "text-sm font-semibold text-teal-neutral",
        className
      )}
    >
      {children}
    </div>
  );
};
