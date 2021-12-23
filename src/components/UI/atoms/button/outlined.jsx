import { classNames } from "@/utils/classnames";

export const OutlinedButton = ({ onClick, children, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "text-4E7DD9 py-3 px-4 border border-4E7DD9 rounded-xl",
        className
      )}
    >
      {children}
    </button>
  );
};
