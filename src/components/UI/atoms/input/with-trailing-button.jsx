import { classNames } from "@/utils/classnames";
import {
  getNumberSeparators,
  getPlainString,
} from "@/utils/formatter/currency";
import { getLocale } from "@/utils/locale";
import BigNumber from "bignumber.js";
// import { getLocale } from "@/utils/locale";
import { useState, useEffect, useRef } from "react";

export const InputWithTrailingButton = ({
  inputProps,
  unit,
  buttonProps,
  error,
}) => {
  const ref = useRef(null);
  const [width, setWidth] = useState();
  const [val, setVal] = useState(inputProps.value ?? "");

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

  useEffect(() => {
    if (!isNaN(parseInt(inputProps.value))) {
      // const formattedNumber = Intl.NumberFormat(getLocale(), {
      //   maximumFractionDigits: 10,
      // }).format(inputProps.value);
      const sep = getNumberSeparators(getLocale());
      const formattedNumber = new BigNumber(inputProps.value).toFormat({
        decimalSeparator: sep.decimal,
        groupSeparator: sep.thousand,
        groupSize: 3,
      });
      setVal(formattedNumber);
    }
    if (inputProps.value === "") setVal("");
  }, [inputProps.value]);

  const numberFormatProps = {
    id: inputProps.id,
    value: val,
    placeholder: inputProps.placeholder,
    disabled: inputProps.disabled,
    onChange: (ev) => {
      const val = ev.target.value;
      const sep = getNumberSeparators(getLocale());
      const incompleteRegex = new RegExp(
        `^${inputProps.allowNegative ? "-?" : ""}\\d*(${sep.thousand}\\d+)*\\${
          sep.decimal
        }$`
      );
      if (
        val !== "" &&
        (val.match(incompleteRegex) ||
          (inputProps.allowNegative && val === "-"))
      ) {
        return setVal(val);
      }
      const formattedRegex = new RegExp(
        `^${inputProps.allowNegative ? "-?" : ""}\\d*(\\${
          sep.thousand
        }\\d+)*(\\${sep.decimal}\\d*)?$`
      );
      if (val !== "" && !val.match(formattedRegex)) return;
      const returnVal = getPlainString(val, getLocale());
      if (inputProps.onChange) inputProps.onChange(returnVal);
    },
    autoComplete: "off",
  };

  return (
    <div className="relative w-full text-black text-h4">
      <input
        {...numberFormatProps}
        className={classNames(
          "bg-white block w-full py-6 pl-6 pr-40 rounded-lg overflow-hidden border",
          error
            ? "border-FA5C2F focus:outline-none focus-visible:ring-0 focus-visible:ring-FA5C2F"
            : "border-B0C4DB focus:outline-none focus-visible:ring-0 focus-visible:ring-4e7dd9",
          numberFormatProps.disabled && "cursor-not-allowed"
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
