import ExclamationCircleIcon from "@/icons/ExclamationCircleIcon";
import { classNames } from "@/utils/classnames";

export const Alert = ({ children, info, className }) => {
  return (
    <div
      className={classNames(
        className,
        `bg-F4F8FC border border-l-4 rounded p-5`,
        info ? "border-4e7dd9" : "border-FA5C2F"
      )}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <ExclamationCircleIcon
            className={classNames(
              `h-6 w-6`,
              info ? "text-4e7dd9" : "text-FA5C2F"
            )}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">{children}</div>
      </div>
    </div>
  );
};
