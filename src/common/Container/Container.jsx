import { classNames } from "@/utils/classnames";

export const Container = ({ children, className, ...rest }) => {
  return (
    <div
      className={classNames(
        "max-w-7xl mx-auto px-4 sm:px-6 md:px-8",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
