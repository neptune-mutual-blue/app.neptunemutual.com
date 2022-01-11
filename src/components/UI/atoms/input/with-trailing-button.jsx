import { useState, useEffect, useRef } from "react";

export const InputWithTrailingButton = ({ inputProps, unit, buttonProps }) => {
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
  }, []);

  return (
    <div className="relative text-black text-h4 w-full">
      <input
        className="bg-white block w-full py-6 pl-6 pr-40 rounded-lg overflow-hidden border border-B0C4DB focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-4e7dd9"
        style={{ paddingRight: `${width || 64}px` }}
        {...inputProps}
      />
      <div className="flex absolute right-0 inset-y-0" ref={ref}>
        {unit && (
          <div className="whitespace-nowrap self-center px-4 text-9B9B9B">
            {unit}
          </div>
        )}
        <button
          className="font-sora px-6 font-medium border-y border-r border-B0C4DB rounded-r-lg bg-DAE2EB hover:bg-DEEAF6 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-4e7dd9"
          {...buttonProps}
        ></button>
      </div>
    </div>
  );
};
