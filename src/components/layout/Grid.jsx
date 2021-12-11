import { classNames } from "@/utils/classnames";

export const Grid = ({ children, className }) => {
  return (
    <div className={classNames("grid grid-cols-3 gap-8", className)}>
      {children}
    </div>
  );
};
