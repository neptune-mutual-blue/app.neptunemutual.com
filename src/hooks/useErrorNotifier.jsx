import { useToast } from "@/lib/toast/context";
import { ERROR_TOAST_TIME } from "@/src/config/toast";
import { getErrorMessage } from "@/src/helpers/tx";
import { useCallback } from "react";

export const useErrorNotifier = ({ duration } = {}) => {
  const toast = useToast();

  const notifyError = useCallback(
    (error, action = "perform action") => {
      const title =
        typeof error.data === "string" ? error.data : `Could not ${action}`;

      console.warn(`Could not ${action}`);
      console.error(error);

      toast?.pushError({
        title: title,
        message: getErrorMessage(error),
        lifetime: duration || ERROR_TOAST_TIME,
      });
    },
    [duration, toast?.pushError]
  );

  return { notifyError };
};
