import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";

import { convertToUnits, isValidNumber } from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";
import { useDebounce } from "@/src/hooks/useDebounce";

const defaultInfo = {
  fee: "0",
  utilizationRatio: "0",
  totalAvailableLiquidity: "0",
  coverRatio: "0",
  floor: "0",
  ceiling: "0",
  rate: "0",
};

export const usePolicyFees = ({ value, coverMonth, coverKey }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();

  const debouncedValue = useDebounce(value, 200);
  const [data, setData] = useState(defaultInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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
      try {
        setLoading(true);
        setError(false);

        const policyContract = await registry.PolicyContract.getInstance(
          networkId,
          signerOrProvider
        );
        const catcher = notifyError;

        const args = [
          coverKey,
          parseInt(coverMonth, 10),
          convertToUnits(debouncedValue).toString(),
        ];

        const [
          fee,
          utilizationRatio,
          totalAvailableLiquidity,
          coverRatio,
          floor,
          ceiling,
          rate,
        ] = await invoke(
          policyContract,
          "getCoverFeeInfo",
          {},
          catcher,
          args,
          false
        );

        if (ignore) return;
        setData({
          fee: fee.toString(),
          utilizationRatio: utilizationRatio.toString(),
          totalAvailableLiquidity: totalAvailableLiquidity.toString(),
          coverRatio: coverRatio.toString(),
          floor: floor.toString(),
          ceiling: ceiling.toString(),
          rate: rate.toString(),
        });
      } catch (err) {
        console.error(err);

        if (ignore) return;
        setError(true);
      } finally {
        if (ignore) return;
        setLoading(false);
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
    error,
    data,
  };
};
