import { classNames } from "@/utils/classnames";

/**
 *
 * @param {Object} props
 * @param {Object} props.inputProps
 * @param {string} [props.className]
 * @returns
 */
export const RegularInput = ({ inputProps, className }) => {
  return (
    <input
      className={classNames(
        "bg-white text-h4 block w-full rounded-lg p-6 border border-B0C4DB placeholder-9B9B9B focus:outline-none focus-visible:ring-2 focus-visible:ring-4e7dd9",
        className,
        inputProps.disabled && "cursor-not-allowed"
      )}
      {...inputProps}
    />
  );
};
