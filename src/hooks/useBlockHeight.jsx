import { useEffect, useState } from "react";
import { AddressZero } from "@ethersproject/constants";
import { useWeb3React } from "@web3-react/core";

import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useAppContext } from "@/src/context/AppWrapper";

export const useBlockHeight = () => {
  const [blockHeight, setblockHeight] = useState(1);

  const { networkId } = useAppContext();
  const { library, account } = useWeb3React();

  useEffect(() => {
    let ignore = false;
    if (!networkId) return;

    const signerOrProvider = getProviderOrSigner(
      library,
      account || AddressZero,
      networkId
    );

    if (!signerOrProvider) return;

    signerOrProvider.provider
      .getBlockNumber()
      .then((blockNumber) => {
        if (ignore) return;
        setblockHeight(blockNumber);
      })
      .catch(console.error);

    return () => (ignore = true);
  }, [account, library, networkId]);

  return blockHeight;
};
