import { classNames } from "@/utils/classnames";
import { useState } from "react/cjs/react.development";

export const DropdownButton = ({ options }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState();

  const handleSelected = (e) => {
    console.log(e.target);
  };

  return (
    <>
      <div className="w-2/3 relative">
        <input
          className="w-full caret-transparent py-3 px-3 rounded-lg border-B0C4DB focus:border-B0C4DB inline-block"
          onClick={() => setDropdownOpen((prev) => !prev)}
        ></input>
        <div
          className={classNames(
            "absolute top-auto w-full",
            dropdownOpen ? "block" : "hidden"
          )}
          dataVa
        >
          {options.map((option) => (
            <div
              key={option.name}
              className="flex m-2 p-2 align-middle cursor-pointer border-21AD8C border"
              onClick={(e) => handleSelected(e)}
            >
              <img
                className="w-8 h-8 mr-3"
                src={option.imgSrc}
                alt={option.name}
              />
              {option.name}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
