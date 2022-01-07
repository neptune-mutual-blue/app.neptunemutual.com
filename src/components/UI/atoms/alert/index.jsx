import ExclamationCircleIcon from "@/icons/ExclamationCircleIcon";

export const Alert = ({ children }) => {
  return (
    <div className="bg-F4F8FC border border-l-4 border-FA5C2F rounded p-5">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <ExclamationCircleIcon
            className="h-6 w-6 text-FA5C2F"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">{children}</div>
      </div>
    </div>
  );
};
