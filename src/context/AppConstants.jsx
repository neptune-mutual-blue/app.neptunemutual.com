import React, { useEffect, useState } from "react";
import { registry } from "@neptunemutual/sdk";

import { useNetwork } from "@/src/context/Network";
import { usePoolsTVL } from "@/src/hooks/usePoolsTVL";
import { getProviderOrSigner } from "@/lib/connect-wallet/utils/web3";
import { useWeb3React } from "@web3-react/core";

const initValue = {
  liquidityTokenAddress: "",
  NPMTokenAddress: "",
  poolsTvl: "0",
  getTVLById: (_id) => "0",
};

const AppConstantsContext = React.createContext(initValue);

export function useAppConstants() {
  const context = React.useContext(AppConstantsContext);
  if (context === undefined) {
    throw new Error(
      "useAppConstants must be used within a AppConstantsProvider"
    );
  }
  return context;
}

export const AppConstantsProvider = ({ children }) => {
  const [data, setData] = useState(initValue);
  const { networkId } = useNetwork();
  const { tvl, getTVLById } = usePoolsTVL(data.NPMTokenAddress);
  const { library, account } = useWeb3React();

  const setAddress = (_address, key) => {
    setData((prev) => ({
      ...prev,
      [key]: _address,
    }));
  };

  useEffect(() => {
    if (!networkId || !account) return;
    const signerOrProvider = getProviderOrSigner(library, account, networkId);

    registry.Stablecoin.getAddress(networkId, signerOrProvider).then((_addr) =>
      setAddress(_addr, "liquidityTokenAddress")
    );

    registry.NPMToken.getAddress(networkId, signerOrProvider).then((_addr) =>
      setAddress(_addr, "NPMTokenAddress")
    );
  }, [account, library, networkId]);

  return (
    <AppConstantsContext.Provider
      value={{ ...data, poolsTvl: tvl, getTVLById }}
    >
      {children}
    </AppConstantsContext.Provider>
  );
};
