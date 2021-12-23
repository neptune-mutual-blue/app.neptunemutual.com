import { classNames } from "@/utils/classnames";

export const OutlinedButton = ({ onClick, children, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "text-4E7DD9 py-3 px-4 border border-4E7DD9 hover:bg-4E7DD9 hover:text-FEFEFF",
        className
      )}
    >
      {children}
    </button>
  );
};
