import React, { useEffect, useState } from "react";

import { useEagerConnect } from "@/lib/connect-wallet/hooks/useEagerConnect";
import { useInactiveListener } from "@/lib/connect-wallet/hooks/useInactiveListener";
import { getNetworkId } from "@/src/config/environment";

const NetworkContext = React.createContext({ networkId: null });

export function useNetwork() {
  const context = React.useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppWrapper");
  }
  return context;
}

export const NetworkProvider = ({ children }) => {
  const [networkId, setNetworkId] = useState();

  useEffect(() => {
    setNetworkId(getNetworkId());
  }, []);

  return (
    <NetworkContext.Provider value={{ networkId }}>
      {networkId && <PostNetworkIdLoad networkId={networkId} />}
      {children}
    </NetworkContext.Provider>
  );
};

// This component makes sure that given hooks are only executed once after networkId is loaded
const PostNetworkIdLoad = ({ networkId }) => {
  useEagerConnect(networkId);
  useInactiveListener(networkId);

  return null;
};
