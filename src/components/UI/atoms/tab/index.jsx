import { classNames } from "@/utils/classnames";

export const Tab = ({ children, active, className }) => {
  return (
    <div
      className={classNames(
        `font-sora cursor-pointer mr-3 -mb-px overflow-auto `,
        active
          ? "text-primary border border-b-0 font-semibold rounded-t-lg border-solid border-ash-border bg-gray-bg"
          : "text-black",
        className
      )}
    >
      {children}
    </div>
  );
};
