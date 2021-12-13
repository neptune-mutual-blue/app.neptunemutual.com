import React from "react";

export const Checkbox = React.forwardRef(
  ({ id, name, children, ...inputProps }, ref) => {
    return (
      <>
        <input
          ref={ref}
          id={id}
          name={name}
          type="checkbox"
          className="focus:ring-primary h-5 w-5 text-primary bg-white-bg border-2 border-dimmed-fg rounded"
          {...inputProps}
        />

        <label htmlFor={id} className="ml-3 align-middle">
          {children}
        </label>
      </>
    );
  }
);

Checkbox.displayName = "Checkbox";
