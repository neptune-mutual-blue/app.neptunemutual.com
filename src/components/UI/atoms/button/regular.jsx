import { classNames } from "@/utils/classnames";

export const RegularButton = ({ children, className, ...props }) => {
  return (
    <button
      type="button"
      className={classNames(
        props.disabled && "opacity-75 cursor-not-allowed",
        "text-EEEEEE border border-4e7dd9 rounded-lg bg-4e7dd9 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-4e7dd9",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
