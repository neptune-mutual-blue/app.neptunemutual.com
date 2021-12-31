import { classNames } from "@/utils/classnames";

export const Stat = ({ position, children, className }) => {
  if (position === "left") {
    return (
      <div className={classNames("flex flex-col text-sm", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={classNames("flex flex-col text-right text-sm ")}>
      {children}
    </div>
  );
};
