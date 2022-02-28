import { classNames } from "@/utils/classnames";

export const BurgerComponent = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className={classNames("relative lg:hidden", isOpen && "z-20")}
      aria-label="Open or Close the Sidebar"
    >
      <div
        className={classNames(
          "w-7 h-1 my-1 bg-white transition-all duration-500 ease-menu",
          isOpen && "translate-y-1.5 rotate-45 bg-white my-px"
        )}
      ></div>
      <div
        className={classNames(
          "w-7 h-1 my-1 bg-white transition duration-500 ease-menu",
          isOpen && "opacity-0"
        )}
      ></div>
      <div
        className={classNames(
          "w-7 h-1 my-1 bg-white transition-all duration-500 ease-menu",
          isOpen && "-translate-y-1.5 -rotate-45 bg-white -my-1"
        )}
      ></div>
    </button>
  );
};
