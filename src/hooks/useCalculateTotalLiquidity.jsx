import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { config, multicall } from "@neptunemutual/sdk";

import { sumOf } from "@/utils/bn";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useNetwork } from "@/src/context/Network";

const { Contract, Provider } = multicall;

export const useCalculateTotalLiquidity = ({ liquidityList = [] }) => {
  const [myTotalLiquidity, setMyTotalLiquidity] = useState("0");
  const { library, account } = useWeb3React();
  const { networkId } = useNetwork();

  useEffect(() => {
    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    async function exec() {
      const multiCallProvider = new Provider(signerOrProvider.provider);

      await multiCallProvider.init(); // Only required when `chainId` is not provided in the `Provider` constructor

      const calls = [];
      liquidityList.forEach(({ podAmount, podAddress }) => {
        const instance = new Contract(podAddress, config.abis.IVault);

        calls.push(instance.calculateLiquidity(podAmount));
      });

      const amountsInDai = await multiCallProvider.all(calls);
      setMyTotalLiquidity(
        sumOf(...amountsInDai.map((x) => x.toString())).toString()
      );
    }

    if (liquidityList.length > 0) {
      exec();
    }
  }, [account, library, liquidityList, networkId]);

  return myTotalLiquidity;
};
