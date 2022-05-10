import { useDebounce } from "@/src/hooks/useDebounce";
import { utils } from "@neptunemutual/sdk";
import React, { useState, useCallback } from "react";

const initialValue = {
  getIpfsByHash: (_hash) => {},
  updateIpfsData: (_hash) => {},
};

const IpfsContext = React.createContext(initialValue);

/**
 * @description DO NOT use `getIpfsByHash` and `updateIpfsData` in the same effect (`useEffect`, `useCallback` or `useMemo`)
 */
export function useIpfs() {
  const context = React.useContext(IpfsContext);
  if (context === undefined) {
    throw new Error("useIpfs must be used within a IpfsProvider");
  }
  return context;
}

export const IpfsProvider = ({ children }) => {
  const [data, setData] = useState({});

  // Debounce data to avoid multiple re-renders due to `updateIpfsData`
  const debounced = useDebounce(data, 2500);

  const getIpfsByHash = useCallback((hash) => debounced[hash], [debounced]);

  const updateIpfsData = useCallback((hash) => {
    const updateState = (hash, _data) => {
      setData((prev) => ({ ...prev, [hash]: _data || {} }));
    };

    utils.ipfs
      .read(hash)
      .then((ipfsData) => updateState(hash, ipfsData))
      .catch(() => updateState(hash, {})); // Fallback to empty obj, so tries only once
  }, []);

  return (
    <IpfsContext.Provider value={{ getIpfsByHash, updateIpfsData }}>
      {children}
    </IpfsContext.Provider>
  );
};
