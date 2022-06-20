import { useEffect, useState } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";

import { convertToUnits, convertFromUnits, isValidNumber } from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useDebounce } from "@/src/hooks/useDebounce";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { t } from "@lingui/macro";
import { useAppConstants } from "@/src/context/AppConstants";
import { useTokenDecimals } from "@/src/hooks/useTokenDecimals";

export const useCalculatePods = ({ coverKey, value, podAddress }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useNetwork();

  const debouncedValue = useDebounce(value, 200);
  const [receiveAmount, setReceiveAmount] = useState("0");
  const [loading, setLoading] = useState(false);
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();
  const { liquidityTokenDecimals } = useAppConstants();
  const tokenDecimals = useTokenDecimals(podAddress);

  useEffect(() => {
    let ignore = false;

    if (
      !networkId ||
      !account ||
      !debouncedValue ||
      !isValidNumber(debouncedValue)
    ) {
      if (receiveAmount !== "0") setReceiveAmount("0");
      return;
    }

    const handleError = (err) => {
      notifyError(err, t`calculate pods`);
    };

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    async function exec() {
      setLoading(true);

      const cleanup = () => {
        setLoading(false);
      };

      try {
        const instance = await registry.Vault.getInstance(
          networkId,
          coverKey,
          signerOrProvider
        );

        const onTransactionResult = (result) => {
          const podAmount = result;

          if (ignore) return;
          setReceiveAmount(
            convertFromUnits(podAmount, tokenDecimals).toString()
          );
          cleanup();
        };

        const onRetryCancel = () => {
          cleanup();
        };

        const onError = (err) => {
          handleError(err);
          cleanup();
        };

        const args = [
          convertToUnits(debouncedValue, liquidityTokenDecimals).toString(),
        ];
        invoke({
          instance,
          methodName: "calculatePods",
          onTransactionResult,
          onRetryCancel,
          onError,
          args,
          retry: false,
        });
      } catch (err) {
        handleError(err);
        cleanup();
      }
    }

    exec();
    return () => {
      ignore = true;
    };
  }, [
    account,
    coverKey,
    debouncedValue,
    invoke,
    library,
    liquidityTokenDecimals,
    networkId,
    notifyError,
    tokenDecimals,
    receiveAmount,
  ]);

  return {
    receiveAmount,
    loading,
  };
};
