import { classNames } from "@/utils/classnames";

export const OutlinedButton = ({ onClick, children, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "text-4E7DD9 py-3 px-4 border border-4E7DD9 hover:bg-4E7DD9 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-4E7DD9",
        className
      )}
    >
      {children}
    </button>
  );
};
