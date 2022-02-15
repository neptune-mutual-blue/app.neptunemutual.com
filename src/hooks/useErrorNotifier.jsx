import { useToast } from "@/lib/toast/context";
import { metamaskErrorCodes } from "../config/constants";

export const useErrorNotifier = (props = { duration: 5000 }) => {
  const toast = useToast();
  const notifyError = (error, action = "perform action") => {
    const title =
      typeof error.data === "string" ? error.data : `Could not ${action}`;
    let message = error.message;
    const code = error?.code?.toString();
    if (Object.keys(metamaskErrorCodes).includes(code)) {
      message = metamaskErrorCodes[code].message;
    }
    toast.pushError({
      title: title,
      message: message,
      lifetime: props.duration ?? 5000,
    });
  };

  return { notifyError };
};
