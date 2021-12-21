import { classNames } from "@/utils/classnames";

export const RegularButton = ({ onClick, children, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "text-white-fg border border-primary rounded-lg bg-primary",
        className
      )}
    >
      {children}
    </button>
  );
};
