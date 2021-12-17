import { classNames } from "@/utils/classnames";

export const RegularButton = ({ onClick, children, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "text-white-fg py-3 px-4 border border-primary rounded-lg bg-primary",
        className
      )}
    >
      {children}
    </button>
  );
};
