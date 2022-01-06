import { classNames } from "@/utils/classnames";

export const RegularInput = ({ inputProps, className }) => {
  return (
    <input
      className={classNames(
        "focus:ring-4E7DD9 focus:border-4E7DD9 bg-white block w-full rounded-lg p-6 border border-B0C4DB placeholder-9B9B9B text-h4",
        className
      )}
      {...inputProps}
    />
  );
};
