import { classNames } from "@/utils/classnames";

/**
 *
 * @param {Object} props
 * @param {Object} props.inputProps
 * @param {boolean} [props.error]
 * @param {string} [props.className]
 * @returns
 */
export const RegularInput = ({ inputProps, className, error = false }) => {
  return (
    <input
      className={classNames(
        "bg-white text-h4 block w-full rounded-lg p-6 border placeholder-9B9B9B",
        className,
        inputProps.disabled && "cursor-not-allowed",
        error
          ? "border-FA5C2F focus:outline-none focus-visible:ring-0 focus-visible:ring-FA5C2F"
          : "border-B0C4DB focus:outline-none focus-visible:ring-0 focus-visible:ring-4e7dd9"
      )}
      {...inputProps}
    />
  );
};
