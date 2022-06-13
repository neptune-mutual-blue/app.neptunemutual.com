/**
 * Inspiration: https://github.com/damikun/React-Toast
 * Author: Dalibor Kundrat  https://github.com/damikun
 */
import { useCallback, useState, useMemo } from "react";

import ToastContainer from "./container";
import { ToastContext } from "./context";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_INTERVAL = 30000; // 30 seconds

/**
 * Implementation
 */
export const ToastProvider = ({ children, variant }) => {
  const [data, setData] = useState([]);

  const Push = useCallback((message, type, lifetime, title, id) => {
    if (message) {
      setData((prevState) => {
        const index = prevState.findIndex((item) => item.id === id);
        const newItem = {
          message: message,
          type: type,
          lifetime: lifetime || DEFAULT_INTERVAL,
          title,
        };

        if (index === -1) {
          return [...prevState, { ...newItem, id: id || uuidv4() }];
        }

        const updatedData = prevState.filter((item) => item.id !== id);
        updatedData.push({ ...newItem, id });

        return updatedData;
      });
    }
  }, []);

  const PushCustom = useCallback(({ message, lifetime, icon, header, id }) => {
    if (message) {
      const newItem = {
        id: id || uuidv4(),
        message: message,
        lifetime: lifetime || DEFAULT_INTERVAL,
        icon: icon,
        header: header,
        type: undefined,
      };
      setData((prevState) => [...prevState, newItem]);
    }
  }, []);

  const PushError = useCallback(
    ({ message, title = "Error", lifetime, id }) =>
      Push(message, "Error", lifetime, title, id),
    [Push]
  );

  const PushWarning = useCallback(
    ({ message, title = "Warning", lifetime, id }) =>
      Push(message, "Warning", lifetime, title, id),
    [Push]
  );

  const PushSuccess = useCallback(
    ({ message, title = "Success", lifetime, id }) =>
      Push(message, "Success", lifetime, title, id),
    [Push]
  );

  const PushInfo = useCallback(
    ({ message, title = "Info", lifetime, id }) =>
      Push(message, "Info", lifetime, title, id),
    [Push]
  );

  const PushLoading = useCallback(
    ({ message, title = "Loading", lifetime, id }) =>
      Push(message, "Loading", lifetime, title, id),
    [Push]
  );

  const remove = useCallback(async (id) => {
    setData((prevState) => prevState.filter((e) => e.id !== id));
  }, []);

  const toastFunctions = useMemo(
    () => ({
      pushError: PushError,
      pushWarning: PushWarning,
      pushSuccess: PushSuccess,
      pushInfo: PushInfo,
      pushLoading: PushLoading,
      push: Push,
      pushCustom: PushCustom,
      remove,
    }),
    [
      Push,
      PushCustom,
      PushError,
      PushInfo,
      PushLoading,
      PushSuccess,
      PushWarning,
      remove,
    ]
  );

  return (
    <ToastContext.Provider value={toastFunctions}>
      <ToastContainer variant={variant} data={data} />
      {children}
    </ToastContext.Provider>
  );
};
