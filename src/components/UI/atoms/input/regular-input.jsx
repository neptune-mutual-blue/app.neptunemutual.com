import { classNames } from "@/utils/classnames";

export const RegularInput = ({ inputProps, className }) => {
  return (
    <input
      className={classNames(
        "bg-white text-h4 block w-full rounded-lg p-6 border border-B0C4DB placeholder-9B9B9B focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-4E7DD9",
        className
      )}
      {...inputProps}
    />
  );
};
