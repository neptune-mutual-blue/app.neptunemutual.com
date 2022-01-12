import React, { useContext, useEffect, useState } from "react";

import { useEagerConnect } from "@/lib/connect-wallet/hooks/useEagerConnect";
import { useInactiveListener } from "@/lib/connect-wallet/hooks/useInactiveListener";
import { getNetworkId } from "@/src/config/environment";


const AppContext = React.createContext({});

export const useAppContext = () => useContext(AppContext);

export const AppWrapper = ({ children }) => {
  const [networkId, setNetworkId] = useState();

  useEagerConnect(networkId);
  useInactiveListener(networkId);

  useEffect(() => {
    setNetworkId(getNetworkId());
  }, []);

  return (
    <AppContext.Provider value={{ networkId }}>{children}</AppContext.Provider>
  );
};
