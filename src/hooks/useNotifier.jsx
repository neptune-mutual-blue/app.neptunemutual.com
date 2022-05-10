import { TOAST_DEFAULT_TIMEOUT } from "@/src/config/toast";
import { useCallback } from "react";
import { toast } from "@/src/store/toast";

export const useNotifier = () => {
  const notifier = useCallback((notification) => {
    if (notification.type === "error") {
      const { error, ...rest } = notification;

      console.error(error);
      toast?.pushError({
        title: rest.title,
        message: rest.message,
        lifetime: TOAST_DEFAULT_TIMEOUT,
      });
    }
  }, []);

  return { notifier };
};
