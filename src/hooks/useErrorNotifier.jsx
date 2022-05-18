import { useToast } from "@/lib/toast/context";
import { ERROR_TOAST_TIME } from "@/src/config/toast";
import { getErrorMessage } from "@/src/helpers/tx";
import { useCallback } from "react";

const defaultArgs = { duration: ERROR_TOAST_TIME };

export const useErrorNotifier = ({ duration } = defaultArgs) => {
  const toast = useToast();

  const notifyError = useCallback(
    (error, action = "perform action") => {
      const title =
        typeof error.data === "string" ? error.data : `Could not ${action}`;

      console.error(error);

      toast.pushError({
        title: title,
        message: getErrorMessage(error),
        lifetime: duration || ERROR_TOAST_TIME,
      });
    },
    [duration, toast]
  );

  return { notifyError };
};
