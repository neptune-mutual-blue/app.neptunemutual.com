import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { policy } from "@neptunemutual/sdk";
import { AddressZero } from "@ethersproject/constants";

import { convertToUnits, isValidNumber } from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useDebouncedEffect } from "@/src/hooks/useDebouncedEffect";
import { useAppContext } from "@/src/context/AppWrapper";

export const usePolicyFees = ({ value, coverMonth, coverKey }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();

  const [data, setData] = useState({});
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
        amount: convertToUnits(value).toString(), // <-- Amount to Cover (In DAI)
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

          // const { fee, rate, totalAvailableLiquidity } = result;

          if (ignore) return;
          setData(result);
          // setFeePercent(
          //   convertFromUnits(rate).multipliedBy(100).decimalPlaces(2).toString()
          // );
          // setFeeAmount(convertFromUnits(fee).decimalPlaces(3).toString());
        } catch (error) {
          console.error(error);
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
