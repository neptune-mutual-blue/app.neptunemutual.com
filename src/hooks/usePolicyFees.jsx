import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { convertToUnits, isValidNumber } from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useDebounce } from "@/src/hooks/useDebounce";

const defaultInfo = {
  fee: "0",
  utilizationRatio: "0",
  totalAvailableLiquidity: "0",
  floor: "0",
  ceiling: "0",
  rate: "0",
};

export const usePolicyFees = ({ value, coverMonth, coverKey }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useNetwork();

  const debouncedValue = useDebounce(value, 200);
  const [data, setData] = useState(defaultInfo);
  const [loading, setLoading] = useState(false);
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useEffect(() => {
    let ignore = false;

    if (
      !networkId ||
      !account ||
      !coverKey ||
      !coverMonth ||
      !debouncedValue ||
      !isValidNumber(debouncedValue)
    ) {
      return;
    }

    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    async function exec() {
      setLoading(true);

      const cleanup = () => {
        setLoading(false);
      };

      const handleError = (err) => {
        notifyError(err, "get fees");
      };

      try {
        const policyContract = await registry.PolicyContract.getInstance(
          networkId,
          signerOrProvider
        );

        const args = [
          coverKey,
          parseInt(coverMonth, 10),
          convertToUnits(debouncedValue).toString(),
        ];

        const onTransactionResult = (result) => {
          const [
            fee,
            utilizationRatio,
            totalAvailableLiquidity,
            floor,
            ceiling,
            rate,
          ] = result;

          if (ignore) return;
          cleanup();
          setData({
            fee: fee.toString(),
            utilizationRatio: utilizationRatio.toString(),
            totalAvailableLiquidity: totalAvailableLiquidity.toString(),
            floor: floor.toString(),
            ceiling: ceiling.toString(),
            rate: rate.toString(),
          });
        };

        const onRetryCancel = () => {
          cleanup();
        };

        const onError = (err) => {
          handleError(err);
          cleanup();
        };

        invoke({
          instance: policyContract,
          methodName: "getCoverFeeInfo",
          args,
          retry: false,
          onTransactionResult,
          onRetryCancel,
          onError,
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
    coverMonth,
    debouncedValue,
    invoke,
    library,
    networkId,
    notifyError,
  ]);

  return {
    loading,
    data,
  };
};
