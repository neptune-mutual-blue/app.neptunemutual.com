import { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { policy } from "@neptunemutual/sdk";
import { AddressZero } from "@ethersproject/constants";

import { convertToUnits, convertFromUnits, isValidNumber } from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useDebouncedEffect } from "@/src/hooks/useDebounce";

export const usePolicyFees = ({ value, coverMonth, coverKey }) => {
  const { library, account, chainId } = useWeb3React();

  const [feePercent, setFeePercent] = useState();
  const [feeAmount, setFeeAmount] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useDebouncedEffect(
    () => {
      let ignore = false;

      if (!value || !isValidNumber(value) || !coverMonth) {
        return;
      }

      const signerOrProvider = getProviderOrSigner(
        library,
        account || AddressZero,
        chainId
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
            chainId,
            coverKey,
            args,
            signerOrProvider
          );

          const { fee, rate } = result;

          if (ignore) return;
          setFeePercent(
            convertFromUnits(rate).multipliedBy(100).decimalPlaces(2).toString()
          );
          setFeeAmount(convertFromUnits(fee).decimalPlaces(3).toString());
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
    500,
    [value, coverMonth, coverKey, chainId, account, library]
  );

  return {
    loading,
    error,
    feePercent,
    feeAmount,
  };
};
