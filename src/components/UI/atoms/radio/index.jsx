import { classNames } from "@/utils/classnames";

export const Radio = ({ label, id, disabled, ...rest }) => {
  return (
    <div
      className={classNames(
        "flex items-center w-full mr-4",
        disabled && "cursor-not-allowed",
        rest.name === "vote-radio" && "p-6 sm:p-0 w-auto mr-0"
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
          "text-sm uppercase",
          disabled && "cursor-not-allowed",
          rest.name === "vote-radio" && "w-full h-full lg:h-auto lg:w-auto"
        )}
        htmlFor={id}
      >
        {label}
      </label>
    </div>
  );
};
