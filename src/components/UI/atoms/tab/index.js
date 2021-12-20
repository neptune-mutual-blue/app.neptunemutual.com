import { classNames } from "@/utils/classnames";

export const Tab = ({ children, text, active, className, onClick, id }) => {
  return (
    <div
      onClick={(e) => onClick(e)}
      data-id={id}
      className={classNames(
        `font-sora cursor-pointer ${
          active
            ? "text-primary border border-b-0 font-semibold rounded-t-lg border-solid border-poolBorder bg-poolClipBg"
            : "text-black"
        } `,
        className
      )}
    >
      {children}
    </div>
  );
};
