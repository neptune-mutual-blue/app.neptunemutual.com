import { classNames } from "@/utils/classnames";

export const Badge = ({ children, className }) => {
  return (
    <div className="text-FEFEFF">
      <div
        className={classNames(
          "inline-block px-2 border rounded",
          "font-poppins text-xs whitespace-nowrap",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
