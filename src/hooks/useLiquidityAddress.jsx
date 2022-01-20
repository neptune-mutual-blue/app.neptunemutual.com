import { useState, useEffect } from "react";
import { registry } from "@neptunemutual/sdk";
import { AddressZero } from "@ethersproject/constants";
import { useWeb3React } from "@web3-react/core";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/components/UI/organisms/AppWrapper";

export const useLiquidityAddress = () => {
  const [liquidityTokenAddress, setLiquidityTokenAddress] =
    useState(AddressZero);

  const { library, account } = useWeb3React();
  const { networkId } = useAppContext();

  useEffect(() => {
    let ignore = false;

    const signerOrProvider = getProviderOrSigner(
      library,
      account || AddressZero,
      networkId
    );

    if (!networkId) {
      return;
    }

    async function fetchLiquidityTokenAddress() {
      try {
        const liquidityTokenAddress = await registry.LiquidityToken.getAddress(
          networkId,
          signerOrProvider
        );

        if (ignore) return;
        setLiquidityTokenAddress(liquidityTokenAddress);
      } catch (e) {
        console.error(e);
      }
    }

    fetchLiquidityTokenAddress();

    return () => (ignore = true);
  }, [account, library, networkId]);

  return {
    liquidityTokenAddress,
    liquidityTokenSymbol: "DAI",
  };
};
