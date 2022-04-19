import { classNames } from "@/utils/classnames";

export const ModalWrapper = ({ className = "", children }) => {
  return (
    <div
      className={classNames(
        "border-[1.5px] border-[#B0C4DB] relative inline-block max-w-xl p-12 text-left align-middle min-w-300 lg:min-w-600 sm:w-auto bg-f1f3f6 rounded-3xl",
        className
      )}
    >
      {children}
    </div>
  );
};
