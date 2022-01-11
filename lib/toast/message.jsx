import React, { useEffect } from "react";
import ErrorIcon from "./components/icons/ErrorIcon";
import InfoIcon from "./components/icons/InfoIcon";
import WarningIcon from "./components/icons/WarningIcon";
import CloseIcon from "./components/icons/CloseIcon";
import SuccessIcon from "./components/icons/SuccessIcon";
import { classNames } from "./utils";

export const VARIANTS = {
  Info: {
    icon: <InfoIcon className="h-6 w-6" aria-hidden="true" />,
    name: "Info",
  },
  Error: {
    icon: <ErrorIcon className="h-6 w-6" aria-hidden="true" />,
    name: "Error",
  },
  Warning: {
    icon: <WarningIcon className="h-6 w-6" aria-hidden="true" />,
    name: "Warning",
  },
  Success: {
    icon: <SuccessIcon className="h-6 w-6" aria-hidden="true" />,
    name: "Success",
  },
};

const ToastMessage = ({
  id,
  header,
  message,
  lifetime,
  onRemove,
  icon,
  type,
  title,
}) => {
  const Var = type
    ? VARIANTS[type]
    : {
        icon: icon,
        name: header,
      };

  useEffect(() => {
    if (lifetime && onRemove) {
      setTimeout(() => {
        onRemove(id);
      }, lifetime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lifetime]);

  return (
    <div
      className={classNames(
        "w-full bg-3A4557 bg-opacity-95 text-white shadow-toast rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden",
        type && "max-h-40"
      )}
    >
      <div className="px-4 py-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">{Var.icon}</div>

          <div className="ml-3 w-0 flex-1">
            <p className="text-para font-sora font-light">
              {title || Var.name}
            </p>
            <div className="mt-3 text-sm text-EEEEEE">{message}</div>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              className="rounded-md inline-flex text-EEEEEE focus:outline-none focus:ring-1 focus:ring-4E7DD9"
              onClick={() => {
                onRemove && onRemove(id);
              }}
            >
              <span className="sr-only">Close</span>
              <CloseIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToastMessage;
