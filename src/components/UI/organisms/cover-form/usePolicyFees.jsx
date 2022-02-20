import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { policy } from "@neptunemutual/sdk";
import { AddressZero } from "@ethersproject/constants";

import { convertToUnits, isValidNumber } from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useDebouncedEffect } from "@/src/hooks/useDebouncedEffect";
import { useAppContext } from "@/src/context/AppWrapper";

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
      const args = {
        duration: parseInt(coverMonth, 10),
        amount: convertToUnits(value).toString(),
      };

      async function fetchCoverFee() {
        try {
          setLoading(true);
          setError(false);
          const { result } = await policy.getCoverFee(
            networkId,
            coverKey,
            args,
            signerOrProvider
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
      return () => (ignore = true);
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
