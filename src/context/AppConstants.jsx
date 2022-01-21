import React, { useEffect, useState } from "react";
import { registry } from "@neptunemutual/sdk";

import { useAppContext } from "@/src/context/AppWrapper";

const initValue = {
  liquidityTokenAddress: "",
  NPMTokenAddress: "",
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

  const setAddress = (_address, key) => {
    setData((prev) => ({
      ...prev,
      [key]: _address,
    }));
  };

  useEffect(() => {
    if (!networkId) return;

    registry.LiquidityToken.getAddress(networkId).then((_addr) =>
      setAddress(_addr, "LiquidityToken")
    );

    registry.NPMToken.getAddress(networkId).then((_addr) =>
      setAddress(_addr, "NPMToken")
    );
  }, [networkId]);

  return (
    <AppConstantsContext.Provider value={data}>
      {children}
    </AppConstantsContext.Provider>
  );
};
