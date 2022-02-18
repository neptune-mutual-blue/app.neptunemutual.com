import { classNames } from "@/utils/classnames";

const ToggleButton = ({ isOpen, handleClick }) => {
  return (
    <div className="flex justify-center items-center">
      <div
        className={classNames(
          "relative flex items-center rounded-full w-8 h-4 transition duration-200 ease-linear",
          isOpen ? "bg-[#4289f2]" : "bg-B0C4DB"
        )}
      >
        <label
          htmlFor="toggle"
          className={classNames(
            "absolute left-0 bg-white border  w-4 h-4 rounded-full transition transform duration-100 ease-linear cursor-pointer",
            isOpen
              ? "translate-x-full border-[#4289f2]"
              : "translate-x-0 border-B0C4DB"
          )}
        />
        <input
          type="checkbox"
          id="toggle"
          name="toggle"
          onChange={handleClick}
          style={{
            background: "transparent",
          }}
          className="cursor-pointer appearance-none w-full h-full border-0 focus:ring-0"
        />
      </div>
    </div>
  );
};

export default ToggleButton;
