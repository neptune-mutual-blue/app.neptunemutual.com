import React, { useContext, useEffect, useState } from "react";

import { useEagerConnect } from "@/lib/connect-wallet/hooks/useEagerConnect";
import { useInactiveListener } from "@/lib/connect-wallet/hooks/useInactiveListener";
import { getNetworkId } from "@/src/config/environment";

const AppContext = React.createContext({});

export const useAppContext = () => useContext(AppContext);

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
