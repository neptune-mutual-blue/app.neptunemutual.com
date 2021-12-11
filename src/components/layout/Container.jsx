import { classNames } from "@/utils/classnames";

export const Container = ({ children, className }) => {
  return (
    <div
      className={classNames(
        "max-w-7xl mx-auto px-4 sm:px-6 md:px-8",
        className
      )}
    >
      {children}
    </div>
  );
};
