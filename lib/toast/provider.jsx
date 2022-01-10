/**
 * Inspiration: https://github.com/damikun/React-Toast
 * Author: Dalibor Kundrat  https://github.com/damikun
 */
import { useCallback, useState } from "react";

import ToastContainer from "./container";
import { ToastContext } from "./context";
import { uuidv4 } from "./utils";

/**
 * Implementation
 */
export const ToastProvider = ({ children, variant }) => {
  const [data, setData] = useState([]);
  const Push = useCallback(
    (message, type, lifetime, truncate, title) => {
      if (message) {
        const newItem = {
          id: uuidv4(),
          message: message,
          type: type,
          lifetime: lifetime || DEFAULT_INTERVAL,
          truncate,
          title,
        };
        setData((prevState) => [...prevState, newItem]);

        return newItem.id;
      }
    },
    [setData]
  );
  const PushCustom = useCallback(
    ({ message, lifetime, truncate }, icon) => {
      if (message) {
        const newItem = {
          id: uuidv4(),
          message: message,
          lifetime: lifetime || DEFAULT_INTERVAL,
          truncate: truncate,
          icon: icon,
          type: undefined,
        };
        setData((prevState) => [...prevState, newItem]);
      }
    },
    [setData]
  );
  const PushError = useCallback(
    ({ message, title = "Error", lifetime, truncate }) =>
      Push(message, "Error", lifetime, truncate, title),
    [Push]
  );
  const PushWarning = useCallback(
    ({ message, title = "Warning", lifetime, truncate }) =>
      Push(message, "Warning", lifetime, truncate, title),
    [Push]
  );
  const PushSuccess = useCallback(
    ({ message, title = "Success", lifetime, truncate }) =>
      Push(message, "Success", lifetime, truncate, title),
    [Push]
  );
  const PushInfo = useCallback(
    ({ message, title = "Info", lifetime, truncate }) =>
      Push(message, "Info", lifetime, truncate, title),
    [Push]
  );
  const ToastContexd = useCallback(() => {
    return {
      data: data,
      pushError: PushError,
      pushWarning: PushWarning,
      pushSuccess: PushSuccess,
      pushInfo: PushInfo,
      push: Push,
      pushCustom: PushCustom,
      remove: async (id) => {
        setData((prevState) => prevState.filter((e) => e.id !== id));
      },
    };
  }, [
    data,
    setData,
    PushError,
    PushWarning,
    PushSuccess,
    PushInfo,
    Push,
    PushCustom,
  ]);

  return (
    <ToastContext.Provider value={ToastContexd()}>
      <ToastContainer variant={variant} />
      {children}
    </ToastContext.Provider>
  );
};
