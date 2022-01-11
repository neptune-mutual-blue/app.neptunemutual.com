import { useEagerConnect } from "@/lib/connect-wallet/hooks/useEagerConnect";
import { useInactiveListener } from "@/lib/connect-wallet/hooks/useInactiveListener";
import { getNetworkId } from "@/src/config/environment";

import { useNotifier } from "@/src/hooks/useNotifier";
import React, { useContext, useEffect, useState } from "react";

const AppContext = React.createContext({});

export const useAppContext = () => useContext(AppContext);

export const AppWrapper = ({ children }) => {
  const [networkId, setNetworkId] = useState();
  const { notifier } = useNotifier();

  useEagerConnect(networkId, notifier);
  useInactiveListener(networkId, notifier);

  useEffect(() => {
    setNetworkId(getNetworkId());
  }, []);

  return (
    <AppContext.Provider value={{ networkId }}>{children}</AppContext.Provider>
  );
};
