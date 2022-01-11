import { useEagerConnect } from "@/lib/connect-wallet/hooks/useEagerConnect";
import { useInactiveListener } from "@/lib/connect-wallet/hooks/useInactiveListener";
import { getNetworkId } from "@/src/config/environment";

import { useNotifier } from "@/src/hooks/useNotifier";
import { useEffect, useState } from "react";

export const AppWrapper = ({ children }) => {
  const [networkId,setNetworkId] = useState()
  const { notifier } = useNotifier();

  useEagerConnect(networkId, notifier);
  useInactiveListener(networkId, notifier);

  

  useEffect(()=>{
    setNetworkId(getNetworkId())
  },[])

  return <>{children}</>;
};
