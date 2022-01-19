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

    async function fetchLiquidityTokenAddress() {
      const signerOrProvider = getProviderOrSigner(
        library,
        account || AddressZero,
        networkId
      );

      if (!signerOrProvider) {
        console.log("No provider found");
      }

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
  }, [networkId]);

  return {
    liquidityTokenAddress,
    liquidityTokenSymbol: "DAI",
  };
};
