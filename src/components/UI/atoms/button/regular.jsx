import { classNames } from "@/utils/classnames";

export const RegularButton = ({ onClick, children, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "text-EEEEEE border border-4E7DD9 rounded-lg bg-4E7DD9",
        className
      )}
    >
      {children}
    </button>
  );
};
