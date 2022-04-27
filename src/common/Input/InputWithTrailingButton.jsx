import { classNames } from "@/utils/classnames";
import {
  getLocaleNumber,
  getNumberSeparators,
  getPlainNumber,
} from "@/utils/formatter/currency";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";

export const InputWithTrailingButton = ({
  inputProps,
  unit,
  buttonProps,
  error,
}) => {
  const ref = useRef(null);
  const [width, setWidth] = useState();
  const [val, setVal] = useState(inputProps.value ?? "");
  const [noChange, setNoChange] = useState(null);
  const router = useRouter();

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
      const formattedNumber = getLocaleNumber(
        inputProps.value,
        router.locale,
        true
      );
      setVal(formattedNumber);
    }
    if (inputProps.value === "") setVal("");
  }, [inputProps.value, router.locale]);

  const inputFieldProps = {
    id: inputProps.id,
    value: val,
    placeholder: inputProps.placeholder,
    disabled: inputProps.disabled,
    onChange: (ev) => {
      const newVal = ev.target.value;
      const sep = getNumberSeparators(router.locale);

      // regex to identify localized number with decimal separator at the end
      const incompleteRegex = new RegExp(
        `^${inputProps.allowNegative ? "-?" : ""}\\d*(\\${
          sep.thousand
        }\\d+)*\\${sep.decimal}$`
      );

      // regex to identify if there are 0s at the end
      // const endZeroRegex = new RegExp(
      //   `^${inputProps.allowNegative ? "-?" : ""}\\d*(\\${
      //     sep.thousand
      //   }\\d+)*\\${sep.decimal}\\d*0+$`
      // );

      if (noChange === newVal) {
        setNoChange(null);
        return setVal(newVal);
      }

      if (
        newVal !== "" &&
        (newVal.match(incompleteRegex) ||
          (inputProps.allowNegative && newVal === "-"))
      ) {
        setNoChange(val);
        return setVal(newVal);
      }

      // regex to identify localized number
      const formattedRegex = new RegExp(
        `^${inputProps.allowNegative ? "-?" : ""}\\d*(\\${
          sep.thousand
        }\\d+)*(\\${sep.decimal}\\d*)?$`
      );
      if (newVal !== "" && !newVal.match(formattedRegex)) return;
      const returnVal = getPlainNumber(newVal, router.locale);
      if (inputProps.onChange) inputProps.onChange(returnVal);
      else setVal(getLocaleNumber(returnVal, router.locale));
    },
    autoComplete: "off",
  };

  return (
    <div className="relative w-full text-black text-h4">
      <input
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
