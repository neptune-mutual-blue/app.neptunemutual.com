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
          className="focus:ring-4E7DD9 h-5 w-5 text-4E7DD9 bg-FEFEFF border-2 border-9B9B9B rounded"
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
