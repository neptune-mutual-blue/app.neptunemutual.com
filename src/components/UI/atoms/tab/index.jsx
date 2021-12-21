import { classNames } from "@/utils/classnames";

export const Tab = ({ children, active, className }) => {
  return (
    <div
      className={classNames(
        `font-sora cursor-pointer mr-3 -mb-px overflow-auto `,
        active
          ? "text-4E7DD9 border border-b-0 font-semibold rounded-t-lg border-solid border-B0C4DB bg-F1F3F6"
          : "text-black",
        className
      )}
    >
      {children}
    </div>
  );
};
