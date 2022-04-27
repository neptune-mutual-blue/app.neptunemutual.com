import { classNames } from "@/utils/classnames";
import { getPlainNumber } from "@/utils/formatter/input";
import { getLocale } from "@/utils/locale";
import { useState, useEffect, useRef } from "react";
import CurrencyInput from "react-currency-input-field";

export const InputWithTrailingButton = ({
  inputProps,
  unit,
  buttonProps,
  error,
}) => {
  const ref = useRef(null);
  const [width, setWidth] = useState();
  const [inputValue, setInputValue] = useState(inputProps.value ?? "");

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

  const inputFieldProps = {
    id: inputProps.id,
    value: inputValue,
    placeholder: inputProps.placeholder,
    disabled: inputProps.disabled,
    onValueChange: (val) => {
      inputProps.onChange(getPlainNumber(val ?? "", getLocale()));
      setInputValue(val ?? "");
    },
    intlConfig: {
      locale: getLocale(),
    },
    autoComplete: "off",
    decimalsLimit: 10,
  };

  return (
    <div className="relative w-full text-black text-h4">
      <CurrencyInput
        {...inputFieldProps}
        className={classNames(
          "bg-white block w-full py-6 pl-6 pr-40 rounded-lg overflow-hidden border",
          error
            ? "border-FA5C2F focus:outline-none focus-visible:ring-0 focus-visible:ring-FA5C2F"
            : "border-B0C4DB focus:outline-none focus-visible:ring-0 focus-visible:ring-4e7dd9",
          inputFieldProps.disabled && "cursor-not-allowed"
        )}
        style={{ paddingRight: `${width || 64}px` }}
      />
      <div className="absolute inset-y-0 right-0 flex" ref={ref}>
        {unit && (
          <div className="self-center px-4 whitespace-nowrap text-9B9B9B">
            {unit}
          </div>
        )}
        <button
          className={classNames(
            "font-sora px-6 m-px font-medium  rounded-r-mdlg bg-DAE2EB hover:bg-DEEAF6 focus:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-4e7dd9",
            buttonProps.disabled && "cursor-not-allowed"
          )}
          {...buttonProps}
        ></button>
      </div>
    </div>
  );
};
