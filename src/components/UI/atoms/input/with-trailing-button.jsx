import { classNames } from "@/utils/classnames";
import { useState, useEffect, useRef } from "react";
import NumberFormat from "react-number-format";

export const InputWithTrailingButton = ({
  inputProps,
  unit,
  buttonProps,
  error,
}) => {
  const ref = useRef(null);
  const [width, setWidth] = useState();

  const getSize = () => {
    const newWidth = ref?.current?.clientWidth;
    setWidth(newWidth);
  };

  useEffect(() => {
    getSize();
  }, [unit, buttonProps.children]);

  // Update 'width' when the window resizes
  useEffect(() => {
    window.addEventListener("resize", getSize);

    return () => window.removeEventListener("resize", getSize);
  }, []);

  const numberFormatProps = {
    id: inputProps.id,
    value: inputProps.value,
    placeholder: inputProps.placeholder,
    disabled: inputProps.disabled,
    thousandSeparator: ",",
    isNumericString: true,
    onValueChange: (values) => inputProps.onChange(values.value),
    autoComplete: "off",
  };

  return (
    <div className="relative text-black text-h4 w-full">
      <NumberFormat
        {...numberFormatProps}
        className={classNames(
          "bg-white block w-full py-6 pl-6 pr-40 rounded-lg overflow-hidden border",
          error
            ? "border-FA5C2F focus:outline-none focus-visible:ring-0 focus-visible:ring-FA5C2F"
            : "border-B0C4DB focus:outline-none focus-visible:ring-0 focus-visible:ring-4e7dd9"
        )}
        style={{ paddingRight: `${width || 64}px` }}
      />
      <div className="flex absolute right-0 inset-y-0" ref={ref}>
        {unit && (
          <div className="whitespace-nowrap self-center px-4 text-9B9B9B">
            {unit}
          </div>
        )}
        <button
          className="font-sora px-6 m-px font-medium  rounded-r-mdlg bg-DAE2EB hover:bg-DEEAF6 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-4e7dd9"
          {...buttonProps}
        ></button>
      </div>
    </div>
  );
};
