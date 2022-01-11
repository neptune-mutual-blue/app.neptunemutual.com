/**
 * Inspiration: https://github.com/damikun/React-Toast
 * Author: Dalibor Kundrat  https://github.com/damikun
 */
import { useCallback, useState } from "react";

import ToastContainer from "./container";
import { ToastContext } from "./context";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_INTERVAL = 30000; // 30 seconds

/**
 * Implementation
 */
export const ToastProvider = ({ children, variant }) => {
  const [data, setData] = useState([]);
  const Push = useCallback(
    (message, type, lifetime, title) => {
      if (message) {
        const newItem = {
          id: uuidv4(),
          message: message,
          type: type,
          lifetime: lifetime || DEFAULT_INTERVAL,
          title,
        };
        setData((prevState) => [...prevState, newItem]);

        return newItem.id;
      }
    },
    [setData]
  );
  const PushCustom = useCallback(
    ({ message, lifetime }, icon) => {
      if (message) {
        const newItem = {
          id: uuidv4(),
          message: message,
          lifetime: lifetime || DEFAULT_INTERVAL,
          icon: icon,
          type: undefined,
        };
        setData((prevState) => [...prevState, newItem]);
      }
    },
    [setData]
  );
  const PushError = useCallback(
    ({ message, title = "Error", lifetime }) =>
      Push(message, "Error", lifetime, title),
    [Push]
  );
  const PushWarning = useCallback(
    ({ message, title = "Warning", lifetime }) =>
      Push(message, "Warning", lifetime, title),
    [Push]
  );
  const PushSuccess = useCallback(
    ({ message, title = "Success", lifetime }) =>
      Push(message, "Success", lifetime, title),
    [Push]
  );
  const PushInfo = useCallback(
    ({ message, title = "Info", lifetime }) =>
      Push(message, "Info", lifetime, title),
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
