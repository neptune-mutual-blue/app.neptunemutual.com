import { useState, useEffect } from "react";
import { registry } from "@neptunemutual/sdk";
import { useWeb3React } from "@web3-react/core";
import { AddressZero } from "@ethersproject/constants";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";
import { convertFromUnits, convertToUnits } from "@/utils/bn";
import BigNumber from "bignumber.js";

export const useAvailableLiquidity = ({ coverKey }) => {
  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();

  const [data, setData] = useState("0");

  useEffect(() => {
    let ignore = false;

    if (!networkId || !coverKey) {
      return;
    }

    const signerOrProvider = getProviderOrSigner(
      library,
      account || AddressZero,
      networkId
    );

    async function fetchAvailableLiquidity() {
      try {
        const instance = await registry.PolicyContract.getInstance(
          networkId,
          signerOrProvider
        );

        const [totalPoolAmount, totalCommitment] =
          await instance.getCoverPoolSummary(coverKey, {
            gasLimit: convertToUnits("10").toString(),
          });

        const availableLiquidity = BigNumber(totalPoolAmount.toString())
          .minus(totalCommitment.toString())
          .toString();
        if (ignore) return;

        setData(convertFromUnits(availableLiquidity).toString());
      } catch (error) {
        console.error(error);
      }
    }

    fetchAvailableLiquidity();
    return () => {
      ignore = true;
    };
  }, [account, coverKey, library, networkId]);

  return {
    availableLiquidity: data,
  };
};
