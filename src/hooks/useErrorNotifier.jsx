import { ERROR_TOAST_TIME } from "@/src/config/toast";
import { getErrorMessage } from "@/src/helpers/tx";
import { useCallback } from "react";
import { toast } from "@/src/store/toast";

const defaultArgs = { duration: ERROR_TOAST_TIME };

export const useErrorNotifier = ({ duration } = defaultArgs) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [duration, toast?.pushError]
  );

  return { notifyError };
};
