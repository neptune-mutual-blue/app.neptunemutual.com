import { useCallback } from "react";

export const useNotifier = () => {
  const notifier = useCallback((notification) => {
    if (notification.type === "error") {
      const { error, ...rest } = notification;

      console.error(error);
      console.log(rest);
    }
  }, []);

  return { notifier };
};
