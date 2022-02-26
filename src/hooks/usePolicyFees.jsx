import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { registry } from "@neptunemutual/sdk";
import { AddressZero } from "@ethersproject/constants";

import { convertToUnits, isValidNumber } from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useDebouncedEffect } from "@/src/hooks/useDebouncedEffect";
import { useAppContext } from "@/src/context/AppWrapper";
import { useInvokeMethod } from "@/src/hooks/useInvokeMethod";
import { useErrorNotifier } from "@/src/hooks/useErrorNotifier";

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

  const [data, setData] = useState(defaultInfo);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { invoke } = useInvokeMethod();
  const { notifyError } = useErrorNotifier();

  useDebouncedEffect(
    () => {
      let ignore = false;

      if (!networkId || !value || !isValidNumber(value) || !coverMonth) {
        return;
      }

      const signerOrProvider = getProviderOrSigner(
        library,
        account || AddressZero,
        networkId
      );

      async function fetchCoverFee() {
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
            convertToUnits(value).toString(),
          ];
          const result = await invoke(
            policyContract,
            "getCoverFeeInfo",
            {},
            catcher,
            args
          );

          const [
            fee,
            utilizationRatio,
            totalAvailableLiquidity,
            coverRatio,
            floor,
            ceiling,
            rate,
          ] = result;

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
          setError(true);
        } finally {
          setLoading(false);
        }
      }

      fetchCoverFee();
      return () => {
        ignore = true;
      };
    },
    [value, coverMonth, coverKey, networkId, account, library],
    500
  );

  return {
    loading,
    error,
    data,
  };
};
