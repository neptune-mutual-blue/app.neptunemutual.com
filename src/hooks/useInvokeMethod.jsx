import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { calculateGasMargin } from "@/utils/bn";
import { useCallback } from "react";

export const useInvokeMethod = () => {
  const { notifyError } = useErrorNotifier();

  const invoke = useCallback(
    async (instance, methodName, overrides, catcher, args) => {
      if (!instance) {
        catcher(new Error("Instance not found"));
        return;
      }

      const estimatedGas = await instance.estimateGas[methodName](
        ...args
      ).catch((err) => {
        notifyError(err, "estimate gas");
        console.log(
          `Could not estimate gas for method "${methodName}", args received: ${JSON.stringify(
            args
          )}`
        );
        return "0";
      });

      const tx = await instance[methodName](...args, {
        gasLimit: calculateGasMargin(estimatedGas),
        ...overrides,
      });

      return tx;
    },
    [notifyError]
  );

  return { invoke };
};
