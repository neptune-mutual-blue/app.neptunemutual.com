import { classNames } from "@/utils/classnames";

export const RegularButton = ({ children, className, ...props }) => {
  return (
    <button
      type="button"
      className={classNames(
        "text-EEEEEE border border-4E7DD9 rounded-lg bg-4E7DD9 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-4E7DD9",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
