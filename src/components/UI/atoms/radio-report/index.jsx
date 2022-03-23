import { classNames } from "@/utils/classnames";

export const RadioReport = ({ label, id, disabled, ...rest }) => {
  return (
    <div
      className={classNames(
        "flex items-center p-6 sm:p-0",
        disabled && "cursor-not-allowed"
      )}
    >
      <input
        className={classNames(
          "w-5 h-5 mr-2 bg-EEEEEE border-B0C4DB",
          disabled && "cursor-not-allowed"
        )}
        type="radio"
        id={id}
        disabled={disabled}
        {...rest}
      />
      <label
        className={classNames(
          "w-full h-full text-sm uppercase lg:h-auto lg:w-auto",
          disabled && "cursor-not-allowed"
        )}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};
