import { classNames } from "@/utils/classnames";

export const Radio = ({ label, id, disabled, ...rest }) => {
  return (
    <div
      className={classNames(
        "flex items-center w-full mr-4",
        disabled && "cursor-not-allowed"
      )}
    >
      <input
        className={classNames(
          "h-5 w-5 bg-EEEEEE border-B0C4DB mr-2",
          disabled && "cursor-not-allowed"
        )}
        type="radio"
        id={id}
        disabled={disabled}
        {...rest}
      />
      <label
        className={classNames(
          "text-sm uppercase",
          disabled && "cursor-not-allowed"
        )}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};
