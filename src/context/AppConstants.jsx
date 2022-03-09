import React, { useEffect, useState } from "react";
import { registry } from "@neptunemutual/sdk";

import { useAppContext } from "@/src/context/AppWrapper";
import { usePoolsTVL } from "@/src/hooks/usePoolsTVL";

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
  const { networkId } = useAppContext();
  const { tvl, getTVLById } = usePoolsTVL(data.NPMTokenAddress);

  const setAddress = (_address, key) => {
    setData((prev) => ({
      ...prev,
      [key]: _address,
    }));
  };

  useEffect(() => {
    if (!networkId) return;

    registry.Stablecoin.getAddress(networkId).then((_addr) =>
      setAddress(_addr, "liquidityTokenAddress")
    );

    registry.NPMToken.getAddress(networkId).then((_addr) =>
      setAddress(_addr, "NPMTokenAddress")
    );
  }, [networkId]);

  return (
    <AppConstantsContext.Provider
      value={{ ...data, poolsTvl: tvl, getTVLById }}
    >
      {children}
    </AppConstantsContext.Provider>
  );
};
