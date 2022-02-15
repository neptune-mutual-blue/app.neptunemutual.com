import React, { useEffect, useState } from "react";

import { useEagerConnect } from "@/lib/connect-wallet/hooks/useEagerConnect";
import { useInactiveListener } from "@/lib/connect-wallet/hooks/useInactiveListener";
import { getNetworkId } from "@/src/config/environment";

const AppContext = React.createContext({ networkId: null });

export function useAppContext() {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppWrapper");
  }
  return context;
}

export const AppWrapper = ({ children }) => {
  const [networkId, setNetworkId] = useState();

  useEffect(() => {
    setNetworkId(getNetworkId());
  }, []);

  return (
    <AppContext.Provider value={{ networkId }}>
      {networkId && <PostNetworkIdLoad networkId={networkId} />}
      {children}
    </AppContext.Provider>
  );
};

// This component makes sure that given hooks are only executed once after networkId is loaded
const PostNetworkIdLoad = ({ networkId }) => {
  useEagerConnect(networkId);
  useInactiveListener(networkId);

  return null;
};
