import ExclamationCircleIcon from "@/icons/ExclamationCircleIcon";

export const Alert = ({ children, info }) => {
  const color = {
    border: info ? "border-4e7dd9" : "border-FA5C2F",
    icon: info ? "text-4e7dd9" : "text-FA5C2F",
  };

  return (
    <div className={`bg-F4F8FC border border-l-4 ${color.border} rounded p-5`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <ExclamationCircleIcon
            className={`h-6 w-6 ${color.icon}`}
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">{children}</div>
      </div>
    </div>
  );
};
